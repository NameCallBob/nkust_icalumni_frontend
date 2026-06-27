import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Spinner, Section, EmptyState } from 'components/common/ui';
import { ImageOff, Sparkles } from 'lucide-react';
import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import SEO from "SEO";

const JoinUsPage = () => {
  const [slides, setSlides] = useState({ largeImages: [], smallImages: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bodyContent,setBodyContent] = useState()
  useEffect(() => {
    const fetchHTMLContent = async () => {
      try {
        setIsLoading(true);
        // 替換成你的後端 API 端點
        let response,pic_response
        await Axios().get('info/requirement/latest/')
        .then((res) => {
          response = res.data
        })
        await Axios().get('info/requirement-images/query_active_images/')
        .then((res) => {
          pic_response = res.data
        })
        // 根據 image_type 分類
        const largeImages = pic_response.filter((img) => img.image_type === 'large');
        const smallImages = pic_response.filter((img) => img.image_type === 'small');


        // 使用 DOMPurify 淨化 HTML 內容以防止 XSS 攻擊
        setBodyContent(response.description)
        setSlides({ largeImages, smallImages });
        setIsLoading(false);
      } catch (err) {
        setError('載入內容時發生錯誤');
        setIsLoading(false);
        // console.error('Error fetching HTML content:', err);
      }
    };

    fetchHTMLContent();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Spinner center label="載入中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-error/20 bg-error/5 px-6 py-8 text-center">
          <p className="font-serif text-lg font-bold text-error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100">
      <SEO
        main={false}
        title="加入我們"
        description="成為智慧商務系友會的一員，獲取資源、商務合作，並與系友共同成長。立即加入！"
        keywords={["智慧商務", "加入", "交流"]}
      />

      {/* Hero 形象橫幅 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a]">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-secondary uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Join Us
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            加入智慧商務系友會
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-blue-100/80 leading-relaxed">
            獲取資源、商務合作，並與系友共同成長。立即成為我們的一員。
          </p>
          <div className="mx-auto mt-7 h-1 w-20 rounded-full bg-gradient-to-r from-secondary to-secondary/40" />
        </div>
      </div>

      {/* 幻燈片元件 */}
      <Section width="wide" className="!py-10 sm:!py-12">
        {slides.largeImages.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop={slides.largeImages.length > 1}
            className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-base-200"
          >
            {slides.largeImages.map((image, index) => (
              <SwiperSlide key={`large-${index}`}>
                <div className="relative aspect-[16/7] w-full bg-base-200">
                  <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src={image.file}
                    alt={image.alt || `Slide ${index + 1}`}
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/85 via-slate-900/40 to-transparent text-white text-center px-4 py-6 sm:py-8">
                      <h3 className="font-serif text-lg sm:text-2xl font-semibold break-words">{image.caption}</h3>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="rounded-2xl border border-dashed border-base-300 bg-base-100">
            <EmptyState icon={<ImageOff className="h-8 w-8" />} title="無展示圖片" />
          </div>
        )}
      </Section>

      {/* 內容說明（後端 HTML） */}
      <Section title="加入須知" eyebrow="Membership" center width="narrow" className="!pt-2">
        <article
          className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-primary prose-img:rounded-xl text-base-content/80 leading-[1.9] break-words"
          dangerouslySetInnerHTML={{ __html: bodyContent }}
        />
      </Section>

      {/* 小圖展示 */}
      <Section title="相關圖片" eyebrow="Gallery" center width="wide" className="!pt-0 pb-16">
        {slides.smallImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {slides.smallImages.map((image, index) => (
              <div
                key={`small-${index}`}
                className="overflow-hidden rounded-2xl bg-base-100 shadow-md ring-1 ring-base-200 transition-shadow hover:shadow-xl"
              >
                <img
                  className="block w-full h-full object-contain"
                  src={image.file}
                  alt={image.alt || `Small Image ${index + 1}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-base-300 bg-base-100">
            <EmptyState icon={<ImageOff className="h-8 w-8" />} title="無相關圖片" />
          </div>
        )}
      </Section>
    </div>
  );
};

export default JoinUsPage;
