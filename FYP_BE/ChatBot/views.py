import uuid
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import os
from dotenv import load_dotenv
from pathlib import Path
import json
import re
import sys
import time
import asyncio
import logging
from asgiref.sync import sync_to_async
from Auth.models import AuthToken, AuthUser
from .models import Chat, Message

logger = logging.getLogger(__name__)

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from mcp_travelmate.agents.orchestrator import TravelMateOrchestrator

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / '.env')
API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API = os.getenv('GROQ_API')

orchestrator = TravelMateOrchestrator()


def no_function(**kwargs):
    msg = kwargs.get("message", kwargs.get("answer", "I'm an assistant, how can I help you?"))
    return msg


def parse_llm_json(raw: str):
    raw = raw.strip()
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass
    code_block = re.search(r'```(?:json)?\s*([\s\S]*?)```', raw)
    if code_block:
        try:
            return json.loads(code_block.group(1).strip())
        except json.JSONDecodeError:
            pass
    arr_match = re.search(r'(\[[\s\S]*\])', raw)
    if arr_match:
        try:
            return json.loads(arr_match.group(1))
        except json.JSONDecodeError:
            pass
    obj_match = re.search(r'(\{[\s\S]*\})', raw)
    if obj_match:
        try:
            return json.loads(obj_match.group(1))
        except json.JSONDecodeError:
            pass
    raise json.JSONDecodeError("Could not extract JSON from LLM response", raw, 0)


def normalize_tool_name(action):
    raw = action.get("tool", [None])
    if isinstance(raw, list):
        return raw[0] if raw else None
    return raw


@sync_to_async
def save_chat_and_messages(user_email, chat_id, user_input, assistant_response):
    if user_email == 'guest':
        return
    try:
        user = AuthUser.objects.get(email=user_email)
    except AuthUser.DoesNotExist:
        return
    chat, created = Chat.objects.get_or_create(
        id=chat_id,
        defaults={'user': user, 'title': user_input[:100]}
    )
    Message.objects.create(chat=chat, role='user', content={'text': user_input})
    Message.objects.create(chat=chat, role='assistant', content=assistant_response)


def _sanitize_messages(messages):
    for m in messages:
        if m.get("role") == "assistant" and not isinstance(m.get("content"), (str, list)):
            m["content"] = json.dumps(m["content"]) if m.get("content") is not None else ""
    return messages


async def get_chatbot_response(user_input, session, user_email='guest', chat_id=None):
    if not user_input:
        return {"error": "No user input provided"}

    chat_history = session.get("chat_history", [])
    system_prompt = {
        "role": "system",
        "content": orchestrator.get_system_prompt()
    }
    if not chat_history or chat_history[0].get("role") != "system":
        chat_history.insert(0, system_prompt)

    chat_history.append({"role": "user", "content": user_input})

    try:
        sanitized = _sanitize_messages(chat_history)
        response = requests.post(
            API_URL,
            headers={"Authorization": f"Bearer {GROQ_API}", "Content-Type": "application/json"},
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": sanitized,
                "max_tokens": 1200,
                "temperature": 0.01
            },
        )

        data = response.json()
        if "choices" not in data or not data["choices"]:
            error_detail = data.get("error", {}).get("message", str(data))
            print(f"GROQ API error: {error_detail}")
            bot_response = {"data": {"bot_reply": [{"no_function": f"Groq API error: {error_detail}"}]}}
            chat_history.append({"role": "assistant", "content": f"Groq API error: {error_detail}"})
            if chat_id:
                await save_chat_and_messages(user_email, chat_id, user_input, bot_response)
            return bot_response

        raw = data["choices"][0]["message"]["content"]
        chat_history.append({"role": "assistant", "content": raw})

        try:
            parsed = parse_llm_json(raw)
        except json.JSONDecodeError:
            bot_response = {"data": {"bot_reply": [{"no_function": raw}]}}
            if chat_id:
                await save_chat_and_messages(user_email, chat_id, user_input, bot_response)
            return bot_response

        if isinstance(parsed, list):
            non_tool_actions = [a for a in parsed if isinstance(a, dict) and normalize_tool_name(a) == "no_function"]
            tool_actions = [a for a in parsed if isinstance(a, dict) and normalize_tool_name(a) and normalize_tool_name(a) != "no_function"]
        elif isinstance(parsed, dict):
            if normalize_tool_name(parsed) == "no_function":
                non_tool_actions = [parsed]
                tool_actions = []
            else:
                non_tool_actions = []
                tool_actions = [parsed]
        else:
            non_tool_actions = []
            tool_actions = []

        if non_tool_actions:
            msg = non_tool_actions[0].get("input", {}).get("message", "Hello! I am TravelMate AI, your travel assistant.")
            bot_response = {"data": {"bot_reply": [{"no_function": msg}]}}
            if chat_id:
                await save_chat_and_messages(user_email, chat_id, user_input, bot_response)
            return bot_response

        tool_actions = orchestrator.inject_default_dates(tool_actions)

        async def _safe_execute(action):
            tool_name = normalize_tool_name(action)
            input_data = action.get("input", {})
            try:
                result = await orchestrator.execute(tool_name, input_data)
                return {tool_name: result}
            except Exception as e:
                logger.warning(f"Agent '{tool_name}' failed gracefully: {e}")
                return {tool_name: {"success": False}}

        start_time = time.time()
        tasks = [_safe_execute(action) for action in tool_actions]
        results = await asyncio.gather(*tasks)
        elapsed = time.time() - start_time
        logger.info(f"MCP dispatch took {elapsed:.2f}s for {len(tasks)} agents: {[normalize_tool_name(a) for a in tool_actions]}")

        session["chat_history"] = chat_history
        if chat_id:
            await save_chat_and_messages(user_email, chat_id, user_input, results)
        return results

    except Exception as e:
        bot_response = {"data": {"bot_reply": [{"no_function": f"Sorry, an error occurred: {str(e)}"}]}}
        chat_history.append({"role": "assistant", "content": f"Sorry, an error occurred: {str(e)}"})
        if chat_id:
            await save_chat_and_messages(user_email, chat_id, user_input, bot_response)
        return bot_response


