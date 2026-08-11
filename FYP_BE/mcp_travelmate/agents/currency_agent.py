import aiohttp
from typing import Any, Dict
from .base import BaseAgent


class CurrencyAgent(BaseAgent):
    name = "get_currency"
    description = "Convert currency from one currency to another"
    system_prompt_extra = (
        "For currency conversion, extract the amount, from_currency, and to_currency. "
        "Use the get_currency tool with amount, from_currency, and to_currency parameters. "
        "Example: '100 USD to EUR' -> amount=100, from_currency='USD', to_currency='EUR'."
    )

    CURRENCIES = {
        "USD": "US Dollar", "EUR": "Euro", "GBP": "British Pound", "JPY": "Japanese Yen",
        "PKR": "Pakistani Rupee", "INR": "Indian Rupee", "AED": "UAE Dirham",
        "SAR": "Saudi Riyal", "CAD": "Canadian Dollar", "AUD": "Australian Dollar",
        "CNY": "Chinese Yuan", "TRY": "Turkish Lira", "MYR": "Malaysian Ringgit",
        "SGD": "Singapore Dollar", "NZD": "New Zealand Dollar", "CHF": "Swiss Franc",
        "KRW": "South Korean Won", "SEK": "Swedish Krona", "NOK": "Norwegian Krone",
        "DKK": "Danish Krone", "THB": "Thai Baht", "HKD": "Hong Kong Dollar",
    }

    async def process(self, **kwargs) -> Dict[str, Any]:
        amount = float(kwargs.get("amount", 1))
        from_curr = kwargs.get("from_currency", kwargs.get("from", "USD")).upper()
        to_curr = kwargs.get("to_currency", kwargs.get("to", "PKR")).upper()

        try:
            async with aiohttp.ClientSession() as session:
                url = f"https://api.frankfurter.dev/latest?from={from_curr}&to={to_curr}"
                async with session.get(url) as resp:
                    if resp.status != 200:
                        return {"error": f"Currency conversion failed for {from_curr} to {to_curr}"}
                    data = await resp.json()
                rate = data["rates"][to_curr]
                converted = round(amount * rate, 2)
                return {
                    "currency": {
                        "from": from_curr,
                        "from_name": self.CURRENCIES.get(from_curr, from_curr),
                        "to": to_curr,
                        "to_name": self.CURRENCIES.get(to_curr, to_curr),
                        "amount": amount,
                        "converted": converted,
                        "rate": rate,
                        "date": data.get("date", ""),
                    }
                }
        except Exception:
            return {"success": False}
