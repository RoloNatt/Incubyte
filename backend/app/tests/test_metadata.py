def test_get_job_titles(client, sample_employee):
    emp1 = sample_employee.copy()
    emp1["job_title"] = "Software Engineer"
    client.post("/employees", json=emp1)

    emp2 = sample_employee.copy()
    emp2["full_name"] = "Jane Doe"
    emp2["job_title"] = "Designer"
    client.post("/employees", json=emp2)

    response = client.get("/metadata/job-titles")
    assert response.status_code == 200
    data = response.json()
    assert "Designer" in data
    assert "Software Engineer" in data


def test_get_job_titles_filtered_by_country(client, sample_employee):
    emp1 = sample_employee.copy()
    emp1["job_title"] = "Software Engineer"
    client.post("/employees", json=emp1)

    emp2 = sample_employee.copy()
    emp2["full_name"] = "Jane Doe"
    emp2["country"] = "USA"
    emp2["currency"] = "USD"
    emp2["job_title"] = "Designer"
    client.post("/employees", json=emp2)

    response = client.get("/metadata/job-titles?country=India")
    data = response.json()
    assert "Software Engineer" in data
    assert "Designer" not in data


def test_get_countries(client, sample_employee):
    emp1 = sample_employee.copy()
    client.post("/employees", json=emp1)

    emp2 = sample_employee.copy()
    emp2["full_name"] = "Jane Doe"
    emp2["country"] = "USA"
    emp2["currency"] = "USD"
    client.post("/employees", json=emp2)

    response = client.get("/metadata/countries")
    assert response.status_code == 200
    data = response.json()
    assert "India" in data
    assert "USA" in data


def test_get_job_titles_empty(client):
    response = client.get("/metadata/job-titles")
    assert response.status_code == 200
    assert response.json() == []
