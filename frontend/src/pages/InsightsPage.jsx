import { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import StatsCard from '../components/StatsCard';
import { getCountryInsights, getJobTitleInsights } from '../api/employeeApi';

const COUNTRIES = ['India', 'USA', 'Germany', 'UK', 'Singapore', 'Australia'];

export default function InsightsPage() {
  const [country, setCountry] = useState('');
  const [countryStats, setCountryStats] = useState(null);
  const [countryError, setCountryError] = useState('');

  const [jtCountry, setJtCountry] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jtStats, setJtStats] = useState(null);
  const [jtError, setJtError] = useState('');

  async function handleCountrySearch() {
    if (!country) return;
    setCountryError('');
    try {
      const data = await getCountryInsights(country);
      setCountryStats(data);
    } catch {
      setCountryStats(null);
      setCountryError('No data found for this country');
    }
  }

  async function handleJobTitleSearch() {
    if (!jtCountry || !jobTitle) return;
    setJtError('');
    try {
      const data = await getJobTitleInsights(jtCountry, jobTitle);
      setJtStats(data);
    } catch {
      setJtStats(null);
      setJtError('No data found for this combination');
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Salary Insights
      </Typography>

      {/* Country Stats Section */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Country Salary Stats
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Country</InputLabel>
          <Select
            value={country}
            label="Country"
            onChange={(e) => setCountry(e.target.value)}
          >
            {COUNTRIES.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleCountrySearch}>
          Get Stats
        </Button>
      </Box>
      {countryError && (
        <Typography color="error" sx={{ mb: 2 }}>
          {countryError}
        </Typography>
      )}
      {countryStats && (
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <StatsCard title="Min Salary" value={countryStats.min_salary.toLocaleString()} />
          <StatsCard title="Max Salary" value={countryStats.max_salary.toLocaleString()} />
          <StatsCard title="Avg Salary" value={countryStats.avg_salary.toLocaleString()} />
          <StatsCard title="Employee Count" value={countryStats.employee_count} />
        </Box>
      )}

      {/* Job Title Stats Section */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Job Title Salary Stats
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Country</InputLabel>
          <Select
            value={jtCountry}
            label="Country"
            onChange={(e) => setJtCountry(e.target.value)}
          >
            {COUNTRIES.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Job Title"
          size="small"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <Button variant="contained" onClick={handleJobTitleSearch}>
          Get Stats
        </Button>
      </Box>
      {jtError && (
        <Typography color="error" sx={{ mb: 2 }}>
          {jtError}
        </Typography>
      )}
      {jtStats && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <StatsCard title="Average Salary" value={jtStats.avg_salary.toLocaleString()} />
        </Box>
      )}
    </Box>
  );
}
