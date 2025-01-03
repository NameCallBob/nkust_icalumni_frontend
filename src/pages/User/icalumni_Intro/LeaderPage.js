import { Container, Spinner, Alert, Carousel } from 'react-bootstrap';

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
        console.error('Error fetching HTML content:', err);
      }
    };

    fetchHTMLContent();
  }, []);

  if (isLoading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">載入中...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* 幻燈片元件 */}
      {slides.largeImages.length > 0 ? (
        <Carousel>
          {slides.largeImages.map((image, index) => (
            <Carousel.Item key={`large-${index}`}>
              <img
                className="d-block w-100"
                src={image.file}
                alt={image.alt || `Slide ${index + 1}`}
                style={{ maxHeight: '300px', objectFit: 'cover' }}
              />
              {image.caption && (
                <Carousel.Caption>
                  <h3>{image.caption}</h3>
                </Carousel.Caption>
              )}
            </Carousel.Item>
          ))}
        </Carousel>
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
        <h4 className="text-center">相關圖片</h4>
        {slides.smallImages.length > 0 ? (
          <div className="d-flex flex-wrap justify-content-center">
            {slides.smallImages.map((image, index) => (
              <div
                key={`small-${index}`}
                className="m-2"
                style={{ width: '600px' }}
              >
                <img
                  className="d-block w-100"
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
    </Container>
  );
};

export default LeaderPage;