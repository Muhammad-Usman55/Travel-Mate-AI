"""
Test script: checks if Travelpayouts has usable flight + hotel data
for your target Pakistan routes/cities BEFORE you build the full integration.

Setup:
1. pip install requests
2. Paste your Travelpayouts API token below
3. Edit FLIGHT_ROUTES and HOTEL_CITIES with your actual FYP routes/cities
4. Run: python test_travelpayouts.py
"""

import requests
from datetime import date, timedelta

TOKEN = "186070e5f3a37a7054c6803d86937c0a"

# Hotellook requires real check-in/check-out dates in the future
CHECK_IN = (date.today() + timedelta(days=30)).isoformat()
CHECK_OUT = (date.today() + timedelta(days=33)).isoformat()

# Edit these to match what your FYP demo will actually search
FLIGHT_ROUTES = [
    ("LHE", "DXB"),
    ("KHI", "DXB"),
    ("ISB", "IST"),
    ("LHE", "JED"),
    ("KHI", "LHE"),
]

HOTEL_CITIES = [
    "Lahore",
    "Karachi",
    "Islamabad",
    "Dubai",
]


def test_flights():
    print("\n" + "=" * 50)
    print("FLIGHT DATA TEST (Aviasales cached prices)")
    print("=" * 50)

    for origin, destination in FLIGHT_ROUTES:
        url = "http://api.travelpayouts.com/v2/prices/latest"
        params = {
            "origin": origin,
            "destination": destination,
            "currency": "usd",
            "token": TOKEN,
        }
        try:
            resp = requests.get(url, params=params, timeout=10)
            data = resp.json()
            success = data.get("success")
            results = data.get("data", [])

            if success and results:
                print(f"✅ {origin} → {destination}: {len(results)} result(s) found")
            else:
                print(f"❌ {origin} → {destination}: NO DATA (empty cache for this route)")
        except Exception as e:
            print(f"⚠️  {origin} → {destination}: request failed — {e}")


def test_hotels():
    print("\n" + "=" * 50)
    print("HOTEL DATA TEST (Hotellook cache)")
    print("=" * 50)

    for city in HOTEL_CITIES:
        url = "https://engine.hotellook.com/api/v2/cache.json"
        params = {
            "location": city,
            "checkIn": CHECK_IN,
            "checkOut": CHECK_OUT,
            "currency": "usd",
            "limit": 5,
            "token": TOKEN,
        }
        try:
            resp = requests.get(url, params=params, timeout=10)
            if resp.status_code != 200:
                print(f"⚠️  {city}: HTTP {resp.status_code} — {resp.text[:150]}")
                continue

            data = resp.json()
            if isinstance(data, list) and len(data) > 0:
                print(f"✅ {city}: {len(data)} hotel(s) found")
            else:
                print(f"❌ {city}: NO DATA (empty response)")
        except Exception as e:
            print(f"⚠️  {city}: request failed — {e}")


if __name__ == "__main__":
    if TOKEN == "PUT_YOUR_TOKEN_HERE":
        print("⚠️  Paste your Travelpayouts API token into TOKEN before running.")
    else:
        test_flights()
        test_hotels()
        print("\nDone. Any ❌ routes/cities need mock data fallback for your demo.")