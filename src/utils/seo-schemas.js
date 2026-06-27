/**
 * 結構化數據 Schema.org 工具函數
 * 提供各種頁面類型的結構化數據產生器
 *
 * 本文件包含針對智慧商務系系友會網站優化的結構化數據生成函數
 * 特別針對「智慧商務系」、「智商系」、「NKUST」等關鍵字進行SEO優化
 *
 * 主要功能：
 * - 教育機構結構化數據
 * - 本地商業結構化數據
 * - 活動、課程、人物等內容結構化數據
 * - FAQ結構化數據
 * - 針對智慧商務領域的專業化配置
 */

/**
 * 產生智慧商務系教育機構結構化數據
 * 專門針對智慧商務系的教育機構優化，包含完整的學系資訊
 */
export const generateEducationalOrganizationSchema = (customData = {}) => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": "https://nkusticalumni.org/#educational-organization",
  "name": "國立高雄科技大學智慧商務系",
  "alternateName": ["NKUST智慧商務系", "智商系", "NKUST IC Department", "高科大智商系"],
  "url": "https://nkusticalumni.org/",
  "logo": {
    "@type": "ImageObject",
    "url": "https://nkusticalumni.org/logo.png",
    "width": 200,
    "height": 200
  },
  "description": "國立高雄科技大學智慧商務系，培育人工智慧、大數據分析、電子商務、數位轉型等領域專業人才的頂尖學系。提供學士、碩士學位課程，結合理論與實務，為產業界培養智慧商務專業人才。",
  "foundingDate": "2018",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "建工路415號",
    "addressLocality": "高雄市",
    "addressRegion": "三民區",
    "postalCode": "807",
    "addressCountry": "TW"
  },
  "telephone": "+886-7-381-4526",
  "email": "ic@nkust.edu.tw",
  "parentOrganization": {
    "@type": "CollegeOrUniversity",
    "name": "國立高雄科技大學",
    "alternateName": "NKUST",
    "url": "https://www.nkust.edu.tw/"
  },
  "department": [
    {
      "@type": "Organization",
      "name": "智慧商務學士班",
      "description": "培育具備人工智慧、大數據分析、電子商務專業能力的學士人才"
    },
    {
      "@type": "Organization",
      "name": "智慧商務碩士班",
      "description": "培育智慧商務領域高階研究與管理人才"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "智慧商務系課程目錄",
    "itemListElement": [
      {
        "@type": "Course",
        "name": "人工智慧與機器學習",
        "description": "深度學習、機器學習演算法與應用"
      },
      {
        "@type": "Course",
        "name": "大數據分析",
        "description": "資料科學、統計分析、數據視覺化"
      },
      {
        "@type": "Course",
        "name": "電子商務",
        "description": "數位行銷、電商平台設計與營運"
      },
      {
        "@type": "Course",
        "name": "數位轉型",
        "description": "企業數位化策略與實務應用"
      }
    ]
  },
  "keywords": "智慧商務系,智商系,NKUST,人工智慧,大數據,電子商務,數位轉型,機器學習,資料科學,數位行銷",
  "sameAs": [
    "https://www.facebook.com/nkusticalumni",
    "https://www.instagram.com/nkusticalumni"
  ],
  ...customData
});

/**
 * 產生系友會組織結構化數據（保留原有功能）
 */
export const generateOrganizationSchema = (customData = {}) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "http://nkusticalumni.org/#organization",
  "name": "國立高雄科技大學智慧商務系系友會",
  "alternateName": "NKUST IC Alumni Association",
  "url": "http://nkusticalumni.org/",
  "logo": {
    "@type": "ImageObject",
    "@id": "http://nkusticalumni.org/#logo",
    "url": "http://nkusticalumni.org/logo.png",
    "contentUrl": "http://nkusticalumni.org/logo.png",
    "caption": "國立高雄科技大學智慧商務系系友會"
  },
  "image": {
    "@id": "http://nkusticalumni.org/#logo"
  },
  "description": "國立高雄科技大學智慧商務系系友會，連結系友、分享商務資源的優質平台",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "高雄市",
    "addressRegion": "台灣",
    "addressCountry": "TW"
  },
  "memberOf": {
    "@type": "CollegeOrUniversity",
    "name": "國立高雄科技大學",
    "url": "https://www.nkust.edu.tw/"
  },
  "sameAs": [
    "https://www.facebook.com/nkusticalumni",
    "https://www.instagram.com/nkusticalumni"
  ]
});

