# Trade-offs and Design Decisions

This document explains the major architectural, product, and engineering trade-offs made while building the **Salary Management Tool** prototype.

The goal of the project was to build a **clean, end-to-end functional HR salary dashboard prototype** that balances:

- simplicity
- usability
- maintainability
- development speed
- prototype realism

---

# 1. Backend Framework Choice

## Chosen: FastAPI

### Alternatives considered
- Flask
- Django

### Why FastAPI

FastAPI was chosen because this application is primarily an API-driven CRUD + analytics dashboard.

Benefits:

- Faster API development
- Built-in request/response validation with Pydantic
- Automatic OpenAPI / Swagger docs
- Cleaner code for structured APIs
- Better developer ergonomics than Flask for this use case

---

### Trade-off

FastAPI adds some abstraction compared to raw Flask and may feel slightly heavier for very small apps.

However, the benefits in validation and maintainability outweighed this.

---

# 2. Database Choice

## Chosen: SQLite

### Alternatives considered
- PostgreSQL
- MySQL

### Why SQLite

Project requirements explicitly allowed SQLite, and this is a localhost prototype.

Benefits:

- No DB server setup
- Simple file-based storage
- Fast enough for 10,000 employees
- Easy seeding
- Easy portability for reviewers

---

### Trade-off

SQLite is not ideal for:

- high concurrency
- production-scale workloads
- advanced analytics at scale

But for 10k records and a prototype, it is the simplest and fastest choice.

---

# 3. ORM Choice

## Chosen: SQLAlchemy

### Alternatives considered
- raw SQL
- SQLModel

### Why SQLAlchemy

Benefits:

- Clean model-based database interactions
- Easier CRUD maintenance
- Supports aggregate queries well
- Industry-standard and mature

---

### Trade-off

Raw SQL could be slightly more explicit and performant for some analytics queries.

However, maintainability and cleaner code were prioritized.

---

# 4. Frontend Framework Choice

## Chosen: ReactJS

### Alternatives considered
- NextJS
- plain HTML templates

### Why React

Benefits:

- SPA behavior ideal for dashboards
- Easy state-driven UI updates
- Great ecosystem
- Simpler than NextJS for this use case

---

### Trade-off

NextJS offers more features like SSR and routing enhancements.

However:

- this project does not need SEO
- no SSR needed
- React keeps the app simpler

---

# 5. UI Library Choice

## Chosen: Material UI

### Alternatives considered
- Tailwind CSS
- Chakra UI
- custom CSS

### Why Material UI

Benefits:

- Fast dashboard development
- Tables, cards, forms, dialogs already available
- Consistent professional UI
- Less CSS overhead

---

### Trade-off

Material UI can feel “default” if not customized enough.

Some extra styling was needed to avoid generic admin-dashboard appearance.

---

# 6. Charting Library Choice

## Chosen: Recharts

### Alternatives considered
- Chart.js
- Nivo
- D3.js

### Why Recharts

Benefits:

- React-native API
- Easy to build dashboards quickly
- Simple chart composition
- Good enough for prototype analytics

---

### Trade-off

Recharts is less flexible than D3 for advanced visualizations.

But D3 would significantly increase complexity for a prototype.

---

# 7. Salary Storage Strategy

## Chosen: Store salaries in native country currency

Each employee stores:

- salary
- currency

Examples:

- India → INR
- USA → USD
- Germany → EUR

---

### Alternatives considered

### Option A
Store everything in USD

### Option B
Store native currency + convert on display

---

### Why chosen option

Benefits:

- More realistic HR modeling
- Preserves original compensation context
- Supports country-specific salary realism
- Enables flexible display currency conversion

---

### Trade-off

Requires:

- conversion logic
- formatting logic
- static exchange rate management

Slightly more complexity than single-currency storage.

---

# 8. Currency Conversion Strategy

## Chosen: Static exchange rates

### Alternatives considered
- Live exchange rate API
- Currency service integration

### Why static rates

Benefits:

- deterministic
- no external dependencies
- offline-friendly
- sufficient for prototype

---

### Trade-off

Exchange rates are not real-time and may become inaccurate over time.

For production, external FX integration would be preferable.

---

# 9. Salary Period Handling

## Chosen: Annual salary stored as source of truth

Monthly salary is derived dynamically.

---

### Alternatives considered
- Store both annual and monthly
- Store monthly as source

---

### Why chosen option

Benefits:

- avoids duplicated salary values
- no sync inconsistency
- simple:

```text
monthly = annual / 12
```

---

### Trade-off

Some HR systems model bonuses and irregular compensation separately.

