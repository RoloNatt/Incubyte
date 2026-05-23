import os
from app.config import DB_PATH, SQLALCHEMY_DATABASE_URL


def test_db_path_is_absolute():
    assert os.path.isabs(DB_PATH)


def test_db_path_points_to_backend_dir():
    assert DB_PATH.endswith("salary.db")
    parent = os.path.dirname(DB_PATH)
    assert os.path.basename(parent) == "backend"


def test_sqlalchemy_url_uses_db_path():
    assert SQLALCHEMY_DATABASE_URL == f"sqlite:///{DB_PATH}"
