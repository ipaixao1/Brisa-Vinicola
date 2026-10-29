from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from .schemas import WineOut

PayMethod = Literal["pix", "cartao-credito", "cartao-debito"]


class OrderAddress(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    cep: str = Field(min_length=8, max_length=20)
    street: str = Field(min_length=1, max_length=200)
    number: str = Field(min_length=1, max_length=20)
    complement: str = Field(default="", max_length=100)
    district: str = Field(min_length=1, max_length=100)
    city: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=2, max_length=2)


class OrderItemIn(BaseModel):
    wine_id: int
    qty: int = Field(ge=1, le=99)


class OrderCreate(BaseModel):
    items: list[OrderItemIn] = Field(min_length=1)
    address: OrderAddress
    payMethod: PayMethod
    installments: int = Field(default=1, ge=1, le=12)


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    wine: WineOut
    qty: int = Field(validation_alias="quantity")


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(validation_alias="code")
    date: datetime = Field(validation_alias="created_at")
    items: list[OrderItemOut]
    subtotal: float
    frete: float
    total: float
    payMethod: PayMethod = Field(validation_alias="pay_method")
    installments: int
    address: OrderAddress
    statusIndex: int = Field(validation_alias="status_index")
    userEmail: str = Field(validation_alias="user_email")

    @field_validator("date")
    @classmethod
    def data_em_utc(cls, v: datetime) -> datetime:
        return v.replace(tzinfo=timezone.utc) if v.tzinfo is None else v