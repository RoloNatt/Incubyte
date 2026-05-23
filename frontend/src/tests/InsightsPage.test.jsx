import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import InsightsPage from '../pages/InsightsPage';
import * as api from '../api/employeeApi';

vi.mock('../api/employeeApi');

describe('InsightsPage', () => {
  beforeEach(() => {
    api.getGlobalAverage.mockResolvedValue({ avg_salary: 100000 });
    api.getCountryInsights.mockResolvedValue({ min_salary: 50000, max_salary: 200000, avg_salary: 100000, employee_count: 500 });
    api.getSalaryDistribution.mockResolvedValue([]);
    api.getJobTitleComparison.mockResolvedValue([]);
    api.getDepartmentComparison.mockResolvedValue([]);
    api.getEmployeeDistribution.mockResolvedValue([]);
    api.getJobTitles.mockResolvedValue([]);
    api.getJobTitleInsights.mockResolvedValue({ avg_salary: 80000 });
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
});
