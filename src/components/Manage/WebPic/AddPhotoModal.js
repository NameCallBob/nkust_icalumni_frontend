import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddPhotoModal = ({ show, onClose, onAdd, editSlide }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (editSlide) {
      setPreview(editSlide.image);
      setName(editSlide.name);
      setDescription(editSlide.description);
      setIsActive(editSlide.is_active);
    } else {
      setPreview("");
      setName("");
      setDescription("");
      setIsActive(true);
    }
  }, [editSlide]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile));
  };

  const handleAdd = () => {
    if (name) {
      const slideData = {
        image: file ? preview : editSlide?.image,
        name,
        description,
        active: isActive,
      };
      onAdd(slideData);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editSlide ? "編輯照片" : "新增照片"}</Modal.Title>
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
          <Form.Group controlId="formName" className="mb-3">
            <Form.Label>名稱</Form.Label>
            <Form.Control
              type="text"
              placeholder="輸入名稱"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          <Form.Group controlId="formActive" className="mb-3">
            <Form.Check
              type="checkbox"
              label="啟用"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          取消
        </Button>
        <Button variant="primary" onClick={handleAdd}>
          {editSlide ? "儲存修改" : "新增"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPhotoModal;
