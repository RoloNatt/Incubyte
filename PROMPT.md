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

## Prompt 5

**Date:** 2026-05-23

**Prompt:** Fix the empty table bug (employees showing 0 rows despite seeded data) and implement comprehensive UI/UX improvements to make the app look professional.

**Summary of Modifications:**

### Bug Fix: Empty Table
- **Root cause:** CORS was restricted to `localhost:5173` only. Browser preview proxy used a different origin, causing silent CORS failures. The frontend catch block set employees to `[]`.
- **Fix:** Changed CORS `allow_origins` to `["*"]` (appropriate for localhost prototype).
- Created `backend/app/config.py` — centralized DB path using absolute path to prevent SQLite path mismatch.
- Updated `backend/app/database.py` — imports from config, prints DB path on startup.
- Updated `backend/app/seed.py` — added verification count and DB path logging after seed.
- Added `backend/app/tests/test_config.py` — 3 tests verifying DB path is absolute, points to backend dir, and URL is correct.

### UI/UX Improvements
- **Theme:** Created `frontend/src/theme.js` — professional color palette (deep blue navbar, gray background, white cards, rounded corners, custom typography).
- **App.jsx:** Added `ThemeProvider`, `CssBaseline`, gray background wrapper.
- **Navbar:** Active page highlighting, icons (People/Insights), sticky position, hover effects, professional styling.
- **EmployeesPage:** Wrapped in `Container maxWidth="xl"`, added subtitle, filter card wrapper, loading spinner (`CircularProgress`), error alert.
- **EmployeeTable:** Zebra rows, hover effect, salary right-aligned with `toLocaleString()` formatting, tooltips on edit/delete, smaller icon buttons, friendly empty state with icon + message.
- **InsightsPage:** Wrapped in Container, added subtitles and descriptions, sections in Cards with Dividers, Alert components for errors.
- **StatsCard:** Improved with border, uppercase label, better typography hierarchy.

### New/Updated Tests
- `EmployeeTable.test.jsx` — added: empty state renders, salary formatting with commas (6 total)
- `EmployeesPage.test.jsx` — added: subtitle renders, error message on API failure (5 total)
- `InsightsPage.test.jsx` — added: subtitle renders (5 total)

### Test Results
- **Backend:** 19 tests passed
- **Frontend:** 21 tests passed

## Prompt 6

**Date:** 2026-05-23

**Prompt:** Transform the app into a professional HR analytics dashboard with currency-aware salary display, better filters, interactive charts, analytics, smoother UX, and richer visual feedback. Implement Option A for currency handling (store local currency, static exchange rates, display currency selector). Replace job title text input with searchable dropdown. Remove "Get Stats" buttons — auto-fetch on selection change. Add Recharts-based analytics dashboard with salary distribution, job title comparison, department comparison, and employee distribution charts. Add contextual insights (% vs global average). Add sorting to employee table. Add Clear Filters. Continue strict TDD.

**Summary of Modifications:**

### Backend Changes
- **`app/config.py`** — Added `COUNTRY_CURRENCY_MAP`, `EXCHANGE_RATES_TO_INR`, `CURRENCY_SYMBOLS`, `convert_salary()` utility.
- **`app/models.py`** — Added `currency` column to Employee model.
- **`app/schemas.py`** — Added `currency` field to EmployeeCreate, EmployeeUpdate, EmployeeResponse.
- **`app/seed.py`** — Auto-assigns currency based on country using `COUNTRY_CURRENCY_MAP`.
- **`app/crud.py`** — Added `sort_by`/`sort_order` to `get_employees()`. Added analytics functions: `get_salary_distribution()`, `get_job_title_comparison()`, `get_department_comparison()`, `get_employee_distribution()`, `get_global_avg_salary()`.
- **`app/routers/employees.py`** — Added `sort_by`, `sort_order` query params.
- **`app/routers/insights.py`** — Added endpoints: `/insights/salary-distribution`, `/insights/job-title-comparison`, `/insights/department-comparison`, `/insights/employee-distribution`, `/insights/global-average`.
- **`app/routers/metadata.py`** (new) — `GET /metadata/job-titles?country=`, `GET /metadata/countries`.
- **`app/main.py`** — Registered metadata router.

### Backend Tests (new)
- **`app/tests/test_config.py`** — 9 tests (DB path + currency conversion).
- **`app/tests/test_analytics.py`** (new) — 6 tests (salary distribution, job title comparison, department comparison, employee distribution, global average).
- **`app/tests/test_metadata.py`** (new) — 4 tests (job titles, job titles filtered by country, countries, empty state).

### Frontend Changes
- **`src/utils/currency.js`** (new) — `convertSalary()`, `formatSalary()`, `formatIndian()`, exchange rates, symbols.
- **`src/components/CurrencySelector.jsx`** (new) — Reusable Display Currency dropdown.
- **`src/api/employeeApi.js`** — Added: `getJobTitles()`, `getCountries()`, `getSalaryDistribution()`, `getJobTitleComparison()`, `getDepartmentComparison()`, `getEmployeeDistribution()`, `getGlobalAverage()`. Updated `getEmployees()` with `sort_by`/`sort_order`.
- **`src/components/EmployeeTable.jsx`** — Sortable column headers (TableSortLabel), currency-aware salary formatting using `formatSalary()`.
- **`src/components/EmployeeFormModal.jsx`** — Country is now a Select dropdown (auto-sets currency). Includes FormHelperText for validation.
- **`src/pages/EmployeesPage.jsx`** — Added CurrencySelector, Clear Filters button, sorting state management.
- **`src/pages/InsightsPage.jsx`** — Complete rewrite: auto-fetch on country/job title change, Recharts bar/pie charts, job title Autocomplete dropdown (dependent on country), contextual % insights, loading states.
- Installed `recharts` package.

