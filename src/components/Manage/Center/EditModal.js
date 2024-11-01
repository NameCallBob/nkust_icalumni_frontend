import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Row, Spinner } from 'react-bootstrap';

const MemberModal = ({ show, handleClose, handleSave, parentData,loading , setLoading }) => {
  const [formData, setFormData] = useState({
    ...parentData,
    graduate: parentData.graduate || { grade: '', school: '' }, // 確保 graduate 存在
  });

  // 處理表單變更
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 如果是 graduate 相關的欄位，做特殊處理
    if (name === 'graduate_year' || name === 'graduate') {
      const graduateField = name === 'graduate_year' ? 'grade' : 'school';
      setFormData((prevState) => ({
        ...prevState,
        graduate: {
          ...prevState.graduate,
          [graduateField]: value,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  // 當 parentData 變更時，更新 formData
  useEffect(() => {
    setFormData({
      ...parentData,
      graduate: parentData.graduate || { grade: '', school: '國立高雄科技大學智慧商務系' },
    });
  }, [parentData]);

  // 處理照片上傳並轉換為 base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prevState) => ({
        ...prevState,
        photo: reader.result, // 將 base64 資料存到 formData.photo
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // 對比 formData 和 parentData，找出變更
  const getChangedData = () => {
    const changedData = {};

    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === 'object' && formData[key] !== null) {
        // 如果是嵌套物件（如 graduate），進行遞迴對比
        Object.keys(formData[key]).forEach((nestedKey) => {
          if (formData[key][nestedKey] !== parentData[key][nestedKey]) {
            if (!changedData[key]) {
              changedData[key] = {};
            }
            changedData[key][nestedKey] = formData[key][nestedKey];
          }
        });
      } else if (formData[key] !== parentData[key]) {
        // 如果不是嵌套物件，直接對比
        changedData[key] = formData[key];
      }
    });

    return changedData;
  };

  // 提交表單，並將變更的資料傳遞出去
  const handleSubmit = () => {
    setLoading(true); // 開啟 loading 狀態
    const changedData = getChangedData();
    console.log('變更的資料:', changedData);

    // 模擬處理過程，例如 API 請求
    setTimeout(() => {
      handleSave(formData, changedData); // 傳遞變更的資料
      setLoading(false); // 完成後關閉 loading 狀態
    }, 2000); // 模擬 2 秒的延遲
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>會員資料</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
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
                    name="graduate_year"  // 和 handleChange 中的 name 保持一致
                    value={formData.graduate?.grade || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="graduate">
                  <Form.Label>畢業學校</Form.Label>
                  <Form.Control
                    type="text"
                    name="graduate"  // 和 handleChange 中的 name 保持一致
                    value={formData.graduate?.school || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
            <Col xs={12} md={6}>
                <Form.Group controlId="photo">
                  <Form.Label>學號</Form.Label>
                  <Form.Control
                    type="text"
                    name="student_id"
                    value={formData.graduate?.student_id || ''}
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Col>
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
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          取消
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? '保存中...' : '保存'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MemberModal;
