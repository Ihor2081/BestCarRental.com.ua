# Backend Unit Testing

This directory contains the unit tests for the backend services and schemas. The testing environment is built using `pytest`, `pytest-asyncio`, and `pytest-mock`.

## Directory Structure

```text
tests/
├── conftest.py          # Global fixtures and configuration
├── test_schemas/        # Unit tests for Pydantic schemas
└── test_services/       # Unit tests for business logic (Service Layer)
```

## Setup

Ensure you have the testing dependencies installed. From the `backend` directory:

```bash
pip install -r requirements.txt
```

The key testing packages are:
- `pytest`: The core testing framework.
- `pytest-asyncio`: Support for testing asynchronous code.
- `pytest-mock`: A wrapper around the standard `unittest.mock` for easier mocking in pytest.

## Running Tests

To run all tests, execute the following command from the `backend` directory:

```bash
pytest
```

To run a specific test file:

```bash
pytest tests/test_services/test_car_service.py
```

To run tests with verbose output:

```bash
pytest -v
```

## Writing Tests

### Service Layer Tests

Service layer tests should be **unit tests**. They should not connect to a real database. Instead, you should mock the repository layer.

Example using `patch` and `AsyncMock`:

```python
@pytest.mark.asyncio
async def test_service_method(mock_db):
    with patch("app.services.my_service.MyRepository") as MockRepo:
        repo_instance = MockRepo.return_value
        repo_instance.get_data = AsyncMock(return_value={"id": 1})
        
        service = MyService(mock_db)
        result = await service.do_something(1)
        
        assert result["id"] == 1
```

### Schema Tests

Schema tests verify that Pydantic models correctly validate input data and handle errors.

```python
def test_schema_validation():
    data = {"name": "Test", "age": 25}
    model = MySchema(**data)
    assert model.name == "Test"
```

## Shared Fixtures (`conftest.py`)

- `mock_db`: Provides an `AsyncMock` of the SQLAlchemy `AsyncSession`. Use this when initializing services in your tests.
- `mock_repo`: A generic `AsyncMock` for repository mocking.

## Configuration (`pytest.ini`)

The `pytest.ini` file in the backend root configures:
- `asyncio_mode = auto`: Automatically handles async test functions.
- `pythonpath = .`: Ensures the `app` module is importable from the tests.
