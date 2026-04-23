# About Page Backend Test Guide

## Overview

This document describes the backend tests related to the **About** page.
These tests ensure that:

- the FastAPI backend correctly mounts and serves static files for the About page
- the About image asset is available through the `/static` route
- the backend provides a dedicated `/api/about` endpoint with the expected response structure
- schema validation works correctly for valid, empty, and incomplete About page payloads

## Backend Changes Made

The following backend changes were introduced to support and test the About page:

### 1. New About API endpoint

A new backend endpoint was added:

- `GET /api/about`

This endpoint returns structured data for the About page, including:

- hero section content
- story content
- team image metadata
- stats
- core values
- reasons to choose DriveAway

Related file:

- [backend/app/api/about_router.py](/d:/Курси/DriveAway/backend/app/api/about_router.py)

### 2. New About response schema

A dedicated schema was added for About page content validation.

Related file:

- [backend/app/schemas/about.py](/d:/Курси/DriveAway/backend/app/schemas/about.py)

### 3. Main application router update

The new About router was registered in the main FastAPI application.

Related file:

- [backend/app/main.py](/d:/Курси/DriveAway/backend/app/main.py)

### 4. Real static About image added

A real image file was added so the backend can serve the About page asset through `/static/about/our-team.jpg`.

Related file:

- [backend/static/about/our-team.jpg](/d:/Курси/DriveAway/backend/static/about/our-team.jpg)

## Test Files Added

### 1. Static file delivery tests

These tests verify:

- `/static` is mounted correctly
- the static directory is created if missing
- `/static/about/our-team.jpg` is served successfully
- missing static files return `404`
- all About page static assets referenced by the frontend are accessible
- the real backend image file exists

Test file:

- [backend/tests/test_about_static_delivery.py](/d:/Курси/DriveAway/backend/tests/test_about_static_delivery.py)

### 2. About API tests

These tests verify:

- `GET /api/about` returns `200 OK`
- the response structure matches the expected About page contract
- empty collections are handled correctly
- missing required fields are rejected at the schema level

Test file:

- [backend/tests/test_api/test_about_api.py](/d:/Курси/DriveAway/backend/tests/test_api/test_about_api.py)

### 3. About schema tests

These tests verify:

- valid About payloads pass validation
- empty lists are allowed where expected
- incomplete payloads fail validation

Test file:

- [backend/tests/test_schemas/test_about_schema.py](/d:/Курси/DriveAway/backend/tests/test_schemas/test_about_schema.py)

## Files Changed

The backend work for the About page involved these files:

- [backend/app/api/about_router.py](/d:/Курси/DriveAway/backend/app/api/about_router.py)
- [backend/app/schemas/about.py](/d:/Курси/DriveAway/backend/app/schemas/about.py)
- [backend/app/main.py](/d:/Курси/DriveAway/backend/app/main.py)
- [backend/static/about/our-team.jpg](/d:/Курси/DriveAway/backend/static/about/our-team.jpg)
- [backend/tests/test_about_static_delivery.py](/d:/Курси/DriveAway/backend/tests/test_about_static_delivery.py)
- [backend/tests/test_api/test_about_api.py](/d:/Курси/DriveAway/backend/tests/test_api/test_about_api.py)
- [backend/tests/test_schemas/test_about_schema.py](/d:/Курси/DriveAway/backend/tests/test_schemas/test_about_schema.py)

## How to Run the Tests

Run the tests from the project root:

```powershell
cd d:\Курси\DriveAway
New-Item -ItemType Directory -Force -Path 'backend\.pytest-temp' | Out-Null
$env:TEMP=(Resolve-Path 'backend\.pytest-temp').Path
$env:TMP=$env:TEMP
.\.venv\Scripts\python.exe -m pytest backend/tests/test_about_static_delivery.py backend/tests/test_api/test_about_api.py backend/tests/test_schemas/test_about_schema.py -q -s --basetemp=backend/.pytest-temp
```

You can also run the test groups separately:

```powershell
cd d:\Курси\DriveAway
New-Item -ItemType Directory -Force -Path 'backend\.pytest-temp' | Out-Null
$env:TEMP=(Resolve-Path 'backend\.pytest-temp').Path
$env:TMP=$env:TEMP
.\.venv\Scripts\python.exe -m pytest backend/tests/test_about_static_delivery.py -q -s --basetemp=backend/.pytest-temp
```

```powershell
cd d:\Курси\DriveAway
New-Item -ItemType Directory -Force -Path 'backend\.pytest-temp' | Out-Null
$env:TEMP=(Resolve-Path 'backend\.pytest-temp').Path
$env:TMP=$env:TEMP
.\.venv\Scripts\python.exe -m pytest backend/tests/test_api/test_about_api.py -q -s --basetemp=backend/.pytest-temp
```

```powershell
cd d:\Курси\DriveAway
New-Item -ItemType Directory -Force -Path 'backend\.pytest-temp' | Out-Null
$env:TEMP=(Resolve-Path 'backend\.pytest-temp').Path
$env:TMP=$env:TEMP
.\.venv\Scripts\python.exe -m pytest backend/tests/test_schemas/test_about_schema.py -q -s --basetemp=backend/.pytest-temp
```

## Expected Result

If everything is working correctly, the output should be:

```text
12 passed
```

A full run may also display warnings related to existing FastAPI or Pydantic deprecations in older parts of the backend. These warnings do **not** mean that the About page tests failed.

## What These Tests Guarantee

After these changes, the backend test coverage for the About page confirms that:

- the About page image can be delivered by the FastAPI backend
- the `/static` mount works correctly
- the backend has a dedicated About content endpoint
- the About API response is validated and predictable
- missing or invalid About data is caught during validation
