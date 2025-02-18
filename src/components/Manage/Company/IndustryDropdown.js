import React, { useState } from "react";
import { Form } from "react-bootstrap";

const IndustryDropdown = ({ industries, company, handleInputChange }) => {
  const [error, setError] = useState(false);

  const validateField = (e) => {
    setError(e.target.value.trim() === ""); // 若選項為空則設定錯誤狀態
  };

  return (
    <div>
      <Form.Group controlId="formIndustry" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>行業分類</Form.Label>
        <Form.Control
          as="select"
          name="industry"
          value={company.industry}
          onChange={handleInputChange}
          onBlur={validateField}
          isInvalid={error}
          required
          style={{
            fontSize: "1.1rem",
            padding: "10px",
            borderRadius: "8px",
            borderColor: "#ced4da",
          }}
        >
          <option value="">請選擇行業分類</option>
          {industries.map((industry) => (
            <option key={industry.id} value={industry.title}>
              {industry.title}
            </option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">請選擇行業分類。</Form.Control.Feedback>
      </Form.Group>
    </div>
  );
};

export default IndustryDropdown;
