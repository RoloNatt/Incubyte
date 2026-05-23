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
  Alert,
  CircularProgress,
  Autocomplete,
  TextField,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore, TrendingUp, TrendingDown, People, Payments, AccountBalance, WorkOutline } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Cell } from 'recharts';
import StatsCard from '../components/StatsCard';
import CurrencySelector from '../components/CurrencySelector';
import SalaryPeriodToggle from '../components/SalaryPeriodToggle';
import { formatSalary, formatCompact, applyPeriod } from '../utils/currency';
import {
  getCountryInsights,
  getJobTitleInsights,
  getJobTitles,
  getSalaryDistribution,
  getJobTitleComparison,
  getDepartmentComparison,
  getEmployeeDistribution,
  getDepartmentPayroll,
  getGlobalAverage,
} from '../api/employeeApi';

const COUNTRIES = ['India', 'USA', 'Germany', 'UK', 'Singapore', 'Australia'];
const COUNTRY_CURRENCY = { India: 'INR', USA: 'USD', Germany: 'EUR', UK: 'GBP', Singapore: 'SGD', Australia: 'AUD' };
const CHART_COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff'];

export default function InsightsPage() {
  const [country, setCountry] = useState('');
  const [displayCurrency, setDisplayCurrency] = useState('Original');
  const [period, setPeriod] = useState('annual');
  const [jobTitle, setJobTitle] = useState('');
  const [jobTitles, setJobTitles] = useState([]);

  const [countryStats, setCountryStats] = useState(null);
  const [globalAvg, setGlobalAvg] = useState(null);
  const [salaryDist, setSalaryDist] = useState([]);
  const [jobTitleComp, setJobTitleComp] = useState([]);
  const [deptComp, setDeptComp] = useState([]);
  const [empDist, setEmpDist] = useState([]);
  const [deptPayroll, setDeptPayroll] = useState([]);
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
      setDeptPayroll([]);
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
      getDepartmentPayroll(country),
      getJobTitles(country),
    ])
      .then(([stats, dist, jtComp, dComp, eDist, dPay, titles]) => {
        setCountryStats(stats);
        setSalaryDist(dist);
        setJobTitleComp(jtComp);
        setDeptComp(dComp);
        setEmpDist(eDist);
        setDeptPayroll(dPay);
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
  const periodLabel = period === 'monthly' ? '/ month' : '/ year';

  function fmtSalary(amount) {
    return formatSalary(amount, countryCurrency, displayCurrency, period);
  }

  function fmtCompact(amount) {
    const adjusted = applyPeriod(amount, period);
    const curr = displayCurrency !== 'Original' ? displayCurrency : countryCurrency;
    return formatCompact(adjusted, curr);
  }

  const percentDiff = countryStats && globalAvg
    ? (((countryStats.avg_salary - globalAvg) / globalAvg) * 100).toFixed(1)
    : null;

  // Dynamic insight subtitles
  const topDistBucket = salaryDist.length > 0 ? salaryDist.reduce((a, b) => a.count > b.count ? a : b) : null;
  const topPayrollDept = deptPayroll.length > 0 ? deptPayroll[0] : null;
  const largestDept = empDist.length > 0 ? empDist[0] : null;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Salary Insights</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Analyze salary data across countries and job titles
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', py: 2, '&:last-child': { pb: 2 } }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Country</InputLabel>
            <Select value={country} label="Country" onChange={(e) => { setCountry(e.target.value); setJobTitle(''); }}>
              {COUNTRIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Autocomplete
            size="small"
            sx={{ minWidth: 200 }}
            options={jobTitles}
            value={jobTitle || null}
            onChange={(_, v) => setJobTitle(v || '')}
            renderInput={(params) => <TextField {...params} label="Job Title" />}
            disabled={!country}
          />
          <CurrencySelector value={displayCurrency} onChange={setDisplayCurrency} />
          <SalaryPeriodToggle value={period} onChange={setPeriod} />
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
          {/* Summary Insight Strip */}
          <Card sx={{ mb: 3, bgcolor: '#f8fafc', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                {countryStats.payroll_share && (
                  <Chip label={`${country} contributes ${countryStats.payroll_share}% of global payroll`} size="small" variant="outlined" />
                )}
                {countryStats.top_department && (
                  <Chip label={`Highest paying dept: ${countryStats.top_department}`} size="small" variant="outlined" />
                )}
                {countryStats.largest_department && (
                  <Chip label={`Largest dept: ${countryStats.largest_department}`} size="small" variant="outlined" />
                )}
                {countryStats.top_job_title && (
                  <Chip label={`Top paying role: ${countryStats.top_job_title}`} size="small" variant="outlined" />
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Compensation Cards */}
          <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Compensation</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <StatsCard title="Min Salary" value={fmtSalary(countryStats.min_salary)} secondary={periodLabel} icon={<TrendingDown sx={{ fontSize: 16 }} />} />
            <StatsCard title="Median Salary" value={fmtSalary(countryStats.median_salary)} secondary={periodLabel} icon={<Payments sx={{ fontSize: 16 }} />} />
            <StatsCard title="Avg Salary" value={fmtSalary(countryStats.avg_salary)} secondary={periodLabel} variant="primary" icon={<Payments sx={{ fontSize: 16 }} />} color="primary" />
            <StatsCard title="Max Salary" value={fmtSalary(countryStats.max_salary)} secondary={periodLabel} icon={<TrendingUp sx={{ fontSize: 16 }} />} />
          </Box>

          {/* Budget Cards */}
          <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Workforce & Budget</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <StatsCard title="Employees" value={countryStats.employee_count.toLocaleString()} icon={<People sx={{ fontSize: 16 }} />} />
            <StatsCard
              title="Monthly Payroll"
              value={fmtCompact(countryStats.monthly_payroll * 12)}
              secondary={periodLabel}
              icon={<AccountBalance sx={{ fontSize: 16 }} />}
              color="budget"
            />
            <StatsCard
              title="Annual Payroll"
              value={fmtCompact(countryStats.annual_payroll)}
              secondary="/ year"
              icon={<AccountBalance sx={{ fontSize: 16 }} />}
              color="budget"
            />
            {percentDiff && (
              <StatsCard
                title="vs Global Avg"
                value={`${percentDiff > 0 ? '▲' : '▼'} ${Math.abs(percentDiff)}%`}
                secondary={percentDiff > 0 ? 'above global average' : 'below global average'}
                color={percentDiff > 0 ? 'success' : 'warning'}
                icon={percentDiff > 0 ? <TrendingUp sx={{ fontSize: 16 }} /> : <TrendingDown sx={{ fontSize: 16 }} />}
              />
            )}
          </Box>

          {/* Job Title Insight */}
          {jtStats && (
            <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <WorkOutline sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="h6">
                    {jobTitle} in {country}
                  </Typography>
                  {jtStats.vs_country_avg !== 0 && (
                    <Chip
                      label={`${jtStats.vs_country_avg > 0 ? '▲' : '▼'} ${Math.abs(jtStats.vs_country_avg)}% vs ${country} avg`}
                      color={jtStats.vs_country_avg > 0 ? 'success' : 'warning'}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <StatsCard title="Avg Salary" value={fmtSalary(jtStats.avg_salary)} secondary={periodLabel} />
                  <StatsCard title="Median Salary" value={fmtSalary(jtStats.median_salary)} secondary={periodLabel} />
                  <StatsCard title="Headcount" value={jtStats.count.toLocaleString()} icon={<People sx={{ fontSize: 16 }} />} />
                  <StatsCard title="Monthly Cost" value={fmtCompact(jtStats.monthly_payroll * 12)} secondary="/ month" color="budget" />
                  <StatsCard title="Annual Cost" value={fmtCompact(jtStats.annual_payroll)} secondary="/ year" color="budget" />
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Key Charts */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Salary Distribution */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>Salary Distribution</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {topDistBucket ? `Most employees fall in ${topDistBucket.range} range` : 'Employee count by salary range'}
                  </Typography>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={salaryDist}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="range" fontSize={11} />
                      <YAxis fontSize={11} />
                      <RTooltip />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {salaryDist.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[Math.min(i, CHART_COLORS.length - 1)]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Payroll by Department */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>Payroll by Department</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {topPayrollDept ? `${topPayrollDept.department} consumes highest payroll budget` : 'Total payroll cost per department'}
                  </Typography>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={deptPayroll} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" fontSize={11} tickFormatter={(v) => formatCompact(applyPeriod(v, period), displayCurrency !== 'Original' ? displayCurrency : countryCurrency)} />
                      <YAxis dataKey="department" type="category" width={100} fontSize={11} />
                      <RTooltip formatter={(v) => fmtSalary(v * (period === 'monthly' ? 12 : 1))} />
                      <Bar dataKey="total_payroll" fill="#7c3aed" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Collapsible Detailed Analytics */}
          <Accordion defaultExpanded={false} sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Detailed Analytics</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {/* Job Title Comparison */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>Avg Salary by Job Title</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {jobTitleComp.length > 0 ? `${jobTitleComp[0].job_title} are highest paid` : 'Top roles by average compensation'}
                      </Typography>
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={jobTitleComp} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis type="number" fontSize={11} />
                          <YAxis dataKey="job_title" type="category" width={130} fontSize={11} />
                          <RTooltip />
                          <Bar dataKey="avg_salary" fill="#60a5fa" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Employee Distribution (horizontal bar replacing pie) */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>Employee Distribution</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {largestDept ? `${largestDept.department} has largest workforce` : 'Headcount by department'}
                      </Typography>
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={empDist} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis type="number" fontSize={11} />
                          <YAxis dataKey="department" type="category" width={100} fontSize={11} />
                          <RTooltip />
                          <Bar dataKey="count" fill="#34d399" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Avg Salary by Department */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>Avg Salary by Department</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Department-level salary comparison</Typography>
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={deptComp}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="department" fontSize={11} />
                          <YAxis fontSize={11} tickFormatter={(v) => formatCompact(v, displayCurrency !== 'Original' ? displayCurrency : countryCurrency)} />
                          <RTooltip />
                          <Bar dataKey="avg_salary" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
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
