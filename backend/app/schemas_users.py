from pydantic import BaseModel, EmailStr, Field, field_validator


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    email: EmailStr | None = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=6, max_length=72)

    @field_validator("new_password")
    @classmethod
    def senha_nao_muito_longa(cls, v: str) -> str:
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Senha muito longa (máximo de 72 bytes)")
        return v


class DeleteAccount(BaseModel):
    password: str