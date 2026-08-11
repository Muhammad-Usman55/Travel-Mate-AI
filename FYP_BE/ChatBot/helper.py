import json

def extract_bot_reply(data):
    # 1. Direct bot_reply
    if isinstance(data, dict):
        if "bot_reply" in data:
            return data["bot_reply"]
        if isinstance(data.get("data"), dict) and "bot_reply" in data["data"]:
            return data["data"]["bot_reply"]

    # 2. From choices[].message.content
    content = (
        data.get("choices", [{}])[0]
        .get("message", {})
        .get("content")
    ) or data['bot_reply'][0]['response'] 
    
    if not content:
        print(content)
        return "Sorry, I didn't understand that."

    # Normalize curly quotes/apostrophes
    content_clean = (
        content.replace("“", '"').replace("”", '"')
               .replace("‘", "'").replace("’", "'")
               .strip()
    )

    # 3. Try parsing as JSON
    try:
        parsed = json.loads(content_clean)
        if isinstance(parsed, dict):
            return parsed.get("bot_reply") or parsed.get("answer") or content_clean
        return content_clean
    except json.JSONDecodeError:
        return content_clean
    try:
        response_data['bot_reply'][0]['response'] 
    except:
        return "Sorry, I didn't understand that."
