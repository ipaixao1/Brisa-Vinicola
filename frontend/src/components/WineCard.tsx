import { useState } from "react";
import { Link } from "react-router-dom";
import type { Wine } from "@/data/wines";
import { useCart } from "@/context/CartContext";

interface Props {
  wine: Wine;
}

export default function WineCard({ wine }: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(wine);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Link to={`/vinhos/${wine.id}`} className="vcard" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      {wine.badge && <div className="vcard-badge">{wine.badge}</div>}
      <div className="vcard-bottle-wrap">
        <img src={wine.img} alt={wine.name} className="vcard-bottle" />
      </div>
      <div className="vcard-body">
        <p className="vcard-type">{wine.type} · {wine.grape}</p>
        <h3 className="vcard-name">{wine.name}</h3>
        <p className="vcard-origin">{wine.origin}</p>
        <div className="vcard-prices">
          {wine.priceOld && (
            <span className="vcard-price-old">R$ {wine.priceOld.toFixed(2).replace(".", ",")}</span>
          )}
          <span className="vcard-price">R$ {wine.price.toFixed(2).replace(".", ",")}</span>
        </div>
        <button className="vcard-btn" onClick={handleAdd} style={{ background: added ? "#2a5" : undefined }}>
          {added ? "Vinho adicionado!" : "Adicionar ao carrinho"}
        </button>
      </div>
    </Link>
  );
}
