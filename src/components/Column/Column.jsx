import React from "react";
import Task from "../Task/Task";
import "./Column.scss";

export default function Column() {
  return (
    <div className="column">
      <header>Brainstorm</header>
      <ul className="task-list">
        <Task />
        <li className="task-item">Add what you like'd to work on below</li>
        <li className="task-item">Add what you like'd to work on below</li>
        <li className="task-item">Add what you like'd to work on below</li>
      </ul>
      <footer>Add another card</footer>
    </div>
  );
}
