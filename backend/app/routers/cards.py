import re

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Card, User
from ..schemas_cards import CardIn, CardOut
from ..security import get_current_user

router = APIRouter(prefix="/cards", tags=["Cartões"])


def _detectar_bandeira(numero: str) -> str:
    if re.match(r"^4", numero):
        return "Visa"
    if re.match(r"^5[1-5]", numero) or re.match(r"^2[2-7]", numero):
        return "Mastercard"
    if re.match(r"^3[47]", numero):
        return "Amex"
    if re.match(r"^6(011|5)", numero):
        return "Elo"
    if re.match(r"^(384100|384140|384160|606282|637095|637568)", numero):
        return "Hipercard"
    return "Outro"


def _obter_cartao(db: Session, card_id: int, user: User) -> Card:
    card = db.scalar(select(Card).where(Card.id == card_id, Card.user_id == user.id))
    if not card:
        raise HTTPException(status_code=404, detail="Cartão não encontrado")
    return card


def _tornar_principal(db: Session, user_id: int, card: Card) -> None:
    db.execute(
        update(Card).where(Card.user_id == user_id, Card.id != card.id).values(is_primary=False)
    )
    card.is_primary = True


@router.get("", response_model=list[CardOut])
def listar_cartoes(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stmt = select(Card).where(Card.user_id == user.id).order_by(Card.is_primary.desc(), Card.id)
    return db.scalars(stmt).all()


@router.post("", response_model=CardOut, status_code=status.HTTP_201_CREATED)
def salvar_cartao(
    dados: CardIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ja_tem = db.scalar(select(Card.id).where(Card.user_id == user.id).limit(1))

    # Só a bandeira e os 4 últimos dígitos são guardados. O número completo é descartado.
    card = Card(
        user_id=user.id,
        brand=_detectar_bandeira(dados.number),
        last4=dados.number[-4:],
        holder_name=dados.name.strip().upper(),
        expiry=dados.expiry,
        is_primary=False,
    )
    db.add(card)
    db.flush()

    if dados.isPrimary or ja_tem is None:
        _tornar_principal(db, user.id, card)

    db.commit()
    db.refresh(card)
    return card


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_cartao(
    card_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    card = _obter_cartao(db, card_id, user)
    era_principal = card.is_primary
    db.delete(card)
    db.flush()

    if era_principal:
        proximo = db.scalar(
            select(Card).where(Card.user_id == user.id).order_by(Card.id).limit(1)
        )
        if proximo:
            proximo.is_primary = True

    db.commit()


@router.post("/{card_id}/primary", response_model=CardOut)
def definir_cartao_principal(
    card_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    card = _obter_cartao(db, card_id, user)
    _tornar_principal(db, user.id, card)
    db.commit()
    db.refresh(card)
    return card