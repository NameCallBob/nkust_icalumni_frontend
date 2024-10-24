import React from "react";
import { Form } from "react-bootstrap";

const ProductInfo = ({ company, handleInputChange }) => {
  return (
    <div>
      <h4 className="mb-4" style={{ fontWeight: "bold", fontSize: "1.5rem" }}>產品資料</h4>

      <Form.Group controlId="formProducts" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>販售商品</Form.Label>
        <Form.Control
          type="text"
          name="products"
          value={company.products}
          onChange={handleInputChange}
          style={{
            fontSize: "1.1rem",
            padding: "10px",
            borderRadius: "8px",
            borderColor: "#ced4da",
          }}
        />
      </Form.Group>

      <Form.Group controlId="formProductDescription" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>販售商品簡介</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="productDescription"
          value={company.productDescription}
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

export default ProductInfo;
