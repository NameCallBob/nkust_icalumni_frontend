import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Card, Badge, Tabs, Tab, Button, Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaGlobe, FaLinkedin, FaGithub, FaInstagram, FaShareAlt, FaFacebookF, FaTwitter, FaLink, FaLine } from 'react-icons/fa';
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
import styles from "css/user/alumni/ProfilePage.module.css";
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
  const [shareUrl, setShareUrl] = useState('');
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);

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

    // 設定分享的URL
    setShareUrl(window.location.href);
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

  // 分享功能處理
  const handleShare = (platform) => {
    const title = `${profileData?.name} - 智慧商務系友`;
    const text = `查看${profileData?.name}的系友資訊`;

    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'line':
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
          setShowCopyTooltip(true);
          setTimeout(() => setShowCopyTooltip(false), 2000);
          toast.success('連結已複製到剪貼簿');
        });
        break;
      default:
        break;
    }
  };

  if (notfound) {
    return (
      <Container className={`${styles.notFoundContainer} py-5 text-center`}>
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
      <Container className={`${styles.loadingContainer} py-5 text-center`}>
        <div className={styles.loadingSpinner}></div>
        <p className={`${styles.loadingText} mt-3`}>正在載入系友資料，請稍候...</p>
      </Container>
    );
  }

  return (
    <Container className="profile-page-container py-5 my-5">
      {profileData && (
        <SEO
          main={false}
          title={`系友 ${profileData.name}`}
          description={`深入了解智慧商務系友 ${profileData.name} 的背景、專長與成就，促進交流與合作。`}
          keywords={["智慧商務", "系友詳細", profileData.name, "會員資訊"]}
        />
      )}
      
      {profileData && (() => {
        // 照片數據準備 - 只在 profileData 存在時執行
        const personalPhotos = profileData.self_images ?
          formatPhotosForAlbum(profileData.self_images, 'personal') : [];

        const companyPhotos = profileData.company_images ?
          formatPhotosForAlbum(profileData.company_images, 'company') : [];

        const lightboxPhotos = activeGallery === 'personal' ?
          formatPhotosForLightbox(profileData.self_images || []) :
          formatPhotosForLightbox(profileData.company_images || []);

        return (
        <>
          {/* 頂部資訊卡片 - 個人資料與簡介 */}
          <motion.div
            className="profile-hero mb-5"
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
          >
            <Card className="shadow-lg border-0">
              <Card.Body className="p-0">
                <Row className="g-0">
                  {/* Navy header column with circular avatar */}
                  <Col lg={4} style={{ background: '#1e3a8a', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <Image
                        src={profileData.photo ? process.env.REACT_APP_BASE_URL + profileData.photo : 'https://via.placeholder.com/300x300/e9ecef/495057?text=No+Photo'}
                        className="rounded-circle"
                        alt={profileData.name || '系友'}
                        style={{
                          width: '200px',
                          height: '200px',
                          objectFit: 'cover',
                          border: '4px solid rgba(255,255,255,0.9)',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.25)'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300/e9ecef/495057?text=No+Photo';
                        }}
                      />
                      {/* Name & position below avatar on mobile / overlapping for md+ */}
                      <div className="d-lg-none mt-3">
                        <h1 style={{ color: '#ffffff', fontWeight: '700', fontSize: '1.5rem', marginBottom: '0.375rem' }}>{profileData.name || '姓名未提供'}</h1>
                        {profileData.position && profileData.position.title && (
                          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', marginBottom: '0.5rem', fontWeight: '400' }}>{profileData.position.title}</p>
                        )}
                        {profileData.graduate && (
                          <span style={{ background: 'rgba(255,255,255,0.18)', color: '#ffffff', fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '4px', display: 'inline-block' }}>
                            {profileData.graduate.school || '學校未知'} · {profileData.graduate.grade || '年級未知'} 級
                          </span>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col lg={8}>
                    <div className="profile-info p-4">
                      <div className="profile-header mb-3">
                        <div className="d-flex justify-content-between align-items-start flex-wrap">
                          <div className="mb-2 d-none d-lg-block">
                            <h1 className="profile-name fw-bold mb-2" style={{ fontSize: '2rem', color: '#0f172a', letterSpacing: '-0.5px' }}>{profileData.name || '姓名未提供'}</h1>
                            <div className="profile-badges d-flex flex-wrap gap-2">
                              {profileData.position && profileData.position.title && (
                                <Badge style={{ background: '#1e3a8a', color: '#ffffff', padding: '0.45rem 1rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: '600' }}>{profileData.position.title}</Badge>
                              )}
                              {profileData.graduate && (
                                <Badge style={{ background: '#eff6ff', color: '#1e3a8a', border: '1px solid #bfdbfe', padding: '0.45rem 1rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: '600' }}>
                                  {profileData.graduate.school || '學校未知'} · {profileData.graduate.grade || '年級未知'} 級
                                </Badge>
                              )}
                            </div>
                          </div>
                          <DropdownButton
                            id="dropdown-share-button"
                            title={<><FaShareAlt /> 分享</>}
                            variant="outline-primary"
                            className="share-dropdown"
                            size="sm"
                          >
                        <Dropdown.Item onClick={() => handleShare('facebook')}>
                          <FaFacebookF className="me-2" /> Facebook
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleShare('line')}>
                          <FaLine className="me-2" /> LINE
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleShare('twitter')}>
                          <FaTwitter className="me-2" /> Twitter
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <OverlayTrigger
                          placement="left"
                          show={showCopyTooltip}
                          overlay={<Tooltip>已複製！</Tooltip>}
                        >
                          <Dropdown.Item onClick={() => handleShare('copy')}>
                            <FaLink className="me-2" /> 複製連結
                          </Dropdown.Item>
                        </OverlayTrigger>
                      </DropdownButton>
                    </div>
                  </div>
                  
                      <hr className="my-4" />

                      <Row>
                        <Col md={12}>
                          <h3 className="section-title h4 mb-3">個人簡介</h3>
                          {profileData.intro ? (
                            <p className="profile-intro text-muted lh-lg">{profileData.intro}</p>
                          ) : (
                            <div className="alert alert-light border" role="alert">
                              <h6 className="alert-heading">尚未提供個人簡介</h6>
                              <p className="mb-0 small text-muted">系友可在個人設定中完善個人資料，讓更多人了解您的專業與特長</p>
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
              </Card.Body>
            </Card>
          </motion.div>

          {/* 主要內容區 - 使用標籤頁切換不同內容 */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="main-content mb-5"
          >
            <Card style={{ border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <Card.Body>
                <style>{`
                  .nav-pills .nav-link {
                    color: #475569;
                    background-color: #f8fafc;
                    border-radius: 6px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    border: 1px solid #e2e8f0;
                    font-size: 0.95rem;
                  }
                  .nav-pills .nav-link.active {
                    background-color: #1e3a8a;
                    color: white !important;
                    font-weight: 600;
                    border-color: #1e3a8a;
                    box-shadow: none;
                  }
                  .nav-pills .nav-link:hover:not(.active) {
                    background-color: #eff6ff;
                    color: #1e3a8a;
                    border-color: #bfdbfe;
                    transform: none;
                  }
                `}</style>
                <Tabs
                  defaultActiveKey="gallery"
                  className="mb-4"
                  variant="pills"
                  fill
                >
                  {/* 照片集錦標籤頁 */}
                  <Tab eventKey="gallery" title="照片集錦" className="py-4">
                    <h3 className="section-title h4 mb-4">系友照片集錦</h3>
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
                    <div className="alert alert-info text-center py-5" role="alert">
                      <div className="mb-3" style={{ fontSize: '48px' }}>📷</div>
                      <h5 className="alert-heading">目前沒有個人照片</h5>
                      <p className="mb-0">系友尚未上傳照片集錦，您可以稍後再回來查看</p>
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
                              src={profileData.company.photo ? `${process.env.REACT_APP_BASE_URL}${profileData.company.photo}` : 'https://via.placeholder.com/400x300/e9ecef/495057?text=No+Company+Photo'}
                              rounded
                              fluid
                              className="company-image shadow"
                              alt={profileData.company.name || '公司'}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x300/e9ecef/495057?text=No+Company+Photo';
                              }}
                            />
                          </motion.div>
                        </Col>
                        <Col md={8}>
                          <h2 className="company-title h3 mb-3">{profileData.company.name || '公司名稱未提供'}</h2>
                          <p className="company-description text-muted lh-lg">
                            {profileData.company.description || '尚未提供公司描述'}
                          </p>
                        
                          <div className="company-contact-info mt-4">
                            <Row>
                              <Col md={6} className="mb-3">
                                <div className="d-flex align-items-center">
                                  <FaMapMarkerAlt className="text-primary me-2" />
                                  <span className="text-muted">{profileData.company.address || "未提供地址"}</span>
                                </div>
                              </Col>
                              <Col md={6} className="mb-3">
                                <div className="d-flex align-items-center">
                                  <FaPhoneAlt className="text-primary me-2" />
                                  <span className="text-muted">{profileData.company.phone_number || "未提供聯絡電話"}</span>
                                </div>
                              </Col>
                              <Col md={6} className="mb-3">
                                <div className="d-flex align-items-center">
                                  <FaEnvelope className="text-primary me-2" />
                                  <span className="text-muted">{profileData.company.email || "未提供電子郵件"}</span>
                                </div>
                              </Col>
                              <Col md={6} className="mb-3">
                                <div className="d-flex align-items-center">
                                  <FaGlobe className="text-primary me-2" />
                                  {profileData.company.website ? (
                                    <a href={profileData.company.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                      {profileData.company.website}
                                    </a>
                                  ) : (
                                    <span className="text-muted">未提供網站</span>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </div>
                      </Col>
                    </Row>

                      <Row className="mb-5">
                        <Col>
                          <Card className="product-info-card" style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                            <Card.Header as="h5" style={{ background: '#1e3a8a', color: '#ffffff', fontWeight: '700', border: 'none', padding: '0.875rem 1.5rem', fontSize: '1rem' }}>
                              我們的產品
                            </Card.Header>
                            <Card.Body>
                              <Card.Title className="h6">
                                {profileData.company.products || "尚未提供產品資訊"}
                              </Card.Title>
                              <Card.Text className="text-muted">
                                {profileData.company.product_description || "尚未提供產品描述"}
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      <h3 className="section-title h4 mb-4">商品展示</h3>
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
                        <div className="alert alert-light border" role="alert">
                          <h5 className="alert-heading">尚未提供公司更多照片</h5>
                          <p className="mb-0">系友可以在設定頁面添加公司產品相關資訊</p>
                        </div>                    
                  
                  )}

                      <ProductDisplay memberId={id} className="mt-5" />

                      <h3 className="section-title h4 mt-5 mb-4">我們的位置</h3>
                      <Card className="map-card shadow-sm border-0">
                        <Card.Body className="p-0">
                          <div className="company-map">
                          <iframe
                            title="Company Location"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(
                              profileData.company.address || "未知地址"
                            )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                              width="100%"
                              height="400"
                              style={{ border: 0, borderRadius: '0.375rem' }}
                              allowFullScreen=""
                              loading="lazy"
                            ></iframe>
                        </div>
                      </Card.Body>
                    </Card>
                  </>
                  ) : (
                    <div className="alert alert-info text-center py-5" role="alert">
                      <div className="mb-3" style={{ fontSize: '48px' }}>🏢</div>
                      <h4 className="alert-heading">系友尚未添加公司資訊</h4>
                      <p className="mb-0">此系友目前未提供任何公司相關資訊</p>
                    </div>
                  )}
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
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
        );
      })()}
    </Container>
  );
};

export default ProfilePage;