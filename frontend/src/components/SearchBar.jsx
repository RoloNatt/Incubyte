import { TextField } from '@mui/material';

export default function SearchBar({ value, onChange }) {
  return (
    <TextField
      label="Search by name"
      variant="outlined"
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ minWidth: 200 }}
    />
  );
}
