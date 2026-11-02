from pydantic import BaseModel, ConfigDict, Field


class AddressIn(BaseModel):
    recipient: str = Field(min_length=1, max_length=120)
    cep: str = Field(min_length=8, max_length=20)
    street: str = Field(min_length=1, max_length=200)
    number: str = Field(min_length=1, max_length=20)
    complement: str = Field(default="", max_length=100)
    neighborhood: str = Field(min_length=1, max_length=100)
    city: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=2, max_length=2)
    reference: str = Field(default="", max_length=200)
    isPrimary: bool = False


class AddressUpdate(BaseModel):
    recipient: str | None = Field(default=None, min_length=1, max_length=120)
    cep: str | None = Field(default=None, min_length=8, max_length=20)
    street: str | None = Field(default=None, min_length=1, max_length=200)
    number: str | None = Field(default=None, min_length=1, max_length=20)
    complement: str | None = Field(default=None, max_length=100)
    neighborhood: str | None = Field(default=None, min_length=1, max_length=100)
    city: str | None = Field(default=None, min_length=1, max_length=100)
    state: str | None = Field(default=None, min_length=2, max_length=2)
    reference: str | None = Field(default=None, max_length=200)
    isPrimary: bool | None = None


class AddressOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recipient: str
    cep: str
    street: str
    number: str
    complement: str
    neighborhood: str
    city: str
    state: str
    reference: str
    isPrimary: bool = Field(validation_alias="is_primary")