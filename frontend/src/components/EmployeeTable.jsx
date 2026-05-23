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
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Job Title</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Salary</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>{emp.full_name}</TableCell>
              <TableCell>{emp.job_title}</TableCell>
              <TableCell>{emp.country}</TableCell>
              <TableCell>{emp.department}</TableCell>
              <TableCell>{emp.salary.toLocaleString()}</TableCell>
              <TableCell>
                <IconButton aria-label="edit" onClick={() => onEdit(emp)}>
                  <Edit />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => onDelete(emp.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
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
