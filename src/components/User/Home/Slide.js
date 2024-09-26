import React, { useState } from "react";
import { Carousel, Modal, Button } from "react-bootstrap";

// Test Pic
import image1 from "assets/slide/326431594_911615443529376_4304352214119373700_n.jpg";
import image2 from "assets/slide/403151410_742061697959924_82251486996955370_n.jpg";
import image3 from "assets/slide/403953713_742061541293273_382114322976831463_n.jpg";
import image4 from "assets/slide/manipic.jpg";

/**
 * 照片輪播
 */
function Slide() {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  return (
    <div style={{ width: "100%" }}>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image4}
            alt="First slide"
            style={{ height: "50vh", objectFit: "cover", margin: "0 auto", cursor: "pointer" }}
            onClick={() => handleImageClick(image4)} // 點擊圖片放大
          />
          <Carousel.Caption
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              color: "white",
              padding: "10px",
            }}
          >
            {/* <h3>招生</h3> */}
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image1}
            alt="First slide"
            style={{ height: "50vh", objectFit: "cover", margin: "0 auto", cursor: "pointer" }}
            onClick={() => handleImageClick(image1)} // 點擊圖片放大
          />
          <Carousel.Caption
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              color: "white",
              padding: "10px",
            }}
          >
            <h3>會長交接大合照</h3>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image2}
            alt="Second slide"
            style={{ height: "50vh", objectFit: "cover", margin: "0 auto", cursor: "pointer" }}
            onClick={() => handleImageClick(image2)} // 點擊圖片放大
          />
          <Carousel.Caption
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              color: "white",
              padding: "10px",
            }}
          >
            <h3>校外參訪合照</h3>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image3}
            alt="Third slide"
            style={{ height: "50vh", objectFit: "cover", margin: "0 auto", cursor: "pointer" }}
            onClick={() => handleImageClick(image3)} // 點擊圖片放大
          />
          <Carousel.Caption
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              color: "white",
              padding: "10px",
            }}
          >
            <h4>112年度秋季「企業參訪暨聯誼交流」活動</h4>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Modal for image zoom */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg" // 使用 lg 作為基礎尺寸
        dialogClassName="modal-80w" // 使用自定義 class
      >
        <Modal.Header closeButton>
          <Modal.Title>查看圖片</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && <img src={selectedImage} alt="Selected" className="w-100" />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            關閉
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Slide;
