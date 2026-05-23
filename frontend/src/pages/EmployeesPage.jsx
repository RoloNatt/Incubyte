import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getEmployees({ page, search, country });
      setEmployees(data.employees);
      setTotal(data.total);
    } catch {
      setEmployees([]);
      setTotal(0);
      setError('Failed to load employees. Is the backend running?');
    } finally {
      setLoading(false);
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Employees</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage employee records across the organization
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', py: 2, '&:last-child': { pb: 2 } }}>
          <SearchBar value={search} onChange={handleSearchChange} />
          <CountryFilter value={country} onChange={handleCountryChange} />
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
            Add Employee
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <EmployeeTable
          employees={employees}
          total={total}
          page={page}
          limit={10}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <EmployeeFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        employee={editingEmployee}
      />
    </Container>
  );
}
