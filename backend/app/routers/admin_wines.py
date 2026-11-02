from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import OrderItem, User, Wine
from ..schemas import WineOut
from ..schemas_wines_admin import WineIn, WineUpdate
from ..security import get_current_admin

router = APIRouter(prefix="/admin/wines", tags=["Admin: Vinhos"])

# Nomes do front (camelCase) -> nomes das colunas no banco
CAMPOS = {"priceOld": "price_old", "servingTemp": "serving_temp"}


def _obter_vinho(db: Session, wine_id: int) -> Wine:
    wine = db.get(Wine, wine_id)
    if not wine:
        raise HTTPException(status_code=404, detail="Vinho não encontrado")
    return wine


@router.post("", response_model=WineOut, status_code=status.HTTP_201_CREATED)
def cadastrar_vinho(
    dados: WineIn,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    campos = dados.model_dump()
    for camel, snake in CAMPOS.items():
        campos[snake] = campos.pop(camel)

    # Sem "date" informado, o vinho vira o mais recente
    if campos["date"] is None:
        campos["date"] = (db.scalar(select(func.max(Wine.date))) or 0) + 1

    wine = Wine(**campos)
    db.add(wine)
    db.commit()
    db.refresh(wine)
    return wine


@router.put("/{wine_id}", response_model=WineOut)
def editar_vinho(
    wine_id: int,
    dados: WineUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    wine = _obter_vinho(db, wine_id)

    for campo, valor in dados.model_dump(exclude_unset=True).items():
        # priceOld e badge aceitam null (para remover uma promoção); os demais campos não
        if valor is None and campo not in ("priceOld", "badge"):
            continue
        setattr(wine, CAMPOS.get(campo, campo), valor)

    db.commit()
    db.refresh(wine)
    return wine


@router.delete("/{wine_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_vinho(
    wine_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    wine = _obter_vinho(db, wine_id)

    ja_vendido = db.scalar(select(OrderItem.id).where(OrderItem.wine_id == wine_id).limit(1))
    if ja_vendido:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este vinho já foi vendido e não pode ser excluído",
        )

    db.delete(wine)
    db.commit()