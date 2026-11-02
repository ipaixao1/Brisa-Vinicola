from pydantic import BaseModel, Field


class QuizAnswers(BaseModel):
    """Respostas do quiz: cada uma é o índice (0 a 3) da opção escolhida."""

    ocasiao: int = Field(ge=0, le=3)
    sabor: int = Field(ge=0, le=3)
    comida: int = Field(ge=0, le=3)
    experiencia: int = Field(ge=0, le=3)
    preco: int = Field(ge=0, le=3)


class ContentItem(BaseModel):
    """Um conteúdo personalizado: leva a um vídeo do YouTube."""

    id: str
    category: str  # Seu perfil / Para o seu nível / Para o seu prato / Para a sua ocasião
    title: str
    description: str
    tag: str
    videoUrl: str
    videoTitle: str
    learn: list[str]  # pontos-chave do tema
    article: str | None = None  # título de um artigo da loja sobre o mesmo assunto
    wineIds: list[int] = []  # vinhos da loja relacionados ao assunto


class RecommendationOut(BaseModel):
    profile: str
    profileDescription: str
    traits: list[str]
    level: str
    levelTip: str
    # cada item é um vinho (mesmos campos de /wines) + score, compatibility e label
    wines: list[dict]
    content: list[ContentItem]
