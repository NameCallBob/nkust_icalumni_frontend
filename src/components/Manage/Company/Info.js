import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const CompanyInfo = ({ company, handleInputChange }) => {
  return (
    <div>
      <h4 className="mb-4" style={{ fontWeight: "bold", fontSize: "1.5rem" }}>公司基本資料</h4>
      <Row>
        <Col sm={12}>
          <Form.Group controlId="formName" className="mb-4">
            <Form.Label style={{ fontSize: "1.2rem" }}>公司名稱</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={company.name}
              onChange={handleInputChange}
              required
              style={{
                fontSize: "1.1rem",
                padding: "10px",
                borderRadius: "8px",
                borderColor: "#ced4da",
              }}
            />
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
          required
          style={{
            fontSize: "1.1rem",
            padding: "10px",
            borderRadius: "8px",
            borderColor: "#ced4da",
          }}
        />
      </Form.Group>

      <Form.Group controlId="formDescription" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>公司簡介</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="description"
          value={company.description}
          onChange={handleInputChange}
          style={{
            fontSize: "1.1rem",
            padding: "10px",
            borderRadius: "8px",
            borderColor: "#ced4da",
          }}
        />
      </Form.Group>
    </div>
  );
};

export default CompanyInfo;
