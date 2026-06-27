import React from 'react';
import { Helmet } from 'react-helmet-async';
import EducationalOrganizationSchema from './EducationalOrganizationSchema';
import LocalBusinessSchema from './LocalBusinessSchema';
import EventSchema from './EventSchema';
import CourseSchema, { EducationalProgramSchema } from './CourseSchema';
import PersonSchema, { FacultySchema } from './PersonSchema';
import FAQSchema, { generatePageFAQs } from './FAQSchema';

/**
 * 動態結構化數據生成器
 * 根據頁面類型和內容自動生成適當的 Schema.org 標記
 */
const StructuredDataProvider = ({
  pageType = 'general',
  pageData = {},
  children
}) => {
  // 基礎 WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://nkusticalumni.org/#website",
    "url": "https://nkusticalumni.org/",
    "name": "國立高雄科技大學智慧商務系系友會",
    "description": "國立高雄科技大學智慧商務系系友會官方網站，提供系友服務、活動資訊、職涯發展與產學合作平台",
    "publisher": {
      "@id": "https://nkusticalumni.org/#alumni-organization"
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://nkusticalumni.org/search?q={search_term_string}"
        },
        "query-input": {
          "@type": "PropertyValueSpecification",
          "valueRequired": "http://schema.org/True",
          "valueName": "search_term_string"
        }
      }
    ],
    "inLanguage": "zh-TW",
    "keywords": "智慧商務系,系友會,NKUST,校友網絡,產學合作,職涯發展"
  };

  // 麵包屑 Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": pageData.breadcrumbs ? pageData.breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url || `https://nkusticalumni.org${item.path}`
    })) : [{
      "@type": "ListItem",
      "position": 1,
      "name": "首頁",
      "item": "https://nkusticalumni.org/"
    }]
  };

  const renderSchemas = () => {
    const schemas = [];

    // 根據頁面類型生成對應的結構化數據
    switch (pageType) {
      case 'homepage':
        schemas.push(
          <EducationalOrganizationSchema key="educational-org" />,
          <LocalBusinessSchema key="local-business" />,
          <FAQSchema
            key="homepage-faq"
            faqs={generatePageFAQs('homepage')}
            keywords="智慧商務系常見問題,NKUST FAQ,系友會問答"
          />
        );
        break;

      case 'about-department':
        schemas.push(
          <EducationalOrganizationSchema
            key="educational-org"
            {...pageData.organizationData}
          />,
          <FAQSchema
            key="department-faq"
            faqs={generatePageFAQs('department')}
            keywords="智慧商務系介紹,NKUST智商系,學系特色"
          />
        );
        break;

      case 'about-alumni':
        schemas.push(
          <LocalBusinessSchema
            key="local-business"
            {...pageData.businessData}
          />,
          <FAQSchema
            key="alumni-faq"
            faqs={generatePageFAQs('alumni')}
            keywords="系友會服務,校友會入會,系友活動"
          />
        );
        break;

      case 'event-detail':
        if (pageData.eventData) {
          schemas.push(
            <EventSchema
              key="event"
              {...pageData.eventData}
            />
          );
        }
        break;

      case 'event-list':
        if (pageData.events && pageData.events.length > 0) {
          pageData.events.forEach((event, index) => {
            schemas.push(
              <EventSchema
                key={`event-${index}`}
                {...event}
              />
            );
          });
        }
        break;

      case 'course-detail':
        if (pageData.courseData) {
          schemas.push(
            <CourseSchema
              key="course"
              {...pageData.courseData}
            />
          );
        }
        break;

      case 'program-detail':
        if (pageData.programData) {
          schemas.push(
            <EducationalProgramSchema
              key="program"
              {...pageData.programData}
            />
          );
        }
        break;

      case 'person-profile':
        if (pageData.personData) {
          schemas.push(
            <PersonSchema
              key="person"
              {...pageData.personData}
            />
          );
        }
        break;

      case 'faculty-profile':
        if (pageData.facultyData) {
          schemas.push(
            <FacultySchema
              key="faculty"
              {...pageData.facultyData}
            />
          );
        }
        break;

      case 'career-page':
        schemas.push(
          <FAQSchema
            key="career-faq"
            faqs={generatePageFAQs('career')}
            keywords="職涯發展,就業媒合,系友就業"
          />
        );
        break;

      case 'cooperation-page':
        schemas.push(
          <FAQSchema
            key="cooperation-faq"
            faqs={generatePageFAQs('cooperation')}
            keywords="產學合作,企業合作,技術諮詢"
          />
        );
        break;

      case 'technical-page':
        schemas.push(
          <FAQSchema
            key="technical-faq"
            faqs={generatePageFAQs('technical')}
            keywords="技術學習,程式設計,AI學習"
          />
        );
        break;

      case 'search-results':
        // 搜尋結果頁面的特殊處理
        if (pageData.searchQuery) {
          const searchSchema = {
            "@context": "https://schema.org",
            "@type": "SearchResultsPage",
            "mainEntity": {
              "@type": "ItemList",
              "name": `"${pageData.searchQuery}" 的搜尋結果`,
              "numberOfItems": pageData.totalResults || 0
            }
          };

          schemas.push(
            <Helmet key="search-schema">
              <script type="application/ld+json">
                {JSON.stringify(searchSchema, null, 2)}
              </script>
            </Helmet>
          );
        }
        break;

      case 'article':
        if (pageData.articleData) {
          const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": pageData.articleData.title,
            "description": pageData.articleData.description,
            "image": pageData.articleData.image || "https://nkusticalumni.org/og-image.jpg",
            "datePublished": pageData.articleData.publishedDate,
            "dateModified": pageData.articleData.modifiedDate || pageData.articleData.publishedDate,
            "author": {
              "@type": "Organization",
              "name": pageData.articleData.author || "國立高雄科技大學智慧商務系系友會"
            },
            "publisher": {
              "@type": "Organization",
              "name": "國立高雄科技大學智慧商務系系友會",
              "logo": {
                "@type": "ImageObject",
                "url": "https://nkusticalumni.org/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": pageData.articleData.url
            },
            "keywords": pageData.articleData.keywords || "智慧商務系,NKUST,系友會"
          };

          schemas.push(
            <Helmet key="article-schema">
              <script type="application/ld+json">
                {JSON.stringify(articleSchema, null, 2)}
              </script>
            </Helmet>
          );
        }
        break;

      default:
        // 一般頁面的基本 Schema
        break;
    }

    return schemas;
  };

  return (
    <>
      {/* 基礎 Schema */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema, null, 2)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema, null, 2)}
        </script>
      </Helmet>

      {/* 頁面特定 Schema */}
      {renderSchemas()}

      {/* 如果有自定義 Schema */}
      {pageData.customSchemas && pageData.customSchemas.map((schema, index) => (
        <Helmet key={`custom-${index}`}>
          <script type="application/ld+json">
            {JSON.stringify(schema, null, 2)}
          </script>
        </Helmet>
      ))}

      {children}
    </>
  );
};

/**
 * 高階組件：為頁面包裝結構化數據
 */
export const withStructuredData = (pageType, getPageData = () => ({})) => {
  return (WrappedComponent) => {
    const WithStructuredDataComponent = (props) => {
      const pageData = typeof getPageData === 'function' ? getPageData(props) : getPageData;

      return (
        <StructuredDataProvider pageType={pageType} pageData={pageData}>
          <WrappedComponent {...props} />
        </StructuredDataProvider>
      );
    };

    WithStructuredDataComponent.displayName = `withStructuredData(${WrappedComponent.displayName || WrappedComponent.name})`;

    return WithStructuredDataComponent;
  };
};

/**
 * Hook：在組件中使用結構化數據
 */
export const useStructuredData = (schema) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema, null, 2)}
      </script>
    </Helmet>
  );
};

export default StructuredDataProvider;