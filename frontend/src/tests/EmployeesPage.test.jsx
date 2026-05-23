import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import EmployeesPage from '../pages/EmployeesPage';
import * as api from '../api/employeeApi';

vi.mock('../api/employeeApi');

const mockResponse = {
  employees: [
    { id: 1, full_name: 'John Smith', job_title: 'Engineer', country: 'India', department: 'Engineering', salary: 75000 },
  ],
  total: 1,
  page: 1,
  limit: 10,
};

describe('EmployeesPage', () => {
  beforeEach(() => {
    api.getEmployees.mockResolvedValue(mockResponse);
  });

  it('renders employees page title', async () => {
    render(
      <MemoryRouter>
        <EmployeesPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Employees')).toBeInTheDocument();
  });

  it('renders Add Employee button', async () => {
    render(
      <MemoryRouter>
        <EmployeesPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Add Employee')).toBeInTheDocument();
  });

  it('fetches and displays employees', async () => {
    render(
      <MemoryRouter>
        <EmployeesPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });
  });
});
