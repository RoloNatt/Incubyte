import random
import time
import os
from sqlalchemy import text
from app.database import engine, Base
from app.models import Employee

COUNTRIES = ["India", "USA", "Germany", "UK", "Singapore", "Australia"]
JOB_TITLES = [
    "Software Engineer",
    "Senior Engineer",
    "Product Manager",
    "HR Manager",
    "Data Scientist",
    "Designer",
    "QA Engineer",
    "DevOps Engineer",
]
DEPARTMENTS = ["Engineering", "HR", "Finance", "Marketing", "Operations", "Product"]

SALARY_RANGES = {
    "India": (400000, 3000000),
    "USA": (60000, 200000),
    "Germany": (50000, 150000),
    "UK": (40000, 130000),
    "Singapore": (50000, 160000),
    "Australia": (55000, 170000),
}


def load_names(filepath: str) -> list[str]:
    with open(filepath, "r") as f:
        return [line.strip() for line in f if line.strip()]


def seed():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    first_names = load_names(os.path.join(base_dir, "first_names.txt"))
    last_names = load_names(os.path.join(base_dir, "last_names.txt"))

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    employees = []
    for _ in range(10000):
        country = random.choice(COUNTRIES)
        salary_min, salary_max = SALARY_RANGES[country]
        employees.append(
            {
                "full_name": f"{random.choice(first_names)} {random.choice(last_names)}",
                "job_title": random.choice(JOB_TITLES),
                "country": country,
                "department": random.choice(DEPARTMENTS),
                "salary": round(random.uniform(salary_min, salary_max), 2),
            }
        )

    start = time.time()
    with engine.begin() as conn:
        conn.execute(Employee.__table__.insert(), employees)
    elapsed = time.time() - start

    print(f"Seeded 10000 employees in {elapsed:.2f} seconds")


if __name__ == "__main__":
    seed()
