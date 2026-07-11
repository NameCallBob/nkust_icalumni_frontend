import React, { useState, useEffect, useRef } from 'react';
import { DEFAULT_IMAGES } from '../../utils/imageDefaults';

/**
 * LazyImage 元件 - 提供圖片延遲載入與 SEO 優化
 * @param {string} src - 圖片來源
 * @param {string} alt - 替代文字（必填，對 SEO 很重要）
 * @param {string} title - 圖片標題
 * @param {string} className - CSS 類別
 * @param {string} placeholder - 佔位圖片
 * @param {number} width - 圖片寬度
 * @param {number} height - 圖片高度
 * @param {string} loading - 載入策略 ('lazy' | 'eager')
 * @param {string} imageType - 圖片類型 ('avatar', 'company', 'product', 'activity', 'default')
 */
const LazyImage = ({
  src,
  alt,
  title,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg==',
  width,
  height,
  loading = 'lazy',
  srcSet,
  sizes,
  imageType = 'default'
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imgRef = useRef(null);

  // 使用 Intersection Observer 檢測圖片是否進入視窗
  useEffect(() => {
    if (loading === 'eager') {
      setImageSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '100px'
      }
    );

    const node = imgRef.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, [src, loading]);

  // 當圖片進入視窗時載入真實圖片
  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.src = src;

      if (srcSet) {
        img.srcset = srcSet;
      }

      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };

      img.onerror = () => {
        // 載入失敗時使用對應類型的預設圖片
        const defaultSrc = DEFAULT_IMAGES[imageType] || DEFAULT_IMAGES.default;
        setImageSrc(defaultSrc);
        setHasError(true);
        setIsLoaded(true);
      };
    }
  }, [isInView, src, srcSet, placeholder, imageType]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      title={title || alt}
      className={`${className} ${isLoaded ? 'loaded' : 'loading'} ${hasError ? 'image-error' : ''}`}
      width={width}
      height={height}
      loading={loading}
      srcSet={isLoaded ? srcSet : undefined}
      sizes={sizes}
      style={{
        transition: 'opacity 0.3s ease-in-out',
        opacity: isLoaded ? 1 : 0.7,
        backgroundColor: hasError ? '#f0f0f0' : 'transparent'
      }}
      onError={(e) => {
        // 額外的錯誤處理，避免預設圖片也失敗
        if (e.target.src !== placeholder && !hasError) {
          const fallbackSrc = DEFAULT_IMAGES[imageType] || DEFAULT_IMAGES.default;
          e.target.src = fallbackSrc;
          setHasError(true);
        }
      }}
    />
  );
};

export default LazyImage;