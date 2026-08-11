from locust import HttpUser, task, between, events
import time


from datetime import datetime, timedelta
import random
import os
import django


# Configure Django so settings are available
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")  # <-- replace Main with your Django project name
django.setup()

import time
from locust import User, task, between, events

def track(name, func, **kwargs):
    start_time = time.time()
    try:
        result = func(**kwargs)   # call your function
        total_time = int((time.time() - start_time) * 1000)  # ms
        events.request.fire(
            request_type="function",   # type can be "function"
            name=name,
            response_time=total_time,
            response_length=0,
            exception=None,
        )
        return result
    except Exception as e:
        total_time = int((time.time() - start_time) * 1000)
        events.request.fire(
            request_type="function",
            name=name,
            response_time=total_time,
            response_length=0,
            exception=e,
        )
        raise


class TravelFunctionUser(User):
    wait_time = between(1, 3)

    @task(2)
    async def call_flights(self):
        from Flight.views import get_lowest_rates
        adults = random.randint(1, 4)
        start_date = datetime.today() + timedelta(days=random.randint(1, 30))
        end_date = start_date + timedelta(days=3)

        result = await get_lowest_rates(
              departure=["LHE"], arrivals=["DXB", "LHE"],
              startDate=start_date.strftime("%Y-%m-%d"),
              endDate=end_date.strftime("%Y-%m-%d"),
              adults=adults, budget=1000, infants="0")
        print(result)
        

    @task(1)
    async def call_hotels(self):
        from Restaurant.views import fetchHotels
        adults = random.randint(1, 4)
        start_date = datetime.today() + timedelta(days=random.randint(1, 30))
        end_date = start_date + timedelta(days=2)

        result = await fetchHotels(
              iataCodes=["LHR", "LGW", "STN", "LTN"],
              startDate=start_date.strftime("%Y-%m-%d"),
              endDate=end_date.strftime("%Y-%m-%d"),
              adults=adults)
        