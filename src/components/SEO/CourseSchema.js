import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * 課程/學程結構化數據組件
 * 專為智慧商務系課程設計的 Course Schema.org 標記
 */
const CourseSchema = ({
  name,
  description,
  provider = {
    name: "國立高雄科技大學智慧商務系",
    url: "https://nkusticalumni.org/"
  },
  courseCode = null,
  courseMode = "blended", // online, onsite, blended
  educationalLevel = "UndergraduateLevel", // BeginnerLevel, IntermediateLevel, AdvancedLevel, UndergraduateLevel, GraduateLevel
  about = [],
  teaches = [],
  competencyRequired = [],
  educationalCredentialAwarded = null,
  duration = null,
  startDate = null,
  endDate = null,
  instructor = null,
  coursePrerequisites = [],
  aggregateRating = null,
  keywords = "智慧商務,人工智慧,大數據,電子商務,數位轉型,NKUST",
  inLanguage = "zh-TW",
  isAccessibleForFree = false,
  offers = null
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": name,
    "description": description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": provider.name,
      "url": provider.url
    },
    "educationalLevel": educationalLevel,
    "inLanguage": inLanguage,
    "keywords": keywords,
    "isAccessibleForFree": isAccessibleForFree
  };

  // 課程代碼
  if (courseCode) {
    schema.courseCode = courseCode;
  }

  // 授課模式
  if (courseMode) {
    const modeMapping = {
      online: "OnlineCourse",
      onsite: "InPersonCourse",
      blended: "BlendedCourse"
    };
    schema.courseMode = modeMapping[courseMode] || courseMode;
  }

  // 課程主題
  if (about.length > 0) {
    schema.about = about.map(topic => ({
      "@type": "Thing",
      "name": topic.name,
      "description": topic.description
    }));
  }

  // 教學內容
  if (teaches.length > 0) {
    schema.teaches = teaches.map(skill => ({
      "@type": "DefinedTerm",
      "name": skill.name,
      "description": skill.description
    }));
  }

  // 先修條件
  if (coursePrerequisites.length > 0) {
    schema.coursePrerequisites = coursePrerequisites.map(prereq => ({
      "@type": "Course",
      "name": prereq.name,
      "description": prereq.description
    }));
  }

  // 所需能力
  if (competencyRequired.length > 0) {
    schema.competencyRequired = competencyRequired.map(competency => ({
      "@type": "DefinedTerm",
      "name": competency.name,
      "description": competency.description
    }));
  }

  // 授予證書
  if (educationalCredentialAwarded) {
    schema.educationalCredentialAwarded = {
      "@type": "EducationalOccupationalCredential",
      "name": educationalCredentialAwarded.name,
      "description": educationalCredentialAwarded.description
    };
  }

  // 課程時間
  if (duration) {
    schema.timeRequired = duration; // ISO 8601 duration format
  }

  if (startDate) {
    schema.startDate = startDate;
  }

  if (endDate) {
    schema.endDate = endDate;
  }

  // 講師資訊
  if (instructor) {
    schema.instructor = {
      "@type": "Person",
      "name": instructor.name,
      "jobTitle": instructor.jobTitle,
      "description": instructor.description,
      "worksFor": {
        "@type": "EducationalOrganization",
        "name": instructor.organization || provider.name
      }
    };
  }

  // 評分
  if (aggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount,
      "bestRating": aggregateRating.bestRating || 5,
      "worstRating": aggregateRating.worstRating || 1
    };
  }

  // 價格資訊
  if (offers) {
    schema.offers = {
      "@type": "Offer",
      "price": offers.price,
      "priceCurrency": offers.currency || "TWD",
      "availability": `https://schema.org/${offers.availability || "InStock"}`,
      "validFrom": offers.validFrom,
      "validThrough": offers.validThrough
    };
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
 * 學程結構化數據組件
 */
export const EducationalProgramSchema = ({
  name,
  description,
  provider = {
    name: "國立高雄科技大學智慧商務系",
    url: "https://nkusticalumni.org/"
  },
  programType = "BachelorDegree", // BachelorDegree, MasterDegree, Certificate, Diploma
  numberOfCredits = null,
  programPrerequisites = [],
  hasCourse = [],
  educationalCredentialAwarded,
  duration,
  applicationDeadline = null,
  startDate = null,
  tuitionFee = null,
  keywords = "智慧商務學程,學士學位,碩士學位,NKUST"
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalProgram",
    "name": name,
    "description": description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": provider.name,
      "url": provider.url
    },
    "programType": programType,
    "keywords": keywords
  };

  // 學分數
  if (numberOfCredits) {
    schema.numberOfCredits = numberOfCredits;
  }

  // 入學要求
  if (programPrerequisites.length > 0) {
    schema.programPrerequisites = programPrerequisites.map(prereq => ({
      "@type": "EducationalOccupationalCredential",
      "name": prereq.name,
      "description": prereq.description
    }));
  }

  // 包含課程
  if (hasCourse.length > 0) {
    schema.hasCourse = hasCourse.map(course => ({
      "@type": "Course",
      "name": course.name,
      "description": course.description,
      "courseCode": course.courseCode
    }));
  }

  // 授予學位
  if (educationalCredentialAwarded) {
    schema.educationalCredentialAwarded = {
      "@type": "EducationalOccupationalCredential",
      "name": educationalCredentialAwarded.name,
      "description": educationalCredentialAwarded.description,
      "credentialCategory": educationalCredentialAwarded.category
    };
  }

  // 修業時間
  if (duration) {
    schema.timeToComplete = duration;
  }

  // 開課日期
  if (startDate) {
    schema.startDate = startDate;
  }

  // 申請截止日
  if (applicationDeadline) {
    schema.applicationDeadline = applicationDeadline;
  }

  // 學費
  if (tuitionFee) {
    schema.offers = {
      "@type": "Offer",
      "price": tuitionFee.amount,
      "priceCurrency": tuitionFee.currency || "TWD",
      "description": tuitionFee.description || "學費"
    };
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
 * 智慧商務系常見課程預設配置
 */
export const CoursePresets = {
  // 人工智慧課程
  AI_COURSE: {
    about: [
      { name: "人工智慧", description: "機器學習、深度學習基礎理論與應用" },
      { name: "機器學習", description: "監督式與非監督式學習演算法" }
    ],
    teaches: [
      { name: "Python程式設計", description: "使用Python進行AI開發" },
      { name: "機器學習演算法", description: "各種ML演算法的實作與應用" },
      { name: "深度學習", description: "神經網路與深度學習框架" }
    ],
    keywords: "人工智慧,機器學習,深度學習,Python,神經網路,NKUST"
  },

  // 大數據課程
  BIG_DATA_COURSE: {
    about: [
      { name: "大數據分析", description: "大量數據的處理、分析與視覺化" },
      { name: "資料科學", description: "數據科學方法論與實務應用" }
    ],
    teaches: [
      { name: "資料分析", description: "統計分析與資料探勘技術" },
      { name: "資料視覺化", description: "使用工具呈現分析結果" },
      { name: "資料庫管理", description: "大數據儲存與管理技術" }
    ],
    keywords: "大數據,資料科學,資料分析,統計,視覺化,NKUST"
  },

  // 電子商務課程
  ECOMMERCE_COURSE: {
    about: [
      { name: "電子商務", description: "電商平台設計與網路行銷策略" },
      { name: "數位行銷", description: "網路行銷工具與策略規劃" }
    ],
    teaches: [
      { name: "電商平台開發", description: "電商網站設計與開發" },
      { name: "數位行銷策略", description: "SEO、SEM、社群行銷" },
      { name: "消費者行為分析", description: "線上消費行為研究" }
    ],
    keywords: "電子商務,數位行銷,電商平台,網路行銷,SEO,NKUST"
  }
};

export default CourseSchema;