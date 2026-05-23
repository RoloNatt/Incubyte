from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import distinct
from app.database import get_db
from app.models import Employee

router = APIRouter()


@router.get("/metadata/job-titles")
def get_job_titles(country: str | None = None, db: Session = Depends(get_db)):
    query = db.query(distinct(Employee.job_title))
    if country:
        query = query.filter(Employee.country == country)
    results = query.order_by(Employee.job_title).all()
    return [r[0] for r in results]


@router.get("/metadata/countries")
def get_countries(db: Session = Depends(get_db)):
    results = db.query(distinct(Employee.country)).order_by(Employee.country).all()
    return [r[0] for r in results]
