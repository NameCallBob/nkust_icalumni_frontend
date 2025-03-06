import React, { useState } from "react";
import { Form } from "react-bootstrap";

const ProductInfo = ({ company, handleInputChange }) => {
  const [errors, setErrors] = useState({
    products: false,
    product_description: false,
  });

  const validateField = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() === "", // 若值為空則標記錯誤
    }));
  };

  return (
    <div>
      <Form.Group controlId="formProducts" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>販售商品</Form.Label>
        <Form.Control
          type="text"
          name="products"
          value={company.products}
          onChange={handleInputChange}
          onBlur={validateField}
          isInvalid={errors.products}
          required
          placeholder="請輸入販售商品"
          style={{
            fontSize: "1.1rem",
            padding: "10px",
            borderRadius: "8px",
            borderColor: "#ced4da",
          }}
        />
        <Form.Control.Feedback type="invalid">販售商品為必填項目。</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formProductDescription" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>販售商品簡介</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="product_description"
          value={company.product_description}
          onChange={handleInputChange}
          onBlur={validateField}
          isInvalid={errors.product_description}
          required
          placeholder="請簡單描述產品。註：有頁面可以添加多商品呈現，此只要簡單描述。"
          style={{
            fontSize: "1.1rem",
            padding: "10px",
            borderRadius: "8px",
            borderColor: "#ced4da",
          }}
        />
        <Form.Control.Feedback type="invalid">販售商品簡介為必填項目。</Form.Control.Feedback>
      </Form.Group>
    </div>
  );
};

export default ProductInfo;
