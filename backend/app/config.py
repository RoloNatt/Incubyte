import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "salary.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

COUNTRY_CURRENCY_MAP = {
    "India": "INR",
    "USA": "USD",
    "Germany": "EUR",
    "UK": "GBP",
    "Singapore": "SGD",
    "Australia": "AUD",
}

# Static exchange rates to INR (base)
EXCHANGE_RATES_TO_INR = {
    "INR": 1.0,
    "USD": 83.0,
    "EUR": 90.0,
    "GBP": 105.0,
    "SGD": 62.0,
    "AUD": 55.0,
}

CURRENCY_SYMBOLS = {
    "INR": "₹",
    "USD": "$",
    "EUR": "€",
    "GBP": "£",
    "SGD": "S$",
    "AUD": "A$",
}


def convert_salary(amount: float, from_currency: str, to_currency: str) -> float:
    if from_currency == to_currency:
        return amount
    inr_amount = amount * EXCHANGE_RATES_TO_INR[from_currency]
    return round(inr_amount / EXCHANGE_RATES_TO_INR[to_currency], 2)
