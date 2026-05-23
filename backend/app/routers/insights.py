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


@router.get("/insights/salary-distribution")
def get_salary_distribution(country: str = Query(...), db: Session = Depends(get_db)):
    result = crud.get_salary_distribution(db, country)
    if not result:
        raise HTTPException(status_code=404, detail="No data found")
    return result


@router.get("/insights/job-title-comparison")
def get_job_title_comparison(country: str = Query(...), db: Session = Depends(get_db)):
    result = crud.get_job_title_comparison(db, country)
    if not result:
        raise HTTPException(status_code=404, detail="No data found")
    return result


@router.get("/insights/department-comparison")
def get_department_comparison(country: str = Query(...), db: Session = Depends(get_db)):
    result = crud.get_department_comparison(db, country)
    if not result:
        raise HTTPException(status_code=404, detail="No data found")
    return result


@router.get("/insights/employee-distribution")
def get_employee_distribution(country: str = Query(...), db: Session = Depends(get_db)):
    result = crud.get_employee_distribution(db, country)
    if not result:
        raise HTTPException(status_code=404, detail="No data found")
    return result


@router.get("/insights/global-average")
def get_global_average(db: Session = Depends(get_db)):
    result = crud.get_global_avg_salary(db)
    if result is None:
        raise HTTPException(status_code=404, detail="No data found")
    return {"avg_salary": result}
