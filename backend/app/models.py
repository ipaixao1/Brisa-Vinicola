from datetime import datetime, timezone

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Wine(Base):
    __tablename__ = "wines"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(150))
    producer: Mapped[str] = mapped_column(String(150))
    type: Mapped[str] = mapped_column(String(20), index=True)
    grape: Mapped[str] = mapped_column(String(80), index=True)
    origin: Mapped[str] = mapped_column(String(80))
    price: Mapped[float] = mapped_column(Numeric(10, 2))
    price_old: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    img: Mapped[str] = mapped_column(String(255))
    badge: Mapped[str | None] = mapped_column(String(40), nullable=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    date: Mapped[int] = mapped_column(Integer)
    description: Mapped[str] = mapped_column(Text)
    alcohol: Mapped[str] = mapped_column(String(20))
    acidity: Mapped[str] = mapped_column(String(20))
    volume: Mapped[str] = mapped_column(String(20))
    serving_temp: Mapped[str] = mapped_column(String(40))
    traits: Mapped[list] = mapped_column(JSON)
    pairings: Mapped[list] = mapped_column(JSON)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
    subtotal: Mapped[float] = mapped_column(Numeric(10, 2))
    frete: Mapped[float] = mapped_column(Numeric(10, 2))
    total: Mapped[float] = mapped_column(Numeric(10, 2))
    pay_method: Mapped[str] = mapped_column(String(20))
    installments: Mapped[int] = mapped_column(Integer, default=1)
    status_index: Mapped[int] = mapped_column(Integer, default=0)

    # Endereço de entrega (cópia no momento da compra)
    cep: Mapped[str] = mapped_column(String(20))
    street: Mapped[str] = mapped_column(String(200))
    number: Mapped[str] = mapped_column(String(20))
    complement: Mapped[str] = mapped_column(String(100), default="")
    district: Mapped[str] = mapped_column(String(100))
    city: Mapped[str] = mapped_column(String(100))
    state: Mapped[str] = mapped_column(String(2))

    user: Mapped["User"] = relationship()
    items: Mapped[list["OrderItem"]] = relationship(
        back_populates="order", cascade="all, delete-orphan"
    )

    @property
    def address(self) -> dict:
        return {
            "cep": self.cep,
            "street": self.street,
            "number": self.number,
            "complement": self.complement,
            "district": self.district,
            "city": self.city,
            "state": self.state,
        }

    @property
    def user_email(self) -> str:
        return self.user.email


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), index=True)
    wine_id: Mapped[int] = mapped_column(ForeignKey("wines.id"))
    quantity: Mapped[int] = mapped_column(Integer)
    unit_price: Mapped[float] = mapped_column(Numeric(10, 2))

    order: Mapped["Order"] = relationship(back_populates="items")
    wine: Mapped["Wine"] = relationship()


class Address(Base):
    __tablename__ = "addresses"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    recipient: Mapped[str] = mapped_column(String(120))
    cep: Mapped[str] = mapped_column(String(20))
    street: Mapped[str] = mapped_column(String(200))
    number: Mapped[str] = mapped_column(String(20))
    complement: Mapped[str] = mapped_column(String(100), default="")
    neighborhood: Mapped[str] = mapped_column(String(100))
    city: Mapped[str] = mapped_column(String(100))
    state: Mapped[str] = mapped_column(String(2))
    reference: Mapped[str] = mapped_column(String(200), default="")
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)

class Card(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    brand: Mapped[str] = mapped_column(String(20))
    last4: Mapped[str] = mapped_column(String(4))
    holder_name: Mapped[str] = mapped_column(String(120))
    expiry: Mapped[str] = mapped_column(String(5))
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)