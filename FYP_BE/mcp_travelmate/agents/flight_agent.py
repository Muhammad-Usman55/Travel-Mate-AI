from typing import Any, Dict
from .base import BaseAgent
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from Flight.views import get_lowest_rates


class FlightAgent(BaseAgent):
    name = "get_Flights"
    description = "Search for flight availability and prices"
    system_prompt_extra = (
        "For flight searches, extract: departure airport code, arrival airport code, "
        "start date, end date, number of adults, cabin class, trip type, and stops preference. "
        "Use the get_Flights tool with departure, arrivals, startDate, endDate, adults, infants, budget, "
        "cabin_class, trip_type, stops. "
        "Airport codes are IATA 3-letter codes like LHE, KHI, DXB, ISB, LHR, JFK."
    )

    async def process(self, **kwargs) -> Dict[str, Any]:
        try:
            result = await get_lowest_rates(**kwargs)
            if isinstance(result, dict):
                return {"flights": result}
            return {"flights": {"data": result if isinstance(result, list) else [result]}}
        except Exception:
            return {"success": False}
