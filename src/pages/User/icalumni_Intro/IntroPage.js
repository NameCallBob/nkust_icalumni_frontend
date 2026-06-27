import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { Spinner, Section, EmptyState } from 'components/common/ui';
import { ImageOff, AlertTriangle } from 'lucide-react';
import SEO from "SEO";

const IntroPage = () => {
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
        <div className="flex items-center gap-3 rounded-xl border border-error/30 bg-error/10 px-6 py-4 text-error">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-200/40 min-h-screen">
      <SEO
        main={false}
        title="簡介"
        description="了解國立高雄科技大學智慧商務系友會的成立理念、核心價值與使命，促進系友交流與商務發展。"
        keywords={["智慧商務", "簡介", "介紹", "了解"]}
      />

      {/* Hero 幻燈片 */}
      <section className="px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="mx-auto max-w-6xl">
          {slides.largeImages.length > 0 ? (
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              loop={slides.largeImages.length > 1}
              className="w-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-primary/10"
            >
              {slides.largeImages.map((image, index) => (
                <SwiperSlide key={`large-${index}`}>
                  <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-primary/5">
                    <img
                      className="absolute inset-0 h-full w-full object-cover"
                      src={image.file}
                      alt={image.alt || `Slide ${index + 1}`}
                    />
                    {image.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f172a]/85 via-[#0f172a]/40 to-transparent px-6 pb-8 pt-16 text-center">
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
            <div className="rounded-2xl border border-dashed border-primary/20 bg-base-100">
              <EmptyState title="無展示圖片" description="尚未上傳輪播圖片" />
            </div>
          )}
        </div>
      </section>

      {/* 簡介內文 */}
      <Section title="系友會簡介" eyebrow="ABOUT US" center width="default">
        <div className="rounded-2xl bg-base-100 p-6 sm:p-10 shadow-sm ring-1 ring-primary/5">
          <div
            className="prose prose-slate max-w-none leading-[1.9] text-base-content/80 break-words prose-headings:font-serif prose-headings:text-primary prose-a:text-secondary prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: bodyContent }}
          />
        </div>
      </Section>

      {/* 相關圖片 */}
      <Section title="相關圖片" eyebrow="GALLERY" center width="wide" className="pt-0">
        {slides.smallImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {slides.smallImages.map((image, index) => (
              <div
                key={`small-${index}`}
                className="group overflow-hidden rounded-2xl bg-base-100 shadow-sm ring-1 ring-primary/5 transition hover:shadow-lg"
              >
                <div className="aspect-[4/3] w-full bg-primary/5">
                  <img
                    className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                    src={image.file}
                    alt={image.alt || `Small Image ${index + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-primary/20 bg-base-100">
            <EmptyState
              icon={<ImageOff className="h-10 w-10 text-base-content/30" />}
              title="無相關圖片"
              description="目前沒有相關圖片可供展示"
            />
          </div>
        )}
      </Section>
    </div>
  );
};

export default IntroPage;
