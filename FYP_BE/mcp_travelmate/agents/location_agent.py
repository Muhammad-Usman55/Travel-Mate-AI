import aiohttp
from typing import Any, Dict
from .base import BaseAgent


class LocationAgent(BaseAgent):
    name = "get_locations"
    description = "Search for places, attractions, and locations worldwide"
    system_prompt_extra = (
        "For location/place searches, extract the place name or query. "
        "Use the get_locations tool with the query parameter."
    )

    async def process(self, **kwargs) -> Dict[str, Any]:
        query = kwargs.get("query", kwargs.get("q", ""))
        if not query:
            return {"error": "No search query provided", "locations": []}
        try:
            async with aiohttp.ClientSession() as session:
                url = f"https://nominatim.openstreetmap.org/search?q={query}&format=json&limit=5&addressdetails=1"
                headers = {"User-Agent": "TravelMateAI/1.0"}
                async with session.get(url, headers=headers) as resp:
                    results = await resp.json()
                locations = []
                for r in results:
                    locations.append({
                        "name": r.get("display_name", "").split(",")[0],
                        "full_address": r.get("display_name", ""),
                        "latitude": r.get("lat"),
                        "longitude": r.get("lon"),
                        "type": r.get("type", ""),
                        "country": r.get("address", {}).get("country", ""),
                    })
                return {"locations": locations[:5], "query": query}
        except Exception:
            return {"success": False, "locations": []}
