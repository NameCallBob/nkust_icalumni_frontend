
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Carousel ,Modal} from 'react-bootstrap';
import Axios from 'common/Axios';
import LoadingSpinner from 'components/LoadingSpinner';

const ImageSlider = ({ images }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState(null);
  
    const handleImageClick = (image) => {
      setModalImage(image);
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
      setModalImage(null);
    };
  
    return (
      <>
        {/* Carousel with fixed image height and width auto-adjustment */}
        <Carousel interval={null} fade={false} className="image-slider">
          {images.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                src={image}
                alt={`slide-${index}`}
                style={{
                  maxHeight: '500px', // Locked height (can adjust)
                  objectFit: 'cover', // Maintain aspect ratio without distortion
                  cursor: 'pointer',
                }}
                onClick={() => handleImageClick(image)} // Click to open modal
                onError={(e) => (e.target.style.display = 'none')} // Error handling for missing images
              />
            </Carousel.Item>
          ))}
        </Carousel>
  
        {/* Modal for image zoom */}
        <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>放大</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            {modalImage && <img src={modalImage} alt="Zoomed" style={{ width: '100%' }} />}
          </Modal.Body>
        </Modal>
      </>
    );
  };


  const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [largeImages, setLargeImages] = useState([]);
    const [smallImages, setSmallImages] = useState([]);
  
    useEffect(() => {
      const fetchEventDetails = async () => {
        try {
          const response = await Axios().get("/article/all/get_one/", {
            params: { id: id },
          });
          const eventData = response.data;
  
          // Separate images by their `pic_type`
          const large = eventData.images.filter((img) => img.pic_type === 'large').map(img => (process.env.REACT_APP_BASE_URL+img.image));
          const small = eventData.images.filter((img) => img.pic_type === 'small').map(img => (process.env.REACT_APP_BASE_URL+img.image));
  
          setEvent(eventData);
          setLargeImages(large);
          setSmallImages(small);
        } catch (error) {
          console.error('Error fetching event details:', error);
        }
      };
  
      fetchEventDetails();
    }, [id]);
  
    if (!event) return <LoadingSpinner />;
  
    return (
      <Container className="mt-4">
        <Row>
          <Col>
            <h1>{event.title}</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <div
              dangerouslySetInnerHTML={{ __html: event.content }}
              className="mt-3"
            ></div>
          </Col>
        </Row>
  
        {/* Large Image Slider */}
        {largeImages.length > 0 && (
        <>
        <Row>
            <Col>
            <h4>大圖展示</h4>
            </Col>
        </Row>
          <Row className="mt-4">
            <Col>
              <ImageSlider images={largeImages} />
            </Col>
          </Row>
        </>
        )}
  
        {/* Small Image Slider */}
        {smallImages.length > 0 && (
            <>
            <Row>
                <Col>
                <h4>
                    活動圖片展示
                </h4>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                <ImageSlider images={smallImages} />
                </Col>
            </Row>

            </>
        )}
      </Container>
    );
  };
  
  export default EventDetail;