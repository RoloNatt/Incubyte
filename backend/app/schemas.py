from pydantic import BaseModel, Field


class EmployeeCreate(BaseModel):
    full_name: str = Field(..., min_length=1)
    job_title: str = Field(..., min_length=1)
    country: str = Field(..., min_length=1)
    department: str = Field(..., min_length=1)
    salary: float = Field(..., gt=0)
    currency: str = Field(..., min_length=1)


class EmployeeUpdate(BaseModel):
    full_name: str = Field(..., min_length=1)
    job_title: str = Field(..., min_length=1)
    country: str = Field(..., min_length=1)
    department: str = Field(..., min_length=1)
    salary: float = Field(..., gt=0)
    currency: str = Field(..., min_length=1)


class EmployeeResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    full_name: str
    job_title: str
    country: str
    department: str
    salary: float
    currency: str


class PaginatedEmployeesResponse(BaseModel):
    employees: list[EmployeeResponse]
    total: int
    page: int
    limit: int


class CountryInsightsResponse(BaseModel):
    min_salary: float
    max_salary: float
    avg_salary: float
    median_salary: float
    employee_count: int
    annual_payroll: float
    monthly_payroll: float
    payroll_share: float
    top_department: str | None = None
    top_job_title: str | None = None
    largest_department: str | None = None


class JobTitleInsightsResponse(BaseModel):
    avg_salary: float
    median_salary: float
    count: int
    annual_payroll: float
    monthly_payroll: float
    vs_country_avg: float
