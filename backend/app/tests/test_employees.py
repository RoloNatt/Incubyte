def test_create_employee(client, sample_employee):
    response = client.post("/employees", json=sample_employee)
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "John Smith"
    assert data["salary"] == 75000.0
    assert "id" in data


def test_create_employee_validation_failure(client):
    response = client.post("/employees", json={"full_name": "", "salary": -100})
    assert response.status_code == 422


def test_create_employee_missing_fields(client):
    response = client.post("/employees", json={"full_name": "Test"})
    assert response.status_code == 422


def test_get_employees_paginated(client, sample_employee):
    for i in range(15):
        emp = sample_employee.copy()
        emp["full_name"] = f"Employee {i}"
        client.post("/employees", json=emp)

    response = client.get("/employees?page=1&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data["employees"]) == 10
    assert data["total"] == 15
    assert data["page"] == 1
    assert data["limit"] == 10


def test_get_employees_page_two(client, sample_employee):
    for i in range(15):
        emp = sample_employee.copy()
        emp["full_name"] = f"Employee {i}"
        client.post("/employees", json=emp)

    response = client.get("/employees?page=2&limit=10")
    data = response.json()
    assert len(data["employees"]) == 5


def test_search_employees(client, sample_employee):
    client.post("/employees", json=sample_employee)
    emp2 = sample_employee.copy()
    emp2["full_name"] = "Jane Doe"
    client.post("/employees", json=emp2)

    response = client.get("/employees?search=John")
    data = response.json()
    assert data["total"] == 1
    assert data["employees"][0]["full_name"] == "John Smith"


def test_filter_employees_by_country(client, sample_employee):
    client.post("/employees", json=sample_employee)
    emp2 = sample_employee.copy()
    emp2["full_name"] = "Jane Doe"
    emp2["country"] = "USA"
    emp2["currency"] = "USD"
    client.post("/employees", json=emp2)

    response = client.get("/employees?country=India")
    data = response.json()
    assert data["total"] == 1
    assert data["employees"][0]["country"] == "India"


def test_update_employee(client, sample_employee):
    create_resp = client.post("/employees", json=sample_employee)
    emp_id = create_resp.json()["id"]

    updated = sample_employee.copy()
    updated["salary"] = 90000.0
    response = client.put(f"/employees/{emp_id}", json=updated)
    assert response.status_code == 200
    assert response.json()["salary"] == 90000.0


def test_update_nonexistent_employee(client, sample_employee):
    response = client.put("/employees/9999", json=sample_employee)
    assert response.status_code == 404


def test_delete_employee(client, sample_employee):
    create_resp = client.post("/employees", json=sample_employee)
    emp_id = create_resp.json()["id"]

    response = client.delete(f"/employees/{emp_id}")
    assert response.status_code == 204

    get_response = client.get("/employees")
    assert get_response.json()["total"] == 0


def test_delete_nonexistent_employee(client):
    response = client.delete("/employees/9999")
    assert response.status_code == 404


def test_employee_response_includes_currency(client, sample_employee):
    response = client.post("/employees", json=sample_employee)
    data = response.json()
    assert data["currency"] == "INR"
