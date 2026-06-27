import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { Spinner } from 'components/common/ui';
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
      <div className="container mx-auto px-4 text-center my-12">
        <Spinner center label="載入中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 my-8">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 my-12">
                  <SEO
      main={false}
      title="簡介"
        description="了解國立高雄科技大學智慧商務系友會的成立理念、核心價值與使命，促進系友交流與商務發展。"
        keywords={["智慧商務", "簡介", "介紹","了解"]}
      />
      {/* 幻燈片元件 */}
      {slides.largeImages.length > 0 ? (
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={slides.largeImages.length > 1}
          className="w-full rounded-lg overflow-hidden shadow-lg"
        >
          {slides.largeImages.map((image, index) => (
            <SwiperSlide key={`large-${index}`}>
              <div className="relative">
                <img
                  className="block w-full"
                  src={image.file}
                  alt={image.alt || `Slide ${index + 1}`}
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
                {image.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent text-white text-center p-4">
                    <h3 className="text-lg font-semibold">{image.caption}</h3>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center my-6 text-base-content/60">無展示圖片</p>
      )}
      <br>
      </br>
      {/* 使用 dangerouslySetInnerHTML 渲染淨化後的 HTML */}
      <div dangerouslySetInnerHTML={{ __html: bodyContent }} style={{ lineHeight: '1.8' }} />
      <br>
      </br>
      {/* 小圖展示 */}
      <div className="mt-4">
        <h4 className="text-center text-xl font-semibold mb-4">相關圖片</h4>
        {slides.smallImages.length > 0 ? (
          <div className="flex flex-wrap justify-center">
            {slides.smallImages.map((image, index) => (
              <div
                key={`small-${index}`}
                className="m-2"
                style={{ width: '600px' }}
              >
                <img
                  className="block w-full"
                  src={image.file}
                  alt={image.alt || `Small Image ${index + 1}`}
                  style={{ objectFit: 'contain' }} // 保持圖片完整
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-base-content/60">無相關圖片</p>
        )}
      </div>
    </div>
  );
};

export default IntroPage;
