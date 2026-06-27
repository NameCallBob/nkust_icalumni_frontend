import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Spinner, Section, EmptyState } from 'components/common/ui';
import { ImageOff, AlertTriangle, Images } from 'lucide-react';
import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';

const LeaderPage = () => {
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
        await Axios().get('info/associations/latest/')
        .then((res) => {
          response = res.data
        })
        await Axios().get('info/association-images/query_active_images/')
        .then((res) => {
          pic_response = res.data
        })
        // 根據 image_type 分類
        const largeImages = pic_response.filter((img) => img.image_type === 'large');
        const smallImages = pic_response.filter((img) => img.image_type === 'small');

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
      <div className="min-h-[60vh] flex items-center justify-center bg-base-100">
        <Spinner size="lg" center label="載入中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-base-100 px-4">
        <EmptyState
          icon={<AlertTriangle className="h-8 w-8 text-error" />}
          title="載入失敗"
          description={error}
        />
      </div>
    );
  }

  return (
    <div className="bg-base-100">
      {/* 形象標題區 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] text-white">
        <div className="absolute inset-0 opacity-10 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-secondary uppercase">
            NKUST · 智慧商務系系友會
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            理事長的話
          </h1>
          <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-secondary to-white/70" />
        </div>
      </div>

      {/* 大圖幻燈片 */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 -mt-10 sm:-mt-12 relative z-10">
        {slides.largeImages.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={slides.largeImages.length > 1}
            pagination={slides.largeImages.length > 1 ? { clickable: true } : false}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={slides.largeImages.length > 1}
            className="leader-carousel rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5"
          >
            {slides.largeImages.map((image, index) => (
              <SwiperSlide key={`large-${index}`}>
                <div className="relative aspect-[16/7] w-full bg-base-200">
                  <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src={image.file}
                    alt={image.alt || `Slide ${index + 1}`}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  {image.caption && (
                    <div className="absolute inset-x-0 bottom-0 z-[5] bg-gradient-to-t from-[#0f172a]/85 via-[#0f172a]/40 to-transparent px-6 pb-6 pt-12">
                      <h3 className="font-serif text-lg sm:text-2xl font-bold text-white drop-shadow">
                        {image.caption}
                      </h3>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="rounded-2xl border border-base-200 bg-base-100 shadow-sm">
            <EmptyState
              icon={<ImageOff className="h-8 w-8" />}
              title="無展示圖片"
              description="目前尚未上傳形象主視覺。"
            />
          </div>
        )}
      </div>

      {/* 內文 */}
      <Section width="narrow" className="pt-10 sm:pt-14 pb-4">
        <div className="rounded-2xl bg-white p-6 sm:p-10 shadow-sm ring-1 ring-base-200">
          <div
            className="prose prose-slate max-w-none break-words leading-relaxed text-base-content/90 prose-headings:font-serif prose-headings:text-primary prose-a:text-primary prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: bodyContent }}
            style={{ lineHeight: '1.8' }}
          />
        </div>
      </Section>

      {/* 相關圖片 */}
      <Section title="相關圖片" eyebrow="Gallery" center width="wide" className="pt-6">
        {slides.smallImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {slides.smallImages.map((image, index) => (
              <figure
                key={`small-${index}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-base-200 transition hover:shadow-lg"
              >
                <div className="flex items-center justify-center bg-base-200/60 p-3">
                  <img
                    className="max-h-[420px] w-full object-contain transition duration-300 group-hover:scale-[1.02]"
                    src={image.file}
                    alt={image.alt || `Small Image ${index + 1}`}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                {image.caption && (
                  <figcaption className="px-4 py-3 text-center text-sm font-medium text-base-content/70 break-words">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Images className="h-8 w-8" />}
            title="無相關圖片"
            description="目前尚未上傳相關圖片。"
          />
        )}
      </Section>
    </div>
  );
};

export default LeaderPage;