### Frontend Tests
- **`src/tests/currency.test.js`** (new) — 8 tests (conversion, Indian format, western format, cross-currency).
- **`src/tests/EmployeeTable.test.jsx`** — Updated: currency symbols test, currency conversion display test (7 total).
- **`src/tests/EmployeeFormModal.test.jsx`** — Updated: MUI Select interaction, currency in payload (5 total).
- **`src/tests/EmployeesPage.test.jsx`** — Updated: currency in mock data (5 total).
- **`src/tests/InsightsPage.test.jsx`** — Rewritten: empty state, country filter, display currency (5 total).

### Test Results
- **Backend:** 36 tests passed
- **Frontend:** 30 tests passed
- **Total:** 66 tests, all green

## Prompt 7

**Date:** 2026-05-23

**Prompt:** Transform the app into a decision-ready HR compensation dashboard. Add salary period toggle (Annual/Monthly), enhanced payroll analytics (median, payroll totals, share %, summary insights), improve charts (replace pie with horizontal bars, progressive colors, dynamic subtitles, fix axis), add collapsible detailed analytics, improve stats cards with icons/hierarchy/colors, add country flags to table, add salary tooltip with both periods, improve number formatting everywhere. Continue strict TDD.

**Summary of Modifications:**

### Backend Changes
- **`app/crud.py`** — Added `_calculate_median()` helper. Enhanced `get_country_insights()` to return: `median_salary`, `annual_payroll`, `monthly_payroll`, `payroll_share`, `top_department`, `top_job_title`, `largest_department`. Enhanced `get_job_title_insights()` to return: `median_salary`, `count`, `annual_payroll`, `monthly_payroll`, `vs_country_avg`. Added `get_department_payroll()` function.
- **`app/schemas.py`** — Extended `CountryInsightsResponse` (7 new fields) and `JobTitleInsightsResponse` (5 new fields).
- **`app/routers/insights.py`** — Added `/insights/department-payroll` endpoint.

### Backend Tests
- **`app/tests/test_enhanced_insights.py`** (new) — 7 tests: median salary, payroll totals, payroll share %, summary insights (top_department, top_job_title, largest_department), enhanced job title insights (median, count, payroll, vs_country_avg), department payroll totals.

### Frontend Changes
- **`src/utils/currency.js`** — Added `applyPeriod()` for annual/monthly conversion, `formatCompact()` for lakhs/crores/K/M display.
- **`src/components/SalaryPeriodToggle.jsx`** (new) — Reusable segmented toggle (Annual | Monthly).
- **`src/components/StatsCard.jsx`** — Enhanced with `icon`, `color`, `secondary`, `variant` props for visual hierarchy.
- **`src/components/EmployeeTable.jsx`** — Added country flags, salary tooltip (shows both annual & monthly), period label (/yr or /mo), stronger hover, `period` prop support.
- **`src/pages/EmployeesPage.jsx`** — Added SalaryPeriodToggle, period state, passes period to table, clears on reset.
- **`src/pages/InsightsPage.jsx`** — Complete rewrite:
  - Summary insight strip with Chips (payroll share, top dept, largest dept, top role)
  - Compensation cards with icons (Min, Median, Avg primary, Max)
  - Budget cards (Employees, Monthly Payroll, Annual Payroll, VS Global Avg with ▲/▼ badge)
  - Enhanced job title section (avg, median, headcount, monthly cost, annual cost, vs country avg chip)
  - Key charts: Salary Distribution (progressive colors via Cell), Payroll by Department (horizontal bar, purple)
  - Collapsible "Detailed Analytics" accordion: Job Title Comparison, Employee Distribution (horizontal bar replacing pie), Avg Salary by Department
  - Dynamic chart subtitles (auto-generated from data)
  - Fixed Y-axis formatting using `formatCompact`
  - Period-aware: all values update when toggle changes
- **`src/api/employeeApi.js`** — Added `getDepartmentPayroll()`.

### Frontend Tests
- **`src/tests/currency.test.js`** — Added 9 tests: applyPeriod (annual/monthly), formatSalary with period, formatCompact (INR lakhs/crores, USD K/M, small amounts). Total: 17 tests.
- **`src/tests/EmployeeTable.test.jsx`** — Added: period label test, monthly salary test, country flags test. Total: 9 tests.
- **`src/tests/InsightsPage.test.jsx`** — Added: salary period toggle renders. Updated mocks for enhanced API responses. Total: 6 tests.
- **`src/tests/EmployeesPage.test.jsx`** — Unchanged, 5 tests.
- **`src/tests/EmployeeFormModal.test.jsx`** — Unchanged, 5 tests.

### Test Results
- **Backend:** 43 tests passed
- **Frontend:** 42 tests passed
- **Total:** 85 tests, all green

### Deployment Status
- **Backend:** Running at http://localhost:8001
- **Frontend:** Running at http://localhost:5173
- **Database:** 10,000 employees seeded
- **Status:** ✓ All systems operational

### Hotfix (2026-05-23)
- Fixed `WorkOutline` icon import error in `InsightsPage.jsx` — replaced with `Work` icon (WorkOutline doesn't exist in MUI icons)
