import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Axios from 'common/Axios';
import AppModal from 'components/common/AppModal';
import LoadingSpinner from 'components/LoadingSpinner';
import SEO from 'SEO';
import { Section, Card, EmptyState } from 'components/common/ui';

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
      {title && (
        <div className="mt-10 mb-4 flex items-center gap-3">
          <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-secondary to-primary" />
          <h4 className="font-serif text-xl sm:text-2xl font-bold text-primary">{title}</h4>
        </div>
      )}

      {/* 改進的輪播效果 */}
      <Card padding="none" className="overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={images.length > 1}
          pagination={images.length > 1 ? { clickable: true } : false}
          className="image-slider"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="group relative bg-slate-50">
                <img
                  className="block w-full transition-transform duration-300 group-hover:scale-[1.01]"
                  src={image}
                  alt={`圖片-${index + 1}`}
                  style={{
                    height: '420px',
                    objectFit: 'contain',
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
            </SwiperSlide>
          ))}
        </Swiper>
      </Card>
      {images.length > 1 && (
        <p className="mt-3 text-center text-sm text-base-content/50">
          點擊圖片可放大查看 ({currentIndex + 1}/{images.length})
        </p>
      )}

      {/* 改進的放大模式 */}
      <AppModal
        show={showModal}
        onHide={handleCloseModal}
        size="xl"
        variant="showcase"
        title="圖片詳情"
        icon={<ImageIcon size={18} />}
      >
        {modalImage && (
          <div className="relative bg-black">
            <img
              src={modalImage}
              alt="放大圖片"
              style={{
                width: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />

            {images.length > 1 && (
              <>
                {/* 上一張/下一張按鈕 */}
                <button
                  type="button"
                  className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center justify-center h-full w-[10%] text-white/80 hover:text-white transition-colors"
                  onClick={handlePrev}
                  aria-label="上一張"
                >
                  <ChevronLeft size={40} />
                </button>
                <button
                  type="button"
                  className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center justify-center h-full w-[10%] text-white/80 hover:text-white transition-colors"
                  onClick={handleNext}
                  aria-label="下一張"
                >
                  <ChevronRight size={40} />
                </button>

                {/* 圖片計數器 */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-3 text-white">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        )}
      </AppModal>
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
      <div className="min-h-[60vh] bg-base-200">
        <Section width="narrow">
          <EmptyState title="載入失敗" description={error} />
        </Section>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[60vh] bg-base-200">
        <Section width="narrow">
          <EmptyState title="找不到活動資訊" description="此活動可能已下架或網址有誤。" />
        </Section>
      </div>
    );
  }

  return (
    <div className="bg-base-200">
      <SEO
        main={false}
        title={event.title}
        description="深入了解智慧商務系友會各個成員的背景、專長與成就，促進交流與合作。"
        keywords={["智慧商務", "系友詳細", "會員資訊"]}
      />

      {/* 頂部深藍標題橫幅 */}
      <header className="bg-gradient-to-br from-[#0f172a] via-primary to-[#0f172a] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14 sm:py-20">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-secondary uppercase">
            系友會活動
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight break-words">
            {event.title}
          </h1>
          <div className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-secondary to-white/40" />
        </div>
      </header>

      {/* 主內容區 */}
      <Section width="narrow" className="pt-8 sm:pt-12">
        {/* 活動內容區塊 */}
        <Card padding="lg">
          <div
            dangerouslySetInnerHTML={{ __html: event.content }}
            className="max-w-none break-words leading-relaxed text-base-content/80
              [&_h1]:font-serif [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-primary [&_h1]:mt-6 [&_h1]:mb-3
              [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-primary [&_h2]:mt-6 [&_h2]:mb-3
              [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-primary [&_h3]:mt-5 [&_h3]:mb-2
              [&_p]:my-3 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
              [&_img]:rounded-xl [&_img]:my-4 [&_img]:mx-auto [&_img]:max-w-full
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_li]:my-1
              [&_blockquote]:border-l-4 [&_blockquote]:border-secondary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-base-content/60"
          ></div>
        </Card>

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
      </Section>
    </div>
  );
};

export default EventDetail;
