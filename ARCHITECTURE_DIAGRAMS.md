# Architecture Diagrams

## High-Level System Architecture

``` text
HR Manager
   |
   v
React Frontend (Material UI)
   |
   | HTTP API Calls
   v
FastAPI Backend
   |
   | ORM Queries
   v
SQLite Database
```

## Frontend Architecture

``` text
App
|
|-- Navbar
|
|-- Employees Page
|   |-- Search Bar
|   |-- Country Filter
|   |-- Currency Selector
|   |-- Salary Period Toggle
|   |-- Employee Table
|   |-- Employee Form Modal
|
|-- Salary Insights Page
    |-- Filters Toolbar
    |-- Summary Insight Strip
    |-- Stats Cards
    |-- Key Charts
    |-- Detailed Analytics Accordion
```

## Backend Architecture

``` text
main.py
|
|-- routers/
|   |-- employees.py
|   |-- insights.py
|   |-- metadata.py
|
|-- models.py
|-- schemas.py
|-- crud.py
|-- analytics.py
|-- currency_utils.py
|-- database.py
|-- config.py
|-- seed.py
```

## Data Flow (Employee CRUD)

``` text
React UI -> API Request -> FastAPI Route -> CRUD Layer -> SQLAlchemy -> SQLite
```

## Data Flow (Insights)

``` text
Filter Selection -> Insights API -> Aggregate Queries -> JSON Response -> Cards + Charts
```
