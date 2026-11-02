from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import ContactMessage, User
from ..schemas_contact import AnsweredUpdate, ContactIn, ContactOut
from ..security import get_current_admin

router = APIRouter(tags=["Fale Conosco"])


def _obter_mensagem(db: Session, message_id: int) -> ContactMessage:
    msg = db.get(ContactMessage, message_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Mensagem não encontrada")
    return msg


# Pública: qualquer visitante pode enviar uma mensagem
@router.post("/contact", status_code=status.HTTP_201_CREATED)
def enviar_mensagem(dados: ContactIn, db: Session = Depends(get_db)):
    msg = ContactMessage(
        name=dados.name.strip(),
        email=dados.email.lower(),
        subject=dados.subject.strip(),
        message=dados.message.strip(),
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return {"id": msg.id, "detail": "Mensagem recebida! Responderemos em até 24 horas úteis."}


@router.get("/admin/contact", response_model=list[ContactOut])
def listar_mensagens(
    answered: bool | None = None,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    stmt = select(ContactMessage).order_by(ContactMessage.created_at.desc(), ContactMessage.id.desc())
    if answered is not None:
        stmt = stmt.where(ContactMessage.answered == answered)
    return db.scalars(stmt).all()


@router.put("/admin/contact/{message_id}", response_model=ContactOut)
def marcar_respondida(
    message_id: int,
    dados: AnsweredUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    msg = _obter_mensagem(db, message_id)
    msg.answered = dados.answered
    db.commit()
    db.refresh(msg)
    return msg


@router.delete("/admin/contact/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_mensagem(
    message_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    msg = _obter_mensagem(db, message_id)
    db.delete(msg)
    db.commit()