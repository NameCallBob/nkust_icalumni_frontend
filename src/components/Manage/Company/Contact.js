import React from "react";
import { Form } from "react-bootstrap";

const ContactInfo = ({ company, handleInputChange, handleFileChange }) => {
  return (
    <div>
      <h4 className="mb-4" style={{ fontWeight: "bold", fontSize: "1.5rem" }}>聯絡資訊</h4>
      
      <Form.Group controlId="formWebsite" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>公司網站連結</Form.Label>
        <Form.Control
          type="url"
          name="website"
          value={company.website}
          onChange={handleInputChange}
          style={{
            fontSize: "1.1rem",
            padding: "10px",
            borderRadius: "8px",
            borderColor: "#ced4da",
          }}
        />
      </Form.Group>

      <Form.Group controlId="formAddress" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>公司地點</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="address"
          value={company.address}
          onChange={handleInputChange}
          style={{
            fontSize: "1.1rem",
            padding: "10px",
            borderRadius: "8px",
            borderColor: "#ced4da",
          }}
        />
      </Form.Group>

      <Form.Group controlId="formEmail" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>聯絡信箱</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={company.email}
          onChange={handleInputChange}
          style={{
            fontSize: "1.1rem",
            padding: "10px",
            borderRadius: "8px",
            borderColor: "#ced4da",
          }}
        />
      </Form.Group>

      <Form.Group controlId="formPhoneNumber" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>聯絡電話</Form.Label>
        <Form.Control
          type="text"
          name="phoneNumber"
          value={company.phoneNumber}
          onChange={handleInputChange}
          style={{
            fontSize: "1.1rem",
            padding: "10px",
            borderRadius: "8px",
            borderColor: "#ced4da",
          }}
        />
      </Form.Group>

      <Form.Group controlId="formPhoto" className="mb-4">
        <Form.Label style={{ fontSize: "1.2rem" }}>公司照片</Form.Label>
        <Form.Control 
          type="file" 
          name="photo" 
          onChange={handleFileChange}
          style={{
            padding: "10px",
            borderRadius: "8px",
            borderColor: "#ced4da",
          }} 
        />
      </Form.Group>
    </div>
  );
};

export default ContactInfo;
