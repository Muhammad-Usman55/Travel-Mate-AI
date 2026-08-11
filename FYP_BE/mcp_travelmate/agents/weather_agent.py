import aiohttp
from typing import Any, Dict
from .base import BaseAgent

WEATHER_CODES = {
    0: "Clear", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
    45: "Foggy", 48: "Foggy", 51: "Light Drizzle", 53: "Moderate Drizzle",
    55: "Dense Drizzle", 61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
    71: "Slight Snow", 73: "Moderate Snow", 75: "Heavy Snow",
    80: "Slight Rain Showers", 81: "Moderate Rain Showers", 82: "Violent Rain Showers",
    95: "Thunderstorm", 96: "Thunderstorm with Slight Hail", 99: "Thunderstorm with Heavy Hail",
}


class WeatherAgent(BaseAgent):
    name = "get_weather"
    description = "Get current weather and forecast for a city"
    system_prompt_extra = (
        "For weather queries, extract the city name. "
        "Use the get_weather tool with the city parameter."
    )

    async def process(self, **kwargs) -> Dict[str, Any]:
        city = kwargs.get("city", kwargs.get("query", "Lahore"))
        try:
            async with aiohttp.ClientSession() as session:
                geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json"
                async with session.get(geo_url) as resp:
                    geo = await resp.json()
                if not geo.get("results"):
                    return {"error": f"Could not find location: {city}", "city": city}
                lat = geo["results"][0]["latitude"]
                lon = geo["results"][0]["longitude"]
                w_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto"
                async with session.get(w_url) as wr:
                    wdata = await wr.json()
                code = wdata.get("current", {}).get("weather_code", 0)
                condition = WEATHER_CODES.get(code, "Unknown")
                return {
                    "weather": {
                        "city": geo["results"][0]["name"],
                        "country": geo["results"][0].get("country", ""),
                        "temperature": f'{wdata["current"]["temperature_2m"]}°C',
                        "feels_like": f'{wdata["current"]["apparent_temperature"]}°C',
                        "humidity": f'{wdata["current"]["relative_humidity_2m"]}%',
                        "wind_speed": f'{wdata["current"]["wind_speed_10m"]} km/h',
                        "condition": condition,
                        "high": f'{wdata["daily"]["temperature_2m_max"][0]}°C',
                        "low": f'{wdata["daily"]["temperature_2m_min"][0]}°C',
                    }
                }
        except Exception:
            return {"success": False}
