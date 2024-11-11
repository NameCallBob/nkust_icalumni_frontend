import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Row, Spinner } from 'react-bootstrap';

const MemberModal = ({ show, handleClose, handleSave, parentData, loading, setLoading }) => {
  const [formData, setFormData] = useState({
    ...parentData,
    graduate: parentData.graduate || { grade: '', school: '', student_id: '' }, // 確保 graduate 存在
  });

  // 處理表單變更
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 處理 graduate 相關欄位，包括學號
    if (name === 'graduate_year' || name === 'graduate' || name === 'student_id') {
      const graduateField = name === 'graduate_year' ? 'grade' : name === 'graduate' ? 'school' : 'student_id';
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

  const [errors, setErrors] = useState({}); // 儲存錯誤訊息

  const [hint ,setHint] = useState("")

  const handleFocus = (field) => {
    switch (field) {
      case "name":
        setHint("請輸入您的真實姓名，例如：王小明，最多 50 個字。");
        break;
      case "gender":
        setHint("請選擇您的性別，例如：男性、女性或其他。");
        break;
      case "birth_date":
        setHint("請選擇出生日期，例如：1990-01-01。");
        break;
      case "mobile_phone":
        setHint("請輸入有效的行動電話號碼，例如：0912345678。");
        break;
      case "home_phone":
        setHint("請輸入市內電話號碼，例如：07-1234567。");
        break;
      case "address":
        setHint("請輸入詳細住址，例如：高雄市鼓山區博愛一路123號。");
        break;
      case "intro":
        setHint("請輸入有關於您的自我介紹，可說明專長、職業以利於被搜尋到．限定200字");
        break;
      case "school":
        setHint("請輸入畢業學校，例如：國立高雄科技大學 智慧商務系。");
        break;
      case "grade":
        setHint("請輸入畢業學年，例如：113。");
        break;
      case "student_id":
        setHint("請輸入學號，例如：S12345678。");
        break;
      default:
        setHint("");
        break;
    }
  };

  const handleBlur = () => {
    setHint(""); // 失焦時清空提示
  };



  // 當 parentData 變更時，更新 formData
  useEffect(() => {
    setFormData({
      ...parentData,
      graduate: parentData.graduate || { grade: '', school: '國立高雄科技大學智慧商務系', student_id: '' },
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
      {hint && (
        <div className="p-2 mb-3 bg-light text-secondary border rounded">
          {hint}
        </div>
      )}
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
                  onFocus={() => handleFocus("name")}
                  onBlur={handleBlur}
                />
                {errors.name && <div className="text-danger">{errors.name}</div>}
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
                  onFocus={() => handleFocus("home_phone")}
                  onBlur={handleBlur}
                />
                {errors.home_phone && <div className="text-danger">{errors.home_phone}</div>}
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
                  onFocus={() => handleFocus("mobile_phone")}
                  onBlur={handleBlur}
                />
                {errors.mobile_phone && <div className="text-danger">{errors.mobile_phone}</div>}
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
                  onFocus={() => handleFocus("gender")}
                  onBlur={handleBlur}
                >
                  <option value="">選擇性別</option>
                  <option value="M">男性</option>
                  <option value="F">女性</option>
                  <option value="O">其他</option>
                </Form.Control>
                {errors.gender && <div className="text-danger">{errors.gender}</div>}
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
                  onFocus={() => handleFocus("birth_date")}
                  onBlur={handleBlur}
                />
                {errors.birth_date && <div className="text-danger">{errors.birth_date}</div>}
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
                  onFocus={() => handleFocus("address")}
                  onBlur={handleBlur}
                />
                {errors.address && <div className="text-danger">{errors.address}</div>}
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
                  value={formData.graduate?.grade || ''}
                  onChange={handleChange}
                  onFocus={() => handleFocus("graduate_year")}
                  onBlur={handleBlur}
                />
                {errors.graduate_year && <div className="text-danger">{errors.graduate_year}</div>}
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="graduate">
                <Form.Label>畢業學校</Form.Label>
                <Form.Control
                  type="text"
                  name="graduate"
                  value={formData.graduate?.school || ''}
                  onChange={handleChange}
                  onFocus={() => handleFocus("graduate")}
                  onBlur={handleBlur}
                />
                {errors.graduate && <div className="text-danger">{errors.graduate}</div>}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6}>
              <Form.Group controlId="student_id">
                <Form.Label>學號</Form.Label>
                <Form.Control
                  type="text"
                  name="student_id"
                  value={formData.graduate?.student_id || ''}
                  onChange={handleChange}
                  onFocus={() => handleFocus("student_id")}
                  onBlur={handleBlur}
                />
                {errors.student_id && <div className="text-danger">{errors.student_id}</div>}
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="photo">
                <Form.Label>照片</Form.Label>
                <Form.Control
                  type="file"
                  name="photo"
                  onChange={handleFileChange}
                  onFocus={() => handleFocus("photo")}
                  onBlur={handleBlur}
                />
                {errors.photo && <div className="text-danger">{errors.photo}</div>}
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
              onFocus={() => handleFocus("intro")}
              onBlur={handleBlur}
            />
            {errors.intro && <div className="text-danger">{errors.intro}</div>}
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
