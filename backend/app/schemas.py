from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class WineOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    producer: str
    type: str
    grape: str
    origin: str
    price: float
    priceOld: float | None = Field(default=None, validation_alias="price_old")
    img: str
    badge: str | None = None
    featured: bool
    date: int
    description: str
    alcohol: str
    acidity: str
    volume: str
    servingTemp: str = Field(validation_alias="serving_temp")
    traits: list[str]
    pairings: list[str]


class WineList(BaseModel):
    items: list[WineOut]
    total: int
    page: int
    pages: int


class WineFilters(BaseModel):
    types: list[str]
    grapes: list[str]


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)

    @field_validator("password")
    @classmethod
    def senha_nao_muito_longa(cls, v: str) -> str:
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Senha muito longa (máximo de 72 bytes)")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    isAdmin: bool = Field(validation_alias="is_admin")


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut