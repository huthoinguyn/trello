import React from "react";

import "./Card.scss";

export default function Card(props) {
  const { card } = props;
  return (
    <li className="card-item">
      {card.cover && (
        <img src={card.cover} className="card-cover" alt="huthoine-img" />
      )}
      {card.title}
    </li>
  );
}
