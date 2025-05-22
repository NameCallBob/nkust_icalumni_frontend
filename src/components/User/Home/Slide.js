import React, { useState, useEffect, useRef } from "react";
import { Carousel, Modal, Button } from "react-bootstrap";
import { ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, X, Info } from "lucide-react";
import Axios from "common/Axios";
import LoadingSpinner from "components/LoadingSpinner";

/**
 * 增強版照片輪播元件
 * 添加了以下功能：
 * 1. 圖片放大縮小控制
 * 2. 圖片下載功能
 * 3. 改進的加載體驗
 * 4. 全螢幕查看模式
 * 5. 鍵盤快捷鍵支持
 * 6. 手勢支持（行動裝置）
 */
function Slide() {
  const [showModal, setShowModal] = useState(false);
  const [slideImage, setSlideImage] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showInfo, setShowInfo] = useState(true);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef(null);
  
  const fallbackImage = {
    id: 0,
    image: "/images/活動整理中.png",
    title: "活動整理中",
    description: "目前沒有活動照片",
  };

  // 處理圖片點擊，顯示模態框
  const handleImageClick = (image, index) => {
    setSelectedImage(image.startsWith("/images/") ? image : process.env.REACT_APP_BASE_URL + image);
    setSelectedIndex(index);
    setShowModal(true);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // 關閉模態框
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // 放大圖片
  const handleZoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel(prev => Math.min(prev + 0.25, 3));
      setPosition({ x: 0, y: 0 }); // 重置位置
    }
  };

  // 縮小圖片
  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
      setPosition({ x: 0, y: 0 }); // 重置位置
    }
  };

  // 下載當前圖片
  const handleDownload = () => {
    if (!selectedImage) return;
    
    const link = document.createElement('a');
    link.href = selectedImage;
    link.download = `image-${slideImage[selectedIndex]?.title || 'download'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 切換到下一張圖片
  const handleNextImage = () => {
    if (slideImage.length <= 1) return;
    const nextIndex = (selectedIndex + 1) % slideImage.length;
    const nextImage = slideImage[nextIndex];
    setSelectedIndex(nextIndex);
    setSelectedImage(nextImage.image.startsWith("/images/") 
      ? nextImage.image 
      : process.env.REACT_APP_BASE_URL + nextImage.image);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // 切換到上一張圖片
  const handlePrevImage = () => {
    if (slideImage.length <= 1) return;
    const prevIndex = selectedIndex === 0 ? slideImage.length - 1 : selectedIndex - 1;
    const prevImage = slideImage[prevIndex];
    setSelectedIndex(prevIndex);
    setSelectedImage(prevImage.image.startsWith("/images/") 
      ? prevImage.image 
      : process.env.REACT_APP_BASE_URL + prevImage.image);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // 切換資訊顯示
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  // 處理鍵盤事件
  const handleKeyDown = (e) => {
    if (!showModal) return;
    
    switch (e.key) {
      case 'Escape':
        handleCloseModal();
        break;
      case 'ArrowLeft':
        handlePrevImage();
        break;
      case 'ArrowRight':
        handleNextImage();
        break;
      case '+':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
      case 'i':
        toggleInfo();
        break;
      default:
        break;
    }
  };

  // 處理滑鼠滾輪縮放
  const handleWheel = (e) => {
    if (!showModal) return;
    e.preventDefault();
    
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // 拖動開始
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  // 觸控開始
  const handleTouchStart = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  // 拖動中
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setPosition(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // 觸控移動
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    
    setPosition(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  // 拖動結束
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 觸控結束
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 雙擊切換縮放
  const handleDoubleClick = () => {
    if (zoomLevel > 1) {
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setZoomLevel(2);
    }
  };

  // 加載圖片數據
  useEffect(() => {
    Axios()
      .get("/picture/slide-images/active/")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setSlideImage(res.data);
        } else {
          setSlideImage([fallbackImage]);
        }
        setLoading(false);
      })
      .catch(() => {
        setSlideImage([fallbackImage]);
        setLoading(false);
      });
  }, []);

  // 註冊鍵盤事件
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal, selectedIndex]);

  // 防止頁面滾動當模態框開啟時
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  return (
    <div style={{ width: "100%" }} className="enhanced-slide-container">
      {loading ? (
        <div className="text-center py-5">
          <LoadingSpinner />
          <p className="mt-3">正在加載精彩照片...</p>
        </div>
      ) : (
        <Carousel 
          interval={5000}
          pause="hover"
          indicators={slideImage.length > 1}
          controls={slideImage.length > 1}
          className="enhanced-carousel"
        >
          {slideImage.map((slide, index) => (
            <Carousel.Item key={slide.id}>
              <div className="slide-image-container">
                <img
                  className="d-block w-100"
                  src={
                    slide.image.startsWith("/images/")
                      ? slide.image
                      : process.env.REACT_APP_BASE_URL + slide.image
                  }
                  alt={slide.title || "圖片"}
                  style={{
                    width : "100vh",
                    height: "70vh",
                    objectFit: "cover",
                    margin: "0 auto",
                    cursor: "pointer",
                    transition: "transform 0.3s ease"
                  }}
                  onClick={() => handleImageClick(slide.image, index)}
                  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
                {(slide.title || slide.description) && (
                  <Carousel.Caption
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      color: "white",
                      padding: "15px",
                      borderRadius: "8px",
                      maxWidth: "80%",
                      margin: "0 auto",
                      bottom: "20px"
                    }}
                  >
                    {slide.title && <h3 style={{ fontSize: "22px", fontWeight: "bold" }}>{slide.title}</h3>}
                    {slide.description && <p style={{ fontSize: "16px" }}>{slide.description}</p>}
                  </Carousel.Caption>
                )}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      {/* 增強的圖片查看模態框 */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="xl"
        dialogClassName="image-viewer-modal"
        contentClassName="bg-dark"
      >
        <Modal.Header className="bg-dark text-white border-0">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="image-counter">
              {slideImage.length > 1 && (
                <span>{selectedIndex + 1} / {slideImage.length}</span>
              )}
            </div>
            <div className="control-buttons">
              <Button 
                variant="outline-light" 
                size="sm" 
                className="mx-1" 
                onClick={toggleInfo}
                title="顯示/隱藏資訊"
              >
                <Info size={18} />
              </Button>
              <Button 
                variant="outline-light" 
                size="sm" 
                className="mx-1" 
                onClick={handleZoomIn}
                title="放大"
              >
                <ZoomIn size={18} />
              </Button>
              <Button 
                variant="outline-light" 
                size="sm" 
                className="mx-1" 
                onClick={handleZoomOut}
                title="縮小"
              >
                <ZoomOut size={18} />
              </Button>
              <Button 
                variant="outline-light" 
                size="sm" 
                className="mx-1" 
                onClick={handleDownload}
                title="下載圖片"
              >
                <Download size={18} />
              </Button>
              <Button 
                variant="outline-light" 
                size="sm" 
                className="mx-1" 
                onClick={handleCloseModal}
                title="關閉"
              >
                <X size={18} />
              </Button>
            </div>
          </div>
        </Modal.Header>
        
        <Modal.Body className="p-0 bg-dark text-white position-relative">
          <div 
            className="image-viewer-container" 
            onWheel={handleWheel}
          >
            {selectedImage && (
              <>
                {slideImage.length > 1 && (
                  <>
                    <Button 
                      variant="dark" 
                      className="nav-button prev-button" 
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft size={24} />
                    </Button>
                    <Button 
                      variant="dark" 
                      className="nav-button next-button" 
                      onClick={handleNextImage}
                    >
                      <ChevronRight size={24} />
                    </Button>
                  </>
                )}
                
                <div 
                  className="zoom-container"
                  style={{ 
                    overflow: 'hidden',
                    width: '100%',
                    height: '70vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <img
                    ref={imageRef}
                    src={selectedImage}
                    alt="Selected"
                    className="viewer-image"
                    style={{
                      transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                      transition: isDragging ? 'none' : 'transform 0.2s ease',
                      cursor: zoomLevel > 1 ? 'grab' : 'default',
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onDoubleClick={handleDoubleClick}
                    draggable="false"
                  />
                </div>
                
                {showInfo && slideImage[selectedIndex] && (slide => slide.title || slide.description)(slideImage[selectedIndex]) && (
                  <div className="image-info p-3">
                    {slideImage[selectedIndex].title && (
                      <h4>{slideImage[selectedIndex].title}</h4>
                    )}
                    {slideImage[selectedIndex].description && (
                      <p>{slideImage[selectedIndex].description}</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="zoom-level-indicator">
            {zoomLevel !== 1 && `${Math.round(zoomLevel * 100)}%`}
          </div>
        </Modal.Body>
        
        <Modal.Footer className="bg-dark text-white border-0">
          <div className="zoom-controls w-100 d-flex justify-content-center">
            <Button 
              variant={zoomLevel <= 0.5 ? "secondary" : "outline-light"} 
              disabled={zoomLevel <= 0.5}
              onClick={handleZoomOut}
              className="mx-2"
            >
              -
            </Button>
            <div className="zoom-slider-container mx-2">
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.25"
                value={zoomLevel}
                onChange={(e) => {
                  setZoomLevel(parseFloat(e.target.value));
                  setPosition({ x: 0, y: 0 });
                }}
                className="zoom-slider"
              />
            </div>
            <Button 
              variant={zoomLevel >= 3 ? "secondary" : "outline-light"} 
              disabled={zoomLevel >= 3}
              onClick={handleZoomIn}
              className="mx-2"
            >
              +
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      
      {/* 自定義CSS */}
      <style jsx>{`
        .enhanced-carousel {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .slide-image-container {
          position: relative;
          overflow: hidden;
        }
        
        .image-viewer-modal {
          max-width: 90vw;
        }
        
        .image-viewer-container {
          position: relative;
          width: 100%;
          background-color: #000;
        }
        
        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          opacity: 0.7;
        }
        
        .nav-button:hover {
          opacity: 1;
        }
        
        .prev-button {
          left: 10px;
        }
        
        .next-button {
          right: 10px;
        }
        
        .zoom-level-indicator {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background-color: rgba(0,0,0,0.6);
          color: white;
          padding: 5px 10px;
          border-radius: 12px;
          font-size: 14px;
        }
        
        .image-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(0,0,0,0.7);
          color: white;
          padding: 15px;
        }
        
        .zoom-slider {
          width: 150px;
        }
        
        .control-buttons button {
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        
        @media (max-width: 768px) {
          .control-buttons button {
            width: 32px;
            height: 32px;
          }
          
          .zoom-slider {
            width: 100px;
          }
        }
      `}</style>
    </div>
  );
}

export default Slide;