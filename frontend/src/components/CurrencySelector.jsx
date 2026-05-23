import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DISPLAY_CURRENCIES } from '../utils/currency';

export default function CurrencySelector({ value, onChange }) {
  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel>Display Currency</InputLabel>
      <Select
        value={value}
        label="Display Currency"
        onChange={(e) => onChange(e.target.value)}
      >
        {DISPLAY_CURRENCIES.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
