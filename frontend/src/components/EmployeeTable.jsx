import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Tooltip,
  Typography,
  Box,
  TableSortLabel,
} from '@mui/material';
import { Edit, Delete, SearchOff } from '@mui/icons-material';
import { formatSalary } from '../utils/currency';

export default function EmployeeTable({
  employees,
  total,
  page,
  limit,
  onPageChange,
  onEdit,
  onDelete,
  displayCurrency = 'Original',
  sortBy = '',
  sortOrder = 'asc',
  onSort,
}) {
  const sortableColumns = [
    { id: 'full_name', label: 'Full Name' },
    { id: 'job_title', label: 'Job Title' },
    { id: 'country', label: 'Country' },
    { id: 'department', label: 'Department' },
  ];

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            {sortableColumns.map((col) => (
              <TableCell key={col.id}>
                <TableSortLabel
                  active={sortBy === col.id}
                  direction={sortBy === col.id ? sortOrder : 'asc'}
                  onClick={() => onSort && onSort(col.id)}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell align="right">
              <TableSortLabel
                active={sortBy === 'salary'}
                direction={sortBy === 'salary' ? sortOrder : 'asc'}
                onClick={() => onSort && onSort('salary')}
              >
                Salary
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <SearchOff sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="h6" color="text.secondary">
                    No employees found
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Try changing filters or adding employees
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            employees.map((emp, index) => (
              <TableRow
                key={emp.id}
                sx={{
                  bgcolor: index % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
                  '&:hover': { bgcolor: 'rgba(30, 58, 95, 0.04)' },
                  transition: 'background-color 0.15s',
                }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{emp.full_name}</TableCell>
                <TableCell>{emp.job_title}</TableCell>
                <TableCell>{emp.country}</TableCell>
                <TableCell>{emp.department}</TableCell>
                <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                  {formatSalary(emp.salary, emp.currency, displayCurrency)}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton aria-label="edit" size="small" onClick={() => onEdit(emp)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => onDelete(emp.id)}
                      sx={{ color: 'error.light' }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        rowsPerPageOptions={[10]}
      />
    </TableContainer>
  );
}
