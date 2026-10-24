import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * 人物結構化數據組件
 * 專為智慧商務系系友和教職員設計的 Person Schema.org 標記
 */
const PersonSchema = ({
  name,
  jobTitle,
  description,
  image = null,
  url = null,
  email = null,
  telephone = null,
  birthDate = null,
  gender = null,
  nationality = "TW",
  worksFor = null,
  alumniOf = {
    name: "國立高雄科技大學",
    department: "智慧商務系",
    url: "https://www.nkust.edu.tw/"
  },
  memberOf = {
    name: "國立高雄科技大學智慧商務系系友會",
    url: "https://nkusticalumni.org/"
  },
  hasOccupation = null,
  knowsAbout = [],
  skills = [],
  awards = [],
  education = [],
  workHistory = [],
  socialLinks = [],
  address = null,
  graduationYear = null,
  studentId = null,
  keywords = "智慧商務系系友,NKUST校友,人工智慧專家,大數據專家,電商專家"
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": jobTitle,
    "description": description,
    "nationality": {
      "@type": "Country",
      "name": nationality === "TW" ? "台灣" : nationality
    },
    "keywords": keywords
  };

  // 基本聯絡資訊
  if (image) schema.image = image;
  if (url) schema.url = url;
  if (email) schema.email = email;
  if (telephone) schema.telephone = telephone;
  if (birthDate) schema.birthDate = birthDate;
  if (gender) schema.gender = gender;

  // 地址
  if (address) {
    schema.address = {
      "@type": "PostalAddress",
      "addressLocality": address.city,
      "addressRegion": address.region,
      "addressCountry": address.country || "TW"
    };
  }

  // 目前工作
  if (worksFor) {
    schema.worksFor = {
      "@type": "Organization",
      "name": worksFor.name,
      "url": worksFor.url,
      "industry": worksFor.industry,
      "description": worksFor.description
    };
  }

  // 職業
  if (hasOccupation) {
    schema.hasOccupation = {
      "@type": "Occupation",
      "name": hasOccupation.name,
      "description": hasOccupation.description,
      "occupationLocation": hasOccupation.location ? {
        "@type": "City",
        "name": hasOccupation.location
      } : undefined
    };
  }

  // 畢業學校
  if (alumniOf) {
    schema.alumniOf = {
      "@type": "EducationalOrganization",
      "name": alumniOf.name,
      "url": alumniOf.url,
      "department": {
        "@type": "Organization",
        "name": alumniOf.department
      }
    };

    // 添加畢業年份和學號
    if (graduationYear || studentId) {
      schema.alumniOf.alumniOf = {
        "@type": "EducationalOccupationalCredential",
        "name": `${alumniOf.department}畢業證書`,
        "credentialCategory": "degree"
      };

      if (graduationYear) {
        schema.alumniOf.alumniOf.dateCreated = graduationYear;
      }

      if (studentId) {
        schema.alumniOf.alumniOf.identifier = {
          "@type": "PropertyValue",
          "name": "學號",
          "value": studentId
        };
      }
    }
  }

  // 系友會會員
  if (memberOf) {
    schema.memberOf = {
      "@type": "Organization",
      "name": memberOf.name,
      "url": memberOf.url
    };
  }

  // 專業知識領域
  if (knowsAbout.length > 0) {
    schema.knowsAbout = knowsAbout.map(topic => ({
      "@type": "Thing",
      "name": topic.name,
      "description": topic.description
    }));
  }

  // 技能
  if (skills.length > 0) {
    schema.hasSkill = skills.map(skill => ({
      "@type": "DefinedTerm",
      "name": skill.name,
      "description": skill.description,
      "proficiencyLevel": skill.level // Beginner, Intermediate, Advanced, Expert
    }));
  }

  // 獎項
  if (awards.length > 0) {
    schema.award = awards.map(award => ({
      "@type": "Award",
      "name": award.name,
      "description": award.description,
      "dateReceived": award.date,
      "funder": award.organization ? {
        "@type": "Organization",
        "name": award.organization
      } : undefined
    }));
  }

  // 教育背景
  if (education.length > 0) {
    schema.educationalCredentialAwarded = education.map(edu => ({
      "@type": "EducationalOccupationalCredential",
      "name": edu.degree,
      "description": edu.description,
      "educationalLevel": edu.level,
      "credentialCategory": "degree",
      "recognizedBy": {
        "@type": "EducationalOrganization",
        "name": edu.institution
      },
      "dateCreated": edu.graduationDate
    }));
  }

  // 工作經歷
  if (workHistory.length > 0) {
    schema.hasOccupation = workHistory.map(work => ({
      "@type": "Occupation",
      "name": work.position,
      "description": work.description,
      "occupationLocation": {
        "@type": "Place",
        "name": work.location
      },
      "employer": {
        "@type": "Organization",
        "name": work.company
      },
      "startDate": work.startDate,
      "endDate": work.endDate
    }));
  }

  // 社群媒體
  if (socialLinks.length > 0) {
    schema.sameAs = socialLinks;
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
 * 教職員結構化數據組件
 */
export const FacultySchema = ({
  name,
  jobTitle,
  description,
  image = null,
  email = null,
  telephone = null,
  officeLocation = null,
  worksFor = {
    name: "國立高雄科技大學智慧商務系",
    url: "https://nkusticalumni.org/"
  },
  teachingAreas = [],
  researchInterests = [],
  publications = [],
  courses = [],
  awards = [],
  education = [],
  socialLinks = [],
  keywords = "智慧商務系教授,NKUST教師,人工智慧教育,大數據教育"
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": jobTitle,
    "description": description,
    "worksFor": {
      "@type": "EducationalOrganization",
      "name": worksFor.name,
      "url": worksFor.url
    },
    "keywords": keywords
  };

  // 基本資訊
  if (image) schema.image = image;
  if (email) schema.email = email;
  if (telephone) schema.telephone = telephone;

  // 辦公室位置
  if (officeLocation) {
    schema.workLocation = {
      "@type": "Place",
      "name": officeLocation.building,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": officeLocation.room,
        "addressLocality": "高雄市",
        "addressCountry": "TW"
      }
    };
  }

  // 教學領域
  if (teachingAreas.length > 0) {
    schema.knowsAbout = teachingAreas.map(area => ({
      "@type": "Thing",
      "name": area.name,
      "description": area.description
    }));
  }

  // 研究興趣
  if (researchInterests.length > 0) {
    schema.hasOccupation = {
      "@type": "Occupation",
      "name": "研究員",
      "description": "專精於" + researchInterests.map(r => r.name).join("、"),
      "skills": researchInterests.map(interest => ({
        "@type": "DefinedTerm",
        "name": interest.name,
        "description": interest.description
      }))
    };
  }

  // 學術發表
  if (publications.length > 0) {
    schema.creator = publications.map(pub => ({
      "@type": "ScholarlyArticle",
      "name": pub.title,
      "description": pub.abstract,
      "datePublished": pub.date,
      "publisher": pub.journal ? {
        "@type": "Organization",
        "name": pub.journal
      } : undefined
    }));
  }

  // 教授課程
  if (courses.length > 0) {
    schema.teacherOf = courses.map(course => ({
      "@type": "Course",
      "name": course.name,
      "description": course.description,
      "courseCode": course.code
    }));
  }

  // 獎項和教育背景處理方式同PersonSchema
  if (awards.length > 0) {
    schema.award = awards.map(award => ({
      "@type": "Award",
      "name": award.name,
      "description": award.description,
      "dateReceived": award.date
    }));
  }

  if (education.length > 0) {
    schema.educationalCredentialAwarded = education.map(edu => ({
      "@type": "EducationalOccupationalCredential",
      "name": edu.degree,
      "educationalLevel": edu.level,
      "recognizedBy": {
        "@type": "EducationalOrganization",
        "name": edu.institution
      }
    }));
  }

  if (socialLinks.length > 0) {
    schema.sameAs = socialLinks;
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
 * 常見人物類型的預設配置
 */
export const PersonPresets = {
  // 系友
  ALUMNI: {
    memberOf: {
      name: "國立高雄科技大學智慧商務系系友會",
      url: "https://nkusticalumni.org/"
    },
    alumniOf: {
      name: "國立高雄科技大學",
      department: "智慧商務系",
      url: "https://www.nkust.edu.tw/"
    },
    keywords: "智慧商務系系友,NKUST校友,系友會會員"
  },

  // AI專家
  AI_EXPERT: {
    knowsAbout: [
      { name: "人工智慧", description: "機器學習、深度學習專業知識" },
      { name: "機器學習", description: "各種ML演算法的理論與實務" }
    ],
    skills: [
      { name: "Python", description: "AI開發主要程式語言", level: "Expert" },
      { name: "TensorFlow", description: "深度學習框架", level: "Advanced" }
    ],
    keywords: "人工智慧專家,機器學習專家,AI工程師,智慧商務"
  },

  // 大數據專家
  DATA_SCIENTIST: {
    knowsAbout: [
      { name: "大數據分析", description: "大量數據處理與分析" },
      { name: "資料科學", description: "統計分析與數據挖掘" }
    ],
    skills: [
      { name: "R", description: "統計分析程式語言", level: "Expert" },
      { name: "SQL", description: "資料庫查詢語言", level: "Advanced" }
    ],
    keywords: "資料科學家,大數據專家,資料分析師,商業智慧"
  },

  // 電商專家
  ECOMMERCE_EXPERT: {
    knowsAbout: [
      { name: "電子商務", description: "電商平台營運與管理" },
      { name: "數位行銷", description: "網路行銷策略與執行" }
    ],
    skills: [
      { name: "數位行銷", description: "SEO、SEM、社群行銷", level: "Expert" },
      { name: "電商平台", description: "電商網站開發與營運", level: "Advanced" }
    ],
    keywords: "電商專家,數位行銷專家,電商營運,網路創業"
  }
};

export default PersonSchema;