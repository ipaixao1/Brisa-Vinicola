from collections import defaultdict
from decimal import Decimal
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ..database import get_db
from ..models import Order, OrderItem, User, Wine
from ..schemas_orders import OrderCreate, OrderOut
from ..security import get_current_user

router = APIRouter(prefix="/orders", tags=["Pedidos"])

# Mesma tabela de frete usada no front-end (CheckoutPage)
FRETE_POR_UF = {
    "SP": 14.9, "RJ": 19.9, "MG": 18.9, "RS": 24.9, "SC": 22.9, "PR": 21.9,
    "BA": 27.9, "PE": 28.9, "CE": 29.9, "GO": 23.9, "DF": 22.9, "ES": 20.9,
    "AM": 39.9, "PA": 36.9, "MT": 28.9, "MS": 26.9, "RO": 38.9, "AC": 42.9,
    "RR": 44.9, "AP": 43.9, "TO": 31.9, "MA": 32.9, "PI": 31.9, "AL": 29.9,
    "SE": 28.9, "RN": 30.9, "PB": 29.9,
}
FRETE_PADRAO = 29.9
STATUS_FINAL = 6  # índice de "Entregue"


def _carregar_pedido(db: Session, code: str, user: User) -> Order:
    stmt = (
        select(Order)
        .where(Order.code == code, Order.user_id == user.id)
        .options(selectinload(Order.items).selectinload(OrderItem.wine))
    )
    order = db.scalar(stmt)
    if not order:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return order


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def criar_pedido(
    dados: OrderCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Junta itens repetidos do mesmo vinho
    quantidades: dict[int, int] = defaultdict(int)
    for item in dados.items:
        quantidades[item.wine_id] += item.qty

    vinhos = {
        w.id: w for w in db.scalars(select(Wine).where(Wine.id.in_(list(quantidades)))).all()
    }
    faltando = set(quantidades) - set(vinhos)
    if faltando:
        raise HTTPException(status_code=400, detail=f"Vinho(s) não encontrado(s): {sorted(faltando)}")

    subtotal = sum(
        (Decimal(str(vinhos[i].price)) * q for i, q in quantidades.items()), Decimal("0")
    )
    frete = Decimal(str(FRETE_POR_UF.get(dados.address.state.upper(), FRETE_PADRAO)))

    order = Order(
        code=uuid4().hex[:20],  # provisório, trocado pelo código final logo abaixo
        user_id=user.id,
        subtotal=subtotal,
        frete=frete,
        total=subtotal + frete,
        pay_method=dados.payMethod,
        installments=dados.installments if dados.payMethod == "cartao-credito" else 1,
        status_index=0,
        cep=dados.address.cep,
        street=dados.address.street,
        number=dados.address.number,
        complement=dados.address.complement,
        district=dados.address.district,
        city=dados.address.city,
        state=dados.address.state.upper(),
    )
    for wine_id, qty in quantidades.items():
        order.items.append(
            OrderItem(wine_id=wine_id, quantity=qty, unit_price=vinhos[wine_id].price)
        )

    db.add(order)
    db.flush()
    order.code = f"BV-{order.id:06d}"
    db.commit()
    db.refresh(order)
    return order


@router.get("", response_model=list[OrderOut])
def meus_pedidos(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stmt = (
        select(Order)
        .where(Order.user_id == user.id)
        .options(selectinload(Order.items).selectinload(OrderItem.wine))
        .order_by(Order.created_at.desc(), Order.id.desc())
    )
    return db.scalars(stmt).all()


@router.get("/{code}", response_model=OrderOut)
def obter_pedido(code: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return _carregar_pedido(db, code, user)


# Só para a simulação de entrega do front. Em produção, quem muda o status é a loja.
@router.post("/{code}/advance", response_model=OrderOut)
def avancar_status(code: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = _carregar_pedido(db, code, user)
    if order.status_index < STATUS_FINAL:
        order.status_index += 1
        db.commit()
        db.refresh(order)
    return order