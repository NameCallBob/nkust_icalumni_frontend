import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * 本地商業結構化數據組件
 * 專為智慧商務系系友會設計的本地商業 Schema.org 標記
 */
const LocalBusinessSchema = ({
  name = "國立高雄科技大學智慧商務系系友會",
  alternateName = ["NKUST IC Alumni Association", "智商系友會", "高科大智商系友會"],
  description = "國立高雄科技大學智慧商務系系友會，提供系友聯誼、職涯發展、產學合作等專業服務的本地組織。",
  url = "https://nkusticalumni.org/",
  logo = "https://nkusticalumni.org/logo.png",
  image = "https://nkusticalumni.org/og-image.jpg",
  telephone = "+886-7-381-4526",
  email = "alumni@nkusticalumni.org",
  address = {
    streetAddress: "建工路415號",
    addressLocality: "高雄市",
    addressRegion: "三民區",
    postalCode: "807",
    addressCountry: "TW"
  },
  coordinates = {
    latitude: 22.6273,
    longitude: 120.3014
  },
  openingHours = [
    {
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00"
    }
  ],
  services = [
    {
      name: "系友聯誼活動",
      description: "定期舉辦系友聚會、產業交流會"
    },
    {
      name: "職涯發展服務",
      description: "提供就業媒合、職涯諮詢服務"
    },
    {
      name: "產學合作平台",
      description: "促進系友企業與學系間產學合作"
    },
    {
      name: "創業輔導",
      description: "提供創業諮詢與資源媒合服務"
    },
    {
      name: "專業技能研習",
      description: "舉辦AI、大數據、電商等專業課程"
    }
  ],
  priceRange = "免費",
  currenciesAccepted = "TWD",
  paymentAccepted = "現金, 轉帳",
  areaServed = "台灣",
  serviceRadius = "100000" // 100km
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}#local-business`,
    "name": name,
    "alternateName": alternateName,
    "description": description,
    "image": image,
    "logo": {
      "@type": "ImageObject",
      "url": logo,
      "width": 200,
      "height": 200
    },
    "telephone": telephone,
    "email": email,
    "url": url,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.streetAddress,
      "addressLocality": address.addressLocality,
      "addressRegion": address.addressRegion,
      "postalCode": address.postalCode,
      "addressCountry": address.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": coordinates.latitude,
      "longitude": coordinates.longitude
    },
    "openingHoursSpecification": openingHours.map(hours => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": hours.dayOfWeek,
      "opens": hours.opens,
      "closes": hours.closes
    })),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "系友會服務目錄",
      "itemListElement": services.map(service => ({
        "@type": "Offer",
        "name": service.name,
        "description": service.description,
        "price": "0",
        "priceCurrency": "TWD"
      }))
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": areaServed
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": coordinates.latitude,
        "longitude": coordinates.longitude
      },
      "geoRadius": serviceRadius
    },
    "priceRange": priceRange,
    "currenciesAccepted": currenciesAccepted,
    "paymentAccepted": paymentAccepted,
    "keywords": "系友會,校友網絡,產學合作,職涯發展,智慧商務,NKUST,人脈拓展,創業輔導",
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

export default LocalBusinessSchema;