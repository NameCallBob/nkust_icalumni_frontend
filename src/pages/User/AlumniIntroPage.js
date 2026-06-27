import React, { useState, useEffect } from 'react';
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
  // 內容標籤頁切換狀態（取代 react-bootstrap Tabs 的內建狀態）
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' 或 'company'

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
      <div className={`${styles.notFoundContainer} container mx-auto px-4 py-5 text-center`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={notfoundpic}
            alt="資料未開放"
            className="max-w-full h-auto"
          />
          <h3 className="mt-4">此系友資料目前暫不開放</h3>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`${styles.loadingContainer} container mx-auto px-4 py-5 text-center`}>
        <div className={styles.loadingSpinner}></div>
        <p className={`${styles.loadingText} mt-3`}>正在載入系友資料，請稍候...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-container container mx-auto px-4 py-5 my-5">
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
            <div className="card bg-base-100 shadow-lg border-0 overflow-hidden">
              <div className="card-body p-0">
                <div className="grid grid-cols-12">
                  {/* Navy header column with circular avatar */}
                  <div className="col-span-12 lg:col-span-4" style={{ background: '#1e3a8a', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <img
                        src={profileData.photo ? process.env.REACT_APP_BASE_URL + profileData.photo : 'https://via.placeholder.com/300x300/e9ecef/495057?text=No+Photo'}
                        className="rounded-full"
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
                      <div className="lg:hidden mt-3">
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
                  </div>
                  <div className="col-span-12 lg:col-span-8">
                    <div className="profile-info p-4">
                      <div className="profile-header mb-3">
                        <div className="flex justify-between items-start flex-wrap">
                          <div className="mb-2 hidden lg:block">
                            <h1 className="profile-name font-bold mb-2" style={{ fontSize: '2rem', color: '#0f172a', letterSpacing: '-0.5px' }}>{profileData.name || '姓名未提供'}</h1>
                            <div className="profile-badges flex flex-wrap gap-2">
                              {profileData.position && profileData.position.title && (
                                <span style={{ background: '#1e3a8a', color: '#ffffff', padding: '0.45rem 1rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: '600' }}>{profileData.position.title}</span>
                              )}
                              {profileData.graduate && (
                                <span style={{ background: '#eff6ff', color: '#1e3a8a', border: '1px solid #bfdbfe', padding: '0.45rem 1rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: '600' }}>
                                  {profileData.graduate.school || '學校未知'} · {profileData.graduate.grade || '年級未知'} 級
                                </span>
                              )}
                            </div>
                          </div>
                          {/* 分享下拉選單（DaisyUI dropdown 取代 react-bootstrap DropdownButton） */}
                          <div className="dropdown dropdown-end share-dropdown">
                            <label tabIndex={0} className="btn btn-sm btn-outline btn-primary gap-1">
                              <FaShareAlt /> 分享
                            </label>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box shadow-lg z-10 w-44 p-2 mt-1">
                              <li>
                                <button type="button" onClick={() => handleShare('facebook')}>
                                  <FaFacebookF className="mr-2" /> Facebook
                                </button>
                              </li>
                              <li>
                                <button type="button" onClick={() => handleShare('line')}>
                                  <FaLine className="mr-2" /> LINE
                                </button>
                              </li>
                              <li>
                                <button type="button" onClick={() => handleShare('twitter')}>
                                  <FaTwitter className="mr-2" /> Twitter
                                </button>
                              </li>
                              <div className="divider my-1"></div>
                              <li
                                className={`tooltip tooltip-left ${showCopyTooltip ? 'tooltip-open' : ''}`}
                                data-tip="已複製！"
                              >
                                <button type="button" onClick={() => handleShare('copy')}>
                                  <FaLink className="mr-2" /> 複製連結
                                </button>
                              </li>
                            </ul>
                          </div>
                    </div>
                  </div>

                      <hr className="my-4" />

                      <div className="grid grid-cols-12">
                        <div className="col-span-12">
                          <h3 className="section-title text-xl font-semibold mb-3">個人簡介</h3>
                          {profileData.intro ? (
                            <p className="profile-intro text-base-content/60 leading-loose">{profileData.intro}</p>
                          ) : (
                            <div className="rounded-lg border border-base-300 bg-base-200 p-4" role="alert">
                              <h6 className="font-semibold mb-1">尚未提供個人簡介</h6>
                              <p className="mb-0 text-sm text-base-content/60">系友可在個人設定中完善個人資料，讓更多人了解您的專業與特長</p>
                            </div>
                          )}
                        </div>
                      </div>

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
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 主要內容區 - 使用標籤頁切換不同內容 */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="main-content mb-5"
          >
            <div className="card bg-base-100" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <div className="card-body">
                {/* 標籤頁導覽（DaisyUI/Tailwind 取代 react-bootstrap Tabs pills） */}
                <div role="tablist" className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    role="tab"
                    onClick={() => setActiveTab('gallery')}
                    className={`py-3 rounded-md font-semibold text-[0.95rem] border transition-all duration-200 ${
                      activeTab === 'gallery'
                        ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                        : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:bg-[#eff6ff] hover:text-[#1e3a8a] hover:border-[#bfdbfe]'
                    }`}
                  >
                    照片集錦
                  </button>
                  <button
                    type="button"
                    role="tab"
                    onClick={() => setActiveTab('company')}
                    className={`py-3 rounded-md font-semibold text-[0.95rem] border transition-all duration-200 ${
                      activeTab === 'company'
                        ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                        : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:bg-[#eff6ff] hover:text-[#1e3a8a] hover:border-[#bfdbfe]'
                    }`}
                  >
                    公司資訊
                  </button>
                </div>

                {/* 照片集錦標籤頁 */}
                {activeTab === 'gallery' && (
                  <div className="py-4">
                    <h3 className="section-title text-xl font-semibold mb-4">系友照片集錦</h3>
                {personalPhotos.length > 0 ? (
                  <div className="photo-album-container">
                    <div className="grid grid-cols-12 gap-4 photo-grid">
                      {personalPhotos.map((photo, index) => (
                        <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 photo-col mb-4" key={photo.key}>
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
                        </div>
                      ))}
                    </div>
                  </div>
                  ) : (
                    <div className="alert alert-info flex-col text-center py-12" role="alert">
                      <div className="mb-3" style={{ fontSize: '48px' }}>📷</div>
                      <h5 className="font-semibold">目前沒有個人照片</h5>
                      <p className="mb-0">系友尚未上傳照片集錦，您可以稍後再回來查看</p>
                    </div>
                  )}
                  </div>
                )}
                {/* 公司資訊標籤頁 */}
                {activeTab === 'company' && (
                  <div className="py-4">
                {profileData.company ? (
                  <>
                      <div className="grid grid-cols-12 gap-4 company-header mb-4">
                        <div className="col-span-12 md:col-span-4 mb-4">
                          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                            <img
                              src={profileData.company.photo ? `${process.env.REACT_APP_BASE_URL}${profileData.company.photo}` : 'https://via.placeholder.com/400x300/e9ecef/495057?text=No+Company+Photo'}
                              className="company-image shadow rounded w-full max-w-full h-auto"
                              alt={profileData.company.name || '公司'}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x300/e9ecef/495057?text=No+Company+Photo';
                              }}
                            />
                          </motion.div>
                        </div>
                        <div className="col-span-12 md:col-span-8">
                          <h2 className="company-title text-2xl font-semibold mb-3">{profileData.company.name || '公司名稱未提供'}</h2>
                          <p className="company-description text-base-content/60 leading-loose">
                            {profileData.company.description || '尚未提供公司描述'}
                          </p>

                          <div className="company-contact-info mt-4">
                            <div className="grid grid-cols-12 gap-4">
                              <div className="col-span-12 md:col-span-6 mb-3">
                                <div className="flex items-center">
                                  <FaMapMarkerAlt className="text-primary mr-2" />
                                  <span className="text-base-content/60">{profileData.company.address || "未提供地址"}</span>
                                </div>
                              </div>
                              <div className="col-span-12 md:col-span-6 mb-3">
                                <div className="flex items-center">
                                  <FaPhoneAlt className="text-primary mr-2" />
                                  <span className="text-base-content/60">{profileData.company.phone_number || "未提供聯絡電話"}</span>
                                </div>
                              </div>
                              <div className="col-span-12 md:col-span-6 mb-3">
                                <div className="flex items-center">
                                  <FaEnvelope className="text-primary mr-2" />
                                  <span className="text-base-content/60">{profileData.company.email || "未提供電子郵件"}</span>
                                </div>
                              </div>
                              <div className="col-span-12 md:col-span-6 mb-3">
                                <div className="flex items-center">
                                  <FaGlobe className="text-primary mr-2" />
                                  {profileData.company.website ? (
                                    <a href={profileData.company.website} target="_blank" rel="noopener noreferrer" className="no-underline">
                                      {profileData.company.website}
                                    </a>
                                  ) : (
                                    <span className="text-base-content/60">未提供網站</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                      </div>
                    </div>

                      <div className="mb-5">
                        <div>
                          <div className="product-info-card" style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                            <h5 style={{ background: '#1e3a8a', color: '#ffffff', fontWeight: '700', border: 'none', padding: '0.875rem 1.5rem', fontSize: '1rem', margin: 0 }}>
                              我們的產品
                            </h5>
                            <div className="p-4">
                              <div className="font-semibold text-base mb-2">
                                {profileData.company.products || "尚未提供產品資訊"}
                              </div>
                              <p className="text-base-content/60">
                                {profileData.company.product_description || "尚未提供產品描述"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h3 className="section-title text-xl font-semibold mb-4">商品展示</h3>
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
                                <div className="card product-card">
                                  <div className="product-img-container">
                                    <img
                                      src={photo.src}
                                      alt={photo.title}
                                      className="product-img"
                                    />
                                  </div>
                                  <div className="card-body">
                                    <h5 className="card-title">{photo.title}</h5>
                                    {photo.description && <p>{photo.description}</p>}
                                  </div>
                                </div>
                              </motion.div>
                            </SwiperSlide>
                          ))}
                        </SwiperReact>
                      </div>
                      ) : (
                        <div className="rounded-lg border border-base-300 bg-base-200 p-4" role="alert">
                          <h5 className="font-semibold mb-1">尚未提供公司更多照片</h5>
                          <p className="mb-0">系友可以在設定頁面添加公司產品相關資訊</p>
                        </div>

                  )}

                      <ProductDisplay memberId={id} className="mt-5" />

                      <h3 className="section-title text-xl font-semibold mt-5 mb-4">我們的位置</h3>
                      <div className="card map-card shadow-sm border-0 overflow-hidden">
                        <div className="card-body p-0">
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
                      </div>
                    </div>
                  </>
                  ) : (
                    <div className="alert alert-info flex-col text-center py-12" role="alert">
                      <div className="mb-3" style={{ fontSize: '48px' }}>🏢</div>
                      <h4 className="font-semibold">系友尚未添加公司資訊</h4>
                      <p className="mb-0">此系友目前未提供任何公司相關資訊</p>
                    </div>
                  )}
                  </div>
                )}
              </div>
            </div>
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
    </div>
  );
};

export default ProfilePage;
