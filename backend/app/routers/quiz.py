from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, Wine
from ..recommendations import personalized_content, profile_label, rank_wines
from ..schemas import UserOut, WineOut
from ..schemas_quiz import QuizAnswers, RecommendationOut
from ..security import get_current_user

router = APIRouter(tags=["Quiz e Recomendações"])


def montar_recomendacao(answers: dict, db: Session) -> dict:
    vinhos = db.scalars(select(Wine).order_by(Wine.id)).all()
    ranking = rank_wines(answers, vinhos)
    itens = []
    for vinho, compat, rotulo in ranking:
        dados = WineOut.model_validate(vinho).model_dump()
        dados.update({"score": compat, "compatibility": compat, "label": rotulo})
        itens.append(dados)
    return {
        "profile": profile_label(answers),
        "wines": itens,
        "content": personalized_content(answers),
    }


# Público: quem ainda não tem conta também pode ver o resultado do quiz
@router.post("/quiz/recommend", response_model=RecommendationOut)
def recomendar(dados: QuizAnswers, db: Session = Depends(get_db)):
    return montar_recomendacao(dados.model_dump(), db)


@router.put("/users/me/quiz", response_model=UserOut)
def salvar_quiz(
    dados: QuizAnswers,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user.quiz_answers = dados.model_dump()
    db.commit()
    db.refresh(user)
    return user


@router.get("/users/me/recommendations", response_model=RecommendationOut)
def minhas_recomendacoes(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not user.quiz_answers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Você ainda não respondeu ao quiz",
        )
    return montar_recomendacao(user.quiz_answers, db)
