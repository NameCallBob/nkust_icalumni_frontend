# SEO 結構化數據組件文檔

## 概述

本目錄包含專為國立高雄科技大學智慧商務系系友會網站設計的 Schema.org 結構化數據組件。這些組件旨在提升網站在搜尋引擎中的可見性，特別針對「智慧商務系」、「智商系」、「NKUST」等關鍵字進行了優化。

## 組件結構

### 核心組件

#### 1. StructuredDataProvider
**檔案**: `StructuredDataProvider.js`
**用途**: 動態結構化數據生成器，根據頁面類型自動生成適當的 Schema.org 標記

**使用方式**:
```jsx
import { StructuredDataProvider, PAGE_TYPES } from './components/SEO';

<StructuredDataProvider
  pageType={PAGE_TYPES.HOMEPAGE}
  pageData={{
    breadcrumbs: [{ name: '首頁', url: 'https://nkusticalumni.org/' }]
  }}
>
  <YourPageComponent />
</StructuredDataProvider>
```

#### 2. 基礎 Schema 組件

##### EducationalOrganizationSchema
**檔案**: `EducationalOrganizationSchema.js`
**用途**: 智慧商務系教育機構結構化數據

**特色**:
- 包含完整的學系資訊（學士班、碩士班）
- 課程目錄結構化數據
- 針對智慧商務相關關鍵字優化

##### LocalBusinessSchema
**檔案**: `LocalBusinessSchema.js`
**用途**: 系友會本地商業結構化數據

**特色**:
- 地理位置資訊
- 營業時間
- 服務範圍和項目
- 聯絡資訊

#### 3. 內容 Schema 組件

##### EventSchema
**檔案**: `EventSchema.js`
**用途**: 系友會活動結構化數據

**支援的活動類型**:
- 系友聚會 (`ALUMNI_GATHERING`)
- 產業交流會 (`INDUSTRY_EXCHANGE`)
- 技術研習 (`TECHNICAL_WORKSHOP`)
- 線上活動 (`ONLINE_EVENT`)
- 混合活動 (`HYBRID_EVENT`)

##### CourseSchema & EducationalProgramSchema
**檔案**: `CourseSchema.js`
**用途**: 課程和學程結構化數據

**內建課程預設**:
- AI 課程 (`AI_COURSE`)
- 大數據課程 (`BIG_DATA_COURSE`)
- 電子商務課程 (`ECOMMERCE_COURSE`)

##### PersonSchema & FacultySchema
**檔案**: `PersonSchema.js`
**用途**: 系友和教職員結構化數據

**人物類型預設**:
- 系友 (`ALUMNI`)
- AI專家 (`AI_EXPERT`)
- 大數據專家 (`DATA_SCIENTIST`)
- 電商專家 (`ECOMMERCE_EXPERT`)

##### FAQSchema
**檔案**: `FAQSchema.js`
**用途**: 常見問題結構化數據

**內建 FAQ 類別**:
- 關於智慧商務系 (`ABOUT_DEPARTMENT`)
- 關於系友會 (`ABOUT_ALUMNI`)
- 就業與職涯 (`CAREER_DEVELOPMENT`)
- 產學合作 (`INDUSTRY_COOPERATION`)
- 技術相關 (`TECHNICAL_TOPICS`)

## 使用指南

### 1. 基本用法

```jsx
import {
  StructuredDataProvider,
  PAGE_TYPES,
  createSchemaConfig
} from './components/SEO';

// 首頁使用
const HomepageComponent = () => {
  const schemaConfig = createSchemaConfig.homepage();

  return (
    <StructuredDataProvider {...schemaConfig}>
      {/* 頁面內容 */}
    </StructuredDataProvider>
  );
};
```

### 2. 高階組件用法

```jsx
import { withStructuredData, PAGE_TYPES } from './components/SEO';

const EventDetailPage = ({ event }) => {
  return <div>{/* 活動詳細內容 */}</div>;
};

export default withStructuredData(
  PAGE_TYPES.EVENT_DETAIL,
  (props) => ({ eventData: props.event })
)(EventDetailPage);
```

### 3. Hook 用法

```jsx
import { useStructuredData } from './components/SEO';

const CustomComponent = ({ customSchema }) => {
  const structuredDataElement = useStructuredData(customSchema);

  return (
    <>
      {structuredDataElement}
      {/* 組件內容 */}
    </>
  );
};
```

