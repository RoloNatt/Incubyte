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
  Container,
  Card,
  CardContent,
  Divider,
  Alert,
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">Salary Insights</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Analyze salary data across countries and job titles
        </Typography>
      </Box>

      {/* Country Stats Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Country Salary Stats
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a country to view salary statistics
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
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
            <Alert severity="warning" sx={{ mb: 2 }}>
              {countryError}
            </Alert>
          )}
          {countryStats && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              <StatsCard title="Min Salary" value={countryStats.min_salary.toLocaleString()} />
              <StatsCard title="Max Salary" value={countryStats.max_salary.toLocaleString()} />
              <StatsCard title="Avg Salary" value={countryStats.avg_salary.toLocaleString()} />
              <StatsCard title="Employee Count" value={countryStats.employee_count.toLocaleString()} />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Job Title Stats Section */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Job Title Salary Stats
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a country and job title to view the average salary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
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
            <Alert severity="warning" sx={{ mb: 2 }}>
              {jtError}
            </Alert>
          )}
          {jtStats && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              <StatsCard title="Average Salary" value={jtStats.avg_salary.toLocaleString()} />
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
