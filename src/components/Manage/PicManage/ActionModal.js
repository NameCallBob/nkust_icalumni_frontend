import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ActionModal = ({ actionType, photo, onClose, onDelete, onEdit, onToggleStatus }) => {
  const [title, setTitle] = useState(photo.title);
  const [description, setDescription] = useState(photo.description);

  const handleSave = () => {
    if (actionType === "edit") {
      onEdit(photo.id, { title, description });
    } else if (actionType === "toggleStatus") {
      onToggleStatus(photo.id);
    } else if (actionType === "delete") {
      onDelete(photo.id);
    }
    onClose();
  };

  const getModalTitle = () => {
    switch (actionType) {
      case "edit":
        return "編輯照片";
      case "delete":
        return "刪除照片";
      case "toggleStatus":
        return photo.is_active ? "下架照片" : "上架照片";
      default:
        return "";
    }
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{getModalTitle()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {actionType === "edit" ? (
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>標題</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>說明</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        ) : (
          <p>你確定要{actionType === "delete" ? "刪除" : photo.is_active ? "下架" : "上架"}這張照片嗎？</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          取消
        </Button>
        <Button variant={actionType === "delete" ? "danger" : "primary"} onClick={handleSave}>
          確定
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ActionModal;
