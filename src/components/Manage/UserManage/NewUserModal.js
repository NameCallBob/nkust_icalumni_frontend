import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function NewUserModal({ showModal, handleClose, isComplex, handleAddUser }) {
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    mobile_phone: '',
    home_phone: '',
    address: '',
    position: '',
    school: '',
    is_paid: false,
  });

  // 簡單帳號的處理
  const handleSimpleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    handleAddUser({ email });
    handleClose();
  };

  // 複雜帳號的處理
  const handleComplexSubmit = (e) => {
    e.preventDefault();
    handleAddUser(formData);
    handleClose();
  };

  // 表單輸入處理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isComplex ? '新增複雜帳號' : '新增簡單帳號'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isComplex ? (
          <Form onSubmit={handleComplexSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>姓名</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="輸入姓名"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGender">
              <Form.Label>性別</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">選擇性別</option>
                <option value="M">男性</option>
                <option value="F">女性</option>
                <option value="O">其他</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formMobilePhone">
              <Form.Label>行動電話</Form.Label>
              <Form.Control
                type="text"
                name="mobile_phone"
                value={formData.mobile_phone}
                onChange={handleChange}
                placeholder="輸入行動電話"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formHomePhone">
              <Form.Label>市內電話</Form.Label>
              <Form.Control
                type="text"
                name="home_phone"
                value={formData.home_phone}
                onChange={handleChange}
                placeholder="輸入市內電話"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>住址</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="輸入住址"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPosition">
              <Form.Label>職位</Form.Label>
              <Form.Control
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="輸入職位"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSchool">
              <Form.Label>畢業學校</Form.Label>
              <Form.Control
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="輸入畢業學校"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPaid">
              <Form.Check
                type="checkbox"
                name="is_paid"
                label="是否繳費"
                checked={formData.is_paid}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, is_paid: e.target.checked }))
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              新增帳號
            </Button>
          </Form>
        ) : (
          <Form onSubmit={handleSimpleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>電子郵件</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="輸入電子郵件"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              新增帳號
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default NewUserModal;
