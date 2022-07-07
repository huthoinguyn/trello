import React from "react";
import { useState, useEffect } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { Form, Button, Dropdown } from "react-bootstrap";
import { cloneDeep } from "lodash";

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
import { useRef } from "react";

export default function Column(props) {
  const { column, onCardDrop, onUpdateColumn } = props;
  const cards = mapOrder(column.cards, column.cardOrder, "id");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleConfirmModal = () => setShowConfirmModal(!showConfirmModal);
  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = { ...column, _destroy: true };
      onUpdateColumn(newColumn);
    }
    toggleConfirmModal();
  };

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

  const [openCardForm, setOpenCardForm] = useState(false);
  const toggleOpenCardForm = () => setOpenCardForm(!openCardForm);

  const [newCardTitle, setNewCardTitle] = useState("");
  const newCardTitleChange = (e) => {
    setNewCardTitle(e.target.value);
  };
  const newCardTextareaRef = useRef(null);

  useEffect(() => {
    if (newCardTextareaRef && newCardTextareaRef.current) {
      newCardTextareaRef.current.focus();
      newCardTextareaRef.current.select();
    }
  }, [openCardForm]);

  const addNewCard = () => {
    if (!newCardTitle) return newCardInputRef.current.focus();
    console.log();

    const newCardToAdd = {
      id: Math.random().toString(36).substr(2, 5),
      boardId: column.boardId,
      columnId: column.id,
      title: newCardTitle.trim(),
      cover: null,
    };

    let newColumn = cloneDeep(column);
    newColumn.cards.push(newCardToAdd);
    newColumn.cardOrder.push(newCardToAdd.id);
    onUpdateColumn(newColumn);
    setNewCardTitle("");
    toggleOpenCardForm();
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
          // onDropReady={(p) => console.log("Drop ready: ", p)}
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
        {openCardForm && (
          <div className="add-new-card-area">
            <Form.Control
              className="textarea-enter-new-card"
              size="sm"
              as="textarea"
              rows="3"
              placeholder="Enter a title for this tag..."
              ref={newCardTextareaRef}
              value={newCardTitle}
              onChange={newCardTitleChange}
              onKeyDown={(event) => event.key === "Enter" && addNewCard()}
            />
          </div>
        )}
      </div>
      <footer>
        {openCardForm && (
          <div className="actions-add-new-item">
            <Button variant="success" size="sm" onClick={addNewCard}>
              Add card
            </Button>{" "}
            <span className="cancel-icon" onClick={toggleOpenCardForm}>
              <i className="fa fa-times icon"></i>
            </span>
          </div>
        )}
        {!openCardForm && (
          <div className="footer-action" onClick={toggleOpenCardForm}>
            <i className="fa fa-plus icon" />
            Add another card
          </div>
        )}
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
