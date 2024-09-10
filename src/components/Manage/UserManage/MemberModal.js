import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

function MemberModal({ show, onHide, positions, onSubmit, formData, setFormData, editingMember }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMember = {
      id: editingMember ? editingMember.id : Date.now(),
      ...formData,
      position: positions.find((p) => p.id === parseInt(formData.position)),
      photo: formData.photo ? URL.createObjectURL(formData.photo) : editingMember?.photo,
    };

    onSubmit(newMember);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{editingMember ? '編輯會員' : '新增會員'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* 表單欄位 */}
          <Form.Group className="mb-3">
            <Form.Label>姓名</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>市內電話</Form.Label>
            <Form.Control
              type="text"
              name="home_phone"
              value={formData.home_phone}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>行動電話</Form.Label>
            <Form.Control
              type="text"
              name="mobile_phone"
              value={formData.mobile_phone}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>性別</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="M">男</option>
              <option value="F">女</option>
              <option value="O">其他</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>住址</Form.Label>
            <Form.Control
              as="textarea"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="是否繳費"
              name="is_paid"
              checked={formData.is_paid}
              onChange={(e) => setFormData({ ...formData, is_paid: e.target.checked })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>自我介紹</Form.Label>
            <Form.Control
              as="textarea"
              name="intro"
              value={formData.intro}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>生日</Form.Label>
            <Form.Control
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>照片</Form.Label>
            <Form.Control
              type="file"
              name="photo"
              onChange={handleFileChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>職位</Form.Label>
            <Form.Select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
            >
              <option value="">選擇職位</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>畢業學校</Form.Label>
            <Form.Control
              type="text"
              name="graduate"
              value={formData.graduate}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {editingMember ? '更新' : '新增'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default MemberModal;
