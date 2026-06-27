import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Carousel, Modal, Spinner } from 'react-bootstrap';
import Axios from 'common/Axios';
import LoadingSpinner from 'components/LoadingSpinner';
import SEO from 'SEO';

/**
 * 圖片輪播元件 - 提供圖片展示與放大功能
 */
const ImageSlider = ({ images, title }) => {
  // 所有 Hooks 必須在組件頂層調用，不能有條件式調用
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 點擊圖片處理函數
  const handleImageClick = (image, index) => {
    setModalImage(image);
    setCurrentIndex(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImage(null);
  };

  // 在放大模式中切換下一張圖片
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setModalImage(images[nextIndex]);
  };

  // 在放大模式中切換上一張圖片
  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setModalImage(images[prevIndex]);
  };

  // 如果沒有圖片，則整個組件不渲染任何內容
  if (!images || images.length === 0) {
    return null;
  }
  
  return (
    <>
      {/* 只有當有標題且有圖片時才顯示標題 */}
      {title && <h4 className="mt-4 mb-3">{title}</h4>}
      
      {/* 改進的輪播效果 */}
      <div className="image-slider-container">
        <Carousel 
          interval={null} 
          indicators={images.length > 1}
          controls={images.length > 1}
          className="image-slider rounded shadow-sm"
        >
          {images.map((image, index) => (
            <Carousel.Item key={index}>
              <div className="image-container">
                <img
                  className="d-block w-100"
                  src={image}
                  alt={`圖片-${index + 1}`}
                  style={{
                    height: '400px',
                    objectFit: 'contain',
                    backgroundColor: '#f8f9fa',
                    cursor: 'zoom-in',
                  }}
                  onClick={() => handleImageClick(image, index)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/placeholder-image.png';
                    e.target.style.objectFit = 'scale-down';
                  }}
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
        {images.length > 1 && (
          <p className="text-muted text-center mt-2">
            <small>點擊圖片可放大查看 ({currentIndex + 1}/{images.length})</small>
          </p>
        )}
      </div>

      {/* 改進的放大模式 */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        centered 
        size="xl"
        className="image-zoom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>圖片詳情</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 bg-dark">
          {modalImage && (
            <div className="position-relative">
              <img 
                src={modalImage} 
                alt="放大圖片" 
                style={{ 
                  width: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain'
                }} 
              />
              
              {images.length > 1 && (
                <>
                  {/* 上一張/下一張按鈕 */}
                  <button 
                    className="carousel-control-prev" 
                    onClick={handlePrev}
                    style={{ width: '10%' }}
                  >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  </button>
                  <button 
                    className="carousel-control-next" 
                    onClick={handleNext}
                    style={{ width: '10%' }}
                  >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  </button>
                  
                  {/* 圖片計數器 */}
                  <div className="position-absolute bottom-0 start-50 translate-middle-x pb-3 text-white">
                    {currentIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

/**
 * 活動詳情頁面主元件
 */
const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [largeImages, setLargeImages] = useState([]);
  const [smallImages, setSmallImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const response = await Axios().get("/article/all/get_one/", {
          params: { id }
        });
        const eventData = response.data;

        // 分離大小圖片並添加完整URL路徑
        const large = eventData.images
          .filter(img => img.pic_type === 'large')
          .map(img => process.env.REACT_APP_BASE_URL + img.image);
          
        const small = eventData.images
          .filter(img => img.pic_type === 'small')
          .map(img => process.env.REACT_APP_BASE_URL + img.image);

        setEvent(eventData);
        setLargeImages(large);
        setSmallImages(small);
      } catch (error) {
        // console.error('獲取活動詳情失敗:', error);
        setError('無法載入活動詳情，請稍後再試');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <Container className="mt-5 text-center">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container className="mt-5 text-center">
        <div className="alert alert-warning">找不到活動資訊</div>
      </Container>
    );
  }

  return (
    <Container className="my-4 pb-5">
      <SEO
        main={false}
        title={event.title}
        description="深入了解智慧商務系友會各個成員的背景、專長與成就，促進交流與合作。"
        keywords={["智慧商務", "系友詳細", "會員資訊"]}
      />
      
      {/* 活動標題區塊 */}
      <Row>
        <Col>
          <h1 className="mb-3 fw-bold">{event.title}</h1>
          <hr className="my-4" />
        </Col>
      </Row>
      
      {/* 活動內容區塊 */}
      <Row>
        <Col>
          <div
            dangerouslySetInnerHTML={{ __html: event.content }}
            className="event-content my-4"
          ></div>
        </Col>
      </Row>

      {/* 大圖展示區塊 - 只有存在大圖時才渲染 */}
      <ImageSlider 
        images={largeImages} 
        title={largeImages.length > 0 ? "大圖展示" : null} 
      />

      {/* 活動圖片展示區塊 - 只有存在小圖時才渲染 */}
      <ImageSlider 
        images={smallImages} 
        title={smallImages.length > 0 ? "活動圖片展示" : null} 
      />
    </Container>
  );
};

export default EventDetail;