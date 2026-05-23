import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

const COUNTRY_CURRENCY = { India: 'INR', USA: 'USD', Germany: 'EUR', UK: 'GBP', Singapore: 'SGD', Australia: 'AUD' };
const COUNTRIES = ['India', 'USA', 'Germany', 'UK', 'Singapore', 'Australia'];

const initialForm = {
  full_name: '',
  job_title: '',
  country: '',
  department: '',
  salary: '',
  currency: '',
};

export default function EmployeeFormModal({ open, onClose, onSave, employee }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setForm({ ...employee, salary: String(employee.salary) });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [employee, open]);

  function validate() {
    const newErrors = {};
    if (!form.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!form.job_title.trim()) newErrors.job_title = 'Job title is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    if (!form.department.trim()) newErrors.department = 'Department is required';
    const salary = parseFloat(form.salary);
    if (!form.salary || isNaN(salary) || salary <= 0)
      newErrors.salary = 'Salary must be a positive number';
    return newErrors;
  }

  function handleSubmit() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const currency = form.currency || COUNTRY_CURRENCY[form.country] || 'INR';
    onSave({ ...form, salary: parseFloat(form.salary), currency });
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{employee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Full Name"
            value={form.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            error={!!errors.full_name}
            helperText={errors.full_name}
          />
          <TextField
            label="Job Title"
            value={form.job_title}
            onChange={(e) => handleChange('job_title', e.target.value)}
            error={!!errors.job_title}
            helperText={errors.job_title}
          />
          <FormControl error={!!errors.country}>
            <InputLabel>Country</InputLabel>
            <Select
              value={form.country}
              label="Country"
              onChange={(e) => {
                handleChange('country', e.target.value);
                handleChange('currency', COUNTRY_CURRENCY[e.target.value] || '');
              }}
            >
              {COUNTRIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
            {errors.country && <FormHelperText>{errors.country}</FormHelperText>}
          </FormControl>
          <TextField
            label="Department"
            value={form.department}
            onChange={(e) => handleChange('department', e.target.value)}
            error={!!errors.department}
            helperText={errors.department}
          />
          <TextField
            label="Salary"
            type="number"
            value={form.salary}
            onChange={(e) => handleChange('salary', e.target.value)}
            error={!!errors.salary}
            helperText={errors.salary}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
