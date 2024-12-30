import React from "react";
import { Helmet } from "react-helmet";
import logoImage from "assets/logo.png"
const SEO = ({ title, description, keywords, main}) => {
  // 動態設定標題
  const tmpTitle = main
    ? `國立高雄科技大學 智慧商務系友會 - ${title}`
    : `${title} - 智慧商務系友會`;

  // 預設值處理，避免空值
  const metaDescription = description || "國立高雄科技大學智慧商務系友會，連結系友、分享商務資源的優質平台。";
  const metaKeywords = keywords?.length
    ? keywords.join(", ")
    : "智慧商務, 系友會, 國立高雄科技大學, 人工智慧 , 雲端服務 , 物聯網 , 智慧金融";
  const metaImage = logoImage; // 預設圖片

  return (
    <Helmet>
      {/* 基本 SEO 標籤 */}
      <title>{tmpTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content="智慧商務系友會" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta charSet="utf-8" />

      {/* Open Graph (og) 標籤 */}
      <meta property="og:title" content={tmpTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:type" content="website" />

      {/* Twitter 卡片支援 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={tmpTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

    </Helmet>
  );
};

export default SEO;
