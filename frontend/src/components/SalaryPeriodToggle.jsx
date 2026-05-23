import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export default function SalaryPeriodToggle({ value, onChange }) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, v) => v && onChange(v)}
      size="small"
      sx={{ height: 40 }}
    >
      <ToggleButton value="annual" sx={{ px: 2, textTransform: 'none', fontWeight: 600 }}>
        Annual
      </ToggleButton>
      <ToggleButton value="monthly" sx={{ px: 2, textTransform: 'none', fontWeight: 600 }}>
        Monthly
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