/**
 * 產生網站結構化數據
 */
export const generateWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "http://nkusticalumni.org/#website",
  "url": "http://nkusticalumni.org/",
  "name": "國立高雄科技大學智慧商務系系友會",
  "description": "國立高雄科技大學智慧商務系系友會官方網站",
  "publisher": {
    "@id": "http://nkusticalumni.org/#organization"
  },
  "potentialAction": [
    {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "http://nkusticalumni.org/search?q={search_term_string}"
      },
      "query-input": {
        "@type": "PropertyValueSpecification",
        "valueRequired": "http://schema.org/True",
        "valueName": "search_term_string"
      }
    }
  ],
  "inLanguage": "zh-TW"
});

/**
 * 產生麵包屑結構化數據
 * @param {Array} items - 麵包屑項目陣列
 */
export const generateBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": "http://nkusticalumni.org/#breadcrumb",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url || `http://nkusticalumni.org${item.path}`
  }))
});

/**
 * 產生文章結構化數據
 * @param {Object} article - 文章資訊
 */
export const generateArticleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image || "http://nkusticalumni.org/og-image.jpg",
  "datePublished": article.publishedDate,
  "dateModified": article.modifiedDate || article.publishedDate,
  "author": {
    "@type": "Organization",
    "name": article.author || "國立高雄科技大學智慧商務系系友會"
  },
  "publisher": {
    "@type": "Organization",
    "name": "國立高雄科技大學智慧商務系系友會",
    "logo": {
      "@type": "ImageObject",
      "url": "http://nkusticalumni.org/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  }
});

/**
 * 產生活動結構化數據
 * @param {Object} event - 活動資訊
 */
export const generateEventSchema = (event) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.name,
  "description": event.description,
  "startDate": event.startDate,
  "endDate": event.endDate,
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": event.isOnline
    ? "https://schema.org/OnlineEventAttendanceMode"
    : "https://schema.org/OfflineEventAttendanceMode",
  "location": event.isOnline ? {
    "@type": "VirtualLocation",
    "url": event.url
  } : {
    "@type": "Place",
    "name": event.locationName,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": event.streetAddress,
      "addressLocality": event.city,
      "addressRegion": event.region,
      "addressCountry": "TW"
    }
  },
  "image": event.image || "http://nkusticalumni.org/og-image.jpg",
  "organizer": {
    "@type": "Organization",
    "name": "國立高雄科技大學智慧商務系系友會",
    "url": "https://nkusticalumni.org/"
  }
});

/**
 * 產生人物結構化數據（系友）
 * @param {Object} person - 人物資訊
 */
export const generatePersonSchema = (person) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": person.name,
  "jobTitle": person.jobTitle,
  "worksFor": {
    "@type": "Organization",
    "name": person.company
  },
  "description": person.bio,
  "image": person.image,
  "url": person.profileUrl,
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "國立高雄科技大學",
    "department": {
      "@type": "Organization",
      "name": "智慧商務系"
    }
  },
  "memberOf": {
    "@type": "Organization",
    "name": "國立高雄科技大學智慧商務系系友會"
  },
  "sameAs": person.socialLinks || []
});

/**
 * 產生產品結構化數據
 * @param {Object} product - 產品資訊
 */
export const generateProductSchema = (product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.images || [],
  "brand": {
    "@type": "Brand",
    "name": product.brand || product.company
  },
  "offers": {
    "@type": "Offer",
    "url": product.url,
    "priceCurrency": "TWD",
    "price": product.price || "請洽詢",
    "availability": "https://schema.org/InStock"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": product.company
  }
});