## 關鍵字優化策略

### 智慧商務系相關關鍵字

#### 核心關鍵字
- 智慧商務系
- 智商系
- NKUST
- 國立高雄科技大學

#### 技術相關關鍵字
- 人工智慧
- 機器學習
- 大數據
- 資料科學
- 電子商務
- 數位行銷
- 區塊鏈
- 物聯網

#### 職涯相關關鍵字
- 數據分析師
- AI工程師
- 電商專家
- 數位行銷
- 產品經理
- 商業分析師
- 創業家

#### 系友會相關關鍵字
- 系友會
- 校友網絡
- 產學合作
- 職涯發展
- 人脈拓展
- 創業輔導

## 最佳實踐

### 1. 頁面特定優化

每個頁面類型都有對應的結構化數據配置：

```jsx
// 針對不同頁面類型的優化
const schemaConfigs = {
  homepage: createSchemaConfig.homepage(),
  about: createSchemaConfig.aboutDepartment(),
  events: createSchemaConfig.eventList(events),
  courses: createSchemaConfig.courseDetail(courseData)
};
```

### 2. 動態內容處理

```jsx
// 動態生成活動結構化數據
const EventListPage = ({ events }) => {
  const schemaConfig = {
    pageType: PAGE_TYPES.EVENT_LIST,
    pageData: {
      events: events.map(event => ({
        ...event,
        keywords: `${event.type},智慧商務系活動,NKUST`
      }))
    }
  };

  return (
    <StructuredDataProvider {...schemaConfig}>
      {/* 活動列表內容 */}
    </StructuredDataProvider>
  );
};
```

### 3. 自定義結構化數據

```jsx
// 添加自定義結構化數據
const CustomPage = () => {
  const customSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "智慧商務系最新研究成果",
      "keywords": "智慧商務,AI研究,NKUST"
    }
  ];

  return (
    <StructuredDataProvider
      pageType={PAGE_TYPES.ARTICLE}
      pageData={{ customSchemas }}
    >
      {/* 頁面內容 */}
    </StructuredDataProvider>
  );
};
```

## 工具函數

### generateNKUSTICOptimizedSchema
針對智慧商務系關鍵字優化的結構化數據生成器

```jsx
import { generateNKUSTICOptimizedSchema } from '../utils/seo-schemas';

// 生成首頁優化的結構化數據
const homepageSchema = generateNKUSTICOptimizedSchema('homepage');

// 生成學系頁面優化的結構化數據
const departmentSchema = generateNKUSTICOptimizedSchema('department');
```

### getNKUSTICKeywords
獲取特定類別的智慧商務系相關關鍵字

```jsx
import { getNKUSTICKeywords } from '../utils/seo-schemas';

const techKeywords = getNKUSTICKeywords('technology');
const careerKeywords = getNKUSTICKeywords('career');
const alumniKeywords = getNKUSTICKeywords('alumni');
```

## 測試與驗證

### Google Rich Results Test
使用 Google 的 Rich Results Test 工具驗證結構化數據：
https://search.google.com/test/rich-results

### Schema.org Validator
使用 Schema.org 官方驗證工具：
https://validator.schema.org/

### 建議的測試頁面
1. 首頁 - 教育機構 + 本地商業 + FAQ
2. 關於系所頁面 - 教育機構詳細資訊
3. 活動詳細頁面 - 活動結構化數據
4. 系友檔案頁面 - 人物結構化數據
5. 課程頁面 - 課程結構化數據

## 更新維護

### 定期檢查項目
1. 確保所有 URL 使用 HTTPS
2. 更新聯絡資訊和地址
3. 檢查課程和活動資訊的時效性
4. 驗證結構化數據的有效性

### 關鍵字策略調整
定期根據 SEO 表現調整關鍵字策略：
1. 分析搜尋流量來源
2. 監控關鍵字排名
3. 根據數據調整結構化數據中的關鍵字

## 貢獻指南

添加新的結構化數據組件時，請遵循以下原則：
1. 使用 TypeScript 進行類型檢查
2. 包含完整的 JSDoc 註釋
3. 提供使用範例
4. 針對智慧商務系關鍵字進行優化
5. 確保符合 Google 結構化數據指南