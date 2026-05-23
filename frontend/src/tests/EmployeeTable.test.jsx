import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EmployeeTable from '../components/EmployeeTable';

describe('EmployeeTable', () => {
  const mockEmployees = [
    { id: 1, full_name: 'John Smith', job_title: 'Engineer', country: 'India', department: 'Engineering', salary: 75000 },
    { id: 2, full_name: 'Jane Doe', job_title: 'Manager', country: 'USA', department: 'HR', salary: 90000 },
  ];

  const defaultProps = {
    employees: mockEmployees,
    total: 2,
    page: 1,
    limit: 10,
    onPageChange: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders employee rows', () => {
    render(<EmployeeTable {...defaultProps} />);
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<EmployeeTable {...defaultProps} />);
    expect(screen.getByText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('Job Title')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', () => {
    const onEdit = vi.fn();
    render(<EmployeeTable {...defaultProps} onEdit={onEdit} />);
    const editButtons = screen.getAllByLabelText('edit');
    fireEvent.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(mockEmployees[0]);
  });

  it('calls onDelete when delete button clicked', () => {
    const onDelete = vi.fn();
    render(<EmployeeTable {...defaultProps} onDelete={onDelete} />);
    const deleteButtons = screen.getAllByLabelText('delete');
    fireEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