/**
 * 產生職缺結構化數據
 * @param {Object} job - 職缺資訊
 */
export const generateJobPostingSchema = (job) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": job.title,
  "description": job.description,
  "identifier": {
    "@type": "PropertyValue",
    "name": "職缺編號",
    "value": job.id
  },
  "datePosted": job.datePosted,
  "validThrough": job.validThrough,
  "employmentType": job.employmentType || "FULL_TIME",
  "hiringOrganization": {
    "@type": "Organization",
    "name": job.company,
    "sameAs": job.companyUrl
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": job.city,
      "addressRegion": job.region || "台灣",
      "addressCountry": "TW"
    }
  },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "TWD",
    "value": {
      "@type": "QuantitativeValue",
      "value": job.salary,
      "unitText": "MONTH"
    }
  }
});

/**
 * 產生 FAQ 結構化數據
 * @param {Array} faqs - FAQ 陣列
 */
export const generateFAQSchema = (faqs, options = {}) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "keywords": options.keywords || "智慧商務系FAQ,NKUST常見問題,系友會問答",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer,
      "dateCreated": faq.dateCreated,
      "upvoteCount": faq.upvoteCount,
      "author": faq.author ? {
        "@type": "Person",
        "name": faq.author.name
      } : {
        "@type": "Organization",
        "name": "國立高雄科技大學智慧商務系系友會"
      }
    }
  }))
});

/**
 * 智慧商務系常見問題預設資料
 */
export const NKUST_IC_DEFAULT_FAQS = [
  {
    question: "什麼是智慧商務系？",
    answer: "國立高雄科技大學智慧商務系（簡稱智商系）是結合人工智慧、大數據分析、電子商務與數位轉型的跨領域學系。培育學生具備AI技術應用、資料科學分析、數位行銷與商業策略規劃的專業能力，為智慧商務時代培養頂尖人才。",
    dateCreated: "2024-01-01",
    upvoteCount: 25
  },
  {
    question: "智慧商務系系友會提供哪些服務？",
    answer: "系友會提供多元化服務包括：定期系友聚會與產業交流活動、職涯發展諮詢與就業媒合服務、產學合作機會媒介、創業輔導與資源分享、專業技能研習課程、人脈網絡拓展平台等，協助系友在職涯發展上獲得全方位支持。",
    dateCreated: "2024-01-01",
    upvoteCount: 30
  },
  {
    question: "智慧商務系畢業生就業方向為何？",
    answer: "畢業生就業領域廣泛，包括：數據分析師、AI工程師、電商營運專員、數位行銷經理、產品經理、商業分析師、系統分析師、創業家等。可投入科技業、金融業、零售業、顧問業等各行各業的數位轉型工作。",
    dateCreated: "2024-01-01",
    upvoteCount: 35
  },
  {
    question: "如何加入智慧商務系系友會？",
    answer: "凡國立高雄科技大學智慧商務系畢業校友皆可申請加入系友會。請透過官方網站線上申請，或聯繫系友會秘書處(alumni@nkusticalumni.org)索取入會申請表。入會後即可享有各項系友服務與活動參與權益。",
    dateCreated: "2024-01-01",
    upvoteCount: 28
  },
  {
    question: "智慧商務需要具備哪些程式設計能力？",
    answer: "建議掌握Python（數據分析、AI開發）、R（統計分析）、SQL（資料庫操作）、JavaScript（前端開發）、HTML/CSS（網頁設計）等程式語言。同時要熟悉相關框架如TensorFlow、scikit-learn、React等。",
    dateCreated: "2024-01-01",
    upvoteCount: 40
  },
  {
    question: "NKUST智慧商務系有什麼特色？",
    answer: "本系特色包括：1.跨領域整合課程設計 2.產學合作實務專題 3.業界師資協同教學 4.國際交流與雙聯學制 5.創新創業培育計畫 6.完善實驗設備與學習環境 7.豐富的企業實習機會 8.活躍的系友網絡支持。",
    dateCreated: "2024-01-01",
    upvoteCount: 20
  }
];

