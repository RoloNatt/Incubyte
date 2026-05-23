import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import InsightsPage from '../pages/InsightsPage';

describe('InsightsPage', () => {
  it('renders page title', () => {
    render(
      <MemoryRouter>
        <InsightsPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Salary Insights')).toBeInTheDocument();
  });

  it('renders country stats section', () => {
    render(
      <MemoryRouter>
        <InsightsPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Country Salary Stats')).toBeInTheDocument();
  });

  it('renders job title stats section', () => {
    render(
      <MemoryRouter>
        <InsightsPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Job Title Salary Stats')).toBeInTheDocument();
  });

  it('renders Get Stats buttons', () => {
    render(
      <MemoryRouter>
        <InsightsPage />
      </MemoryRouter>
    );
    const buttons = screen.getAllByText('Get Stats');
    expect(buttons).toHaveLength(2);
  });

  it('renders page subtitle', () => {
    render(
      <MemoryRouter>
        <InsightsPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Analyze salary data across countries and job titles')).toBeInTheDocument();
  });
});
