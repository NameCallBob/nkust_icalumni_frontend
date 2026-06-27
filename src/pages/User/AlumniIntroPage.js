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
import { Building2, Images } from 'lucide-react';
import { Card, EmptyState, Spinner } from 'components/common/ui';
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

  // 區塊標題（深藍 + 金線）
  const SectionHeading = ({ children }) => (
    <div className="mb-6">
      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0f172a]">{children}</h3>
      <div className="mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-[#a0781c] to-[#1e3a8a]" />
    </div>
  );

  if (notfound) {
    return (
      <div className="min-h-[60vh] bg-base-200/40 px-4 py-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mx-auto w-full max-w-xl rounded-2xl border border-base-300/70 bg-base-100 p-8 sm:p-12 text-center shadow-sm"
        >
          <img
            src={notfoundpic}
            alt="資料未開放"
            className="mx-auto max-w-xs w-full h-auto"
          />
          <h3 className="mt-6 font-serif text-2xl font-bold text-[#0f172a]">此系友資料目前暫不開放</h3>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-base-200/40 px-4 py-20 flex items-center justify-center">
        <Spinner size="lg" center label="正在載入系友資料，請稍候..." />
      </div>
    );
  }

  return (
    <div className="bg-base-200/40 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
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
            className="mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
          >
            <Card padding="none" className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* 深藍品牌面板 + 圓形大頭照 */}
                <div className="lg:col-span-4 bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] flex items-center justify-center px-6 py-10">
                  <div className="text-center">
                    <div className="mx-auto h-44 w-44 sm:h-52 sm:w-52 rounded-full overflow-hidden ring-4 ring-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
                      <img
                        src={profileData.photo ? process.env.REACT_APP_BASE_URL + profileData.photo : 'https://via.placeholder.com/300x300/e9ecef/495057?text=No+Photo'}
                        className="h-full w-full object-cover"
                        alt={profileData.name || '系友'}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300/e9ecef/495057?text=No+Photo';
                        }}
                      />
                    </div>
                    {/* 手機版：姓名/職稱/學歷顯示於頭像下 */}
                    <div className="lg:hidden mt-5">
                      <h1 className="font-serif text-2xl font-bold text-white">{profileData.name || '姓名未提供'}</h1>
                      {profileData.position && profileData.position.title && (
                        <p className="mt-1 text-white/80 text-sm">{profileData.position.title}</p>
                      )}
                      {profileData.graduate && (
                        <span className="mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs text-white">
                          {profileData.graduate.school || '學校未知'} · {profileData.graduate.grade || '年級未知'} 級
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 資訊面板 */}
                <div className="lg:col-span-8 p-6 sm:p-8">
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    {/* 桌機版：姓名/標籤 */}
                    <div className="hidden lg:block">
                      <h1 className="font-serif text-3xl font-bold text-[#0f172a] tracking-tight">{profileData.name || '姓名未提供'}</h1>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {profileData.position && profileData.position.title && (
                          <span className="inline-flex items-center rounded-lg bg-[#1e3a8a] px-3 py-1.5 text-sm font-semibold text-white">
                            {profileData.position.title}
                          </span>
                        )}
                        {profileData.graduate && (
                          <span className="inline-flex items-center rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1.5 text-sm font-semibold text-[#1e3a8a]">
                            {profileData.graduate.school || '學校未知'} · {profileData.graduate.grade || '年級未知'} 級
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 分享下拉選單（DaisyUI dropdown 取代 react-bootstrap DropdownButton） */}
                    <div className="dropdown dropdown-end ml-auto">
                      <label tabIndex={0} className="btn btn-sm btn-outline btn-primary gap-1.5 rounded-lg">
                        <FaShareAlt /> 分享
                      </label>
                      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-xl shadow-xl border border-base-300/70 z-10 w-48 p-2 mt-2">
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

                  <hr className="my-6 border-base-300/70" />

                  <SectionHeading>個人簡介</SectionHeading>
                  {profileData.intro ? (
                    <p className="text-[#475569] leading-loose break-words whitespace-pre-line">{profileData.intro}</p>
                  ) : (
                    <div className="rounded-xl border border-dashed border-base-300 bg-base-200/60 p-5">
                      <h6 className="font-semibold text-[#475569] mb-1">尚未提供個人簡介</h6>
                      <p className="mb-0 text-sm text-base-content/60">系友可在個人設定中完善個人資料，讓更多人了解您的專業與特長</p>
                    </div>
                  )}

                  {/* <div className="social-links mt-3">
                    {profileData.social_links && profileData.social_links.linkedin && (
                      <a href={profileData.social_links.linkedin} className="mr-3" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin size={24} />
                      </a>
                    )}
                    {profileData.social_links && profileData.social_links.github && (
                      <a href={profileData.social_links.github} className="mr-3" target="_blank" rel="noopener noreferrer">
                        <FaGithub size={24} />
                      </a>
                    )}
                    {profileData.social_links && profileData.social_links.instagram && (
                      <a href={profileData.social_links.instagram} className="mr-3" target="_blank" rel="noopener noreferrer">
                        <FaInstagram size={24} />
                      </a>
                    )}
                  </div> */}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 主要內容區 - 使用標籤頁切換不同內容 */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="mb-8"
          >
            <Card padding="md">
                {/* 標籤頁導覽（DaisyUI/Tailwind 取代 react-bootstrap Tabs pills） */}
                <div role="tablist" className="grid grid-cols-2 gap-3 mb-8">
                  <button
                    type="button"
                    role="tab"
                    onClick={() => setActiveTab('gallery')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[0.95rem] border transition-all duration-200 ${
                      activeTab === 'gallery'
                        ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-sm'
                        : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:bg-[#eff6ff] hover:text-[#1e3a8a] hover:border-[#bfdbfe]'
                    }`}
                  >
                    <Images className="h-4 w-4" /> 照片集錦
                  </button>
                  <button
                    type="button"
                    role="tab"
                    onClick={() => setActiveTab('company')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[0.95rem] border transition-all duration-200 ${
                      activeTab === 'company'
                        ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-sm'
                        : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:bg-[#eff6ff] hover:text-[#1e3a8a] hover:border-[#bfdbfe]'
                    }`}
                  >
                    <Building2 className="h-4 w-4" /> 公司資訊
                  </button>
                </div>

                {/* 照片集錦標籤頁 */}
                {activeTab === 'gallery' && (
                  <div className="py-2">
                    <SectionHeading>系友照片集錦</SectionHeading>
                {personalPhotos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {personalPhotos.map((photo, index) => (
                          <motion.div
                            key={photo.key}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.25 }}
                            className="group cursor-pointer overflow-hidden rounded-xl border border-base-300/70 bg-base-100 shadow-sm hover:shadow-lg transition-shadow"
                            onClick={() => handleOpenLightbox('personal', index)}
                          >
                            <div className="relative aspect-[4/3] overflow-hidden bg-base-200">
                              <img
                                src={photo.src}
                                alt={photo.title || '系友照片'}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            {photo.title && (
                              <div className="border-t border-base-200 p-4">
                                <h5 className="font-semibold text-[#0f172a] truncate">{photo.title}</h5>
                                {photo.description && <p className="mt-1 text-sm text-base-content/60 line-clamp-2">{photo.description}</p>}
                              </div>
                            )}
                          </motion.div>
                      ))}
                  </div>
                  ) : (
                    <EmptyState
                      icon={<Images className="h-8 w-8" />}
                      title="目前沒有個人照片"
                      description="系友尚未上傳照片集錦，您可以稍後再回來查看"
                    />
                  )}
                  </div>
                )}
                {/* 公司資訊標籤頁 */}
                {activeTab === 'company' && (
                  <div className="py-2">
                {profileData.company ? (
                  <>
                      <div className="rounded-2xl border border-base-300/70 bg-base-100 p-5 sm:p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div className="md:col-span-4">
                            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} className="overflow-hidden rounded-xl border border-base-300/70 shadow-sm">
                              <img
                                src={profileData.company.photo ? `${process.env.REACT_APP_BASE_URL}${profileData.company.photo}` : 'https://via.placeholder.com/400x300/e9ecef/495057?text=No+Company+Photo'}
                                className="w-full h-48 md:h-56 object-cover"
                                alt={profileData.company.name || '公司'}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/400x300/e9ecef/495057?text=No+Company+Photo';
                                }}
                              />
                            </motion.div>
                          </div>
                          <div className="md:col-span-8">
                            <h2 className="font-serif text-2xl font-bold text-[#0f172a] mb-3">{profileData.company.name || '公司名稱未提供'}</h2>
                            <p className="text-[#475569] leading-relaxed break-words whitespace-pre-line">
                              {profileData.company.description || '尚未提供公司描述'}
                            </p>

                            <div className="mt-5 rounded-xl border border-base-300/70 bg-base-200/50 p-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                <div className="flex items-start gap-2.5">
                                  <FaMapMarkerAlt className="text-[#1e3a8a] mt-0.5 flex-shrink-0" />
                                  <span className="text-[#475569] break-words">{profileData.company.address || "未提供地址"}</span>
                                </div>
                                <div className="flex items-start gap-2.5">
                                  <FaPhoneAlt className="text-[#1e3a8a] mt-0.5 flex-shrink-0" />
                                  <span className="text-[#475569] break-words">{profileData.company.phone_number || "未提供聯絡電話"}</span>
                                </div>
                                <div className="flex items-start gap-2.5">
                                  <FaEnvelope className="text-[#1e3a8a] mt-0.5 flex-shrink-0" />
                                  <span className="text-[#475569] break-words">{profileData.company.email || "未提供電子郵件"}</span>
                                </div>
                                <div className="flex items-start gap-2.5">
                                  <FaGlobe className="text-[#1e3a8a] mt-0.5 flex-shrink-0" />
                                  {profileData.company.website ? (
                                    <a href={profileData.company.website} target="_blank" rel="noopener noreferrer" className="text-[#1e3a8a] font-medium hover:underline break-all">
                                      {profileData.company.website}
                                    </a>
                                  ) : (
                                    <span className="text-[#475569]">未提供網站</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <div className="overflow-hidden rounded-xl border border-base-300/70">
                          <h5 className="bg-[#1e3a8a] text-white font-bold m-0 px-6 py-3.5 text-base">
                            我們的產品
                          </h5>
                          <div className="p-5">
                            <div className="font-semibold text-base text-[#0f172a] mb-2">
                              {profileData.company.products || "尚未提供產品資訊"}
                            </div>
                            <p className="text-[#475569] leading-relaxed break-words whitespace-pre-line mb-0">
                              {profileData.company.product_description || "尚未提供產品描述"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <SectionHeading>商品展示</SectionHeading>
                    {companyPhotos.length > 0 ? (
                      <div className="mb-8 pb-10">
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
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.3 }}
                                className="group cursor-pointer overflow-hidden rounded-xl border border-base-300/70 bg-base-100 shadow-sm hover:shadow-lg transition-shadow"
                                onClick={() => handleOpenLightbox('company', index)}
                              >
                                <div className="relative h-48 overflow-hidden bg-base-200">
                                  <img
                                    src={photo.src}
                                    alt={photo.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                </div>
                                <div className="p-4">
                                  <h5 className="font-semibold text-[#0f172a] truncate">{photo.title}</h5>
                                  {photo.description && <p className="mt-1 text-sm text-base-content/60 line-clamp-2">{photo.description}</p>}
                                </div>
                              </motion.div>
                            </SwiperSlide>
                          ))}
                        </SwiperReact>
                      </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-base-300 bg-base-200/60 p-5 mb-8">
                          <h5 className="font-semibold text-[#475569] mb-1">尚未提供公司更多照片</h5>
                          <p className="mb-0 text-sm text-base-content/60">系友可以在設定頁面添加公司產品相關資訊</p>
                        </div>
                  )}

                      <ProductDisplay memberId={id} className="mt-5" />

                      <div className="mt-10">
                        <SectionHeading>我們的位置</SectionHeading>
                        <div className="overflow-hidden rounded-xl border border-base-300/70 shadow-sm">
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
                            className="block w-full"
                          ></iframe>
                        </div>
                      </div>
                  </>
                  ) : (
                    <EmptyState
                      icon={<Building2 className="h-8 w-8" />}
                      title="系友尚未添加公司資訊"
                      description="此系友目前未提供任何公司相關資訊"
                    />
                  )}
                  </div>
                )}
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
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-4 pt-8 text-center text-white">
                      {props.slide.title && <h4 className="text-lg font-semibold">{props.slide.title}</h4>}
                      {props.slide.description && <p className="mt-1 text-sm opacity-90">{props.slide.description}</p>}
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
    </div>
  );
};

export default ProfilePage;