/**
 * 產生本地商業結構化數據
 * 專門針對智慧商務系系友會的本地商業服務優化
 */
export const generateLocalBusinessSchema = (customData = {}) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://nkusticalumni.org/#local-business",
  "name": "國立高雄科技大學智慧商務系系友會",
  "alternateName": ["NKUST IC Alumni Association", "智商系友會", "高科大智商系友會"],
  "description": "國立高雄科技大學智慧商務系系友會，提供系友聯誼、職涯發展、產學合作等專業服務的本地組織。",
  "image": "https://nkusticalumni.org/og-image.jpg",
  "logo": {
    "@type": "ImageObject",
    "url": "https://nkusticalumni.org/logo.png",
    "width": 200,
    "height": 200
  },
  "telephone": "+886-7-381-4526",
  "email": "alumni@nkusticalumni.org",
  "url": "https://nkusticalumni.org/",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "建工路415號",
    "addressLocality": "高雄市",
    "addressRegion": "三民區",
    "postalCode": "807",
    "addressCountry": "TW"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 22.6273,
    "longitude": 120.3014
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ],
  "areaServed": {
    "@type": "AdministrativeArea",
    "name": "台灣"
  },
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 22.6273,
      "longitude": 120.3014
    },
    "geoRadius": "100000"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "系友會服務目錄",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "系友聯誼活動",
        "description": "定期舉辦系友聚會、產業交流會",
        "price": "0",
        "priceCurrency": "TWD"
      },
      {
        "@type": "Offer",
        "name": "職涯發展服務",
        "description": "提供就業媒合、職涯諮詢服務",
        "price": "0",
        "priceCurrency": "TWD"
      },
      {
        "@type": "Offer",
        "name": "產學合作平台",
        "description": "促進系友企業與學系間產學合作",
        "price": "0",
        "priceCurrency": "TWD"
      }
    ]
  },
  "priceRange": "免費",
  "currenciesAccepted": "TWD",
  "paymentAccepted": "現金, 轉帳",
  "keywords": "系友會,校友網絡,產學合作,職涯發展,智慧商務,NKUST,人脈拓展,創業輔導",
  "sameAs": [
    "https://www.facebook.com/nkusticalumni",
    "https://www.instagram.com/nkusticalumni"
  ],
  ...customData
});

/**
 * 產生智慧商務系課程結構化數據
 * @param {Object} course - 課程資訊
 */
export const generateCourseSchema = (course) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  "name": course.name,
  "description": course.description,
  "provider": {
    "@type": "EducationalOrganization",
    "name": "國立高雄科技大學智慧商務系",
    "url": "https://nkusticalumni.org/"
  },
  "courseCode": course.courseCode,
  "educationalLevel": course.level || "UndergraduateLevel",
  "inLanguage": "zh-TW",
  "keywords": course.keywords || "智慧商務,人工智慧,大數據,電子商務,數位轉型,NKUST",
  "about": course.topics ? course.topics.map(topic => ({
    "@type": "Thing",
    "name": topic.name || topic,
    "description": topic.description
  })) : [],
  "teaches": course.skills ? course.skills.map(skill => ({
    "@type": "DefinedTerm",
    "name": skill.name || skill,
    "description": skill.description
  })) : [],
  "instructor": course.instructor ? {
    "@type": "Person",
    "name": course.instructor.name,
    "jobTitle": course.instructor.title || "教授",
    "worksFor": {
      "@type": "EducationalOrganization",
      "name": "國立高雄科技大學智慧商務系"
    }
  } : undefined,
  "timeRequired": course.duration,
  "isAccessibleForFree": course.isFree !== false
});

/**
 * 產生智慧商務系系友結構化數據
 * @param {Object} person - 人物資訊
 */
