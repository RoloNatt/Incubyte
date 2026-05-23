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


def _calculate_median(salaries: list[float]) -> float:
    sorted_s = sorted(salaries)
    n = len(sorted_s)
    if n % 2 == 1:
        return sorted_s[n // 2]
    return round((sorted_s[n // 2 - 1] + sorted_s[n // 2]) / 2, 2)


def get_country_insights(db: Session, country: str) -> dict | None:
    result = (
        db.query(
            func.min(Employee.salary).label("min_salary"),
            func.max(Employee.salary).label("max_salary"),
            func.avg(Employee.salary).label("avg_salary"),
            func.count(Employee.id).label("employee_count"),
            func.sum(Employee.salary).label("total_payroll"),
        )
        .filter(Employee.country == country)
        .first()
    )
    if result.employee_count == 0:
        return None

    # Median
    salaries = [r[0] for r in db.query(Employee.salary).filter(Employee.country == country).all()]
    median_salary = _calculate_median(salaries)

    # Payroll share
    global_payroll = db.query(func.sum(Employee.salary)).scalar() or 0
    payroll_share = round((result.total_payroll / global_payroll) * 100, 2) if global_payroll else 0

    # Top paying department (highest avg salary)
    top_dept = (
        db.query(Employee.department)
        .filter(Employee.country == country)
        .group_by(Employee.department)
        .order_by(func.avg(Employee.salary).desc())
        .first()
    )

    # Top paying job title (highest avg salary)
    top_jt = (
        db.query(Employee.job_title)
        .filter(Employee.country == country)
        .group_by(Employee.job_title)
        .order_by(func.avg(Employee.salary).desc())
        .first()
    )

    # Largest department (most employees)
    largest_dept = (
        db.query(Employee.department)
        .filter(Employee.country == country)
        .group_by(Employee.department)
        .order_by(func.count(Employee.id).desc())
        .first()
    )

    annual_payroll = result.total_payroll
    monthly_payroll = round(annual_payroll / 12, 2)

    return {
        "min_salary": result.min_salary,
        "max_salary": result.max_salary,
        "avg_salary": round(result.avg_salary, 2),
        "median_salary": median_salary,
        "employee_count": result.employee_count,
        "annual_payroll": annual_payroll,
        "monthly_payroll": monthly_payroll,
        "payroll_share": payroll_share,
        "top_department": top_dept[0] if top_dept else None,
        "top_job_title": top_jt[0] if top_jt else None,
        "largest_department": largest_dept[0] if largest_dept else None,
    }


def get_job_title_insights(db: Session, country: str, job_title: str) -> dict | None:
    result = (
        db.query(
            func.avg(Employee.salary).label("avg_salary"),
            func.count(Employee.id).label("count"),
            func.sum(Employee.salary).label("total_payroll"),
        )
        .filter(Employee.country == country, Employee.job_title == job_title)
        .first()
    )
    if result.avg_salary is None:
        return None

    salaries = [
        r[0] for r in db.query(Employee.salary)
        .filter(Employee.country == country, Employee.job_title == job_title)
        .all()
    ]
    median_salary = _calculate_median(salaries)

    # Country avg for comparison
    country_avg = (
        db.query(func.avg(Employee.salary))
        .filter(Employee.country == country)
        .scalar()
    )
    vs_country_avg = round(((result.avg_salary - country_avg) / country_avg) * 100, 2) if country_avg else 0

    annual_payroll = result.total_payroll
    monthly_payroll = round(annual_payroll / 12, 2)

    return {
        "avg_salary": round(result.avg_salary, 2),
        "median_salary": median_salary,
        "count": result.count,
        "annual_payroll": annual_payroll,
        "monthly_payroll": monthly_payroll,
        "vs_country_avg": vs_country_avg,
    }


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


def get_department_payroll(db: Session, country: str) -> list[dict]:
    results = (
        db.query(
            Employee.department,
            func.sum(Employee.salary).label("total_payroll"),
            func.count(Employee.id).label("count"),
        )
        .filter(Employee.country == country)
        .group_by(Employee.department)
        .order_by(func.sum(Employee.salary).desc())
        .all()
    )
    return [
        {"department": r.department, "total_payroll": round(r.total_payroll, 2), "count": r.count}
        for r in results
    ]


def get_global_avg_salary(db: Session) -> float | None:
    result = db.query(func.avg(Employee.salary)).scalar()
    return round(result, 2) if result else None
