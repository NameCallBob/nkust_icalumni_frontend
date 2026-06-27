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
    // 檢查使用者是否已經看過海報
    const hasSeenPoster = localStorage.getItem('hasSeenPoster');
    
    // 使用 Axios 從 API 取得資料
    const fetchPosters = async () => {
      try {
        const response = await Axios().get('/picture/popup-ads/?active=true');
        const images = response.data.results || [];
        setPosterImages(images);

        // 只有當有圖片且使用者尚未看過時，才顯示彈窗並設置標記
        if (images.length > 0 && !hasSeenPoster) {
          setShow(true);
          // 只有在成功顯示彈窗時才設置已看過的標記
          localStorage.setItem('hasSeenPoster', 'true');
        } else {
          // 明確設置不顯示
          setShow(false);
        }
      } catch (err) {
        console.error("Error fetching posters:", err);
        // 在載入失敗時明確設置不顯示
        setShow(false);
      } finally {
        setLoading(false); // API 請求完成後停止 Loading
      }
    };

    fetchPosters();

    // 組件卸載時清理
    return () => {
      // 如果需要取消請求，可以在此處理
    };
  }, []);

  const handleClose = () => setShow(false);

  // 如果沒有圖片，則不渲染整個 Modal 組件
  if (posterImages.length === 0 && !loading) {
    return null;
  }

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
                    src={process.env.REACT_APP_BASE_URL+image.image} // 假設 API 回傳的物件有 `image` 欄位
                    alt={`Poster ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={() => {
                      // 圖片載入失敗時，移除該圖片
                      const newImages = [...posterImages];
                      newImages.splice(index, 1);
                      setPosterImages(newImages);
                      
                      // 如果移除後沒有圖片了，關閉 Modal
                      if (newImages.length === 0) {
                        setShow(false);
                      }
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