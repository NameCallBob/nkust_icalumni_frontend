/**
 * SEO組件統一導出文件
 * 提供所有結構化數據組件的便捷導入
 */

// 核心組件
export { default as StructuredDataProvider, withStructuredData, useStructuredData } from './StructuredDataProvider';

// 基礎 Schema 組件
export { default as EducationalOrganizationSchema } from './EducationalOrganizationSchema';
export { default as LocalBusinessSchema } from './LocalBusinessSchema';

// 內容 Schema 組件
export { default as EventSchema, EventPresets } from './EventSchema';
export { default as CourseSchema, EducationalProgramSchema, CoursePresets } from './CourseSchema';
export { default as PersonSchema, FacultySchema, PersonPresets } from './PersonSchema';
export { default as FAQSchema, DefaultFAQs, generatePageFAQs } from './FAQSchema';

/**
 * 常用的頁面類型常數
 */
export const PAGE_TYPES = {
  HOMEPAGE: 'homepage',
  ABOUT_DEPARTMENT: 'about-department',
  ABOUT_ALUMNI: 'about-alumni',
  EVENT_DETAIL: 'event-detail',
  EVENT_LIST: 'event-list',
  COURSE_DETAIL: 'course-detail',
  PROGRAM_DETAIL: 'program-detail',
  PERSON_PROFILE: 'person-profile',
  FACULTY_PROFILE: 'faculty-profile',
  CAREER_PAGE: 'career-page',
  COOPERATION_PAGE: 'cooperation-page',
  TECHNICAL_PAGE: 'technical-page',
  SEARCH_RESULTS: 'search-results',
  ARTICLE: 'article'
};

/**
 * 快速配置函數：為常見頁面生成結構化數據配置
 */
export const createSchemaConfig = {
  // 首頁配置
  homepage: (data = {}) => ({
    pageType: PAGE_TYPES.HOMEPAGE,
    pageData: {
      breadcrumbs: [{ name: '首頁', url: 'https://nkusticalumni.org/' }],
      ...data
    }
  }),

  // 關於系所頁面
  aboutDepartment: (data = {}) => ({
    pageType: PAGE_TYPES.ABOUT_DEPARTMENT,
    pageData: {
      breadcrumbs: [
        { name: '首頁', url: 'https://nkusticalumni.org/' },
        { name: '關於智慧商務系', path: '/about/department' }
      ],
      organizationData: {
        name: "國立高雄科技大學智慧商務系",
        description: "培育人工智慧、大數據分析、電子商務、數位轉型等領域專業人才的頂尖學系",
        ...data.organizationData
      },
      ...data
    }
  }),

  // 關於系友會頁面
  aboutAlumni: (data = {}) => ({
    pageType: PAGE_TYPES.ABOUT_ALUMNI,
    pageData: {
      breadcrumbs: [
        { name: '首頁', url: 'https://nkusticalumni.org/' },
        { name: '關於系友會', path: '/about/alumni' }
      ],
      businessData: {
        name: "國立高雄科技大學智慧商務系系友會",
        description: "提供系友聯誼、職涯發展、產學合作等專業服務的本地組織",
        ...data.businessData
      },
      ...data
    }
  }),

  // 活動詳細頁面
  eventDetail: (eventData, data = {}) => ({
    pageType: PAGE_TYPES.EVENT_DETAIL,
    pageData: {
      breadcrumbs: [
        { name: '首頁', url: 'https://nkusticalumni.org/' },
        { name: '活動資訊', path: '/events' },
        { name: eventData.name, path: `/events/${eventData.id}` }
      ],
      eventData,
      ...data
    }
  }),

  // 活動列表頁面
  eventList: (events, data = {}) => ({
    pageType: PAGE_TYPES.EVENT_LIST,
    pageData: {
      breadcrumbs: [
        { name: '首頁', url: 'https://nkusticalumni.org/' },
        { name: '活動資訊', path: '/events' }
      ],
      events,
      ...data
    }
  }),

  // 課程詳細頁面
  courseDetail: (courseData, data = {}) => ({
    pageType: PAGE_TYPES.COURSE_DETAIL,
    pageData: {
      breadcrumbs: [
        { name: '首頁', url: 'https://nkusticalumni.org/' },
        { name: '課程資訊', path: '/courses' },
        { name: courseData.name, path: `/courses/${courseData.id}` }
      ],
      courseData,
      ...data
    }
  }),

  // 人物檔案頁面
  personProfile: (personData, data = {}) => ({
    pageType: PAGE_TYPES.PERSON_PROFILE,
    pageData: {
      breadcrumbs: [
        { name: '首頁', url: 'https://nkusticalumni.org/' },
        { name: '系友風采', path: '/alumni' },
        { name: personData.name, path: `/alumni/${personData.id}` }
      ],
      personData,
      ...data
    }
  }),

  // 教職員檔案頁面
  facultyProfile: (facultyData, data = {}) => ({
    pageType: PAGE_TYPES.FACULTY_PROFILE,
    pageData: {
      breadcrumbs: [
        { name: '首頁', url: 'https://nkusticalumni.org/' },
        { name: '師資介紹', path: '/faculty' },
        { name: facultyData.name, path: `/faculty/${facultyData.id}` }
      ],
      facultyData,
      ...data
    }
  }),

  // 文章頁面
  article: (articleData, data = {}) => ({
    pageType: PAGE_TYPES.ARTICLE,
    pageData: {
      breadcrumbs: [
        { name: '首頁', url: 'https://nkusticalumni.org/' },
        { name: '最新消息', path: '/news' },
        { name: articleData.title, path: `/news/${articleData.id}` }
      ],
      articleData,
      ...data
    }
  }),

  // 搜尋結果頁面
  searchResults: (searchQuery, totalResults, data = {}) => ({
    pageType: PAGE_TYPES.SEARCH_RESULTS,
    pageData: {
      breadcrumbs: [
        { name: '首頁', url: 'https://nkusticalumni.org/' },
        { name: '搜尋結果', path: '/search' }
      ],
      searchQuery,
      totalResults,
      ...data
    }
  })
};

