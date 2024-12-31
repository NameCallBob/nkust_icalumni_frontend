import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Carousel } from 'react-bootstrap';
import "css/user/poster.css"
import LoadingSpinner from 'components/LoadingSpinner';
const PosterModal = () => {
  const [show, setShow] = useState(false); // 控制 Modal 顯示
  const [posterImages, setPosterImages] = useState([]); // 存放海報資料

  useEffect(() => {
    // 判斷是否是第一次進入頁面
    const hasSeenPoster = localStorage.getItem('hasSeenPoster');

        // 使用 Axios 從 API 取得資料
        const fetchPosters = async () => {
          try {
            const response = await Axios().get('/picture/popup-ads/?active=true'); // 替換為實際的 API 路徑
            setPosterImages(response.data.results); // 假設 API 回傳的資料為圖片 URL 的陣列
          } catch (error) {
            console.error('Error fetching posters:', error);
          }
        };

    if (!hasSeenPoster) {
      setShow(true); // 顯示彈跳視窗
      localStorage.setItem('hasSeenPoster', 'true'); // 記錄已看過狀態
      fetchPosters();
    }

  }, []);

  const handleClose = () => setShow(false);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg" // 彈跳廣告大小
      backdrop="static" // 禁止點擊背景關閉
      contentClassName="custom-modal-content" // 自定義樣式
    >
      {/* 自定義右上角的關閉按鈕 */}
      <Button
        variant="light"
        className="close-btn"
        onClick={handleClose}
        aria-label="Close"
      >
        ✖
      </Button>
      <Modal.Body className="p-0 custom-modal-body">
        {posterImages.length > 0 ? (
          <Carousel>
            {posterImages.map((image, index) => (
              <Carousel.Item key={index}>
                <div
                  style={{
                    width: '30vw',
                    margin: 'auto',
                    overflow: 'cover',
                  }}
                >
                  <img
                    src={image.image} // 假設 API 回傳的物件有 `url` 欄位
                    alt={`Poster ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover', // 確保圖片按比例填滿
                    }}
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
        <LoadingSpinner />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PosterModal;
