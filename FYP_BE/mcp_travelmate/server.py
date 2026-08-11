import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mcp.server.fastmcp import FastMCP
from .agents.orchestrator import TravelMateOrchestrator

mcp = FastMCP("TravelMate AI", port=8001, host="0.0.0.0")
orchestrator = TravelMateOrchestrator()


@mcp.tool(name="get_Flights", description="Search for flights between cities with dates, budget, cabin class, and stops preference")
async def get_flights(
    departure: list[str],
    arrivals: list[str],
    startDate: str,
    endDate: str,
    adults: str = "1",
    infants: str = "0",
    budget: float = 1000,
    cabin_class: str = "economy",
    trip_type: str = "round_trip",
    stops: str = "any",
) -> dict:
    result = await orchestrator.execute("get_Flights", {
        "departure": departure,
        "arrivals": arrivals,
        "startDate": startDate,
        "endDate": endDate,
        "adults": adults,
        "infants": infants,
        "budget": budget,
        "cabin_class": cabin_class,
        "trip_type": trip_type,
        "stops": stops,
    })
    return result


@mcp.tool(name="get_hotels", description="Search for hotels in a city with dates, budget, and star rating")
async def get_hotels(
    arrivals: list[str],
    startDate: str,
    endDate: str,
    adults: str = "1",
    budget: float = 500,
    star: str = "",
) -> dict:
    result = await orchestrator.execute("get_hotels", {
        "arrivals": arrivals,
        "startDate": startDate,
        "endDate": endDate,
        "adults": adults,
        "budget": budget,
        "star": star,
    })
    return result


@mcp.tool(name="get_weather", description="Get current weather and forecast for a city")
async def get_weather(city: str) -> dict:
    result = await orchestrator.execute("get_weather", {"city": city})
    return result


@mcp.tool(name="get_locations", description="Search for places, attractions, and locations worldwide")
async def get_locations(query: str) -> dict:
    result = await orchestrator.execute("get_locations", {"query": query})
    return result


@mcp.tool(name="get_currency", description="Convert amount from one currency to another")
async def get_currency(
    amount: float = 1,
    from_currency: str = "USD",
    to_currency: str = "PKR",
) -> dict:
    result = await orchestrator.execute("get_currency", {
        "amount": amount,
        "from_currency": from_currency,
        "to_currency": to_currency,
    })
    return result