/**
 * 智慧商務系特定的關鍵字集合
 */
export const NKUST_IC_KEYWORDS = {
  DEPARTMENT: "智慧商務系,智商系,NKUST,國立高雄科技大學,人工智慧,大數據,電子商務,數位轉型",
  ALUMNI: "系友會,校友網絡,產學合作,職涯發展,人脈拓展,創業輔導",
  TECHNOLOGY: "機器學習,資料科學,數位行銷,商業智慧,區塊鏈,物聯網",
  CAREER: "AI工程師,數據分析師,電商專家,數位行銷,產品經理,創業家",
  EDUCATION: "學士班,碩士班,課程設計,實務專題,產學合作,國際交流"
};

/**
 * 常用的結構化數據模板
 */
export const SCHEMA_TEMPLATES = {
  // 智慧商務系系友基本模板
  NKUST_IC_ALUMNI: {
    alumniOf: {
      name: "國立高雄科技大學",
      department: "智慧商務系",
      url: "https://www.nkust.edu.tw/"
    },
    memberOf: {
      name: "國立高雄科技大學智慧商務系系友會",
      url: "https://nkusticalumni.org/"
    },
    keywords: NKUST_IC_KEYWORDS.ALUMNI
  },

  // 智慧商務系課程基本模板
  NKUST_IC_COURSE: {
    provider: {
      name: "國立高雄科技大學智慧商務系",
      url: "https://nkusticalumni.org/"
    },
    inLanguage: "zh-TW",
    keywords: NKUST_IC_KEYWORDS.TECHNOLOGY
  },

  // 系友會活動基本模板
  ALUMNI_EVENT: {
    organizer: {
      type: "Organization",
      name: "國立高雄科技大學智慧商務系系友會",
      url: "https://nkusticalumni.org/"
    },
    location: {
      name: "國立高雄科技大學",
      address: {
        streetAddress: "建工路415號",
        addressLocality: "高雄市",
        addressRegion: "三民區",
        postalCode: "807",
        addressCountry: "TW"
      }
    },
    keywords: NKUST_IC_KEYWORDS.ALUMNI
  }
};

export default StructuredDataProvider;