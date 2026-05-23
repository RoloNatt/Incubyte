from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import CountryInsightsResponse, JobTitleInsightsResponse
from app import crud

router = APIRouter()


@router.get("/insights/country/{country}", response_model=CountryInsightsResponse)
def get_country_insights(country: str, db: Session = Depends(get_db)):
    result = crud.get_country_insights(db, country)
    if not result:
        raise HTTPException(status_code=404, detail="No employees found for this country")
    return result


@router.get("/insights/job-title", response_model=JobTitleInsightsResponse)
def get_job_title_insights(
    country: str = Query(...),
    job_title: str = Query(...),
    db: Session = Depends(get_db),
):
    result = crud.get_job_title_insights(db, country, job_title)
    if not result:
        raise HTTPException(
            status_code=404,
            detail="No employees found for this country and job title",
        )
    return result
