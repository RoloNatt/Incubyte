const BASE_URL = 'http://localhost:8000';

export async function getEmployees({ page = 1, limit = 10, search = '', country = '' } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append('search', search);
  if (country) params.append('country', country);

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
