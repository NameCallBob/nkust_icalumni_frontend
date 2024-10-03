import React, { useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const IndustryCRUD = () => {
  // 假資料
  const [industries, setIndustries] = useState([
    { id: 1, name: '科技', description: '科技產業的簡介' },
    { id: 2, name: '金融', description: '金融產業的簡介' },
    { id: 3, name: '醫療', description: '醫療產業的簡介' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentIndustry, setCurrentIndustry] = useState({
    id: null,
    name: '',
    description: '',
  });

  const handleSave = () => {
    if (isEdit) {
      setIndustries(
        industries.map((industry) =>
          industry.id === currentIndustry.id ? currentIndustry : industry
        )
      );
    } else {
      setIndustries([
        ...industries,
        { ...currentIndustry, id: industries.length + 1 },
      ]);
    }
    setShowModal(false);
    setCurrentIndustry({ id: null, name: '', description: '' });
    setIsEdit(false);
  };

  const handleEdit = (industry) => {
    setCurrentIndustry(industry);
    setIsEdit(true);
    setShowModal(true);
  };

  return (
    <div>
      <h2>公司產業別管理</h2>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        新增產業別
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>產業名稱</th>
            <th>簡介</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {industries.map((industry, index) => (
            <tr key={industry.id}>
              <td>{index + 1}</td>
              <td>{industry.name}</td>
              <td>{industry.description}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(industry)}>
                  修改
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? '修改產業別' : '新增產業別'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="industryName">
              <Form.Label>產業名稱</Form.Label>
              <Form.Control
                type="text"
                value={currentIndustry.name}
                onChange={(e) =>
                  setCurrentIndustry({ ...currentIndustry, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="industryDescription">
              <Form.Label>產業簡介</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentIndustry.description}
                onChange={(e) =>
                  setCurrentIndustry({ ...currentIndustry, description: e.target.value })
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

export default IndustryCRUD;
