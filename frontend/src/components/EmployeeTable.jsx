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
} from '@mui/material';
import { Edit, Delete, SearchOff } from '@mui/icons-material';

export default function EmployeeTable({
  employees,
  total,
  page,
  limit,
  onPageChange,
  onEdit,
  onDelete,
}) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Job Title</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Department</TableCell>
            <TableCell align="right">Salary</TableCell>
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
                <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                  {emp.salary.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
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
