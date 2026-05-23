# Planning and Design Notes

## Project Goal

Build a clean, intuitive Salary Management Tool prototype for HR
managers that supports employee CRUD operations and salary analytics for
10,000 employees.

## Product Principles

-   Simple and easy to use
-   Decision-ready analytics
-   Minimal cognitive load for HR
-   Professional admin dashboard UI
-   Prototype-appropriate architecture

## User Persona

Primary user: HR Manager

Core user goals: - Manage employees - Understand salary distribution -
Compare compensation across countries/job titles - Understand payroll
impact without manual calculations

## Feature Scope

### Employee Management

-   Add employee
-   View employees
-   Update employee
-   Delete employee
-   Search/filter/sort

### Salary Analytics

-   Country salary insights
-   Job title salary insights
-   Payroll metrics
-   Distribution charts
-   Monthly/annual salary toggle
-   Currency conversion
-   Department comparisons

## Product Decisions

-   Dashboard should answer HR questions directly
-   Auto-refresh analytics on filter change
-   Progressive disclosure for detailed analytics
-   Cards + charts for visual scanning
-   Summary insights for quick decisions
