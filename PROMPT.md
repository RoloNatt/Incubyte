# Prompt History

This file tracks all prompts given and the modifications made in response.

## Prompt 1

**Date:** 2026-05-23

**Prompt:** I am starting a new project. before starting the code, create README.md, PROMPT.md. PROMPT.md will contain all the prompts that I will be giving to you, as well as the summary of modifications that you make from that prompt. You must keep updating this file with every prompt I give you. I am creating a virtual env, activate it before you run any code.

**Summary of Modifications:**
- Created `README.md` with project description, setup instructions (including virtual environment activation), and placeholders for usage and project structure.
- Created `PROMPT.md` (this file) to track prompt history.
- Noted that the virtual environment is located at `env/`.

## Prompt 2

**Date:** 2026-05-23

**Prompt:** you need to follow the 3 rules of TDD when writing any code, explain in simple terms what they are so I know that you know what it is

**Summary of Modifications:**
- No code changes.
- Explained the 3 TDD rules: (1) write a failing test first, (2) write minimum code to pass, (3) refactor with tests green.

## Prompt 3

**Date:** 2026-05-23

**Prompt:** update the PROMPT file

**Summary of Modifications:**
- Appended Prompt 2 and Prompt 3 to `PROMPT.md`.

## Prompt 4

**Date:** 2026-05-23

**Prompt:** Build a Salary Management Tool prototype (full specification including tech stack, TDD, folder structure, features, API design, testing requirements, seed script, and UI requirements).

**Summary of Modifications:**

### Backend (created from scratch using TDD)
- `backend/requirements.txt` — FastAPI, uvicorn, SQLAlchemy, pydantic, pytest, httpx
- `backend/pytest.ini` — pytest configuration
- `backend/first_names.txt` — 50 first names for seed script
- `backend/last_names.txt` — 50 last names for seed script
- `backend/app/database.py` — SQLAlchemy engine, session, Base
- `backend/app/models.py` — Employee model with indexes on full_name, country, job_title
- `backend/app/schemas.py` — Pydantic schemas (EmployeeCreate, EmployeeUpdate, EmployeeResponse, PaginatedEmployeesResponse, CountryInsightsResponse, JobTitleInsightsResponse)
- `backend/app/crud.py` — All database operations (CRUD + insights aggregation)
- `backend/app/routers/employees.py` — POST/GET/PUT/DELETE /employees
- `backend/app/routers/insights.py` — GET /insights/country/{country}, GET /insights/job-title
- `backend/app/main.py` — FastAPI app with CORS middleware
- `backend/app/seed.py` — Bulk seed script (10,000 employees in ~0.03s)
- `backend/app/tests/conftest.py` — Test fixtures with in-memory test DB
- `backend/app/tests/test_employees.py` — 11 tests for employee CRUD
- `backend/app/tests/test_insights.py` — 5 tests for salary insights

### Frontend (created from scratch using TDD)
- Scaffolded with Vite + React
- Installed: @mui/material, @mui/icons-material, @emotion/react, @emotion/styled, react-router-dom
- Installed dev: vitest, jsdom, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
- `frontend/src/api/employeeApi.js` — API layer using native fetch
- `frontend/src/components/Navbar.jsx` — Navigation bar
- `frontend/src/components/SearchBar.jsx` — Search input
- `frontend/src/components/CountryFilter.jsx` — Country dropdown filter
- `frontend/src/components/StatsCard.jsx` — Reusable stats display card
- `frontend/src/components/EmployeeTable.jsx` — Paginated employee table with edit/delete actions
- `frontend/src/components/EmployeeFormModal.jsx` — Add/Edit form with validation
- `frontend/src/pages/EmployeesPage.jsx` — Main CRUD page
- `frontend/src/pages/InsightsPage.jsx` — Salary insights page
- `frontend/src/App.jsx` — Router setup
- `frontend/src/setupTests.js` — Test setup
- `frontend/src/tests/EmployeeFormModal.test.jsx` — 5 tests
- `frontend/src/tests/EmployeeTable.test.jsx` — 4 tests
- `frontend/src/tests/EmployeesPage.test.jsx` — 3 tests
- `frontend/src/tests/InsightsPage.test.jsx` — 4 tests

### Other
- `.gitignore` — Python, Node, IDE ignores
- `README.md` — Updated with full setup instructions, project structure, features

### Test Results
- **Backend:** 16 tests passed
- **Frontend:** 16 tests passed
- **Seed:** 10,000 employees in 0.03 seconds
