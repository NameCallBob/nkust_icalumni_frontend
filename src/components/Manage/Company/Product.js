import React from "react";
import { Form, InputGroup, FormText, Card } from "react-bootstrap";

const ProductInfo = ({ company, handleInputChange }) => {
  return (
    <div>
      <Form.Group controlId="formProducts" className="mb-4">
        <Form.Label style={{ fontSize: "18px", fontWeight: "500" }}>
          產品或服務名稱
        </Form.Label>
        <InputGroup>
          <InputGroup.Text>
            <span className="text-primary">🛒</span>
          </InputGroup.Text>
          <Form.Control
            type="text"
            name="products"
            value={company.products}
            onChange={handleInputChange}
            placeholder="例如：智慧家電、企業顧問服務、有機食品"
            style={{
              fontSize: "16px",
              padding: "12px",
              borderRadius: "8px",
            }}
          />
        </InputGroup>
        <FormText className="text-muted mt-2" style={{ fontSize: "14px" }}>
          <span>✅ 提示：列出您主要的產品或服務名稱，多項請用逗號「，」分隔。</span>
        </FormText>
      </Form.Group>
      
      <Form.Group controlId="formProductDescription" className="mb-4">
        <Form.Label style={{ fontSize: "18px", fontWeight: "500" }}>
          產品或服務簡介
        </Form.Label>
        <InputGroup>
          <InputGroup.Text>
            <span className="text-primary">📋</span>
          </InputGroup.Text>
          <Form.Control
            as="textarea"
            rows={3}
            name="product_description"
            value={company.product_description}
            onChange={handleInputChange}
            placeholder="簡單描述您的產品或服務特色、優勢和用途..."
            style={{
              fontSize: "16px",
              padding: "12px",
              borderRadius: "8px",
            }}
          />
        </InputGroup>
        <FormText className="text-muted mt-2" style={{ fontSize: "14px" }}>
          <span>✅ 提示：簡短描述您的產品或服務的特色和優勢。</span><br/>
          <span>註：未來系統有專門的產品詳細頁面，此處只需簡單介紹即可。</span>
        </FormText>
      </Form.Group>
      
      <Card className="bg-light mb-3">
        <Card.Body>
          <Card.Title style={{ fontSize: "16px" }}>產品描述撰寫小技巧</Card.Title>
          <Card.Text>
            <ul>
              <li>簡單明瞭地說明產品或服務的主要功能</li>
              <li>提及您與競爭對手的差異化優勢</li>
              <li>說明產品或服務如何解決客戶的問題</li>
              <li>避免使用太多專業術語，讓一般人也能理解</li>
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductInfo;