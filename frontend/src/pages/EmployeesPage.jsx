import { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeFormModal from '../components/EmployeeFormModal';
import SearchBar from '../components/SearchBar';
import CountryFilter from '../components/CountryFilter';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../api/employeeApi';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = useCallback(async () => {
    try {
      const data = await getEmployees({ page, search, country });
      setEmployees(data.employees);
      setTotal(data.total);
    } catch {
      setEmployees([]);
      setTotal(0);
    }
  }, [page, search, country]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  function handleAdd() {
    setEditingEmployee(null);
    setModalOpen(true);
  }

  function handleEdit(emp) {
    setEditingEmployee(emp);
    setModalOpen(true);
  }

  async function handleDelete(id) {
    await deleteEmployee(id);
    fetchEmployees();
  }

  async function handleSave(formData) {
    if (editingEmployee) {
      await updateEmployee(editingEmployee.id, formData);
    } else {
      await createEmployee(formData);
    }
    setModalOpen(false);
    fetchEmployees();
  }

  function handleSearchChange(value) {
    setSearch(value);
    setPage(1);
  }

  function handleCountryChange(value) {
    setCountry(value);
    setPage(1);
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Employees
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <SearchBar value={search} onChange={handleSearchChange} />
        <CountryFilter value={country} onChange={handleCountryChange} />
        <Button variant="contained" onClick={handleAdd}>
          Add Employee
        </Button>
      </Box>
      <EmployeeTable
        employees={employees}
        total={total}
        page={page}
        limit={10}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EmployeeFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        employee={editingEmployee}
      />
    </Box>
  );
}
