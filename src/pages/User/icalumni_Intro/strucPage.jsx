import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import DOMPurify from 'dompurify';
import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { Spinner, Section, Card, EmptyState } from 'components/common/ui';
import { Network, Images, AlertCircle } from 'lucide-react';
import SEO from 'SEO';

const StructurePage = () => {
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
        await Axios().get('info/structures/latest/')
        .then((res) => {
          response = res.data
        })
        await Axios().get('info/structure-images/query_active_images/')
        .then((res) => {
          pic_response = res.data
        })
        // 根據 image_type 分類
        const largeImages = pic_response.filter((img) => img.image_type === 'large');
        const smallImages = pic_response.filter((img) => img.image_type === 'small');


        // 使用 DOMPurify 淨化 HTML 內容以防止 XSS 攻擊
        const sanitizedHTML = DOMPurify.sanitize(response.description);
        setBodyContent(sanitizedHTML)
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
        <Card padding="lg" className="max-w-md w-full text-center border border-error/20">
          <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 text-error">
            <AlertCircle className="h-7 w-7" />
          </span>
          <p className="font-serif text-lg font-bold text-base-content">載入失敗</p>
          <p className="mt-2 text-sm text-base-content/60">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-base-200/40 min-h-screen">
      <SEO
        main={false}
        title="組織架構"
        description="智慧商務系友會的組織架構介紹，包括核心成員與運作模式。"
        keywords={["智慧商務", "組織", "架構"]}
      />

      {/* 深藍 Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_45%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase text-white/80 ring-1 ring-white/15">
            <Network className="h-4 w-4 text-secondary" />
            Organization
          </span>
          <h1 className="mt-5 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            組織架構
          </h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-secondary to-white/60" />
          <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base text-white/70 leading-relaxed">
            智慧商務系友會的組織架構介紹，包括核心成員與運作模式。
          </p>
        </div>
      </header>

      {/* 主視覺輪播 */}
      <Section width="wide" className="!pb-4">
        {slides.largeImages.length > 0 ? (
          <Card padding="none" className="overflow-hidden">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation={slides.largeImages.length > 1}
              pagination={slides.largeImages.length > 1 ? { clickable: true } : false}
              loop={slides.largeImages.length > 1}
              className="rounded-2xl overflow-hidden"
            >
              {slides.largeImages.map((image, index) => (
                <SwiperSlide key={`large-${index}`}>
                  <div className="relative aspect-[16/7] w-full bg-[#0f172a]">
                    <img
                      className="absolute inset-0 h-full w-full object-cover"
                      src={image.file}
                      alt={image.alt || `Slide ${index + 1}`}
                    />
                    {image.caption && (
                      <>
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f172a]/80 to-transparent" />
                        <div className="absolute bottom-6 left-0 right-0 px-6 text-center">
                          <h3 className="font-serif text-lg sm:text-2xl font-semibold text-white drop-shadow break-words">
                            {image.caption}
                          </h3>
                        </div>
                      </>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </Card>
        ) : (
          <Card padding="lg">
            <EmptyState
              icon={<Images className="h-8 w-8" />}
              title="無展示圖片"
              description="目前尚未上傳組織架構主視覺。"
            />
          </Card>
        )}
      </Section>

      {/* 內文 */}
      {bodyContent && (
        <Section width="default" className="!py-6">
          <Card padding="lg">
            <div
              className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-primary prose-img:rounded-xl break-words"
              style={{ lineHeight: '1.8' }}
              dangerouslySetInnerHTML={{ __html: bodyContent }}
            />
          </Card>
        </Section>
      )}

      {/* 相關圖片 */}
      <Section title="相關圖片" eyebrow="Gallery" center width="wide">
        {slides.smallImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {slides.smallImages.map((image, index) => (
              <Card key={`small-${index}`} hover padding="none" className="overflow-hidden">
                <div className="bg-base-200 p-3">
                  <img
                    className="block w-full rounded-lg object-contain"
                    src={image.file}
                    alt={image.alt || `Small Image ${index + 1}`}
                  />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Images className="h-8 w-8" />}
            title="無相關圖片"
            description="目前尚未提供相關圖片。"
          />
        )}
      </Section>
    </div>
  );
};

export default StructurePage;
