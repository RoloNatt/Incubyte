"""Tests for enhanced insights APIs with median, payroll, share, summary."""


def test_country_insights_includes_median(client, sample_employee):
    salaries = [50000, 70000, 90000]
    for i, sal in enumerate(salaries):
        emp = sample_employee.copy()
        emp["full_name"] = f"Emp {i}"
        emp["salary"] = sal
        client.post("/employees", json=emp)

    response = client.get("/insights/country/India")
    assert response.status_code == 200
    data = response.json()
    assert data["median_salary"] == 70000.0


def test_country_insights_includes_payroll(client, sample_employee):
    salaries = [50000, 70000, 90000]
    for i, sal in enumerate(salaries):
        emp = sample_employee.copy()
        emp["full_name"] = f"Emp {i}"
        emp["salary"] = sal
        client.post("/employees", json=emp)

    response = client.get("/insights/country/India")
    data = response.json()
    assert data["annual_payroll"] == 210000.0
    assert data["monthly_payroll"] == 210000.0 / 12


def test_country_insights_includes_payroll_share(client, sample_employee):
    # Create India employees
    for i in range(3):
        emp = sample_employee.copy()
        emp["full_name"] = f"India Emp {i}"
        emp["salary"] = 100000
        client.post("/employees", json=emp)

    # Create USA employee
    usa_emp = sample_employee.copy()
    usa_emp["full_name"] = "USA Emp"
    usa_emp["country"] = "USA"
    usa_emp["currency"] = "USD"
    usa_emp["salary"] = 100000
    client.post("/employees", json=usa_emp)

    response = client.get("/insights/country/India")
    data = response.json()
    # India payroll = 300000, total = 400000, share = 75%
    assert data["payroll_share"] == 75.0


def test_country_insights_includes_summary(client, sample_employee):
    depts = ["Engineering", "Engineering", "Finance"]
    titles = ["Software Engineer", "Product Manager", "Product Manager"]
    salaries = [60000, 120000, 80000]
    for i in range(3):
        emp = sample_employee.copy()
        emp["full_name"] = f"Emp {i}"
        emp["department"] = depts[i]
        emp["job_title"] = titles[i]
        emp["salary"] = salaries[i]
        client.post("/employees", json=emp)

    response = client.get("/insights/country/India")
    data = response.json()
    assert data["top_department"] == "Engineering"  # highest avg salary
    assert data["top_job_title"] == "Product Manager"  # highest avg salary
    assert data["largest_department"] == "Engineering"  # most employees


def test_job_title_insights_enhanced(client, sample_employee):
    salaries = [50000, 70000, 90000]
    for i, sal in enumerate(salaries):
        emp = sample_employee.copy()
        emp["full_name"] = f"Emp {i}"
        emp["salary"] = sal
        client.post("/employees", json=emp)

    response = client.get(
        "/insights/job-title?country=India&job_title=Software Engineer"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["avg_salary"] == 70000.0
    assert data["median_salary"] == 70000.0
    assert data["count"] == 3
    assert data["annual_payroll"] == 210000.0
    assert data["monthly_payroll"] == 210000.0 / 12


def test_job_title_insights_vs_country_avg(client, sample_employee):
    # SE salary = 50000
    emp1 = sample_employee.copy()
    emp1["salary"] = 50000
    client.post("/employees", json=emp1)

    # PM salary = 100000 (higher)
    emp2 = sample_employee.copy()
    emp2["full_name"] = "Jane"
    emp2["job_title"] = "Product Manager"
    emp2["salary"] = 100000
    client.post("/employees", json=emp2)

    response = client.get(
        "/insights/job-title?country=India&job_title=Software Engineer"
    )
    data = response.json()
    # Country avg = 75000, SE avg = 50000, diff = ((50000 - 75000) / 75000) * 100 = -33.33
    assert data["vs_country_avg"] == -33.33


def test_department_payroll(client, sample_employee):
    depts_salaries = [
        ("Engineering", 100000),
        ("Engineering", 120000),
        ("Finance", 80000),
    ]
    for i, (dept, sal) in enumerate(depts_salaries):
        emp = sample_employee.copy()
        emp["full_name"] = f"Emp {i}"
        emp["department"] = dept
        emp["salary"] = sal
        client.post("/employees", json=emp)

    response = client.get("/insights/department-payroll?country=India")
    assert response.status_code == 200
    data = response.json()
    # Sorted by payroll desc
    assert data[0]["department"] == "Engineering"
    assert data[0]["total_payroll"] == 220000.0
    assert data[0]["count"] == 2
    assert data[1]["department"] == "Finance"
    assert data[1]["total_payroll"] == 80000.0
