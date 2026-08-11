import os
import asyncio
import aiohttp
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / '.env')

TP_URL = "http://api.travelpayouts.com/v1/prices/cheap"

CABIN_MULTIPLIERS = {
    "economy": 1.0,
    "premium_economy": 1.45,
    "business": 2.5,
    "first": 4.0,
}

ESTIMATED_PRICES = {
    ("LHE", "KHI"): {"price": 95, "airline": "SereneAir", "flight_number": "ER-502", "transfers": 0, "duration": "2h 10m"},
    ("LHE", "ISB"): {"price": 75, "airline": "PIA", "flight_number": "PK-301", "transfers": 0, "duration": "1h 20m"},
    ("KHI", "LHE"): {"price": 95, "airline": "AirSial", "flight_number": "PF-121", "transfers": 0, "duration": "2h 10m"},
    ("KHI", "ISB"): {"price": 85, "airline": "SereneAir", "flight_number": "ER-508", "transfers": 0, "duration": "1h 50m"},
    ("ISB", "LHE"): {"price": 75, "airline": "PIA", "flight_number": "PK-306", "transfers": 0, "duration": "1h 20m"},
    ("ISB", "KHI"): {"price": 85, "airline": "AirBlue", "flight_number": "PA-201", "transfers": 0, "duration": "1h 50m"},
    ("LHE", "DXB"): {"price": 250, "airline": "flydubai", "flight_number": "FZ-302", "transfers": 0, "duration": "3h 30m"},
    ("KHI", "DXB"): {"price": 220, "airline": "flydubai", "flight_number": "FZ-334", "transfers": 0, "duration": "2h 45m"},
    ("ISB", "DXB"): {"price": 230, "airline": "Emirates", "flight_number": "EK-613", "transfers": 0, "duration": "3h 15m"},
    ("LHE", "LHR"): {"price": 750, "airline": "British Airways", "flight_number": "BA-260", "transfers": 1, "duration": "10h 30m"},
    ("KHI", "LHR"): {"price": 700, "airline": "British Airways", "flight_number": "BA-252", "transfers": 1, "duration": "9h 45m"},
    ("ISB", "LHR"): {"price": 720, "airline": "British Airways", "flight_number": "BA-262", "transfers": 1, "duration": "10h 00m"},
    ("LHE", "JED"): {"price": 350, "airline": "Saudia", "flight_number": "SV-733", "transfers": 0, "duration": "5h 30m"},
    ("KHI", "JED"): {"price": 320, "airline": "Saudia", "flight_number": "SV-715", "transfers": 0, "duration": "4h 45m"},
}

CABIN_LABELS = {
    "economy": "Economy",
    "premium_economy": "Premium Economy",
    "business": "Business",
    "first": "First Class",
}


def apply_cabin_class(price, cabin_class):
    multiplier = CABIN_MULTIPLIERS.get(cabin_class, 1.0)
    return round(price * multiplier)


def filter_by_stops(flights, stops):
    if not stops or stops == "any":
        return flights
    filtered = []
    for f in flights:
        num_stops = f.get("Segments", [[{}]])[0][0].get("NumberOfStops", 0) if f.get("Segments") else 0
        if stops == "nonstop" and num_stops == 0:
            filtered.append(f)
        elif stops == "1stop" and num_stops == 1:
            filtered.append(f)
        elif stops == "2plus" and num_stops >= 2:
            filtered.append(f)
    return filtered


def estimate_flight(origin, destination, cabin_class="economy"):
    key = (origin.upper(), destination.upper())
    est = ESTIMATED_PRICES.get(key)
    if est:
        adjusted_price = apply_cabin_class(est["price"], cabin_class)
        return {
            "TotalBudget": f"${adjusted_price}",
            "TotalTravelTime": est["duration"],
            "CabinClass": CABIN_LABELS.get(cabin_class, "Economy"),
            "Segments": [[
                {
                    "AirlineName": est["airline"],
                    "arrivalIATA": destination.upper(),
                    "FlightNumber": est["flight_number"],
                    "Aircraft": "Boeing 737",
                    "Departure": origin.upper(),
                    "Arrival": destination.upper(),
                    "FlightDuration": est["duration"],
                    "NumberOfStops": est["transfers"],
                }
            ]],
        }
    return None


