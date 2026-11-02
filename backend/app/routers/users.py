from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Address, Card, User
from ..schemas import UserOut
from ..schemas_users import DeleteAccount, PasswordChange, UserUpdate
from ..security import get_current_user, hash_password, verify_password

router = APIRouter(prefix="/users", tags=["Usuários"])


@router.put("/me", response_model=UserOut)
def atualizar_perfil(
    dados: UserUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if dados.name is not None:
        user.name = dados.name.strip()

    if dados.email is not None:
        novo_email = dados.email.lower()
        if novo_email != user.email:
            if db.scalar(select(User).where(User.email == novo_email)):
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Este e-mail já está em uso")
            user.email = novo_email

    db.commit()
    db.refresh(user)
    return user


@router.put("/me/password", status_code=status.HTTP_204_NO_CONTENT)
def trocar_senha(
    dados: PasswordChange,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(dados.current_password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Senha atual incorreta")
    user.password_hash = hash_password(dados.new_password)
    db.commit()


# Exclui a conta sem apagar o histórico de pedidos (que precisa ser mantido):
# endereços e cartões são apagados e os dados pessoais do usuário são anonimizados.
@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def excluir_conta(
    dados: DeleteAccount,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(dados.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Senha incorreta")

    db.execute(delete(Address).where(Address.user_id == user.id))
    db.execute(delete(Card).where(Card.user_id == user.id))

    user.name = "Usuário removido"
    user.email = f"removido-{user.id}@brisa.invalid"
    user.password_hash = hash_password(uuid4().hex)
    db.commit()