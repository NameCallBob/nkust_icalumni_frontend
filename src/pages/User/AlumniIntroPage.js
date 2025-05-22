import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Card, Badge, Tabs, Tab, Button } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaGlobe, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import Swiper from 'swiper';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import 'swiper/css/effect-fade';

import YetAnotherLightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import LightboxZoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

import { RowsPhotoAlbum as PhotoAlbum } from 'react-photo-album';
import "css/user/alumni/ProfilePage.css";
import Axios from 'common/Axios';
import { useParams } from 'react-router-dom';
import SEO from 'SEO';
import ProductDisplay from 'components/User/intro/Productlist';
import { toast } from 'react-toastify';
import notfoundpic from "assets/系有資料404.png";

const ProfilePage = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notfound, setNotfound] = useState(false);
  
  // 照片查看狀態
  const [openLightbox, setOpenLightbox] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeGallery, setActiveGallery] = useState('personal'); // 'personal' 或 'company'
  
  // 動態效果設定
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  useEffect(() => {
    setIsLoading(true);
    Axios().get("member/any/getOne/", { params: { "id": id } })
      .then(response => {
        setProfileData(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        if (error.response && error.response.status === 404) {
          setNotfound(true);
          toast.warn("此系友目前資料暫不開放");
        }
      });
  }, [id]);

  // 格式化照片數據用於 PhotoAlbum 組件
  const formatPhotosForAlbum = (images, type) => {
    if (!images || images.length === 0) return [];
    
    return images.map((image, index) => ({
      src: `${process.env.REACT_APP_BASE_URL}${image.image}`,
      width: 4,
      height: 3,
      title: image.title,
      description: image.description,
      key: `${type}-${index}`
    }));
  };

  // 格式化照片數據用於燈箱
  const formatPhotosForLightbox = (images) => {
    if (!images || images.length === 0) return [];
    
    return images.map(image => ({
      src: `${process.env.REACT_APP_BASE_URL}${image.image}`,
      title: image.title,
      description: image.description
    }));
  };

  const handleOpenLightbox = (galleryType, index = 0) => {
    setActiveGallery(galleryType);
    setPhotoIndex(index);
    setOpenLightbox(true);
  };

  if (notfound) {
    return (
      <Container className="not-found-container py-5 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img 
            src={notfoundpic}
            alt="資料未開放"
            className="img-fluid"
          />
          <h3 className="mt-4">此系友資料目前暫不開放</h3>
        </motion.div>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <div className="loading-spinner"></div>
        <p className="mt-3">正在載入系友資料，請稍候...</p>
      </Container>
    );
  }

  // 照片數據準備
  const personalPhotos = profileData && profileData.self_images ? 
    formatPhotosForAlbum(profileData.self_images, 'personal') : [];
  
  const companyPhotos = profileData && profileData.company_images ? 
    formatPhotosForAlbum(profileData.company_images, 'company') : [];
  
  const lightboxPhotos = activeGallery === 'personal' ? 
    formatPhotosForLightbox(profileData.self_images || []) : 
    formatPhotosForLightbox(profileData.company_images || []);

  return (
    <Container fluid className="profile-page-container py-4 my-3">
      {profileData && (
        <SEO
          main={false}
          title={`系友 ${profileData.name}`}
          description={`深入了解智慧商務系友 ${profileData.name} 的背景、專長與成就，促進交流與合作。`}
          keywords={["智慧商務", "系友詳細", profileData.name, "會員資訊"]}
        />
      )}
      
      {profileData && (
        <>
          {/* 頂部資訊卡片 - 個人資料與簡介 */}
          <motion.div 
            className="profile-hero mb-5"
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
          >
            <Row className="g-0 profile-card">
              <Col lg={4} className="profile-image-container">
                <div className="profile-image-wrapper">
                  <Image
                    src={process.env.REACT_APP_BASE_URL + profileData.photo}
                    className="profile-image"
                    alt={profileData.name}
                  />
                </div>
              </Col>
              <Col lg={8}>
                <div className="profile-info p-4">
                  <div className="profile-header">
                    <h1 className="profile-name">{profileData.name}</h1>
                    <div className="profile-badges">
                      <Badge bg="primary" className="me-2">{profileData.position.title}</Badge>
                      <Badge bg="secondary">{profileData.graduate.school} {profileData.graduate.grade} 級</Badge>
                    </div>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <Row>
                    <Col md={12}>
                      <h3 className="section-title">個人簡介</h3>
                      {profileData.intro ? (
                        <p className="profile-intro">{profileData.intro}</p>
                      ) : (
                        <div className="empty-data-hint">
                          <p>此系友尚未填寫個人簡介</p>
                          <small>系友可在個人設定中完善個人資料，讓更多人了解您的專業與特長</small>
                        </div>
                      )}
                    </Col>
                  </Row>
                  
                  {/* <div className="social-links mt-3">
                    {profileData.social_links && profileData.social_links.linkedin && (
                      <a href={profileData.social_links.linkedin} className="me-3" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin size={24} />
                      </a>
                    )}
                    {profileData.social_links && profileData.social_links.github && (
                      <a href={profileData.social_links.github} className="me-3" target="_blank" rel="noopener noreferrer">
                        <FaGithub size={24} />
                      </a>
                    )}
                    {profileData.social_links && profileData.social_links.instagram && (
                      <a href={profileData.social_links.instagram} className="me-3" target="_blank" rel="noopener noreferrer">
                        <FaInstagram size={24} />
                      </a>
                    )}
                  </div> */}

                </div>
              </Col>
            </Row>
          </motion.div>

          {/* 主要內容區 - 使用標籤頁切換不同內容 */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="main-content mb-5"
          >
            <Tabs
              defaultActiveKey="gallery"
              className="mb-4 profile-tabs"
              fill
            >
              {/* 照片集錦標籤頁 */}
              <Tab eventKey="gallery" title="照片集錦" className="py-4">
                <h3 className="section-title mb-4">系友照片集錦</h3>
                {personalPhotos.length > 0 ? (
                  <div className="photo-album-container">
                    <Row className="photo-grid">
                      {personalPhotos.map((photo, index) => (
                        <Col xs={12} sm={6} md={4} lg={3} key={photo.key} className="photo-col mb-4">
                          <motion.div
                            whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)" }}
                            transition={{ duration: 0.3 }}
                            className="photo-card"
                            onClick={() => handleOpenLightbox('personal', index)}
                          >
                            <div className="photo-img-container">
                              <img 
                                src={photo.src} 
                                alt={photo.title || '系友照片'} 
                                className="photo-img"
                              />
                            </div>
                            {photo.title && (
                              <div className="photo-caption">
                                <h5>{photo.title}</h5>
                                {photo.description && <p>{photo.description}</p>}
                              </div>
                            )}
                          </motion.div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ) : (
                  <div className="empty-data-hint text-center py-4">
                    <div className="hint-icon mb-3">📷</div>
                    <h5>目前沒有個人照片</h5>
                    <p>系友尚未上傳照片集錦，您可以稍後再回來查看</p>
                  </div>
                )}
              </Tab>
              {/* 公司資訊標籤頁 */}
              <Tab eventKey="company" title="公司資訊" className="py-4">
                {profileData.company ? (
                  <>
                    <Row className="company-header mb-4">
                      <Col md={4} className="mb-4">
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                          <Image
                            src={`${process.env.REACT_APP_BASE_URL}${profileData.company.photo}`}
                            rounded
                            fluid
                            className="company-image"
                            alt={profileData.company.name}
                          />
                        </motion.div>
                      </Col>
                      <Col md={8}>
                        <h2 className="company-title">{profileData.company.name}</h2>
                        <p className="company-description">{profileData.company.description}</p>
                        
                        <div className="company-contact-info mt-4">
                          <div className="contact-item">
                            <FaMapMarkerAlt className="icon" /> 
                            <span>{profileData.company.address || "未提供地址"}</span>
                          </div>
                          <div className="contact-item">
                            <FaPhoneAlt className="icon" /> 
                            <span>{profileData.company.phone_number || "未提供聯絡電話"}</span>
                          </div>
                          <div className="contact-item">
                            <FaEnvelope className="icon" /> 
                            <span>{profileData.company.email || "未提供電子郵件"}</span>
                          </div>
                          <div className="contact-item">
                            <FaGlobe className="icon" />
                            {profileData.company.website ? (
                              <a href={profileData.company.website} target="_blank" rel="noopener noreferrer">
                                {profileData.company.website}
                              </a>
                            ) : (
                              <span>未提供網站</span>
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-5">
                      <Col>
                        <Card className="product-info-card">
                          <Card.Header as="h3">我們的產品</Card.Header>
                          <Card.Body>
                            <Card.Title>{profileData.company.products || "未提供產品資訊"}</Card.Title>
                            <Card.Text>{profileData.company.product_description || "未提供產品描述"}</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    <h3 className="section-title mb-4">商品展示</h3>
                    {companyPhotos.length > 0 ? (
                      <div className="product-slider-container mb-5">
                        <SwiperReact
                          modules={[Navigation, Pagination, Zoom, EffectFade]}
                          slidesPerView={1}
                          spaceBetween={30}
                          navigation
                          pagination={{ clickable: true }}
                          breakpoints={{
                            640: {
                              slidesPerView: 1,
                            },
                            768: {
                              slidesPerView: 2,
                            },
                            1024: {
                              slidesPerView: 3,
                            },
                          }}
                          className="product-slider"
                        >
                          {companyPhotos.map((photo, index) => (
                            <SwiperSlide key={photo.key}>
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="product-slide"
                                onClick={() => handleOpenLightbox('company', index)}
                              >
                                <Card className="product-card">
                                  <div className="product-img-container">
                                    <Card.Img 
                                      variant="top" 
                                      src={photo.src}
                                      alt={photo.title}
                                      className="product-img"
                                    />
                                  </div>
                                  <Card.Body>
                                    <Card.Title>{photo.title}</Card.Title>
                                    {photo.description && <Card.Text>{photo.description}</Card.Text>}
                                  </Card.Body>
                                </Card>
                              </motion.div>
                            </SwiperSlide>
                          ))}
                        </SwiperReact>
                      </div>
                    ) : (
                      <div className="empty-data-hint">
                      <h5>尚未提供公司更多照片</h5>
                      <p>系友可以在設定頁面添加公司產品相關資訊</p>
                    </div>                    
                  
                  )}

                    <ProductDisplay memberId={id} className="mt-5" />

                    <h3 className="section-title mt-5 mb-4">我們的位置</h3>
                    <Card className="map-card">
                      <Card.Body>
                        <div className="company-map">
                          <iframe
                            title="Company Location"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(
                              profileData.company.address || "未知地址"
                            )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                          ></iframe>
                        </div>
                      </Card.Body>
                    </Card>
                  </>
                ) : (
                  <div className="text-center py-5">
                    <h3 className="no-company-info">系友尚未添加公司資訊</h3>
                    <p>此系友目前未提供任何公司相關資訊。</p>
                  </div>
                )}
              </Tab>
            </Tabs>
          </motion.div>

          {/* 照片燈箱 */}
          <YetAnotherLightbox
            open={openLightbox}
            close={() => setOpenLightbox(false)}
            index={photoIndex}
            slides={lightboxPhotos}
            plugins={[Thumbnails, LightboxZoom]}
            carousel={{ finite: false }}
            render={{
              buttonPrev: () => null,
              buttonNext: () => null,
              slide: (props) => (
                <div style={{ position: 'relative', ...props.style }}>
                  <img
                    src={props.slide.src}
                    style={{ objectFit: 'contain', width: '100%', height: '40%' }}
                    alt={props.slide.title || ''}
                  />
                  {(props.slide.title || props.slide.description) && (
                    <div className="lightbox-caption">
                      {props.slide.title && <h4>{props.slide.title}</h4>}
                      {props.slide.description && <p>{props.slide.description}</p>}
                    </div>
                  )}
                </div>
              ),
            }}
          />
        </>
      )}
    </Container>
  );
};

export default ProfilePage;