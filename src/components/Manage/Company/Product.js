import React from "react";
import { Form } from "react-bootstrap";

const ProductInfo = ({ company, handleInputChange }) => {
  return (
    <div>
      <h4>產品資料</h4>
      <Form.Group controlId="formProducts" className="mb-3">
        <Form.Label>販售商品</Form.Label>
        <Form.Control
          type="text"
          name="products"
          value={company.products}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formProductDescription" className="mb-3">
        <Form.Label>販售商品簡介</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="productDescription"
          value={company.productDescription}
          onChange={handleInputChange}
        />
      </Form.Group>
    </div>
  );
};

export default ProductInfo;
