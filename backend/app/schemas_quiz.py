from pydantic import BaseModel, Field


class QuizAnswers(BaseModel):
    """Respostas do quiz: cada uma é o índice (0 a 3) da opção escolhida."""

    ocasiao: int = Field(ge=0, le=3)
    sabor: int = Field(ge=0, le=3)
    comida: int = Field(ge=0, le=3)
    experiencia: int = Field(ge=0, le=3)
    preco: int = Field(ge=0, le=3)


class ContentItem(BaseModel):
    title: str
    description: str
    tag: str


class RecommendationOut(BaseModel):
    profile: str
    # cada item é um vinho (mesmos campos de /wines) + score, compatibility e label
    wines: list[dict]
    content: list[ContentItem]
