from typing import Any, Dict
from .base import BaseAgent
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from Restaurant.views import fetchHotels


class HotelAgent(BaseAgent):
    name = "get_hotels"
    description = "Search for hotel availability and prices"
    system_prompt_extra = (
        "For hotel searches, extract: city/arrival code, check-in date, check-out date, "
        "number of adults, and budget. "
        "Use the get_hotels tool with arrivals, startDate, endDate, adults, budget. "
        "City codes are IATA 3-letter codes like LHE, DXB, ISB."
    )

    async def process(self, **kwargs) -> Dict[str, Any]:
        star = kwargs.pop("star", None)
        room_type = kwargs.pop("room_type", None)
        if star:
            kwargs["star"] = star
        try:
            result = await fetchHotels(**kwargs)
            if isinstance(result, dict):
                return {"hotels": result}
            return {"hotels": {"data": result if isinstance(result, list) else [result]}}
        except Exception:
            return {"success": False}
