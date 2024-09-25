import React from "react";
import { Form } from "react-bootstrap";

const IndustryDropdown = ({ industries, company, handleInputChange }) => {
  return (
    <div>
      <h4>行業分類</h4>
      <Form.Group controlId="formIndustry" className="mb-3">
        <Form.Label>行業分類</Form.Label>
        <Form.Control
          as="select"
          name="industry"
          value={company.industry}
          onChange={handleInputChange}
          required
        >
          <option value="">請選擇行業分類</option>
          {industries.map((industry) => (
            <option key={industry.id} value={industry.id}>
              {industry.title}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </div>
  );
};

export default IndustryDropdown;
