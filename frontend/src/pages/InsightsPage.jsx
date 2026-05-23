import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  Autocomplete,
  TextField,
  Chip,
  Grid,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import StatsCard from '../components/StatsCard';
import CurrencySelector from '../components/CurrencySelector';
import { formatSalary } from '../utils/currency';
import {
  getCountryInsights,
  getJobTitleInsights,
  getJobTitles,
  getSalaryDistribution,
  getJobTitleComparison,
  getDepartmentComparison,
  getEmployeeDistribution,
  getGlobalAverage,
} from '../api/employeeApi';

const COUNTRIES = ['India', 'USA', 'Germany', 'UK', 'Singapore', 'Australia'];
const COUNTRY_CURRENCY = { India: 'INR', USA: 'USD', Germany: 'EUR', UK: 'GBP', Singapore: 'SGD', Australia: 'AUD' };
const CHART_COLORS = ['#1e3a5f', '#2c5282', '#4a90d9', '#63b3ed', '#90cdf4', '#bee3f8'];

export default function InsightsPage() {
  const [country, setCountry] = useState('');
  const [displayCurrency, setDisplayCurrency] = useState('Original');
  const [jobTitle, setJobTitle] = useState('');
  const [jobTitles, setJobTitles] = useState([]);

  const [countryStats, setCountryStats] = useState(null);
  const [globalAvg, setGlobalAvg] = useState(null);
  const [salaryDist, setSalaryDist] = useState([]);
  const [jobTitleComp, setJobTitleComp] = useState([]);
  const [deptComp, setDeptComp] = useState([]);
  const [empDist, setEmpDist] = useState([]);
  const [jtStats, setJtStats] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getGlobalAverage().then((d) => setGlobalAvg(d.avg_salary)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!country) {
      setCountryStats(null);
      setSalaryDist([]);
      setJobTitleComp([]);
      setDeptComp([]);
      setEmpDist([]);
      setJobTitles([]);
      setJobTitle('');
      setJtStats(null);
      return;
    }
    setLoading(true);
    setError('');
    Promise.all([
      getCountryInsights(country),
      getSalaryDistribution(country),
      getJobTitleComparison(country),
      getDepartmentComparison(country),
      getEmployeeDistribution(country),
      getJobTitles(country),
    ])
      .then(([stats, dist, jtComp, dComp, eDist, titles]) => {
        setCountryStats(stats);
        setSalaryDist(dist);
        setJobTitleComp(jtComp);
        setDeptComp(dComp);
        setEmpDist(eDist);
        setJobTitles(titles);
      })
      .catch(() => {
        setError('Failed to load insights');
        setCountryStats(null);
      })
      .finally(() => setLoading(false));
  }, [country]);

  useEffect(() => {
    if (!country || !jobTitle) {
      setJtStats(null);
      return;
    }
    getJobTitleInsights(country, jobTitle)
      .then(setJtStats)
      .catch(() => setJtStats(null));
  }, [country, jobTitle]);

  const countryCurrency = COUNTRY_CURRENCY[country] || 'INR';

  function fmtSalary(amount) {
    return formatSalary(amount, countryCurrency, displayCurrency);
  }

  const percentDiff = countryStats && globalAvg
    ? (((countryStats.avg_salary - globalAvg) / globalAvg) * 100).toFixed(1)
    : null;

  const jtPercentDiff = jtStats && countryStats
    ? (((jtStats.avg_salary - countryStats.avg_salary) / countryStats.avg_salary) * 100).toFixed(1)
    : null;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">Salary Insights</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Analyze salary data across countries and job titles
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', py: 2, '&:last-child': { pb: 2 } }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Country</InputLabel>
            <Select value={country} label="Country" onChange={(e) => { setCountry(e.target.value); setJobTitle(''); }}>
              {COUNTRIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Autocomplete
            size="small"
            sx={{ minWidth: 220 }}
            options={jobTitles}
            value={jobTitle || null}
            onChange={(_, v) => setJobTitle(v || '')}
            renderInput={(params) => <TextField {...params} label="Job Title" />}
            disabled={!country}
          />
          <CurrencySelector value={displayCurrency} onChange={setDisplayCurrency} />
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && countryStats && (
        <>
          {/* Stats Cards */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
            <StatsCard title="Min Salary" value={fmtSalary(countryStats.min_salary)} />
            <StatsCard title="Avg Salary" value={fmtSalary(countryStats.avg_salary)} />
            <StatsCard title="Max Salary" value={fmtSalary(countryStats.max_salary)} />
            <StatsCard title="Employee Count" value={countryStats.employee_count.toLocaleString()} />
            {percentDiff && (
              <StatsCard
                title="vs Global Avg"
                value={`${percentDiff > 0 ? '+' : ''}${percentDiff}%`}
              />
            )}
          </Box>

          {/* Job Title Insight */}
          {jtStats && (
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {jobTitle} in {country}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <StatsCard title="Average Salary" value={fmtSalary(jtStats.avg_salary)} />
                  {jtPercentDiff && (
                    <Chip
                      label={`${jtPercentDiff > 0 ? '+' : ''}${jtPercentDiff}% vs ${country} avg`}
                      color={jtPercentDiff > 0 ? 'success' : 'warning'}
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Charts */}
          <Grid container spacing={3}>
            {/* Salary Distribution */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>Salary Distribution</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Employee count by salary range</Typography>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={salaryDist}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" fontSize={12} />
                      <YAxis />
                      <RTooltip />
                      <Bar dataKey="count" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Job Title Comparison */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>Avg Salary by Job Title</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Top roles by average compensation</Typography>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={jobTitleComp} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="job_title" type="category" width={130} fontSize={12} />
                      <RTooltip />
                      <Bar dataKey="avg_salary" fill="#4a90d9" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Department Comparison */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>Avg Salary by Department</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Department-level salary comparison</Typography>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={deptComp}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" fontSize={12} />
                      <YAxis />
                      <RTooltip />
                      <Bar dataKey="avg_salary" fill="#2c5282" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Employee Distribution Pie */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>Employee Distribution</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Headcount by department</Typography>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={empDist} dataKey="count" nameKey="department" cx="50%" cy="50%" outerRadius={100} label>
                        {empDist.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <RTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {!loading && !countryStats && !error && (
        <Card>
          <CardContent sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Select a country to view salary insights
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Analytics will load automatically
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
