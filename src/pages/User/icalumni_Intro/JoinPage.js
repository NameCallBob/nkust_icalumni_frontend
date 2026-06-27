import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Spinner } from 'components/common/ui';
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
      <div className="container mx-auto px-4 text-center my-12">
        <Spinner center label="載入中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 my-12">
                  <SEO
      main={false}
      title="加入我們"
        description="成為智慧商務系友會的一員，獲取資源、商務合作，並與系友共同成長。立即加入！"
        keywords={["智慧商務", "加入", "交流"]}
      />
      {/* 幻燈片元件 */}
      {slides.largeImages.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={slides.largeImages.length > 1}
          className="rounded-xl overflow-hidden shadow-lg"
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
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent text-white text-center py-6">
                    <h3 className="text-lg font-semibold">{image.caption}</h3>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center my-4">無展示圖片</p>
      )}
      <br>
      </br>
      {/* 使用 dangerouslySetInnerHTML 渲染淨化後的 HTML */}
      <div dangerouslySetInnerHTML={{ __html: bodyContent }} style={{ lineHeight: '1.8' }} />
      <br>
      </br>
      {/* 小圖展示 */}
      <div className="mt-4">
        <h4 className="text-center text-xl font-semibold">相關圖片</h4>
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
          <p className="text-center">無相關圖片</p>
        )}
      </div>
    </div>
  );
};

export default JoinUsPage;
