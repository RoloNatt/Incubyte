from sqlalchemy import Column, Integer, String, Float, Index
from app.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    country = Column(String, nullable=False)
    department = Column(String, nullable=False)
    salary = Column(Float, nullable=False)
    currency = Column(String, nullable=False, default="INR")

    __table_args__ = (
        Index("ix_employees_full_name", "full_name"),
        Index("ix_employees_country", "country"),
        Index("ix_employees_job_title", "job_title"),
    )
