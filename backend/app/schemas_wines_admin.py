from typing import Literal

from pydantic import BaseModel, Field

TipoVinho = Literal["Tinto", "Branco", "Espumante", "Rosé"]


class WineIn(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    producer: str = Field(min_length=1, max_length=150)
    type: TipoVinho
    grape: str = Field(min_length=1, max_length=80)
    origin: str = Field(min_length=1, max_length=80)
    price: float = Field(gt=0)
    priceOld: float | None = Field(default=None, gt=0)
    img: str = Field(default="garrafa.png", max_length=255)
    badge: str | None = Field(default=None, max_length=40)
    featured: bool = False
    date: int | None = None
    description: str = Field(min_length=1)
    alcohol: str = Field(max_length=20)
    acidity: str = Field(max_length=20)
    volume: str = Field(max_length=20)
    servingTemp: str = Field(max_length=40)
    traits: list[str] = Field(default_factory=list)
    pairings: list[str] = Field(default_factory=list)


class WineUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    producer: str | None = Field(default=None, min_length=1, max_length=150)
    type: TipoVinho | None = None
    grape: str | None = Field(default=None, min_length=1, max_length=80)
    origin: str | None = Field(default=None, min_length=1, max_length=80)
    price: float | None = Field(default=None, gt=0)
    priceOld: float | None = Field(default=None, gt=0)
    img: str | None = Field(default=None, max_length=255)
    badge: str | None = Field(default=None, max_length=40)
    featured: bool | None = None
    date: int | None = None
    description: str | None = Field(default=None, min_length=1)
    alcohol: str | None = Field(default=None, max_length=20)
    acidity: str | None = Field(default=None, max_length=20)
    volume: str | None = Field(default=None, max_length=20)
    servingTemp: str | None = Field(default=None, max_length=40)
    traits: list[str] | None = None
    pairings: list[str] | None = None