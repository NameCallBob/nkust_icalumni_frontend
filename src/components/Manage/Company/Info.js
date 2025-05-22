import React from "react";
import { Form, Row, Col, InputGroup, FormText } from "react-bootstrap";

const CompanyInfo = ({ company, handleInputChange }) => {
  return (
    <div>
      <Row>
        <Col sm={12}>
          <Form.Group controlId="formName" className="mb-4">
            <Form.Label style={{ fontSize: "18px", fontWeight: "500" }}>
              公司名稱
            </Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <span className="text-primary">💼</span>
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="name"
                value={company.name}
                onChange={handleInputChange}
                placeholder="例如：台灣創新科技有限公司"
                style={{
                  fontSize: "16px",
                  padding: "12px",
                  borderRadius: "8px",
                }}
              />
            </InputGroup>
            <FormText className="text-muted mt-2" style={{ fontSize: "14px" }}>
              <span>✅ 提示：輸入您的公司完整名稱，這將顯示在您的公司資料頁面和搜尋結果中。</span>
            </FormText>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="formPositions" className="mb-4">
        <Form.Label style={{ fontSize: "18px", fontWeight: "500" }}>
          主要職位
        </Form.Label>
        <InputGroup>
          <InputGroup.Text>
            <span className="text-primary">👥</span>
          </InputGroup.Text>
          <Form.Control
            type="text"
            name="positions"
            value={company.positions}
            onChange={handleInputChange}
            placeholder="例如：工程師、業務經理、客服專員"
            style={{
              fontSize: "16px",
              padding: "12px",
              borderRadius: "8px",
            }}
          />
        </InputGroup>
        <FormText className="text-muted mt-2" style={{ fontSize: "14px" }}>
          <span>✅ 提示：請列出公司的主要職位，多個職位請用逗號「，」分隔。</span>
        </FormText>
      </Form.Group>

      <Form.Group controlId="formDescription" className="mb-4">
        <Form.Label style={{ fontSize: "18px", fontWeight: "500" }}>
          公司簡介
        </Form.Label>
        <InputGroup>
          <InputGroup.Text>
            <span className="text-primary">📝</span>
          </InputGroup.Text>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={company.description}
            onChange={handleInputChange}
            placeholder="簡單介紹您的公司，例如：我們是一家專注於提供創新科技解決方案的公司，成立於2010年..."
            style={{
              fontSize: "16px",
              padding: "12px",
              borderRadius: "8px",
            }}
          />
        </InputGroup>
        <FormText className="text-muted mt-2" style={{ fontSize: "14px" }}>
          <span>✅ 提示：簡短描述您的公司背景、主要業務和特色，可讓潛在客戶更加了解您。建議寫100-300字。</span>
        </FormText>
      </Form.Group>
    </div>
  );
};

export default CompanyInfo;