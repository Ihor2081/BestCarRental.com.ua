import pytest
from pydantic import ValidationError

from app.schemas.about import AboutContentResponse


def test_about_content_schema_accepts_valid_payload():
    payload = {
        "hero_title": "About DriveAway",
        "hero_description": "About text",
        "story_title": "Our Story",
        "story_paragraphs": ["Paragraph 1"],
        "team_image": {
            "src": "/static/about/our-team.jpg",
            "alt": "DriveAway Team",
        },
        "stats": [{"value": "5,000+", "label": "Vehicles Available"}],
        "core_values": [{"title": "Customer First", "desc": "Your satisfaction is our priority."}],
        "reasons_to_choose": [{"title": "24/7 Support", "desc": "Always here for you."}],
    }

    model = AboutContentResponse.model_validate(payload)

    assert model.hero_title == "About DriveAway"
    assert model.team_image.src == "/static/about/our-team.jpg"
    assert model.core_values[0].description == "Your satisfaction is our priority."


def test_about_content_schema_allows_empty_lists():
    payload = {
        "hero_title": "About DriveAway",
        "hero_description": "About text",
        "story_title": "Our Story",
        "story_paragraphs": [],
        "team_image": {
            "src": "/static/about/our-team.jpg",
            "alt": "DriveAway Team",
        },
        "stats": [],
        "core_values": [],
        "reasons_to_choose": [],
    }

    model = AboutContentResponse.model_validate(payload)

    assert model.story_paragraphs == []
    assert model.stats == []
    assert model.core_values == []
    assert model.reasons_to_choose == []


def test_about_content_schema_requires_mandatory_fields():
    with pytest.raises(ValidationError):
        AboutContentResponse.model_validate(
            {
                "hero_title": "About DriveAway",
                "story_title": "Our Story",
                "stats": [],
                "core_values": [],
                "reasons_to_choose": [],
            }
        )
