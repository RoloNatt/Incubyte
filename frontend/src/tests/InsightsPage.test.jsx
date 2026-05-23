import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import InsightsPage from '../pages/InsightsPage';
import * as api from '../api/employeeApi';

vi.mock('../api/employeeApi');

describe('InsightsPage', () => {
  beforeEach(() => {
    api.getGlobalAverage.mockResolvedValue({ avg_salary: 100000 });
    api.getCountryInsights.mockResolvedValue({ min_salary: 50000, max_salary: 200000, avg_salary: 100000, median_salary: 90000, employee_count: 500, annual_payroll: 50000000, monthly_payroll: 4166666.67, payroll_share: 25, top_department: 'Engineering', top_job_title: 'Product Manager', largest_department: 'Operations' });
    api.getSalaryDistribution.mockResolvedValue([]);
    api.getJobTitleComparison.mockResolvedValue([]);
    api.getDepartmentComparison.mockResolvedValue([]);
    api.getEmployeeDistribution.mockResolvedValue([]);
    api.getDepartmentPayroll.mockResolvedValue([]);
    api.getJobTitles.mockResolvedValue([]);
    api.getJobTitleInsights.mockResolvedValue({ avg_salary: 80000, median_salary: 75000, count: 50, annual_payroll: 4000000, monthly_payroll: 333333.33, vs_country_avg: 5.5 });
  });

  it('renders page title', () => {
    render(
      <MemoryRouter>
        <InsightsPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Salary Insights')).toBeInTheDocument();
  });

  it('renders page subtitle', () => {
    render(
      <MemoryRouter>
        <InsightsPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Analyze salary data across countries and job titles')).toBeInTheDocument();
  });

  it('renders empty state when no country selected', () => {
    render(
      <MemoryRouter>
        <InsightsPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Select a country to view salary insights')).toBeInTheDocument();
    expect(screen.getByText('Analytics will load automatically')).toBeInTheDocument();
  });

  it('renders country filter', () => {
    render(
      <MemoryRouter>
        <InsightsPage />
      </MemoryRouter>
    );
    expect(screen.getAllByText('Country').length).toBeGreaterThan(0);
  });

  it('renders display currency selector', () => {
    render(
      <MemoryRouter>
        <InsightsPage />
      </MemoryRouter>
    );
    expect(screen.getAllByText('Display Currency').length).toBeGreaterThan(0);
  });

  it('renders salary period toggle', () => {
    render(
      <MemoryRouter>
        <InsightsPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Annual')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
  });
});
