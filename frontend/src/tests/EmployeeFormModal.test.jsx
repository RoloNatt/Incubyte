import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EmployeeFormModal from '../components/EmployeeFormModal';

describe('EmployeeFormModal', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
    employee: null,
  };

  it('renders add employee form when no employee provided', () => {
    render(<EmployeeFormModal {...defaultProps} />);
    expect(screen.getByText('Add Employee')).toBeInTheDocument();
  });

  it('renders edit employee form when employee provided', () => {
    const employee = {
      id: 1,
      full_name: 'John Smith',
      job_title: 'Engineer',
      country: 'India',
      department: 'Engineering',
      salary: 50000,
    };
    render(<EmployeeFormModal {...defaultProps} employee={employee} />);
    expect(screen.getByText('Edit Employee')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', () => {
    render(<EmployeeFormModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Save'));
    expect(screen.getByText('Full name is required')).toBeInTheDocument();
    expect(screen.getByText('Job title is required')).toBeInTheDocument();
    expect(screen.getByText('Country is required')).toBeInTheDocument();
    expect(screen.getByText('Department is required')).toBeInTheDocument();
    expect(screen.getByText('Salary must be a positive number')).toBeInTheDocument();
  });

  it('calls onSave with form data on valid submit', () => {
    const onSave = vi.fn();
    render(<EmployeeFormModal {...defaultProps} onSave={onSave} />);

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText('Job Title'), { target: { value: 'Manager' } });
    fireEvent.change(screen.getByLabelText('Country'), { target: { value: 'USA' } });
    fireEvent.change(screen.getByLabelText('Department'), { target: { value: 'HR' } });
    fireEvent.change(screen.getByLabelText('Salary'), { target: { value: '80000' } });

    fireEvent.click(screen.getByText('Save'));
    expect(onSave).toHaveBeenCalledWith({
      full_name: 'Jane Doe',
      job_title: 'Manager',
      country: 'USA',
      department: 'HR',
      salary: 80000,
    });
  });

  it('calls onClose when Cancel is clicked', () => {
    const onClose = vi.fn();
    render(<EmployeeFormModal {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});
