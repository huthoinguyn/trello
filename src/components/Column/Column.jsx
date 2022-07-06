import React from "react";
import { useState, useEffect } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { Dropdown } from "react-bootstrap";
import { Form } from "react-bootstrap";

import Card from "../Card/Card";
import { mapOrder } from "../../utilities/sorts";
import ConfirmModal from "../Common/ConfirmModal";
import {
  MODAL_ACTION_CONFIRM,
  MODAL_ACTION_CLOSE,
} from "../../utilities/constants";
import {
  selectInlineInputValue,
  saveContentAfterPressEnter,
} from "../../utilities/contentEditable";
import "./Column.scss";


export default function Column(props) {
  const { column, onCardDrop, onUpdateColumn } = props;
  const cards = mapOrder(column.cards, column.cardOrder, "id");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");

  useEffect(() => {
    setColumnTitle(column.title);
  }, [column.title]);

  const columnTitleChange = (e) => setColumnTitle(e.target.value);

  const columnTitleBlur = () => {
    setColumnTitle(columnTitle);
    const newColumn = { ...column, title: columnTitle };
    onUpdateColumn(newColumn);
  };

  const toggleConfirmModal = () => setShowConfirmModal(!showConfirmModal);

  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = { ...column, _destroy: true };
      onUpdateColumn(newColumn);
    }
    toggleConfirmModal();
  };

  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          <Form.Control
            size="sm"
            type="text"
            className="trello-content-editable"
            onClick={selectInlineInputValue}
            onChange={columnTitleChange}
            onBlur={columnTitleBlur}
            value={columnTitle}
            onKeyDown={saveContentAfterPressEnter}
            onMouseDown={(e) => e.preventDefault()}
            spellCheck="false"
          />
        </div>
        <div className="column-dropdown">
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-basic"
              className="dropdown-btn"
              size="sm"
            />
            <Dropdown.Menu>
              <Dropdown.Item>Add cart...</Dropdown.Item>
              <Dropdown.Item onClick={toggleConfirmModal}>
                Remove column...
              </Dropdown.Item>
              <Dropdown.Item>
                Remove all cards in this column (beta)...
              </Dropdown.Item>
              <Dropdown.Item>
                Archive all cards in this column (beta)...
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          groupName="col"
          onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
          getChildPayload={(index) => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          onDropReady={(p) => console.log("Drop ready: ", p)}
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: "card-drop-preview",
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
      </div>
      <footer>
        <div className="footer-action">
          <i className="fa fa-plus icon" />
          Add another card
        </div>
      </footer>
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove Column"
        content={`Are you sure to remove <strong>${column.title}</strong>! <br/> All related cards will also be removed!`}
      />
    </div>
  );
}
