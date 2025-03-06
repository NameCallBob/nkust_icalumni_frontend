import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Carousel } from 'react-bootstrap';
import "css/user/poster.css"
import LoadingSpinner from 'components/LoadingSpinner';

const PosterModal = () => {
  const [show, setShow] = useState(false); // 控制 Modal 顯示
  const [posterImages, setPosterImages] = useState([]); // 存放海報資料
  const [loading, setLoading] = useState(true); // 用於顯示 Loading

  useEffect(() => {
    const hasSeenPoster = localStorage.getItem('hasSeenPoster');

    // 使用 Axios 從 API 取得資料
    const fetchPosters = async () => {
      try {
        const response = await Axios().get('/picture/popup-ads/?active=true');
        const images = response.data.results || [];
        setPosterImages(images);

        // 若有圖片且使用者尚未看過，則顯示彈窗
        if (images.length > 0 && !hasSeenPoster) {
          setShow(true);
          localStorage.setItem('hasSeenPoster', 'true');
        }
      } catch (err) {
        console.error("Error fetching posters:", err);
      } finally {
        setLoading(false); // API 請求完成後停止 Loading
      }
    };

    fetchPosters();
  }, []);

  const handleClose = () => setShow(false);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      backdrop="static"
      contentClassName="custom-modal-content"
    >
      <Button
        variant="light"
        className="close-btn"
        onClick={handleClose}
        aria-label="Close"
      >
        ✖
      </Button>
      <Modal.Body className="p-0 custom-modal-body">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Carousel>
            {posterImages.map((image, index) => (
              <Carousel.Item key={index}>
                <div
                  style={{
                    width: '30vw',
                    margin: 'auto',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={image.image} // 假設 API 回傳的物件有 `image` 欄位
                    alt={`Poster ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PosterModal;
