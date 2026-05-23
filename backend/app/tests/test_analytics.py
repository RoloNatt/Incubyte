def test_salary_distribution(client, sample_employee):
    for i in range(5):
        emp = sample_employee.copy()
        emp["full_name"] = f"Emp {i}"
        emp["salary"] = 50000 + i * 20000
        client.post("/employees", json=emp)

    response = client.get("/insights/salary-distribution?country=India")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "range" in data[0]
    assert "count" in data[0]


def test_salary_distribution_no_data(client):
    response = client.get("/insights/salary-distribution?country=Mars")
    assert response.status_code == 404


def test_job_title_comparison(client, sample_employee):
    titles = ["Software Engineer", "Designer", "QA Engineer"]
    for i, title in enumerate(titles):
        emp = sample_employee.copy()
        emp["full_name"] = f"Emp {i}"
        emp["job_title"] = title
        emp["salary"] = 50000 + i * 30000
        client.post("/employees", json=emp)

    response = client.get("/insights/job-title-comparison?country=India")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert "job_title" in data[0]
    assert "avg_salary" in data[0]
    assert data[0]["avg_salary"] >= data[1]["avg_salary"]


def test_department_comparison(client, sample_employee):
    depts = ["Engineering", "HR", "Finance"]
    for i, dept in enumerate(depts):
        emp = sample_employee.copy()
        emp["full_name"] = f"Emp {i}"
        emp["department"] = dept
        emp["salary"] = 60000 + i * 20000
        client.post("/employees", json=emp)

    response = client.get("/insights/department-comparison?country=India")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert "department" in data[0]
    assert "avg_salary" in data[0]


def test_employee_distribution(client, sample_employee):
    depts = ["Engineering", "Engineering", "HR"]
    for i, dept in enumerate(depts):
        emp = sample_employee.copy()
        emp["full_name"] = f"Emp {i}"
        emp["department"] = dept
        client.post("/employees", json=emp)

    response = client.get("/insights/employee-distribution?country=India")
    assert response.status_code == 200
    data = response.json()
    assert data[0]["department"] == "Engineering"
    assert data[0]["count"] == 2


def test_global_average(client, sample_employee):
    for i in range(3):
        emp = sample_employee.copy()
        emp["full_name"] = f"Emp {i}"
        emp["salary"] = 60000 + i * 10000
        client.post("/employees", json=emp)

    response = client.get("/insights/global-average")
    assert response.status_code == 200
    data = response.json()
    assert data["avg_salary"] == 70000.0
