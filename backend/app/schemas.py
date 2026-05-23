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
    employee_count: int


class JobTitleInsightsResponse(BaseModel):
    avg_salary: float
