import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useCallback } from "react";
import { isEmpty } from "lodash";
import { Container, Draggable } from "react-smooth-dnd";
import {
  Col,
  Container as BSContainer,
  Row,
  Form,
  Button,
} from "react-bootstrap";
import Column from "../Column/Column";
import { mapOrder } from "../../utilities/sorts";
import { applyDrag } from "../../utilities/dragDrop";

import { initialData } from "../../actions/initialData";

import "./BoardContent.scss";

export default function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const [openColumnForm, setOpenColumnForm] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const newColumnTitleChange = useCallback(
    (e) => setNewColumnTitle(e.target.value),
    []
  );

  const newColumnInputRef = useRef(null);
  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === "board-1"
    );
    if (boardFromDB) {
      setBoard(boardFromDB);
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, "id"));
    }
  }, []);

  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus();
      newColumnInputRef.current.select();
    }
  }, [openColumnForm]);

  if (isEmpty(board)) {
    return <div className="not-found">Board not found!</div>;
  }

  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns];
    newColumns = applyDrag(newColumns, dropResult);
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;
    setBoard(newBoard);
    setColumns(newColumns);
  };
  const onCardDrop = (columnID, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns];

      let currentColumn = newColumns.find((c) => c.id === columnID);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map((i) => i.id);
      setColumns(newColumns);
    }
  };

  const toggleOpenColumnForm = () => setOpenColumnForm(!openColumnForm);

  const addNewColumn = () => {
    if (!newColumnTitle) return newColumnInputRef.current.focus();

    const newColumnToAdd = {
      id: Math.random().toString(36).substr(2, 5),
      boardId: board.id,
      title: newColumnTitle,
      cardOrder: [],
      cards: [],
    };
    let newColumns = [...columns];
    newColumns.push(newColumnToAdd);
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;
    setBoard(newBoard);
    setColumns(newColumns);
    setNewColumnTitle("");
    toggleOpenColumnForm();
  };

  const onUpdateColumn = (newColumnToUpdate) => {
    const columnIdtopUpdate = newColumnToUpdate.id;

    let newColumns = [...columns];
    const columnIndextopUpdate = newColumns.findIndex(
      (i) => i.id === columnIdtopUpdate
    );
    if (newColumnToUpdate._destroy) {
      newColumns.splice(columnIndextopUpdate, 1);
    } else {
      newColumns.splice(columnIndextopUpdate, 1, newColumnToUpdate);
    }
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;
    setBoard(newBoard);
    setColumns(newColumns);
  };

  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        dragHandleSelector=".column-drag-handle"
        getChildPayload={(index) => columns[index]}
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: "column-drop-preview",
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column
              column={column}
              onCardDrop={onCardDrop}
              onUpdateColumn={onUpdateColumn}
            />
          </Draggable>
        ))}
      </Container>
      <BSContainer className="bscontainer">
        {!openColumnForm && (
          <Row>
            <Col className="add-new-column" onClick={toggleOpenColumnForm}>
              <i className="fa fa-plus icon"></i>
              Add another column
            </Col>
          </Row>
        )}

        {openColumnForm && (
          <Row>
            <Col className="enter-new-column">
              <Form.Control
                className="input-enter-new-column"
                size="sm"
                type="text"
                placeholder="Enter column title"
                ref={newColumnInputRef}
                value={newColumnTitle}
                onChange={newColumnTitleChange}
                onKeyDown={(event) => event.key === "Enter" && addNewColumn()}
              />
              <div className="actions-add-new-column">
                <Button variant="success" size="sm" onClick={addNewColumn}>
                  Add column
                </Button>{" "}
                <span
                  className="cancel-new-column"
                  onClick={toggleOpenColumnForm}
                >
                  <i className="fa fa-times icon"></i>
                </span>
              </div>
            </Col>
          </Row>
        )}
      </BSContainer>
    </div>
  );
}
