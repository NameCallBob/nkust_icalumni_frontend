import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";

const CompanyInfo = ({ company, handleInputChange }) => {
  const [errors, setErrors] = useState({
    name: false,
    positions: false,
    description: false,
  });

  const validateField = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() === "", // 若值為空則設定錯誤狀態
    }));
  };

  return (
    <div>
      <Row>
        <Col sm={12}>
          <Form.Group controlId="formName" className="mb-4">
            <Form.Label style={{ fontSize: "1.2rem" }}>公司名稱</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={company.name}
              onChange={handleInputChange}
              onBlur={validateField}
              isInvalid={errors.name}
              required
              placeholder="請輸入公司名稱，例如：Tech Corp."
              style={{
                fontSize: "1.1rem",
                padding: "10px",
                borderRadius: "8px",
                borderColor: "#ced4da",
              }}
            />
            <Form.Control.Feedback type="invalid">公司名稱為必填項目。</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="formPositions" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>公司在職職位</Form.Label>
        <Form.Control
          type="text"
          name="positions"
          value={company.positions}
          onChange={handleInputChange}
          onBlur={validateField}
          isInvalid={errors.positions}
          required
          placeholder="請輸入公司內的職位，例如：軟體工程師、產品經理"
          style={{
            fontSize: "1.1rem",
            padding: "10px",
            borderRadius: "8px",
            borderColor: "#ced4da",
          }}
        />
        <Form.Control.Feedback type="invalid">公司職位為必填項目。</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formDescription" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>公司簡介</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="description"
          value={company.description}
          onChange={handleInputChange}
          onBlur={validateField}
          isInvalid={errors.description}
          required
          placeholder="請簡單介紹公司，例如：我們是一家專注於 AI 研發的科技公司..."
          style={{
            fontSize: "1.1rem",
            padding: "10px",
            borderRadius: "8px",
            borderColor: "#ced4da",
          }}
        />
        <Form.Control.Feedback type="invalid">公司簡介為必填項目。</Form.Control.Feedback>
      </Form.Group>
    </div>
  );
};

export default CompanyInfo;
