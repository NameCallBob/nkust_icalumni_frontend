import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * 教育機構結構化數據組件
 * 專為智慧商務系設計的教育機構 Schema.org 標記
 */
const EducationalOrganizationSchema = ({
  name = "國立高雄科技大學智慧商務系",
  alternateName = ["NKUST智慧商務系", "智商系", "NKUST IC Department", "高科大智商系"],
  description = "國立高雄科技大學智慧商務系，培育人工智慧、大數據分析、電子商務、數位轉型等領域專業人才的頂尖學系。",
  url = "https://nkusticalumni.org/",
  logo = "https://nkusticalumni.org/logo.png",
  foundingDate = "2018",
  telephone = "+886-7-381-4526",
  email = "ic@nkust.edu.tw",
  address = {
    streetAddress: "建工路415號",
    addressLocality: "高雄市",
    addressRegion: "三民區",
    postalCode: "807",
    addressCountry: "TW"
  },
  courses = [
    {
      name: "人工智慧與機器學習",
      description: "深度學習、機器學習演算法與應用"
    },
    {
      name: "大數據分析",
      description: "資料科學、統計分析、數據視覺化"
    },
    {
      name: "電子商務",
      description: "數位行銷、電商平台設計與營運"
    },
    {
      name: "數位轉型",
      description: "企業數位化策略與實務應用"
    },
    {
      name: "商業智慧系統",
      description: "商業分析、決策支援系統"
    },
    {
      name: "區塊鏈技術",
      description: "區塊鏈原理與商業應用"
    }
  ],
  departments = [
    {
      name: "智慧商務學士班",
      description: "培育具備人工智慧、大數據分析、電子商務專業能力的學士人才"
    },
    {
      name: "智慧商務碩士班",
      description: "培育智慧商務領域高階研究與管理人才"
    }
  ],
  keywords = "智慧商務系,智商系,NKUST,人工智慧,大數據,電子商務,數位轉型,機器學習,資料科學,數位行銷"
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${url}#educational-organization`,
    "name": name,
    "alternateName": alternateName,
    "url": url,
    "logo": {
      "@type": "ImageObject",
      "url": logo,
      "width": 200,
      "height": 200
    },
    "description": description,
    "foundingDate": foundingDate,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.streetAddress,
      "addressLocality": address.addressLocality,
      "addressRegion": address.addressRegion,
      "postalCode": address.postalCode,
      "addressCountry": address.addressCountry
    },
    "telephone": telephone,
    "email": email,
    "parentOrganization": {
      "@type": "CollegeOrUniversity",
      "name": "國立高雄科技大學",
      "alternateName": "NKUST",
      "url": "https://www.nkust.edu.tw/"
    },
    "department": departments.map(dept => ({
      "@type": "Organization",
      "name": dept.name,
      "description": dept.description
    })),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "智慧商務系課程目錄",
      "itemListElement": courses.map(course => ({
        "@type": "Course",
        "name": course.name,
        "description": course.description,
        "provider": {
          "@type": "EducationalOrganization",
          "name": name
        }
      }))
    },
    "keywords": keywords,
    "sameAs": [
      "https://www.facebook.com/nkusticalumni",
      "https://www.instagram.com/nkusticalumni"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema, null, 2)}
      </script>
    </Helmet>
  );
};

export default EducationalOrganizationSchema;