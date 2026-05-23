from sqlalchemy.orm import Session
from sqlalchemy import func, case, and_
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
    sort_by: str | None = None,
    sort_order: str = "asc",
) -> tuple[list[Employee], int]:
    query = db.query(Employee)

    if search:
        query = query.filter(Employee.full_name.ilike(f"%{search}%"))
    if country:
        query = query.filter(Employee.country == country)

    if sort_by and hasattr(Employee, sort_by):
        column = getattr(Employee, sort_by)
        query = query.order_by(column.desc() if sort_order == "desc" else column.asc())

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


def get_salary_distribution(db: Session, country: str) -> list[dict]:
    employees = db.query(Employee.salary).filter(Employee.country == country).all()
    if not employees:
        return []

    salaries = [e[0] for e in employees]
    max_sal = max(salaries)

    if max_sal <= 200000:
        buckets = [(0, 50000), (50000, 100000), (100000, 150000), (150000, 200000)]
    elif max_sal <= 1000000:
        buckets = [(0, 100000), (100000, 250000), (250000, 500000), (500000, 1000000)]
    else:
        buckets = [(0, 500000), (500000, 1000000), (1000000, 2000000), (2000000, 5000000)]

    result = []
    for low, high in buckets:
        count = sum(1 for s in salaries if low <= s < high)
        if low >= 1000000:
            label = f"{low // 1000000}M-{high // 1000000}M"
        elif low >= 1000:
            label = f"{low // 1000}k-{high // 1000}k"
        else:
            label = f"{low}-{high // 1000}k"
        result.append({"range": label, "count": count})

    over = sum(1 for s in salaries if s >= buckets[-1][1])
    if over > 0:
        result.append({"range": f"{buckets[-1][1] // 1000000}M+", "count": over})

    return result


def get_job_title_comparison(db: Session, country: str) -> list[dict]:
    results = (
        db.query(
            Employee.job_title,
            func.avg(Employee.salary).label("avg_salary"),
            func.count(Employee.id).label("count"),
        )
        .filter(Employee.country == country)
        .group_by(Employee.job_title)
        .order_by(func.avg(Employee.salary).desc())
        .all()
    )
    return [
        {"job_title": r.job_title, "avg_salary": round(r.avg_salary, 2), "count": r.count}
        for r in results
    ]


def get_department_comparison(db: Session, country: str) -> list[dict]:
    results = (
        db.query(
            Employee.department,
            func.avg(Employee.salary).label("avg_salary"),
            func.count(Employee.id).label("count"),
        )
        .filter(Employee.country == country)
        .group_by(Employee.department)
        .order_by(func.avg(Employee.salary).desc())
        .all()
    )
    return [
        {"department": r.department, "avg_salary": round(r.avg_salary, 2), "count": r.count}
        for r in results
    ]


def get_employee_distribution(db: Session, country: str) -> list[dict]:
    results = (
        db.query(
            Employee.department,
            func.count(Employee.id).label("count"),
        )
        .filter(Employee.country == country)
        .group_by(Employee.department)
        .order_by(func.count(Employee.id).desc())
        .all()
    )
    return [{"department": r.department, "count": r.count} for r in results]


def get_global_avg_salary(db: Session) -> float | None:
    result = db.query(func.avg(Employee.salary)).scalar()
    return round(result, 2) if result else None
