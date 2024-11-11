import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import CategorySelector from "components/Manage/WebPic/CategorySelector";
import PreviewPanel from "components/Manage/WebPic/PreviewPanel";
import AddPhotoModal from "components/Manage/WebPic/AddPhotoModal";
import Axios from "common/Axios";

const WebPicManager = () => {
  const [selectedCategory, setSelectedCategory] = useState("廣告設置");
  const [slides, setSlides] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (selectedCategory === "主頁輪播"){
        Axios().get("/picture/slide-images/all/")
        .then((res) => {
            setSlides(res.data)
        })
    }
  },[selectedCategory])

  const handleAddSlide = (slide) => {
    setSlides([...slides, { ...slide, id: slides.length + 1 }]);
  };

  const handleDeleteSlide = (id) => {
    setSlides(slides.filter((slide) => slide.id !== id));
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
            onDeleteSlide={handleDeleteSlide}
          />
        </Col>
      </Row>
      <AddPhotoModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddSlide}
      />
    </Container>
  );
};

export default WebPicManager;
