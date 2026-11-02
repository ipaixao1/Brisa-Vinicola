from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Address, User
from ..schemas_addresses import AddressIn, AddressOut, AddressUpdate
from ..security import get_current_user

router = APIRouter(prefix="/addresses", tags=["Endereços"])


def _obter_endereco(db: Session, address_id: int, user: User) -> Address:
    address = db.scalar(
        select(Address).where(Address.id == address_id, Address.user_id == user.id)
    )
    if not address:
        raise HTTPException(status_code=404, detail="Endereço não encontrado")
    return address


def _tornar_principal(db: Session, user_id: int, address: Address) -> None:
    # Desmarca todos os outros e marca só este
    db.execute(
        update(Address)
        .where(Address.user_id == user_id, Address.id != address.id)
        .values(is_primary=False)
    )
    address.is_primary = True


@router.get("", response_model=list[AddressOut])
def listar_enderecos(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stmt = (
        select(Address)
        .where(Address.user_id == user.id)
        .order_by(Address.is_primary.desc(), Address.id)
    )
    return db.scalars(stmt).all()


@router.post("", response_model=AddressOut, status_code=status.HTTP_201_CREATED)
def criar_endereco(
    dados: AddressIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ja_tem = db.scalar(select(Address.id).where(Address.user_id == user.id).limit(1))

    campos = dados.model_dump(exclude={"isPrimary"})
    campos["state"] = campos["state"].upper()
    address = Address(user_id=user.id, is_primary=False, **campos)
    db.add(address)
    db.flush()

    # O primeiro endereço sempre vira o principal
    if dados.isPrimary or ja_tem is None:
        _tornar_principal(db, user.id, address)

    db.commit()
    db.refresh(address)
    return address


@router.put("/{address_id}", response_model=AddressOut)
def editar_endereco(
    address_id: int,
    dados: AddressUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    address = _obter_endereco(db, address_id, user)
    mudancas = dados.model_dump(exclude_unset=True)

    quer_principal = mudancas.pop("isPrimary", None)
    for campo, valor in mudancas.items():
        if valor is None:
            continue
        setattr(address, campo, valor.upper() if campo == "state" else valor)

    # Sempre precisa existir um principal, então só dá para marcar (não desmarcar)
    if quer_principal:
        _tornar_principal(db, user.id, address)

    db.commit()
    db.refresh(address)
    return address


@router.delete("/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_endereco(
    address_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    address = _obter_endereco(db, address_id, user)
    era_principal = address.is_primary
    db.delete(address)
    db.flush()

    # Se excluiu o principal, o primeiro que sobrar assume
    if era_principal:
        proximo = db.scalar(
            select(Address).where(Address.user_id == user.id).order_by(Address.id).limit(1)
        )
        if proximo:
            proximo.is_primary = True

    db.commit()


@router.post("/{address_id}/primary", response_model=AddressOut)
def definir_principal(
    address_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    address = _obter_endereco(db, address_id, user)
    _tornar_principal(db, user.id, address)
    db.commit()
    db.refresh(address)
    return address