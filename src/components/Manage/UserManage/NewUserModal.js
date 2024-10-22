import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

function NewUserModal({ showModal, handleClose, isComplex, userId, handleAddUser, fetchUserData }) {
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    mobile_phone: '',
    home_phone: '',
    address: '',
    position: {title : ''},
    graduate: { school: '', grade: '' }, // 確保 graduate 是一個空對象
    is_paid: false,
  });

  const [loading, setLoading] = useState(false);

  // 從後端獲取使用者資料（編輯模式），或者清空資料（新增模式）
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        // 編輯模式，載入資料
        setLoading(true);
        const data = await fetchUserData(userId);
        if (data) {
          setFormData(data);
          setEmail(data.email); // 假設 email 也需要編輯
        }
        setLoading(false);
      } else {
        // 新增模式，清空資料
        setFormData({
          name: '',
          gender: '',
          mobile_phone: '',
          home_phone: '',
          address: '',
          position: '',
          school: '',
          is_paid: false,
        });
        setEmail('');
      }
    };
    fetchData();
  }, [userId, fetchUserData]);

  // 處理表單輸入變更
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 檢查是否需要更新嵌套的 graduate 屬性
    if (name === 'school' || name === 'grade') {
      setFormData((prev) => ({
        ...prev,
        graduate: {
          ...prev.graduate,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  // 處理複雜帳號的送出
  const handleComplexSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleAddUser(true, formData);
    setLoading(false);
  };

  // 處理簡單帳號的送出
  const handleSimpleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleAddUser(false, { email });
    setLoading(false);
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{userId ? '編輯帳號' : isComplex ? '新增複雜帳號' : '新增簡單帳號'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : isComplex ? (
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
              value={formData.graduate.school}
              onChange={handleChange}
              placeholder="輸入畢業學校"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGrade">
            <Form.Label>畢業學年</Form.Label>
            <Form.Control
              type="text"
              name="grade"
              value={formData.graduate.grade}
              onChange={handleChange}
              placeholder="輸入畢業學年"
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

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : '保存變更'}
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

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : '新增帳號'}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default NewUserModal;
