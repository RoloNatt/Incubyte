from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import Employee
from app.schemas import EmployeeCreate, EmployeeUpdate


def create_employee(db: Session, employee: EmployeeCreate) -> Employee:
    db_employee = Employee(**employee.model_dump())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


def get_employees(
    db: Session,
    page: int = 1,
    limit: int = 10,
    search: str | None = None,
    country: str | None = None,
) -> tuple[list[Employee], int]:
    query = db.query(Employee)

    if search:
        query = query.filter(Employee.full_name.ilike(f"%{search}%"))
    if country:
        query = query.filter(Employee.country == country)

    total = query.count()
    employees = query.offset((page - 1) * limit).limit(limit).all()
    return employees, total


def get_employee(db: Session, employee_id: int) -> Employee | None:
    return db.query(Employee).filter(Employee.id == employee_id).first()


def update_employee(
    db: Session, employee_id: int, employee: EmployeeUpdate
) -> Employee | None:
    db_employee = get_employee(db, employee_id)
    if not db_employee:
        return None
    for key, value in employee.model_dump().items():
        setattr(db_employee, key, value)
    db.commit()
    db.refresh(db_employee)
    return db_employee


def delete_employee(db: Session, employee_id: int) -> bool:
    db_employee = get_employee(db, employee_id)
    if not db_employee:
        return False
    db.delete(db_employee)
    db.commit()
    return True


def get_country_insights(db: Session, country: str) -> dict | None:
    result = (
        db.query(
            func.min(Employee.salary).label("min_salary"),
            func.max(Employee.salary).label("max_salary"),
            func.avg(Employee.salary).label("avg_salary"),
            func.count(Employee.id).label("employee_count"),
        )
        .filter(Employee.country == country)
        .first()
    )
    if result.employee_count == 0:
        return None
    return {
        "min_salary": result.min_salary,
        "max_salary": result.max_salary,
        "avg_salary": round(result.avg_salary, 2),
        "employee_count": result.employee_count,
    }


def get_job_title_insights(db: Session, country: str, job_title: str) -> dict | None:
    result = (
        db.query(func.avg(Employee.salary).label("avg_salary"))
        .filter(Employee.country == country, Employee.job_title == job_title)
        .first()
    )
    if result.avg_salary is None:
        return None
    return {"avg_salary": round(result.avg_salary, 2)}
