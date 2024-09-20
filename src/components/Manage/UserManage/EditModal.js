// EditUserModal.js
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function EditUserModal({
  showModal,
  handleCloseModal,
  currentUser,
  setCurrentUser,
  handleUpdateUser,
}) {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>修改使用者資料</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="editName">
            <Form.Label>姓名</Form.Label>
            <Form.Control
              type="text"
              value={currentUser.name}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, name: e.target.value })
              }
            />
          </Form.Group>
          {/* 其他需要修改的欄位 */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          取消
        </Button>
        <Button variant="primary" onClick={handleUpdateUser}>
          保存修改
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditUserModal;
