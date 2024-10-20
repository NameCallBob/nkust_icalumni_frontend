import React, { useState , useEffect } from 'react';
import { Container, Row, Col, Image, Carousel, Modal } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaGlobe } from 'react-icons/fa';
import "css/user/aliumni/ProfilePage.css"
import Axios from 'common/Axios';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { id } = useParams(); // 取得網址中的 id (例如 1)
  const [profileData, setProfileData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const handleImageClick = (src) => {
    setModalImage(src);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    Axios().get("member/any/getOne/", { params: { "id": id } })
      .then(response => {
        setProfileData(response.data);
      })
      .catch(error => {
        console.error("Error fetching profile data:", error);
      });
  }, [id]);

  const BASE_URL = ''; // 如果需要，請替換為您的基本 URL

  return (
    <Container>
      {profileData ? (
        <>
          {/* 個人資訊區塊 */}
          <Row className="my-5">
            <Col xs={12} md={4} className="text-center mb-4">
              <Image
                src={process.env.REACT_APP_BASE_URL+profileData.photo}
                roundedCircle
                style={{ width: '100%', height: 'auto', maxWidth: '350px' }}
                alt="個人照片"
              />
            </Col>
            <Col xs={12} md={8}>
              <h2 className="section-title mb-4">個人資料</h2>
              <p>
                <strong>姓名:</strong> {profileData.name}
              </p>
              <p>
                <strong>職位:</strong> {profileData.position.title}
              </p>
              <p>
                <strong>專長:</strong> {profileData.intro}
              </p>
              <p>
                <strong>系級:</strong> {profileData.graduate.school} {profileData.graduate.grade} 級
              </p>
              <hr />
              <h3 className="section-title mb-4">個人簡介</h3>
              <p>
                {profileData.intro}
              </p>
            </Col>
          </Row>

          <Row>
            <Col>
              <h2 className="section-title mb-4">系友照片集錦</h2>
            </Col>
          </Row>
          {/* 系友照片集錦 */}
          <Row className="my-5">
            <Col>
              {profileData.self_images && profileData.self_images.length > 0 ? (
                <Carousel className="mb-4" indicators={false} controls={true} interval={3000} slide={false}>
                  {profileData.self_images.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100"
                        src={process.env.REACT_APP_BASE_URL+image.image}
                        alt={image.title}
                        onClick={() => handleImageClick(image.image)}
                        style={{ cursor: 'pointer', objectFit: 'cover', height: '400px' }}
                      />
                      <Carousel.Caption>
                        <h5>{image.title}</h5>
                        <p>{image.description}</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <p>目前沒有照片。</p>
              )}
            </Col>
          </Row>

          {/* 公司資訊區塊 */}
          <Row className="my-5">
            <Col>
              <h2 className="section-title mb-4">公司資訊</h2>
            </Col>
          </Row>

          {/* 公司介紹區塊 */}
          <Row className="company-section mb-5">
            <Col xs={12} md={4} className="mb-4">
              <Image
                src={process.env.REACT_APP_BASE_URL+profileData.company.photo}
                rounded
                fluid
                alt="公司大樓"
              />
            </Col>
            <Col xs={12} md={8}>
              <h3 className="company-title mb-3">{profileData.company.name}</h3>
              <p className="company-description mb-4">
                {profileData.company.description}
              </p>
              <ul className="company-info-list list-unstyled">
                <li className="mb-2">
                  <FaMapMarkerAlt className="icon mr-2" /> {profileData.company.address}
                </li>
                <li className="mb-2">
                  <FaPhoneAlt className="icon mr-2" /> {profileData.company.phone_number}
                </li>
                <li className="mb-2">
                  <FaEnvelope className="icon mr-2" /> {profileData.company.email}
                </li>
                <li className="mb-2">
                  <FaGlobe className="icon mr-2" />{' '}
                  <a href={profileData.company.website} target="_blank" rel="noopener noreferrer">
                    {profileData.company.website}
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3 className="section-title mb-4">我們的產品</h3>
            </Col>
          </Row>
          {/* 我們的產品 */}
          <Row className="my-5">
            <Col>
              <p>{profileData.company.products}</p>
              <p>{profileData.company.product_description}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3 className="section-title mb-4">商品展示</h3>
            </Col>
          </Row>
          {/* 商品展示 */}
          <Row className="my-5">
            <Col>
              {profileData.company_images && profileData.company_images.length > 0 ? (
                <Carousel indicators={false} controls={true} interval={3000} slide={false}>
                  {profileData.company_images.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100"
                        src={process.env.REACT_APP_BASE_URL+image.image}
                        alt={image.title}
                        onClick={() => handleImageClick(image.image)}
                        style={{ cursor: 'pointer', objectFit: 'cover', height: '400px' }}
                      />
                      <Carousel.Caption>
                        <h5>{image.title}</h5>
                        <p>{image.description}</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <p>目前沒有公司圖片。</p>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <h3 className="section-title mb-4">我們的位置</h3>
            </Col>
          </Row>
          {/* 我們的位置 */}
          <Row className="my-5">
            <Col>
              <div style={{ width: '100%', height: '400px' }}>
                <iframe
                  title="Company Location"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(profileData.company.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </Col>
          </Row>

          {/* 圖片放大 Modal */}
          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Body>
              <Image src={modalImage} fluid />
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <p>載入中...</p>
      )}
    </Container>
  );
};

export default ProfilePage;
