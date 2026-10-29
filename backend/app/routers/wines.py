from math import ceil

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Wine
from ..schemas import WineFilters, WineList, WineOut

router = APIRouter(prefix="/wines", tags=["Vinhos"])

SORTS = {
    "recentes": Wine.date.desc(),
    "menor": Wine.price.asc(),
    "maior": Wine.price.desc(),
    "az": Wine.name.asc(),
    "vendidos": Wine.featured.desc(),
}


@router.get("", response_model=WineList)
def listar_vinhos(
    q: str | None = None,
    type: str | None = None,
    grape: list[str] | None = Query(default=None),
    min_price: float | None = None,
    max_price: float | None = None,
    sort: str = "recentes",
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=9, ge=1, le=50),
    db: Session = Depends(get_db),
):
    stmt = select(Wine)

    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            or_(Wine.name.ilike(like), Wine.grape.ilike(like), Wine.producer.ilike(like))
        )
    if type:
        stmt = stmt.where(Wine.type == type)
    if grape:
        stmt = stmt.where(Wine.grape.in_(grape))
    if min_price is not None:
        stmt = stmt.where(Wine.price >= min_price)
    if max_price is not None:
        stmt = stmt.where(Wine.price <= max_price)

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0

    order = SORTS.get(sort, SORTS["recentes"])
    stmt = stmt.order_by(order, Wine.id).offset((page - 1) * page_size).limit(page_size)
    items = db.scalars(stmt).all()

    return {"items": items, "total": total, "page": page, "pages": ceil(total / page_size)}


# Esta rota precisa vir ANTES de "/{wine_id}", senão "filters" seria lido como um id
@router.get("/filters", response_model=WineFilters)
def listar_filtros(db: Session = Depends(get_db)):
    types = db.scalars(select(Wine.type).distinct().order_by(Wine.type)).all()
    grapes = db.scalars(select(Wine.grape).distinct().order_by(Wine.grape)).all()
    return {"types": types, "grapes": grapes}


@router.get("/{wine_id}", response_model=WineOut)
def obter_vinho(wine_id: int, db: Session = Depends(get_db)):
    wine = db.get(Wine, wine_id)
    if not wine:
        raise HTTPException(status_code=404, detail="Vinho não encontrado")
    return wine


@router.get("/{wine_id}/related", response_model=list[WineOut])
def vinhos_parecidos(wine_id: int, db: Session = Depends(get_db)):
    wine = db.get(Wine, wine_id)
    if not wine:
        raise HTTPException(status_code=404, detail="Vinho não encontrado")
    stmt = (
        select(Wine)
        .where(Wine.type == wine.type, Wine.id != wine.id)
        .order_by(Wine.id)
        .limit(3)
    )
    return db.scalars(stmt).all()