import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const CompanyInfo = ({ company, handleInputChange }) => {
  return (
    <div>
      <h4>公司基本資料</h4>
      <Row>
        <Col sm={12}>
          <Form.Group controlId="formName" className="mb-3">
            <Form.Label>公司名稱</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={company.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col sm={12}>
          <Form.Group controlId="formMember" className="mb-3">
            <Form.Label>會員</Form.Label>
            <Form.Control
              type="text"
              name="member"
              value={company.member}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="formPositions" className="mb-3">
        <Form.Label>公司在職職位</Form.Label>
        <Form.Control
          type="text"
          name="positions"
          value={company.positions}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formDescription" className="mb-3">
        <Form.Label>公司簡介</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={company.description}
          onChange={handleInputChange}
        />
      </Form.Group>
    </div>
  );
};

export default CompanyInfo;
