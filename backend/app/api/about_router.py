from fastapi import APIRouter

from app.schemas.about import AboutContentResponse

router = APIRouter(tags=["about"])


def get_about_page_content() -> AboutContentResponse:
    return AboutContentResponse.model_validate(
        {
            "hero_title": "About DriveAway",
            "hero_description": (
                "We're revolutionizing car rentals by combining premium vehicles, "
                "exceptional service, and cutting-edge technology to make your "
                "journey unforgettable."
            ),
            "story_title": "Our Story",
            "story_paragraphs": [
                (
                    "Founded in 2018, DriveAway began with a simple mission: "
                    "to make car rental accessible, affordable, and enjoyable "
                    "for everyone."
                ),
                (
                    "What started as a small fleet of 20 vehicles has grown "
                    "into a nationwide service with over 5,000 premium cars."
                ),
                (
                    "Today, we're proud to serve over 100,000 customers annually, "
                    "maintaining our commitment to quality and transparency."
                ),
            ],
            "team_image": {
                "src": "/static/about/our-team.jpg",
                "alt": "DriveAway Team",
            },
            "stats": [
                {"value": "5,000+", "label": "Vehicles Available"},
                {"value": "50+", "label": "Locations"},
                {"value": "100K+", "label": "Happy Customers"},
                {"value": "4.8★", "label": "Average Rating"},
            ],
            "core_values": [
                {"title": "Customer First", "desc": "Your satisfaction is our priority."},
                {"title": "Trust & Transparency", "desc": "No hidden fees."},
                {"title": "Excellence", "desc": "Top quality service."},
                {"title": "Innovation", "desc": "We improve constantly."},
                {"title": "Sustainability", "desc": "Eco-friendly fleet."},
                {"title": "Community", "desc": "We support local communities."},
            ],
            "reasons_to_choose": [
                {"title": "Premium Fleet", "desc": "Latest cars maintained to highest standards."},
                {"title": "Convenient Locations", "desc": "50+ pickup locations."},
                {"title": "Flexible Policies", "desc": "No hidden fees."},
                {"title": "24/7 Support", "desc": "Always here for you."},
            ],
        }
    )


@router.get("", response_model=AboutContentResponse)
async def get_about_content():
    return get_about_page_content()
