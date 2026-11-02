import re

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CardIn(BaseModel):
    number: str = Field(min_length=13, max_length=25)
    name: str = Field(min_length=2, max_length=120)
    expiry: str = Field(pattern=r"^(0[1-9]|1[0-2])/\d{2}$")  # MM/AA
    isPrimary: bool = False

    @field_validator("number")
    @classmethod
    def validar_numero(cls, v: str) -> str:
        digitos = re.sub(r"\D", "", v)
        if not 13 <= len(digitos) <= 19:
            raise ValueError("Número de cartão inválido")
        return digitos


class CardOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    brand: str
    last4: str
    holderName: str = Field(validation_alias="holder_name")
    expiry: str
    isPrimary: bool = Field(validation_alias="is_primary")