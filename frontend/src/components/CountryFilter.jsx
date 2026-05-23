import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const COUNTRIES = ['', 'India', 'USA', 'Germany', 'UK', 'Singapore', 'Australia'];

export default function CountryFilter({ value, onChange }) {
  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel>Country</InputLabel>
      <Select value={value} label="Country" onChange={(e) => onChange(e.target.value)}>
        {COUNTRIES.map((country) => (
          <MenuItem key={country} value={country}>
            {country || 'All'}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
