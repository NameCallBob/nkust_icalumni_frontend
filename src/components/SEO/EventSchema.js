import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * 活動結構化數據組件
 * 專為智慧商務系系友會活動設計的 Event Schema.org 標記
 */
const EventSchema = ({
  name,
  description,
  startDate,
  endDate,
  url,
  image = "https://nkusticalumni.org/og-image.jpg",
  eventStatus = "EventScheduled", // EventScheduled, EventCancelled, EventMovedOnline, EventPostponed, EventRescheduled
  eventAttendanceMode = "OfflineEventAttendanceMode", // OfflineEventAttendanceMode, OnlineEventAttendanceMode, MixedEventAttendanceMode
  location = {
    type: "Place", // Place or VirtualLocation
    name: "國立高雄科技大學",
    address: {
      streetAddress: "建工路415號",
      addressLocality: "高雄市",
      addressRegion: "三民區",
      postalCode: "807",
      addressCountry: "TW"
    }
  },
  organizer = {
    type: "Organization",
    name: "國立高雄科技大學智慧商務系系友會",
    url: "https://nkusticalumni.org/"
  },
  performer = null,
  offers = null,
  audience = {
    type: "EducationalAudience",
    name: "智慧商務系系友及在校生"
  },
  keywords = "系友會活動,智慧商務系,NKUST,產業交流,職涯發展,技術研習",
  category = "BusinessEvent", // BusinessEvent, EducationEvent, SocialEvent
  maximumAttendeeCapacity = null,
  registrationUrl = null
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": name,
    "description": description,
    "startDate": startDate,
    "endDate": endDate,
    "eventStatus": `https://schema.org/${eventStatus}`,
    "eventAttendanceMode": `https://schema.org/${eventAttendanceMode}`,
    "image": image,
    "url": url,
    "location": location.type === "VirtualLocation" ? {
      "@type": "VirtualLocation",
      "url": location.url || url,
      "name": location.name
    } : {
      "@type": "Place",
      "name": location.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": location.address.streetAddress,
        "addressLocality": location.address.addressLocality,
        "addressRegion": location.address.addressRegion,
        "postalCode": location.address.postalCode,
        "addressCountry": location.address.addressCountry
      }
    },
    "organizer": {
      "@type": organizer.type,
      "name": organizer.name,
      "url": organizer.url
    },
    "audience": {
      "@type": audience.type,
      "name": audience.name
    },
    "keywords": keywords,
    "about": [
      {
        "@type": "Thing",
        "name": "智慧商務",
        "description": "人工智慧、大數據、電子商務相關主題"
      },
      {
        "@type": "Thing",
        "name": "職涯發展",
        "description": "系友職業發展與經驗分享"
      },
      {
        "@type": "Thing",
        "name": "產學合作",
        "description": "學術界與產業界合作交流"
      }
    ]
  };

  // 添加表演者資訊（如果有）
  if (performer) {
    schema.performer = {
      "@type": performer.type || "Person",
      "name": performer.name,
      "jobTitle": performer.jobTitle,
      "description": performer.description
    };
  }

  // 添加票價資訊（如果有）
  if (offers) {
    schema.offers = {
      "@type": "Offer",
      "price": offers.price || "0",
      "priceCurrency": offers.currency || "TWD",
      "availability": `https://schema.org/${offers.availability || "InStock"}`,
      "url": offers.url || registrationUrl || url
    };
  }

  // 添加參與人數限制（如果有）
  if (maximumAttendeeCapacity) {
    schema.maximumAttendeeCapacity = maximumAttendeeCapacity;
  }

  // 添加報名網址（如果有）
  if (registrationUrl) {
    schema.isAccessibleForFree = !offers;
    schema.url = registrationUrl;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema, null, 2)}
      </script>
    </Helmet>
  );
};

/**
 * 常見活動類型的預設配置
 */
export const EventPresets = {
  // 系友聚會
  ALUMNI_GATHERING: {
    category: "SocialEvent",
    audience: {
      type: "EducationalAudience",
      name: "智慧商務系系友"
    },
    keywords: "系友聚會,校友聯誼,智慧商務系,NKUST"
  },

  // 產業交流會
  INDUSTRY_EXCHANGE: {
    category: "BusinessEvent",
    audience: {
      type: "BusinessAudience",
      name: "智慧商務系系友及業界人士"
    },
    keywords: "產業交流,商業網絡,智慧商務,職涯發展"
  },

  // 技術研習
  TECHNICAL_WORKSHOP: {
    category: "EducationEvent",
    audience: {
      type: "EducationalAudience",
      name: "智慧商務系系友及在校生"
    },
    keywords: "技術研習,專業培訓,人工智慧,大數據"
  },

  // 線上活動
  ONLINE_EVENT: {
    eventAttendanceMode: "OnlineEventAttendanceMode",
    location: {
      type: "VirtualLocation",
      name: "線上會議室"
    }
  },

  // 混合活動
  HYBRID_EVENT: {
    eventAttendanceMode: "MixedEventAttendanceMode"
  }
};

export default EventSchema;