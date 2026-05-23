# Salary Management Tool

A professional HR compensation and budgeting dashboard for an organization of 10,000 employees. Built for HR managers to manage employees and analyze salary data with comprehensive payroll insights.

## Tech Stack

- **Backend:** Python 3.14, FastAPI, SQLAlchemy, SQLite, pytest
- **Frontend:** React 19, Vite, Material UI 9, Recharts, Vitest + React Testing Library
- **Testing:** 43 backend tests, 42 frontend tests (85 total)

## Setup

### Prerequisites

- Python 3.14+
- Node.js 18+
- Virtual environment (`env/`)

### Backend

```bash
# Activate virtual environment (Windows)
.\env\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Seed database with 10,000 employees
python -m app.seed

# Run backend server
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

Backend runs at: http://localhost:8001

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs at: http://localhost:5173

## Running Tests

### Backend Tests

```bash
cd backend
pytest -v
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app entry
│   │   ├── database.py      # SQLAlchemy setup
│   │   ├── models.py        # Employee model
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── crud.py          # Database operations
│   │   ├── seed.py          # Seed 10k employees
│   │   ├── routers/
│   │   │   ├── employees.py # Employee CRUD endpoints
│   │   │   └── insights.py  # Salary insights endpoints
│   │   └── tests/
│   │       ├── conftest.py
│   │       ├── test_employees.py
│   │       └── test_insights.py
│   ├── first_names.txt
│   ├── last_names.txt
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/employeeApi.js
│   │   ├── components/
│   │   ├── pages/
│   │   └── tests/
│   ├── package.json
│   └── vite.config.js
├── README.md
├── PROMPT.md
└── .gitignore
```

## Features

### Employee Management
- **CRUD Operations:** Add, view, edit, delete employees with validation
- **Search & Filter:** Search by name, filter by country, sortable columns
- **Currency Support:** Multi-currency with automatic conversion (INR, USD, EUR, GBP, SGD, AUD)
- **Salary Period Toggle:** View salaries in annual or monthly format
- **Country Flags:** Visual country indicators in table
- **Salary Tooltips:** Hover to see both annual and monthly values
- **Pagination:** Server-side pagination (10 per page)

### Analytics Dashboard
- **Compensation Metrics:** Min, Median, Average, Max salary with visual hierarchy
- **Payroll Analytics:** Monthly/annual payroll totals, payroll share %, budget insights
- **Summary Insights:** Auto-generated contextual insights (top dept, largest dept, top role)
- **Interactive Charts:** 
  - Salary Distribution (progressive colors)
  - Payroll by Department (horizontal bars)
  - Job Title Comparison
  - Employee Distribution by Department
  - Department Average Salary
- **Job Title Analysis:** Median, headcount, payroll cost, comparison vs country average
- **Dynamic Subtitles:** Charts show contextual insights automatically
- **Collapsible Analytics:** Detailed analytics in expandable accordion

### Technical
- **Seed Script:** Bulk inserts 10,000 employees in ~0.03s
- **Strict TDD:** All features developed test-first (85 tests passing)
- **Responsive Design:** Works on desktop and mobile
- **Number Formatting:** Indian (lakhs/crores) and Western (K/M) formats
