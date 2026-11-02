from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import TokenOut, UserCreate, UserLogin, UserOut
from ..security import create_access_token, get_current_user, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post("/register", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
def cadastrar(dados: UserCreate, db: Session = Depends(get_db)):
    email = dados.email.lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Este e-mail já está cadastrado")

    user = User(name=dados.name.strip(), email=email, password_hash=hash_password(dados.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"access_token": create_access_token(user.id), "token_type": "bearer", "user": user}


@router.post("/login", response_model=TokenOut)
def entrar(dados: UserLogin, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == dados.email.lower()))
    if not user or not verify_password(dados.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="E-mail ou senha incorretos")
    return {"access_token": create_access_token(user.id), "token_type": "bearer", "user": user}


@router.get("/me", response_model=UserOut)
def meus_dados(user: User = Depends(get_current_user)):
    return user