import React from 'react';
import LazyImage from './LazyImage';

/**
 * ImageWithSEO 元件 - 提供完整 SEO 優化的圖片元件
 * 包含多種圖片格式支援、響應式圖片、延遲載入等功能
 */
const ImageWithSEO = ({
  src,
  alt,
  title,
  caption,
  className = '',
  containerClassName = '',
  width,
  height,
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  formats = ['webp', 'jpg'], // 支援的圖片格式
  isProduct = false,
  productInfo = {},
  onClick
}) => {
  // 產生不同尺寸的圖片 URL
  const generateSrcSet = (baseUrl, format) => {
    const sizes = [320, 640, 768, 1024, 1366, 1920];
    const extension = baseUrl.substring(baseUrl.lastIndexOf('.'));
    const urlWithoutExt = baseUrl.substring(0, baseUrl.lastIndexOf('.'));

    return sizes
      .map(size => `${urlWithoutExt}-${size}w.${format} ${size}w`)
      .join(', ');
  };

  // 產生結構化數據
  const generateImageSchema = () => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "contentUrl": src,
      "name": title || alt,
      "description": alt
    };

    if (width && height) {
      baseSchema.width = width;
      baseSchema.height = height;
    }

    if (caption) {
      baseSchema.caption = caption;
    }

    if (isProduct && productInfo.name) {
      return {
        ...baseSchema,
        "@type": "Product",
        "name": productInfo.name,
        "image": src,
        "description": productInfo.description || alt
      };
    }

    return baseSchema;
  };

  const schema = generateImageSchema();

  return (
    <figure className={containerClassName} onClick={onClick}>
      <picture>
        {/* WebP 格式（較新瀏覽器支援） */}
        {formats.includes('webp') && (
          <source
            type="image/webp"
            srcSet={generateSrcSet(src, 'webp')}
            sizes={sizes}
          />
        )}

        {/* AVIF 格式（最新格式，檔案更小） */}
        {formats.includes('avif') && (
          <source
            type="image/avif"
            srcSet={generateSrcSet(src, 'avif')}
            sizes={sizes}
          />
        )}

        {/* 預設 JPEG/PNG 格式 */}
        <LazyImage
          src={src}
          alt={alt}
          title={title}
          className={className}
          width={width}
          height={height}
          loading={loading}
          srcSet={generateSrcSet(src, 'jpg')}
          sizes={sizes}
        />
      </picture>

      {/* 圖片說明文字 */}
      {caption && (
        <figcaption className="text-center text-muted mt-2">
          {caption}
        </figcaption>
      )}

      {/* 結構化數據 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </figure>
  );
};

export default ImageWithSEO;