import React, { useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const AlumniPositionCRUD = () => {
  // 假資料
  const [positions, setPositions] = useState([
    { id: 1, title: '會長' },
    { id: 2, title: '副會長' },
    { id: 3, title: '理事' },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ id: null, title: '' });

  const handleSave = () => {
    if (isEdit) {
      setPositions(
        positions.map((position) =>
          position.id === currentPosition.id ? currentPosition : position
        )
      );
    } else {
      setPositions([
        ...positions,
        { ...currentPosition, id: positions.length + 1 },
      ]);
    }
    setShowModal(false);
    setCurrentPosition({ id: null, title: '' });
    setIsEdit(false);
  };

  const handleEdit = (position) => {
    setCurrentPosition(position);
    setIsEdit(true);
    setShowModal(true);
  };

  return (
    <div>
      <h2>系友會職稱管理</h2>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        新增職稱
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>職稱名稱</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position, index) => (
            <tr key={position.id}>
              <td>{index + 1}</td>
              <td>{position.title}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(position)}>
                  修改
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? '修改職稱' : '新增職稱'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="positionTitle">
              <Form.Label>職稱名稱</Form.Label>
              <Form.Control
                type="text"
                value={currentPosition.title}
                onChange={(e) =>
                  setCurrentPosition({ ...currentPosition, title: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isEdit ? '儲存修改' : '新增'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AlumniPositionCRUD;
