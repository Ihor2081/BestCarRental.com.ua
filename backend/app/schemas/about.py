from pydantic import BaseModel, Field


class AboutStat(BaseModel):
    value: str
    label: str


class AboutValue(BaseModel):
    title: str
    description: str = Field(alias="desc")


class AboutReason(BaseModel):
    title: str
    description: str = Field(alias="desc")


class AboutImage(BaseModel):
    src: str
    alt: str


class AboutContentResponse(BaseModel):
    hero_title: str
    hero_description: str
    story_title: str
    story_paragraphs: list[str]
    team_image: AboutImage
    stats: list[AboutStat]
    core_values: list[AboutValue]
    reasons_to_choose: list[AboutReason]
