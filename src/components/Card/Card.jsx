import React from "react";

import "./Card.scss";

export default function Card(props) {
  const { card } = props;
  return (
    <div className="card-item">
      {card.cover && (
        <img
          src={card.cover}
          draggable={false}
          className="card-cover"
          alt="huthoine-img"
        />
      )}
      {card.title}
    </div>
  );
}
