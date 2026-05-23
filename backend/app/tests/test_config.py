import os
from app.config import (
    DB_PATH,
    SQLALCHEMY_DATABASE_URL,
    COUNTRY_CURRENCY_MAP,
    EXCHANGE_RATES_TO_INR,
    convert_salary,
)


def test_db_path_is_absolute():
    assert os.path.isabs(DB_PATH)


def test_db_path_points_to_backend_dir():
    assert DB_PATH.endswith("salary.db")
    parent = os.path.dirname(DB_PATH)
    assert os.path.basename(parent) == "backend"


def test_sqlalchemy_url_uses_db_path():
    assert SQLALCHEMY_DATABASE_URL == f"sqlite:///{DB_PATH}"


def test_country_currency_map_has_all_countries():
    expected = {"India", "USA", "Germany", "UK", "Singapore", "Australia"}
    assert set(COUNTRY_CURRENCY_MAP.keys()) == expected


def test_exchange_rates_has_all_currencies():
    expected = {"INR", "USD", "EUR", "GBP", "SGD", "AUD"}
    assert set(EXCHANGE_RATES_TO_INR.keys()) == expected


def test_convert_salary_same_currency():
    assert convert_salary(100000, "INR", "INR") == 100000


def test_convert_salary_inr_to_usd():
    result = convert_salary(83000, "INR", "USD")
    assert result == 1000.0


def test_convert_salary_usd_to_inr():
    result = convert_salary(1000, "USD", "INR")
    assert result == 83000.0


def test_convert_salary_usd_to_eur():
    result = convert_salary(1000, "USD", "EUR")
    expected = round((1000 * 83.0) / 90.0, 2)
    assert result == expected
