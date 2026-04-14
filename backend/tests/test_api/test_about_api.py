from fastapi.testclient import TestClient
from pydantic import ValidationError

import app.main as main_module
from app.api import about_router
from app.schemas.about import AboutContentResponse


def test_about_endpoint_returns_expected_structure(monkeypatch):
    monkeypatch.setattr(main_module.app.router, "on_startup", [])

    with TestClient(main_module.app) as client:
        response = client.get("/api/about")

    assert response.status_code == 200
    payload = response.json()

    assert payload["hero_title"] == "About DriveAway"
    assert payload["story_title"] == "Our Story"
    assert payload["team_image"]["src"] == "/static/about/our-team.jpg"
    assert len(payload["stats"]) == 4
    assert len(payload["core_values"]) == 6
    assert len(payload["reasons_to_choose"]) == 4


def test_about_endpoint_handles_empty_collections(monkeypatch):
    monkeypatch.setattr(main_module.app.router, "on_startup", [])
    monkeypatch.setattr(
        about_router,
        "get_about_page_content",
        lambda: AboutContentResponse(
            hero_title="About DriveAway",
            hero_description="Static content placeholder",
            story_title="Our Story",
            story_paragraphs=[],
            team_image={
                "src": "/static/about/our-team.jpg",
                "alt": "DriveAway Team",
            },
            stats=[],
            core_values=[],
            reasons_to_choose=[],
        ),
    )

    with TestClient(main_module.app) as client:
        response = client.get("/api/about")

    assert response.status_code == 200
    payload = response.json()
    assert payload["story_paragraphs"] == []
    assert payload["stats"] == []
    assert payload["core_values"] == []
    assert payload["reasons_to_choose"] == []


def test_about_schema_rejects_missing_required_fields():
    invalid_payload = {
        "hero_title": "About DriveAway",
        "team_image": {"src": "/static/about/our-team.jpg", "alt": "DriveAway Team"},
        "stats": [],
        "core_values": [],
        "reasons_to_choose": [],
    }

    try:
        AboutContentResponse.model_validate(invalid_payload)
        assert False, "Expected AboutContentResponse validation to fail."
    except ValidationError as exc:
        missing_fields = {error["loc"][0] for error in exc.errors()}
        assert {"hero_description", "story_title", "story_paragraphs"} <= missing_fields
