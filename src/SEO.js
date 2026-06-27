import React from "react";
import { Helmet } from "react-helmet";
import logoImage from "assets/logo.png"

const SEO = ({
  title,
  description,
  keywords,
  main,
  url,
  image,
  type = "website",
  author = "國立高雄科技大學智慧商務系系友會",
  publishedTime,
  modifiedTime,
  article = false,
  schema
}) => {
  // 動態設定標題
  const tmpTitle = main
    ? `國立高雄科技大學 智慧商務系系友會 - ${title}`
    : `${title} - 智慧商務系系友會`;

  // 預設值處理
  const metaDescription = description || "國立高雄科技大學智慧商務系系友會 - 連結系友、分享商務資源，提供產學合作、職涯發展與人脈拓展的優質平台。智慧商務系培育AI、大數據、電商等領域專業人才。";
  const metaKeywords = keywords?.length
    ? keywords.join(", ")
    : "國立高雄科技大學,智慧商務系,系友會,NKUST,智商系友會,高科大智商系,人工智慧,大數據分析,電子商務,數位轉型,產學合作,職涯發展,校友網絡";
  const metaImage = image || `http://nkusticalumni.org${logoImage}`;
  const metaUrl = url || "http://nkusticalumni.org/";
  const ogType = article ? "article" : type;

  return (
    <Helmet>
      {/* 基本 SEO 標籤 */}
      <title>{tmpTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta charSet="utf-8" />
      <html lang="zh-TW" />

      {/* Canonical URL */}
      <link rel="canonical" href={metaUrl} />
      <link rel="alternate" hreflang="zh-TW" href={metaUrl} />

      {/* Open Graph (og) 標籤 */}
      <meta property="og:title" content={tmpTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={tmpTitle} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:locale" content="zh_TW" />
      <meta property="og:site_name" content="國立高雄科技大學智慧商務系系友會" />

      {/* Article specific tags */}
      {article && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {article && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {article && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Card 標籤 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={tmpTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:site" content="@nkusticalumni" />
      <meta name="twitter:creator" content="@nkusticalumni" />

      {/* 結構化數據 Schema.org */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
