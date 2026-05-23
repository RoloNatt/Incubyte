# Performance Considerations

## Database Performance

### SQLite Suitability

10,000 employee records are well within SQLite capability for prototype
workloads.

### Indexes Used

Indexes added on: - full_name - country - job_title

Benefits: - Faster search - Faster filtering - Faster salary aggregation
queries

## Query Optimization

### Pagination

Employees are fetched page-by-page.

Benefits: - Avoids loading all 10,000 rows - Faster rendering - Lower
memory use

### Filtered Aggregation

Analytics queries use SQL aggregation: - MIN - MAX - AVG - COUNT - SUM -
Median logic

This avoids fetching all records into frontend.

## Seed Script Performance

### Bulk Insert Strategy

Uses: - batch generation - bulk inserts - single transaction

Benefits: - Much faster than row-by-row inserts

## Frontend Performance

### Auto-refresh Analytics

Trade-off: - More API requests - Better UX

Acceptable because dataset is small and local.

### Pagination in Table

Only visible rows render at a time.

## Currency Conversion

Uses static in-memory exchange rates.

Benefits: - No API latency - Deterministic behavior - Instant UI updates

## Chart Rendering

Charts use aggregated data only, avoiding rendering large datasets.

## Prototype vs Production Notes

Not implemented: - caching - connection pooling - background jobs -
distributed DB - observability

These would be considered in production systems.