This prototype intentionally keeps compensation simple.

---

# 10. Employee Fields Scope

## Chosen fields

- Full Name
- Job Title
- Country
- Department
- Salary
- Currency

---

### Excluded fields

Not included:

- hire date
- bonus
- equity
- employment type
- status
- tax data
- manager hierarchy

---

### Why

Project goal was prototype simplicity.

Additional HR complexity would increase scope without improving core salary analytics.

---

### Trade-off

Real HR systems would require richer employee metadata.

This prototype intentionally limits scope.

---

# 11. Analytics Scope

## Chosen

Implemented:

- min salary
- median salary
- avg salary
- max salary
- employee count
- monthly payroll
- annual payroll
- payroll share
- salary distribution
- job title salary comparison
- department payroll comparison
- employee distribution

---

### Excluded

Not included:

- time-series trends
- forecasting
- bonus analysis
- tax cost
- compensation bands
- promotion trends

---

### Why

The prototype focuses on **current-state compensation analytics**, not longitudinal HR intelligence.

---

### Trade-off

Less analytical depth, but much lower implementation complexity.

---

# 12. Insights UX Design

## Chosen: Decision-ready dashboard

Goal:

HR should not manually calculate:

- monthly salary
- payroll cost
- compensation comparisons

Dashboard surfaces these directly.

---

### Why

This reduces cognitive load.

Analytics should answer HR questions, not force users to derive answers manually.

---

### Trade-off

Dashboard contains more derived metrics, increasing UI complexity.

Balance was maintained by:

- summary cards
- charts
- collapsible detailed analytics

---

# 13. Chart Design Trade-offs

## Pie chart removed

### Why

Pie charts were harder to compare visually.

Replaced with:

- horizontal bar charts

---

### Trade-off

Pie charts are visually attractive, but bar charts are more analytically readable.

Readability was prioritized over aesthetics.

---

# 14. Summary Insight Strip

## Chosen: Derived summary insights

Examples:

- top paying department
- largest workforce
- payroll share
- highest paying role

---

### Why

Adds product intelligence.

Helps HR understand insights immediately.

---

### Trade-off

Requires additional derived calculations and explanation logic.

Worth it for UX improvement.

---

# 15. Filters Behavior

## Chosen: Auto-refresh analytics on filter change

### Alternatives considered
- manual "Get Stats" button

---

### Why

Benefits:

- smoother UX
- fewer clicks
- feels modern

---

### Trade-off

Can trigger more API requests.

For prototype scale, this is acceptable.

---

# 16. Detailed Analytics in Accordion

## Chosen

Detailed analytics moved into collapsible section.

---

### Why

Dashboard was becoming visually too dense.

Benefits:

- cleaner first screen
- advanced insights available on demand

---

### Trade-off

One extra click for advanced analysis.

Improves overall usability.

---

# 17. Employees Table Design

## Chosen

Table includes:

- search
- filters
- sorting
- currency display
- salary period awareness

---

### Excluded

Not included:

- inline editing
- bulk actions
- CSV export
- mass salary update

---

### Why

Prototype simplicity.

---

### Trade-off

Real HR systems often require bulk workflows.

Not necessary for this project.

---

# 18. Seed Script Design

## Chosen

- 10,000 employees
- bulk inserts
- country-based salary ranges
- realistic currency mapping

---

### Alternatives considered

Random fully arbitrary salaries

---

### Why chosen

Analytics become more meaningful when salary ranges match geography.

---

### Trade-off

Slightly more complex generation logic.

Much better realism.

---

# 19. Testing Strategy

## Chosen: TDD

Rules followed:

1. Write failing test first
2. Write minimum implementation
3. Refactor with tests green

---

### Why

Benefits:

- safer refactoring
- regression prevention
- cleaner design

---

### Trade-off

Slower development initially.

Higher confidence long-term.

---

# 20. Prototype vs Production Trade-off

This project intentionally optimizes for:

- localhost prototype speed
- clarity
- usability
- architectural cleanliness

Instead of:

- production scalability
- auth/security
- distributed services
- cloud deployment

---

### Production features intentionally excluded

- authentication
- RBAC
- audit logging
- async background jobs
- external exchange APIs
- distributed DB
- caching
- observability

---

### Why

These would significantly increase complexity and distract from the core salary dashboard objective.

---

# Final Philosophy

This project was designed as:

> A clean, professional HR salary analytics prototype where an HR manager can manage employees and understand compensation and payroll without needing manual calculations.

Trade-offs consistently favored:

- usability
- clarity
- maintainability
- prototype realism
- engineering simplicity