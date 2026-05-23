# Salary Management Tool

A simple salary management prototype for an organization of 10,000 employees. Built for HR managers to manage employees and view salary insights.

## Tech Stack

- **Backend:** Python, FastAPI, SQLAlchemy, SQLite
- **Frontend:** React, Material UI, Vite
- **Testing:** pytest (backend), Vitest + React Testing Library (frontend)

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
uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000

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

- **Employee CRUD:** Add, view, edit, delete employees
- **Search & Filter:** Search by name, filter by country
- **Pagination:** Server-side pagination (10 per page)
- **Salary Insights:** Min/max/avg salary by country, avg salary by job title + country
- **Seed Script:** Bulk inserts 10,000 employees in ~0.03s
