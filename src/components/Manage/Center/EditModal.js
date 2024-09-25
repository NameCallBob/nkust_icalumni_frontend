import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import axios from 'axios'; // Axios 預留用於取得使用者資料

const MemberModal = ({ show, handleClose, handleSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    home_phone: '',
    mobile_phone: '',
    gender: '',
    address: '',
    intro: '',
    birth_date: '',
    photo: null,
    position: '',
    graduate: '',
  });

//   useEffect(() => {
//     if (memberId) {
//       // 在這裡使用 axios 來取得使用者資料
//       // 範例 API: `/api/members/${memberId}`
//       axios
//         .get(`/api/members/${memberId}`)
//         .then((response) => {
//           setFormData(response.data);
//         })
//         .catch((error) => {
//           console.error("Error fetching member data", error);
//         });
//     }
//   }, [memberId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  const handleSubmit = () => {
    handleSave(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>會員資料</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group controlId="name">
                <Form.Label>姓名</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="home_phone">
                <Form.Label>市內電話</Form.Label>
                <Form.Control
                  type="text"
                  name="home_phone"
                  value={formData.home_phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6}>
              <Form.Group controlId="mobile_phone">
                <Form.Label>行動電話</Form.Label>
                <Form.Control
                  type="text"
                  name="mobile_phone"
                  value={formData.mobile_phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="gender">
                <Form.Label>性別</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="M">男性</option>
                  <option value="F">女性</option>
                  <option value="O">其他</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6}>
              <Form.Group controlId="birth_date">
                <Form.Label>生日</Form.Label>
                <Form.Control
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="address">
                <Form.Label>地址</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6}>
              <Form.Group controlId="graduate_year">
                <Form.Label>畢業學年</Form.Label>
                <Form.Control
                  type="text"
                  name="graduate_year"
                  value={formData.position}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="graduate">
                <Form.Label>畢業學校</Form.Label>
                <Form.Control
                  type="text"
                  name="graduate"
                  value={formData.graduate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6}>
              <Form.Group controlId="photo">
                <Form.Label>照片</Form.Label>
                <Form.Control
                  type="file"
                  name="photo"
                  onChange={handleFileChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="intro">
            <Form.Label>自我介紹</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="intro"
              value={formData.intro}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          取消
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          保存
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MemberModal;
