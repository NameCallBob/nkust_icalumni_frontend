import React, { useState ,useEffect} from "react";
import { Carousel, Modal, Button } from "react-bootstrap";
import Axios from "common/Axios";
import PicAxios from "common/PicAxios"
import LoadingSpinner from "components/LoadingSpinner";


/**
 * 照片輪播
 */
function Slide() {
  const [showModal, setShowModal] = useState(false);
  const [slideImage , setSlideImage] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true); // 管理加載狀態

  const handleImageClick = (image) => {
    let back_image = PicAxios().get(image)
    setSelectedImage(back_image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    Axios().get("/picture/slide-images/active/")
    .then((res) => {
      setSlideImage(res.data)
      setLoading(false); // 加載完成，隱藏動畫
    })

  },[])

  return (
    <div style={{ width: "100%" }}>
    {loading ? (
          <LoadingSpinner></LoadingSpinner>
      ) : (
        <Carousel>
          {slideImage.map((slide) => (
            <Carousel.Item key={slide.id}>
              <img
                className="d-block w-100"
                src={process.env.REACT_APP_BASE_URL+slide.image}
                alt={slide.name}
                style={{ height: "60vh", objectFit: "cover", margin: "0 auto", cursor: "pointer" }}
                onClick={() => handleImageClick(slide.image)} // 點擊圖片放大
              />
              <Carousel.Caption
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  padding: "10px",
                }}
              >
                <p style={{fontSize : "18pt"}}>{slide.title}</p>
                <p>{slide.description}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}

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
