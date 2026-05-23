import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EmployeeTable from '../components/EmployeeTable';

describe('EmployeeTable', () => {
  const mockEmployees = [
    { id: 1, full_name: 'John Smith', job_title: 'Engineer', country: 'India', department: 'Engineering', salary: 75000, currency: 'INR' },
    { id: 2, full_name: 'Jane Doe', job_title: 'Manager', country: 'USA', department: 'HR', salary: 90000, currency: 'USD' },
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

  it('renders empty state when no employees', () => {
    render(<EmployeeTable {...defaultProps} employees={[]} total={0} />);
    expect(screen.getByText('No employees found')).toBeInTheDocument();
    expect(screen.getByText('Try changing filters or adding employees')).toBeInTheDocument();
  });

  it('formats salary with currency symbols and period label', () => {
    render(<EmployeeTable {...defaultProps} displayCurrency="Original" period="annual" />);
    expect(screen.getByText('₹75,000')).toBeInTheDocument();
    expect(screen.getByText('$90,000')).toBeInTheDocument();
    expect(screen.getAllByText('/yr').length).toBe(2);
  });

  it('converts salary when display currency set', () => {
    render(<EmployeeTable {...defaultProps} displayCurrency="USD" period="annual" />);
    expect(screen.getByText('$904')).toBeInTheDocument();
    expect(screen.getByText('$90,000')).toBeInTheDocument();
  });

  it('shows monthly salary when period is monthly', () => {
    render(<EmployeeTable {...defaultProps} displayCurrency="Original" period="monthly" />);
    expect(screen.getByText('₹6,250')).toBeInTheDocument();
    expect(screen.getByText('$7,500')).toBeInTheDocument();
    expect(screen.getAllByText('/mo').length).toBe(2);
  });

  it('shows country flags', () => {
    render(<EmployeeTable {...defaultProps} />);
    expect(screen.getByText(/🇮🇳/)).toBeInTheDocument();
    expect(screen.getByText(/🇺🇸/)).toBeInTheDocument();
  });
});
