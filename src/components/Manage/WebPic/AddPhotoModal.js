import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddPhotoModal = ({ show, onClose, onAdd }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile));
  };

  const handleAdd = () => {
    if (file && title) {
      onAdd({ image: preview, title, description });
      setFile(null);
      setPreview("");
      setTitle("");
      setDescription("");
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>新增照片</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>上傳圖片</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          {preview && (
            <div className="mb-3">
              <img
                src={preview}
                alt="Preview"
                style={{ width: "100%", height: "auto", borderRadius: "5px" }}
              />
            </div>
          )}
          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label>標題</Form.Label>
            <Form.Control
              type="text"
              placeholder="輸入標題"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDescription" className="mb-3">
            <Form.Label>說明文字</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="輸入說明文字"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          取消
        </Button>
        <Button variant="primary" onClick={handleAdd}>
          新增
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPhotoModal;