def format_flight_data(origin, destination, offer, cabin_class="economy"):
    price = offer.get("price", 0)
    adjusted_price = apply_cabin_class(price, cabin_class)
    return {
        "TotalBudget": f"${adjusted_price}",
        "TotalTravelTime": "N/A",
        "CabinClass": CABIN_LABELS.get(cabin_class, "Economy"),
        "Segments": [[
            {
                "AirlineName": offer.get("airline", "N/A"),
                "arrivalIATA": destination,
                "FlightNumber": str(offer.get("flight_number", "N/A")),
                "Aircraft": "N/A",
                "Departure": f"{origin} - {offer.get('departure_at', 'N/A')}",
                "Arrival": f"{destination} - {offer.get('return_at') or 'N/A'}",
                "FlightDuration": "N/A",
                "NumberOfStops": offer.get("transfers", 0),
            }
        ]],
    }


def filter_flights_by_budget(flight_offers, min_budget=0, max_budget="1200$"):
    max_budget = float(max_budget.replace('$', '').replace(',', ''))
    filtered_flights = [
        flight for flight in flight_offers
        if min_budget <= float(flight['TotalBudget'].replace('$', '').replace(',', '')) <= max_budget
    ]
    return filtered_flights


async def fetch_flight(session, token, origin, arrival, currency="usd"):
    params = {
        "origin": origin.upper(),
        "destination": arrival.upper(),
        "currency": currency.upper(),
        "token": token,
    }
    async with session.get(TP_URL, params=params, timeout=10) as response:
        if response.status != 200:
            return None
        data = await response.json()
        success = data.get("success", False)
        if not success:
            return None
        origin_data = data.get("data", {}).get(origin.upper(), {})
        offers = origin_data.get(arrival.upper(), [])
        if not offers:
            return None
        best = offers[0] if isinstance(offers, list) else offers
        return format_flight_data(origin.upper(), arrival.upper(), best)


async def fetch_all_flights(token, departure, arrivals):
    origin = departure[0] if isinstance(departure, list) else departure
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_flight(session, token, origin, arrival) for arrival in arrivals]
        results = await asyncio.gather(*tasks)
        return [result for result in results if result is not None]


async def flight_search(budget, departure, arrivals, startDate, endDate, adults, infants, token):
    if not token:
        return {"success": False, "message": "Unable to retrieve access token."}
    try:
        return await fetch_all_flights(token, departure, arrivals)
    except Exception:
        return {"success": False, "message": "Flight search failed"}


async def get_lowest_rates(**data):
    budget = data.get("budget", "1000")
    departure = data.get("departure")
    arrivals = data.get("arrivals")
    startDate = data.get("startDate")
    endDate = data.get("endDate")
    adults = data.get("adults")
    infants = data.get("infants")
    cabin_class = data.get("cabin_class", "economy")
    trip_type = data.get("trip_type", "round_trip")
    stops = data.get("stops", "any")

    token = os.getenv('TRAVELPAYOUTS_TOKEN')
    if not departure or not arrivals:
        return {"success": False, "data": []}

    flights = []
    if token:
        flights = await flight_search(
            budget, departure, arrivals, startDate, endDate, adults, infants, token
        )

    # The provider can return an error object. Only a non-empty list is valid
    # flight data; all other responses use the local route estimates below.
    if not isinstance(flights, list) or not flights:
        origin = departure[0] if isinstance(departure, list) else departure
        estimated = []
        for dest in arrivals:
            est = estimate_flight(origin, dest, cabin_class)
            if est:
                estimated.append(est)
        if estimated:
            flights_data = estimated
        else:
            flights_data = []
    else:
        flights_data = flights
        for f in flights_data:
            if "CabinClass" not in f:
                f["CabinClass"] = CABIN_LABELS.get(cabin_class, "Economy")

    flights_data = filter_by_stops(flights_data, stops)

    return {"data": flights_data}
