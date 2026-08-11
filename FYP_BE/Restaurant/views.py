import os
import re
import asyncio
import aiohttp
import pandas as pd
from django.conf import settings
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / '.env')

SERPAPI_URL = "https://serpapi.com/search"


def get_city_query(iata_code):
    try:
        file_path = os.path.join(settings.BASE_DIR, 'airports.csv')
        airport_df = pd.read_csv(file_path, encoding='Windows-1252')
        row = airport_df[airport_df['IATA CODE'] == iata_code]
        if not row.empty:
            return row['Airport Name'].values[0]
    except Exception:
        pass
    return iata_code


def format_hotel_data(properties, city_code, checkOutDate):
    details = []
    for p in properties:
        rate = (p.get("rate_per_night") or {}).get("extracted_lowest") or (p.get("rate_per_night") or {}).get("lowest")
        if rate and isinstance(rate, str):
            match = re.search(r'[\d.]+', rate)
            rate = match.group() if match else None
        details.append({
            "HotelName": p.get("name", "N/A"),
            "City": city_code,
            "Price": f"${rate}" if rate else "N/A",
            "Rating": p.get("overall_rating", "N/A"),
            "Stars": p.get("hotel_class", "N/A"),
            "Amenities": p.get("amenities", []),
            "CheckOut": checkOutDate,
            "Link": p.get("link", "N/A"),
            "Thumbnail": (p.get("images") or [{}])[0].get("thumbnail", "N/A"),
        })
    return details


async def hotel_data(city_code, checkInDate, checkOutDate, adults, api_key, star=None, all_hotels=None):
    query = get_city_query(city_code)
    params = {
        "engine": "google_hotels",
        "q": query,
        "check_in_date": checkInDate,
        "check_out_date": checkOutDate,
        "adults": str(adults) if adults else "1",
        "currency": "USD",
        "gl": "pk",
        "hl": "en",
        "api_key": api_key,
    }

    async with aiohttp.ClientSession() as session:
        async with session.get(SERPAPI_URL, params=params, timeout=15) as response:
            if response.status != 200:
                return f"Error fetching hotel data: {response.status}"
            data = await response.json()

    properties = data.get("properties", [])
    if star:
        properties = [p for p in properties if str(p.get("hotel_class", "")) == str(star)]

    if not properties:
        return {"Result": "Not Found"}

    extracted_data = format_hotel_data(properties, city_code, checkOutDate)
    return {'details': extracted_data}


async def fetch_all_city_data(city_codes, check_in_date, check_out_date, adults, api_key, star=None, all_hotels='true'):
    tasks = [
        hotel_data(city_code, check_in_date, check_out_date, adults, api_key, star, all_hotels)
        for city_code in city_codes
    ]
    return await asyncio.gather(*tasks)


async def fetchHotels(**data):
    try:
        iataCodes = data.get('iataCodes') or data.get('arrivals', ["LHR", "LGW", "STN", "LTN"])
        startDate = data.get('startDate')
        endDate = data.get('endDate')
        adults = data.get('adults')
        star = data.get('star', None)

        api_key = os.getenv('SERPAPI_KEY')
        if not api_key:
            return {"success": False}

        if not all([iataCodes, startDate, endDate]):
            return {'error': 'Missing required fields'}

        async def run_search():
            return await fetch_all_city_data(iataCodes, startDate, endDate, adults, api_key, star)

        try:
            return await run_search()
        except Exception:
            return {"success": False}

    except Exception:
        return {"success": False}
