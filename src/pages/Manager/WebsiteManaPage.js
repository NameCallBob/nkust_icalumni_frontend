// SlideManagement.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Toast, ToastContainer } from "react-bootstrap";
import CategorySelector from "components/Manage/WebPic/CategorySelector";
import PreviewPanel from "components/Manage/WebPic/PreviewPanel";
import AddPhotoModal from "components/Manage/WebPic/AddPhotoModal";
import Axios from "common/Axios";

const WebPicManager = () => {
  const [selectedCategory, setSelectedCategory] = useState("廣告設置");
  const [slides, setSlides] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editSlide, setEditSlide] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    
    Axios().get(`picture/slide-images/all/`)
      .then((response) => setSlides(response.data))
      .catch((error) => console.error("Failed to fetch slides", error));
      
  }, [selectedCategory]);

  const handleAddOrEditSlide = (slide) => {
    if (editSlide) {
      setSlides(
        slides.map((s) => (s.id === editSlide.id ? { ...s, ...slide } : s))
      );
      setToastMessage("Slide updated successfully.");
    } else {
      setSlides([...slides, { ...slide, id: Date.now() }]);
      setToastMessage("Slide added successfully.");
    }
    setShowToast(true);
    setEditSlide(null);
  };

  const handleDeleteSlide = (id) => {
    setSlides(slides.filter((slide) => slide.id !== id));
    setToastMessage("Slide deleted successfully.");
    setShowToast(true);
  };

  const handleEditSlide = (slide) => {
    setEditSlide(slide);
    setShowModal(true);
  };

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={3} className="border-end">
          <CategorySelector
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </Col>
        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>{selectedCategory}</h5>
            <Button variant="success" onClick={() => setShowModal(true)}>
              新增照片
            </Button>
          </div>
          <PreviewPanel
            slides={slides}
            category={selectedCategory}
            onEditSlide={handleEditSlide}
            onDeleteSlide={handleDeleteSlide}
          />
        </Col>
      </Row>
      <AddPhotoModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditSlide(null);
        }}
        onAdd={(slide) => {
          handleAddOrEditSlide(slide);
          setShowModal(false);
        }}
        editSlide={editSlide}
      />
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};


export default WebPicManager