def _resolve_user(request):
    auth = request.headers.get('Authorization', '')
    token_str = auth.replace('Bearer ', '') if auth.startswith('Bearer ') else ''
    if not token_str:
        return None
    try:
        tk = AuthToken.objects.select_related('user').get(token=token_str)
        return tk.user
    except AuthToken.DoesNotExist:
        return None


@csrf_exempt
@require_http_methods(["GET"])
def chat_history(request):
    user = _resolve_user(request)
    if not user:
        return JsonResponse({'error': 'unauthorized'}, status=401)

    limit = int(request.GET.get('limit', 20))
    starting_after = request.GET.get('starting_after')
    ending_before = request.GET.get('ending_before')

    qs = Chat.objects.filter(user=user)
    if starting_after:
        qs = qs.filter(created_at__gt=starting_after)
    if ending_before:
        qs = qs.filter(created_at__lt=ending_before)

    chats = list(qs.order_by('-created_at')[:limit].values('id', 'title', 'created_at', 'visibility'))
    return JsonResponse(chats, safe=False)


@csrf_exempt
@require_http_methods(["POST"])
def chat_create(request):
    user = _resolve_user(request)
    if not user:
        return JsonResponse({'error': 'unauthorized'}, status=401)

    data = json.loads(request.body)
    chat_id = data.get('id', str(uuid.uuid4()))
    title = data.get('title', 'New Chat')
    visibility = data.get('visibility', 'private')

    chat = Chat.objects.create(id=chat_id, user=user, title=title, visibility=visibility)
    return JsonResponse({'id': str(chat.id), 'title': chat.title, 'created_at': chat.created_at.isoformat()})


@csrf_exempt
@require_http_methods(["GET", "DELETE"])
def chat_detail(request, chat_id):
    user = _resolve_user(request)
    if not user:
        return JsonResponse({'error': 'unauthorized'}, status=401)

    try:
        chat = Chat.objects.get(id=chat_id, user=user)
    except Chat.DoesNotExist:
        return JsonResponse({'error': 'not found'}, status=404)

    if request.method == 'DELETE':
        chat.delete()
        return JsonResponse({'deleted': True})

    messages = list(chat.messages.all().values('id', 'role', 'content', 'created_at'))
    return JsonResponse({
        'id': str(chat.id),
        'title': chat.title,
        'created_at': chat.created_at.isoformat(),
        'visibility': chat.visibility,
        'messages': messages,
    })