export const generateAlumniPersonSchema = (person) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": person.name,
  "jobTitle": person.jobTitle,
  "description": person.bio || person.description,
  "image": person.image,
  "url": person.profileUrl,
  "email": person.email,
  "worksFor": person.company ? {
    "@type": "Organization",
    "name": person.company,
    "url": person.companyUrl,
    "industry": person.industry
  } : undefined,
  "hasOccupation": {
    "@type": "Occupation",
    "name": person.jobTitle,
    "description": person.jobDescription,
    "occupationLocation": {
      "@type": "City",
      "name": person.workLocation || "台灣"
    }
  },
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "國立高雄科技大學",
    "url": "https://www.nkust.edu.tw/",
    "department": {
      "@type": "Organization",
      "name": "智慧商務系"
    }
  },
  "memberOf": {
    "@type": "Organization",
    "name": "國立高雄科技大學智慧商務系系友會",
    "url": "https://nkusticalumni.org/"
  },
  "knowsAbout": person.expertise ? person.expertise.map(skill => ({
    "@type": "Thing",
    "name": skill.name || skill,
    "description": skill.description
  })) : [
    {"@type": "Thing", "name": "智慧商務", "description": "智慧商務相關專業知識"}
  ],
  "hasSkill": person.skills ? person.skills.map(skill => ({
    "@type": "DefinedTerm",
    "name": skill.name || skill,
    "description": skill.description,
    "proficiencyLevel": skill.level
  })) : [],
  "award": person.awards ? person.awards.map(award => ({
    "@type": "Award",
    "name": award.name || award,
    "description": award.description,
    "dateReceived": award.date
  })) : [],
  "keywords": person.keywords || "智慧商務系系友,NKUST校友,人工智慧專家,大數據專家,電商專家",
  "sameAs": person.socialLinks || []
});

/**
 * 針對智慧商務系關鍵字優化的結構化數據生成器
 */
export const generateNKUSTICOptimizedSchema = (type, data) => {
  const baseKeywords = "智慧商務系,智商系,NKUST,國立高雄科技大學,人工智慧,大數據,電子商務,數位轉型";

  switch (type) {
    case 'homepage':
      return {
        "@context": "https://schema.org",
        "@graph": [
          generateEducationalOrganizationSchema(),
          generateLocalBusinessSchema(),
          generateFAQSchema(NKUST_IC_DEFAULT_FAQS.slice(0, 6), {
            keywords: `${baseKeywords},常見問題,FAQ`
          })
        ]
      };

    case 'department':
      return generateEducationalOrganizationSchema({
        keywords: `${baseKeywords},學系介紹,課程規劃,師資介紹`
      });

    case 'alumni':
      return generateLocalBusinessSchema({
        keywords: `${baseKeywords},系友會,校友網絡,產學合作,職涯發展`
      });

    default:
      return {};
  }
};

/**
 * 獲取智慧商務系相關關鍵字
 */
export const getNKUSTICKeywords = (category = 'general') => {
  const keywordSets = {
    general: "智慧商務系,智商系,NKUST,國立高雄科技大學",
    technology: "人工智慧,機器學習,大數據,資料科學,電子商務,數位行銷,區塊鏈,物聯網",
    career: "數據分析師,AI工程師,電商專家,數位行銷,產品經理,商業分析師,創業家",
    alumni: "系友會,校友網絡,產學合作,職涯發展,人脈拓展,創業輔導",
    education: "學士班,碩士班,課程設計,實務專題,產學合作,國際交流"
  };

  return keywordSets[category] || keywordSets.general;
};

/**
 * 智慧商務系活動結構化數據強化版
 * @param {Object} event - 活動資訊
 */
export const generateEnhancedEventSchema = (event) => ({
  ...generateEventSchema(event),
  "audience": {
    "@type": "EducationalAudience",
    "name": "智慧商務系系友及在校生"
  },
  "keywords": event.keywords || "系友會活動,智慧商務系,NKUST,產業交流,職涯發展,技術研習",
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
    }
  ]
});