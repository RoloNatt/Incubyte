from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeeResponse,
    PaginatedEmployeesResponse,
)
from app import crud

router = APIRouter()


@router.post("/employees", response_model=EmployeeResponse, status_code=201)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    return crud.create_employee(db, employee)


@router.get("/employees", response_model=PaginatedEmployeesResponse)
def get_employees(
    page: int = 1,
    limit: int = 10,
    search: str | None = None,
    country: str | None = None,
    sort_by: str | None = None,
    sort_order: str = "asc",
    db: Session = Depends(get_db),
):
    employees, total = crud.get_employees(db, page, limit, search, country, sort_by, sort_order)
    return {
        "employees": employees,
        "total": total,
        "page": page,
        "limit": limit,
    }


@router.put("/employees/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int, employee: EmployeeUpdate, db: Session = Depends(get_db)
):
    updated = crud.update_employee(db, employee_id, employee)
    if not updated:
        raise HTTPException(status_code=404, detail="Employee not found")
    return updated


@router.delete("/employees/{employee_id}", status_code=204)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_employee(db, employee_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Employee not found")
