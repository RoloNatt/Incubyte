def test_country_salary_stats(client, sample_employee):
    emp1 = sample_employee.copy()
    emp1["salary"] = 50000.0
    emp2 = sample_employee.copy()
    emp2["full_name"] = "Jane Doe"
    emp2["salary"] = 100000.0

    client.post("/employees", json=emp1)
    client.post("/employees", json=emp2)

    response = client.get("/insights/country/India")
    assert response.status_code == 200
    data = response.json()
    assert data["min_salary"] == 50000.0
    assert data["max_salary"] == 100000.0
    assert data["avg_salary"] == 75000.0
    assert data["employee_count"] == 2


def test_country_salary_stats_no_employees(client):
    response = client.get("/insights/country/Atlantis")
    assert response.status_code == 404


def test_job_title_avg_salary(client, sample_employee):
    emp1 = sample_employee.copy()
    emp1["salary"] = 60000.0
    emp2 = sample_employee.copy()
    emp2["full_name"] = "Jane Doe"
    emp2["salary"] = 80000.0

    client.post("/employees", json=emp1)
    client.post("/employees", json=emp2)

    response = client.get(
        "/insights/job-title?country=India&job_title=Software Engineer"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["avg_salary"] == 70000.0


def test_job_title_insights_no_match(client):
    response = client.get(
        "/insights/job-title?country=India&job_title=Astronaut"
    )
    assert response.status_code == 404


def test_job_title_insights_missing_params(client):
    response = client.get("/insights/job-title")
    assert response.status_code == 422
