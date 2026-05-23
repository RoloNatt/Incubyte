const BASE_URL = 'http://localhost:8001';

export async function getEmployees({ page = 1, limit = 10, search = '', country = '', sort_by = '', sort_order = 'asc' } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append('search', search);
  if (country) params.append('country', country);
  if (sort_by) params.append('sort_by', sort_by);
  if (sort_order) params.append('sort_order', sort_order);

  const response = await fetch(`${BASE_URL}/employees?${params}`);
  if (!response.ok) throw new Error('Failed to fetch employees');
  return response.json();
}

export async function createEmployee(employee) {
  const response = await fetch(`${BASE_URL}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  });
  if (!response.ok) throw new Error('Failed to create employee');
  return response.json();
}

export async function updateEmployee(id, employee) {
  const response = await fetch(`${BASE_URL}/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  });
  if (!response.ok) throw new Error('Failed to update employee');
  return response.json();
}

export async function deleteEmployee(id) {
  const response = await fetch(`${BASE_URL}/employees/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete employee');
}

export async function getCountryInsights(country) {
  const response = await fetch(`${BASE_URL}/insights/country/${encodeURIComponent(country)}`);
  if (!response.ok) throw new Error('Failed to fetch country insights');
  return response.json();
}

export async function getJobTitleInsights(country, jobTitle) {
  const params = new URLSearchParams({ country, job_title: jobTitle });
  const response = await fetch(`${BASE_URL}/insights/job-title?${params}`);
  if (!response.ok) throw new Error('Failed to fetch job title insights');
  return response.json();
}

export async function getJobTitles(country = '') {
  const params = country ? `?country=${encodeURIComponent(country)}` : '';
  const response = await fetch(`${BASE_URL}/metadata/job-titles${params}`);
  if (!response.ok) throw new Error('Failed to fetch job titles');
  return response.json();
}

export async function getCountries() {
  const response = await fetch(`${BASE_URL}/metadata/countries`);
  if (!response.ok) throw new Error('Failed to fetch countries');
  return response.json();
}

export async function getSalaryDistribution(country) {
  const response = await fetch(`${BASE_URL}/insights/salary-distribution?country=${encodeURIComponent(country)}`);
  if (!response.ok) throw new Error('Failed to fetch salary distribution');
  return response.json();
}

export async function getJobTitleComparison(country) {
  const response = await fetch(`${BASE_URL}/insights/job-title-comparison?country=${encodeURIComponent(country)}`);
  if (!response.ok) throw new Error('Failed to fetch job title comparison');
  return response.json();
}

export async function getDepartmentComparison(country) {
  const response = await fetch(`${BASE_URL}/insights/department-comparison?country=${encodeURIComponent(country)}`);
  if (!response.ok) throw new Error('Failed to fetch department comparison');
  return response.json();
}

export async function getEmployeeDistribution(country) {
  const response = await fetch(`${BASE_URL}/insights/employee-distribution?country=${encodeURIComponent(country)}`);
  if (!response.ok) throw new Error('Failed to fetch employee distribution');
  return response.json();
}

export async function getDepartmentPayroll(country) {
  const response = await fetch(`${BASE_URL}/insights/department-payroll?country=${encodeURIComponent(country)}`);
  if (!response.ok) throw new Error('Failed to fetch department payroll');
  return response.json();
}

export async function getGlobalAverage() {
  const response = await fetch(`${BASE_URL}/insights/global-average`);
  if (!response.ok) throw new Error('Failed to fetch global average');
  return response.json();
}
