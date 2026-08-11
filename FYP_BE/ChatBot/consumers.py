import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .views import get_chatbot_response, orchestrator, normalize_tool_name
from Auth.models import AuthToken
import asyncio
from urllib.parse import parse_qs


AGENT_LABELS = {
    "get_Flights": "Flight Search",
    "get_hotels": "Hotel Search",
    "get_weather": "Weather Forecast",
    "get_currency": "Currency Conversion",
    "get_locations": "Location Discovery",
}


def guess_agents_from_message(text: str) -> list[str]:
    lower = text.lower()
    trip_words = ["trip", "travel", "visit", "vacation", "holiday", "plan a"]
    has_trip = any(w in lower for w in trip_words)

    if has_trip:
        return ["get_Flights", "get_hotels", "get_weather", "get_currency", "get_locations"]

    agents = []
    if any(w in lower for w in ["flight", "fly", "plane", "airline"]):
        agents.append("get_Flights")
    if any(w in lower for w in ["hotel", "stay", "room", "accommodation"]):
        agents.append("get_hotels")
    if any(w in lower for w in ["weather", "temperature", "forecast"]):
        agents.append("get_weather")
    if any(w in lower for w in ["currency", "convert", "exchange", "rate"]):
        agents.append("get_currency")
    if any(w in lower for w in ["location", "attraction", "places", "visit", "explore"]):
        agents.append("get_locations")

    if not agents:
        agents = ["get_Flights", "get_hotels", "get_weather", "get_currency", "get_locations"]

    return agents


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query = parse_qs(self.scope.get('query_string', b'').decode())
        token = query.get('token', [None])[0]
        self.chat_id = query.get('chat_id', [None])[0]
        if token:
            try:
                tk = await AuthToken.objects.select_related('user').aget(token=token)
                self.user_email = tk.user.email
                print(f"Authorized WebSocket: {tk.user.email}")
            except AuthToken.DoesNotExist:
                self.user_email = 'guest'
                print("WebSocket: invalid token, using guest")
        else:
            self.user_email = 'guest'
            print("WebSocket: no token, using guest")
        self.chat_histories = {'chat_history': []}
        await self.accept()
        self.ping_task = asyncio.create_task(self.send_periodic_pings())
        print(f"WebSocket connected (user: {self.user_email}).")

    async def disconnect(self, close_code):
        if self.ping_task:
            self.ping_task.cancel()
        print(f"WebSocket disconnected: {close_code}")

    async def receive(self, text_data):
        try:
            response_data = await get_chatbot_response(
                text_data, self.chat_histories,
                user_email=self.user_email,
                chat_id=self.chat_id
            )

            is_no_function = False
            if isinstance(response_data, dict):
                bot_reply = response_data.get("data", {}).get("bot_reply", [])
                is_no_function = any(isinstance(item, dict) and "no_function" in item for item in bot_reply)

            if is_no_function:
                await self.send(text_data=json.dumps(response_data))
                return

            if isinstance(response_data, list):
                executed_agents = [list(res.keys())[0] for res in response_data if isinstance(res, dict) and res]
                agent_names = executed_agents if executed_agents else guess_agents_from_message(text_data)
            else:
                agent_names = guess_agents_from_message(text_data)

            status_msg = {
                "type": "agent_status",
                "agents": [
                    {"name": name, "label": AGENT_LABELS.get(name, name), "status": "pending"}
                    for name in agent_names
                ]
            }
            await self.send(text_data=json.dumps(status_msg))

            for i, name in enumerate(agent_names):
                await self.send(text_data=json.dumps({
                    "type": "agent_update",
                    "agent": name,
                    "label": AGENT_LABELS.get(name, name),
                    "status": "done",
                    "index": i,
                }))

            await self.send(text_data=json.dumps(response_data))
        except Exception as e:
            error_message = f"Error processing message: {str(e)}"
            print(error_message)
            await self.send(text_data=json.dumps({"error": error_message}))

    async def send_periodic_pings(self):
        try:
            while True:
                await asyncio.sleep(10)
                await self.send(text_data=json.dumps({"type": "ping"}))
        except asyncio.CancelledError:
            print("Ping task canceled gracefully.")
        except Exception as e:
            print(f"Ping failed: {e}")
