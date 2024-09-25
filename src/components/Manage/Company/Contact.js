import React from "react";
import { Form } from "react-bootstrap";

const ContactInfo = ({ company, handleInputChange, handleFileChange }) => {
  return (
    <div>
      <h4>聯絡資訊</h4>
      <Form.Group controlId="formWebsite" className="mb-3">
        <Form.Label>公司網站連結</Form.Label>
        <Form.Control
          type="url"
          name="website"
          value={company.website}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formAddress" className="mb-3">
        <Form.Label>公司地點</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="address"
          value={company.address}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formEmail" className="mb-3">
        <Form.Label>聯絡信箱</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={company.email}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formPhoneNumber" className="mb-3">
        <Form.Label>聯絡電話</Form.Label>
        <Form.Control
          type="text"
          name="phoneNumber"
          value={company.phoneNumber}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formPhoto" className="mb-3">
        <Form.Label>照片</Form.Label>
        <Form.Control type="file" name="photo" onChange={handleFileChange} />
      </Form.Group>
    </div>
  );
};

export default ContactInfo;
