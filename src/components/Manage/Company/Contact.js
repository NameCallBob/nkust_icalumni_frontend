import React, { useState } from "react";
import { Form, Alert,Image, Row, Col } from "react-bootstrap";

const ContactInfo = ({ company, handleInputChange, handleFileChange }) => {
  const [errors, setErrors] = useState({
    website: "",
    email: "",
    phone_number: "",
  });

 // 限制可上傳的圖片格式與大小
 const handleFileValidation = (e) => {
  const file = e.target.files[0];
  if (file) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        photo: "僅支援 JPG, PNG, GIF 格式的圖片",
      }));
    } else if (file.size > maxSize) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        photo: "圖片大小不能超過 5MB",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, photo: "" }));
      handleFileChange(e);
    }
  }
};

  // 驗證輸入格式
 // 驗證輸入格式與必填欄位
 const handleValidation = (e) => {
  const { name, value } = e.target;
  let errorMsg = "";

  switch (name) {
    case "website":
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}(:\d+)?(\/.*)?$/;
      if (!value.trim()) {
        errorMsg = "公司網站為必填項目";
      } else if (!urlPattern.test(value)) {
        errorMsg = "請輸入有效的網址，例如 https://example.com";
      }
      break;

    case "email":
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        errorMsg = "聯絡信箱為必填項目";
      } else if (!emailPattern.test(value)) {
        errorMsg = "請輸入有效的電子郵件，例如 example@email.com";
      }
      break;

    case "phone_number":
      const phonePattern = /^\d{8,15}$/;
      if (!value.trim()) {
        errorMsg = "聯絡電話為必填項目";
      } else if (!phonePattern.test(value)) {
        errorMsg = "請輸入有效的電話號碼（8-15 位數字）";
      }
      break;

    case "address":
      if (!value.trim()) {
        errorMsg = "公司地點為必填項目";
      }
      break;

    default:
      break;
  }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  return (
    <div>
      {/* 公司網站 */}
      <Form.Group controlId="formWebsite" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>公司網站連結</Form.Label>
        <Form.Control
          type="url"
          name="website"
          value={company.website}
          onChange={handleInputChange}
          onBlur={handleValidation}
          isInvalid={!!errors.website}
          required
          placeholder="請輸入公司網站，例如：https://example.com"
          style={{ fontSize: "1.1rem", padding: "10px", borderRadius: "8px" }}
        />
        <Form.Control.Feedback type="invalid">{errors.website}</Form.Control.Feedback>
      </Form.Group>

      {/* 公司地點 */}
      <Form.Group controlId="formAddress" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>公司地點</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="address"
          value={company.address}
          onChange={handleInputChange}
          onBlur={handleValidation}
          isInvalid={!!errors.address}
          required
          placeholder="請輸入公司地址，例如：台北市信義區"
          style={{ fontSize: "1.1rem", padding: "10px", borderRadius: "8px" }}
        />
        <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
      </Form.Group>

      {/* 聯絡信箱 */}
      <Form.Group controlId="formEmail" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>聯絡信箱</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={company.email}
          onChange={handleInputChange}
          onBlur={handleValidation}
          isInvalid={!!errors.email}
          required
          placeholder="請輸入聯絡信箱，例如：info@example.com"
          style={{ fontSize: "1.1rem", padding: "10px", borderRadius: "8px" }}
        />
        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
      </Form.Group>

      {/* 聯絡電話 */}
      <Form.Group controlId="formPhoneNumber" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>聯絡電話</Form.Label>
        <Form.Control
          type="text"
          name="phone_number"
          value={company.phone_number}
          onChange={handleInputChange}
          onBlur={handleValidation}
          isInvalid={!!errors.phone_number}
          required
          placeholder="請輸入聯絡電話，例如：0912345678"
          style={{ fontSize: "1.1rem", padding: "10px", borderRadius: "8px" }}
        />
        <Form.Control.Feedback type="invalid">{errors.phone_number}</Form.Control.Feedback>
      </Form.Group>

      {/* 公司照片上傳 */}
      <Form.Group controlId="formPhoto" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>公司照片</Form.Label>
        <Form.Control
          type="file"
          name="photo"
          accept="image/jpeg, image/png, image/gif"
          onChange={handleFileValidation}
          isInvalid={!!errors.photo}
          style={{ padding: "10px", borderRadius: "8px" }}
        />
        <Form.Control.Feedback type="invalid">{errors.photo}</Form.Control.Feedback>
      </Form.Group>

      {/* 圖片預覽標題 */}
      <h3 className="text-center mt-4 mb-3">圖片預覽</h3>

      {/* 照片預覽區塊 */}
      <div className="mb-4 text-center">
        <Row className="mb-3 text-center">
          <Col xs={12} md={6}>
            <h4>使用者上傳照片</h4>
          </Col>
          <Col xs={12} md={6}>
            <h4>官網照片預覽</h4>
          </Col>
        </Row>
        <Row className="text-center">
          <Col xs={12} md={6} className="mb-3">
            {company.photo_url ? (
              <Image
                src={process.env.REACT_APP_BASE_URL + company.photo_url}
                alt="公司照片"
                fluid
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  borderRadius: "8px",
                  border: "1px solid #ced4da",
                }}
              />
            ) : (
              <Alert variant="warning">尚未上傳公司照片</Alert>
            )}
          </Col>
          <Col xs={12} md={6} className="mb-3">
          {company.photo_url ? (
            <Image
              src={process.env.REACT_APP_BASE_URL + company.photo_url}
              rounded
              fluid
              style={{ width: "100%", maxWidth: "400px", height: "300px", objectFit: "cover" }}
              alt="若此照片"
            /> ) : (
              <Alert variant="warning">尚未上傳公司照片</Alert>
            )}
          </Col>
        </Row>
      <p className="text-center">請上傳方形照片，避免裁切影響顯示效果</p>
      </div>

    </div>
  );
};

export default ContactInfo;
