import React, { useState, useEffect, useRef } from "react";
import { Carousel, Modal, Button } from "react-bootstrap";
import {
  ZoomIn,
  ZoomOut,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Info,
  Grid,
  Globe,
} from "lucide-react";
import Axios from "common/Axios";
import LoadingSpinner from "components/LoadingSpinner";
import { handleImageError, getImageSrc } from "../../../utils/imageDefaults";

/**
 * 增強版照片輪播元件 v2.1
 * 修改功能：
 * 1. 移除複雜的自定義控制器，改用標準 Bootstrap 左右控制器。
 * 2. 新增右上角圖庫按鈕，點擊後以全螢幕網格模式顯示所有照片。
 * 3. 調整輪播標題位置，避免與控制器重疊。
 * 4. 優化整體樣式與使用者體驗。
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAllPhotosModal, setShowAllPhotosModal] = useState(false);
  const imageRef = useRef(null);
  const carouselRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fallbackImage = {
    id: 0,
    image: "/images/events-preparing.png",
    title: "活動整理中",
    description: "目前沒有活動照片",
  };

  // 處理圖片點擊，如果有連結則跳轉，否則顯示模態框
  const handleImageClick = (slide, index) => {
    if (slide.link_url) {
      window.open(slide.link_url, "_blank", "noopener,noreferrer");
      return;
    }
    const imageUrl = slide.image.startsWith("/images/")
      ? slide.image
      : process.env.REACT_APP_BASE_URL + slide.image;
    setSelectedImage(imageUrl);
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
      setZoomLevel((prev) => Math.min(prev + 0.25, 3));
      setPosition({ x: 0, y: 0 });
    }
  };

  // 縮小圖片
  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
      setPosition({ x: 0, y: 0 });
    }
  };

  // 下載當前圖片
  const handleDownload = () => {
    if (!selectedImage) return;
    const link = document.createElement("a");
    link.href = selectedImage;
    link.download = `image-${slideImage[selectedIndex]?.title || "download"}.jpg`;
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
    setSelectedImage(
      nextImage.image.startsWith("/images/")
        ? nextImage.image
        : process.env.REACT_APP_BASE_URL + nextImage.image,
    );
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // 切換到上一張圖片
  const handlePrevImage = () => {
    if (slideImage.length <= 1) return;
    const prevIndex =
      selectedIndex === 0 ? slideImage.length - 1 : selectedIndex - 1;
    const prevImage = slideImage[prevIndex];
    setSelectedIndex(prevIndex);
    setSelectedImage(
      prevImage.image.startsWith("/images/")
        ? prevImage.image
        : process.env.REACT_APP_BASE_URL + prevImage.image,
    );
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const toggleInfo = () => setShowInfo(!showInfo);

  const handleKeyDown = (e) => {
    if (!showModal) return;
    switch (e.key) {
      case "Escape":
        handleCloseModal();
        break;
      case "ArrowLeft":
        handlePrevImage();
        break;
      case "ArrowRight":
        handleNextImage();
        break;
      case "+":
        handleZoomIn();
        break;
      case "-":
        handleZoomOut();
        break;
      case "i":
        toggleInfo();
        break;
      default:
        break;
    }
  };

  const handleWheel = (e) => {
    if (!showModal) return;
    e.preventDefault();
    if (e.deltaY < 0) handleZoomIn();
    else handleZoomOut();
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleTouchStart = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleTouchEnd = () => setIsDragging(false);

  const handleDoubleClick = () => {
    if (zoomLevel > 1) {
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setZoomLevel(2);
    }
  };

  useEffect(() => {
    Axios()
      .get("/picture/slide-images/active/")
      .then((res) => {
        if (res.data && res.data.length > 0) setSlideImage(res.data);
        else setSlideImage([fallbackImage]);
        setLoading(false);
      })
      .catch(() => {
        setSlideImage([fallbackImage]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal, selectedIndex]);

  useEffect(() => {
    if (showModal || showAllPhotosModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal, showAllPhotosModal]);

  return (
    <div style={{ width: "100%" }} className="enhanced-slide-container">
      {loading ? (
        <div className="text-center py-5">
          <LoadingSpinner />
          <p className="mt-3">正在加載精彩照片...</p>
        </div>
      ) : (
        <>
          <Carousel
            ref={carouselRef}
            interval={4000}
            pause="hover"
            indicators={slideImage.length > 1}
            controls={slideImage.length > 1}
            activeIndex={currentSlide}
            onSelect={(selectedIndex) => setCurrentSlide(selectedIndex)}
            className="enhanced-carousel-v2"
          >
            {slideImage.map((slide, index) => (
              <Carousel.Item key={slide.id}>
                <div className="slide-image-container-v2">
                  <div className="image-wrapper-v2">
                    <img
                      loading="lazy"
                      className="carousel-image-v2"
                      src={getImageSrc(
                        slide.image.startsWith("/images/")
                          ? slide.image
                          : process.env.REACT_APP_BASE_URL + slide.image,
                        "activity",
                      )}
                      alt={slide.title || "圖片"}
                      onClick={() => handleImageClick(slide, index)}
                      onError={(e) => handleImageError(e, "activity")}
                      style={{ cursor: slide.link_url ? "pointer" : "zoom-in" }}
                    />
                    <div className="image-overlay-v2"></div>
                    {slide.link_url && (
                      <button
                        className="link-icon-top-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(slide.link_url, "_blank", "noopener,noreferrer");
                        }}
                        title="前往連結"
                      >
                        <Globe size={isMobile ? 18 : 22} />
                      </button>
                    )}
                  </div>
                  {(slide.title || slide.description) && (
                    <Carousel.Caption className="enhanced-caption">
                      {slide.title && <h3>{slide.title}</h3>}
                      {slide.description && <p>{slide.description}</p>}
                    </Carousel.Caption>
                  )}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>

          {slideImage.length > 1 && (
            <button
              className="thumbnail-control-top-right"
              onClick={() => setShowAllPhotosModal(true)}
              title="查看所有照片"
            >
              <Grid size={isMobile ? 18 : 22} />
            </button>
          )}

          <Modal
            show={showAllPhotosModal}
            onHide={() => setShowAllPhotosModal(false)}
            centered
            size="xl"
            dialogClassName="all-photos-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>所有照片</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="thumbnails-wrapper">
                {slideImage.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`thumbnail-item ${index === currentSlide ? "active" : ""}`}
                    onClick={() => {
                      setCurrentSlide(index);
                      setShowAllPhotosModal(false);
                    }}
                  >
                    <img
                      loading="lazy"
                      src={getImageSrc(
                        slide.image.startsWith("/images/")
                          ? slide.image
                          : process.env.REACT_APP_BASE_URL + slide.image,
                        "activity",
                      )}
                      alt={slide.title || `縮略圖 ${index + 1}`}
                      onError={(e) => handleImageError(e, "activity")}
                    />
                    <div className="thumbnail-overlay">
                      <span>{index + 1}</span>
                    </div>
                    {slide.link_url && (
                      <button
                        className="link-icon-top-left thumbnail-link-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(slide.link_url, "_blank", "noopener,noreferrer");
                        }}
                        title="前往連結"
                      >
                        <Globe size={isMobile ? 14 : 18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}

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
                <span>
                  {selectedIndex + 1} / {slideImage.length}
                </span>
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
          <div className="image-viewer-container" onWheel={handleWheel}>
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
                    overflow: "hidden",
                    width: "100%",
                    height: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    ref={imageRef}
                    src={getImageSrc(selectedImage, "activity")}
                    alt="Selected"
                    className="viewer-image"
                    style={{
                      transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                      transition: isDragging ? "none" : "transform 0.2s ease",
                      cursor: zoomLevel > 1 ? "grab" : "default",
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                    onMouseDown={handleMouseDown}
                    onError={(e) => handleImageError(e, "activity")}
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
                {showInfo &&
                  slideImage[selectedIndex] &&
                  ((slide) => slide.title || slide.description)(
                    slideImage[selectedIndex],
                  ) && (
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

      <style jsx>{`
        .enhanced-slide-container {
          position: relative;
          width: 100%;
        }
        .enhanced-carousel-v2 {
          border-radius: ${isMobile ? "12px" : "20px"};
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          position: relative;
          background: #e6f3ff;
        }
        .slide-image-container-v2 {
          position: relative;
          overflow: hidden;
          height: ${isMobile ? "40vh" : "650px"};
        }
        .image-wrapper-v2 {
          width: 100%;
          height: 100%;
        }
        .carousel-image-v2 {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .image-overlay-v2 {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0) 50%
          );
          pointer-events: none;
        }
        .enhanced-caption {
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          padding: ${isMobile ? "10px" : "15px"};
          border-radius: 8px;
          max-width: 80%;
          margin: 0 auto;
          bottom: ${isMobile ? "60px" : "50px"};
          transition: all 0.3s ease;
        }
        .enhanced-caption h3 {
          font-size: ${isMobile ? "18px" : "22px"};
          font-weight: bold;
        }
        .enhanced-caption p {
          font-size: ${isMobile ? "14px" : "16px"};
        }

        .link-icon-top-left {
          position: absolute;
          top: ${isMobile ? "8px" : "12px"};
          left: ${isMobile ? "8px" : "12px"};
          z-index: 10;
          background: rgba(255, 255, 255, 0.8);
          border: none;
          border-radius: 50%;
          width: ${isMobile ? "32px" : "40px"};
          height: ${isMobile ? "32px" : "40px"};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          color: #007bff;
        }
        .link-icon-top-left:hover {
          background: white;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .thumbnail-link-icon {
          top: ${isMobile ? "5px" : "8px"};
          left: ${isMobile ? "5px" : "8px"};
          width: ${isMobile ? "24px" : "30px"};
          height: ${isMobile ? "24px" : "30px"};
        }
        .thumbnail-link-icon svg {
          width: ${isMobile ? "14px" : "18px"};
          height: ${isMobile ? "14px" : "18px"};
        }
        
        .thumbnail-control-top-right {
          position: absolute;
          top: ${isMobile ? "15px" : "20px"};
          right: ${isMobile ? "15px" : "20px"};
          z-index: 10;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 50%;
          width: ${isMobile ? "40px" : "48px"};
          height: ${isMobile ? "40px" : "48px"};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          color: #2c3e50;
        }
        .thumbnail-control-top-right:hover {
          background: white;
          transform: scale(1.08);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .all-photos-modal .modal-body {
          max-height: 80vh;
          overflow-y: auto;
        }

        .thumbnails-wrapper {
          display: grid;
          grid-template-columns: repeat(
            auto-fill,
            minmax(${isMobile ? "120px" : "200px"}, 1fr)
          );
          gap: ${isMobile ? "15px" : "25px"};
          width: 100%;
          padding: 20px 0;
        }
        .thumbnail-item {
          position: relative;
          width: 100%;
          height: auto;
          aspect-ratio: 1 / 1;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 4px solid transparent;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        .thumbnail-item.active {
          border-color: #3498db;
          transform: scale(1.05);
          box-shadow: 0 0 25px rgba(52, 152, 219, 0.8);
        }
        .thumbnail-item:hover {
          transform: scale(1.03);
          border-color: rgba(52, 152, 219, 0.6);
        }
        .thumbnail-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .thumbnail-item:hover img {
          transform: scale(1.1);
        }
        .thumbnail-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          font-weight: bold;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .thumbnail-item:hover .thumbnail-overlay {
          opacity: 1;
        }

        :global(.enhanced-carousel-v2 .carousel-control-prev),
        :global(.enhanced-carousel-v2 .carousel-control-next) {
          width: ${isMobile ? "10%" : "5%"};
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }
        :global(.enhanced-carousel-v2:hover .carousel-control-prev),
        :global(.enhanced-carousel-v2:hover .carousel-control-next) {
          opacity: 0.8;
        }
        :global(.enhanced-carousel-v2 .carousel-control-prev-icon),
        :global(.enhanced-carousel-v2 .carousel-control-next-icon) {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          padding: ${isMobile ? "18px" : "22px"};
          background-size: 50%;
        }
        :global(.enhanced-carousel-v2 .carousel-indicators [data-bs-target]) {
          background-color: #fff;
          opacity: 0.7;
          border-radius: 50%;
          width: 10px;
          height: 10px;
          margin: 0 5px;
        }
        :global(.enhanced-carousel-v2 .carousel-indicators .active) {
          opacity: 1;
          transform: scale(1.2);
        }

        .image-viewer-modal {
          max-width: 95vw;
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
          background-color: rgba(0, 0, 0, 0.6);
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
          background-color: rgba(0, 0, 0, 0.7);
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
      `}</style>
    </div>
  );
}

export default Slide;
