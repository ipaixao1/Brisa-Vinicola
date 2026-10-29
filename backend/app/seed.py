from .database import Base, SessionLocal, engine
from .models import Wine
from .seed_data import WINES


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Wine).count() > 0:
            print("O banco já tem vinhos. Nada a fazer.")
            return
        for w in WINES:
            db.add(
                Wine(
                    id=w["id"],
                    name=w["name"],
                    producer=w["producer"],
                    type=w["type"],
                    grape=w["grape"],
                    origin=w["origin"],
                    price=w["price"],
                    price_old=w.get("priceOld"),
                    img=w["img"],
                    badge=w.get("badge"),
                    featured=w.get("featured", False),
                    date=w["date"],
                    description=w["description"],
                    alcohol=w["alcohol"],
                    acidity=w["acidity"],
                    volume=w["volume"],
                    serving_temp=w["servingTemp"],
                    traits=w["traits"],
                    pairings=w["pairings"],
                )
            )
        db.commit()
        print(f"{len(WINES)} vinhos cadastrados com sucesso.")
    finally:
        db.close()


if __name__ == "__main__":
    run()