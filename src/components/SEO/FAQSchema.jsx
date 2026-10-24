import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * FAQ結構化數據組件
 * 專為智慧商務系系友會常見問題設計的 FAQ Schema.org 標記
 */
const FAQSchema = ({
  faqs,
  mainEntity = null,
  keywords = "智慧商務系FAQ,NKUST常見問題,系友會問答"
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "keywords": keywords,
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
  };

  // 如果有指定主要實體
  if (mainEntity) {
    schema.mainEntity = {
      "@type": mainEntity.type || "Thing",
      "name": mainEntity.name,
      "description": mainEntity.description
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
 * 智慧商務系系友會常見問題預設配置
 */
export const DefaultFAQs = {
  // 關於智慧商務系
  ABOUT_DEPARTMENT: [
    {
      question: "什麼是智慧商務系？",
      answer: "國立高雄科技大學智慧商務系（簡稱智商系）是結合人工智慧、大數據分析、電子商務與數位轉型的跨領域學系。培育學生具備AI技術應用、資料科學分析、數位行銷與商業策略規劃的專業能力，為智慧商務時代培養頂尖人才。",
      dateCreated: "2024-01-01",
      upvoteCount: 25
    },
    {
      question: "智慧商務系和一般商學系有什麼不同？",
      answer: "智慧商務系強調科技與商業的結合，課程涵蓋程式設計、資料科學、AI應用等技術面向，同時融入商業策略、市場分析等管理知識。學生不僅學習傳統商學理論，更要具備實際操作AI工具、分析大數據、開發電商平台的技術能力。",
      dateCreated: "2024-01-01",
      upvoteCount: 18
    },
    {
      question: "智慧商務系主要學習哪些課程？",
      answer: "主要課程包括人工智慧與機器學習、大數據分析與視覺化、電子商務平台設計、數位行銷策略、商業智慧系統、區塊鏈技術應用、物聯網商務模式、數位轉型管理等。結合理論與實務，培養學生跨領域整合能力。",
      dateCreated: "2024-01-01",
      upvoteCount: 22
    },
    {
      question: "NKUST智慧商務系有什麼特色？",
      answer: "本系特色包括：1.跨領域整合課程設計 2.產學合作實務專題 3.業界師資協同教學 4.國際交流與雙聯學制 5.創新創業培育計畫 6.完善實驗設備與學習環境 7.豐富的企業實習機會 8.活躍的系友網絡支持。",
      dateCreated: "2024-01-01",
      upvoteCount: 20
    }
  ],

  // 關於系友會
  ABOUT_ALUMNI: [
    {
      question: "智慧商務系系友會提供哪些服務？",
      answer: "系友會提供多元化服務包括：定期系友聚會與產業交流活動、職涯發展諮詢與就業媒合服務、產學合作機會媒介、創業輔導與資源分享、專業技能研習課程、人脈網絡拓展平台等，協助系友在職涯發展上獲得全方位支持。",
      dateCreated: "2024-01-01",
      upvoteCount: 30
    },
    {
      question: "如何加入智慧商務系系友會？",
      answer: "凡國立高雄科技大學智慧商務系畢業校友皆可申請加入系友會。請透過官方網站線上申請，或聯繫系友會秘書處(alumni@nkusticalumni.org)索取入會申請表。入會後即可享有各項系友服務與活動參與權益。",
      dateCreated: "2024-01-01",
      upvoteCount: 28
    },
    {
      question: "系友會有哪些活動？",
      answer: "系友會定期舉辦多種活動：年度系友大會、產業趨勢講座、技術研習工作坊、企業參訪活動、創業分享會、職涯規劃座談、網路聚會、節慶聯誼活動等。活動資訊會透過官網、社群媒體及電子報發布。",
      dateCreated: "2024-01-01",
      upvoteCount: 24
    },
    {
      question: "系友會會費如何收取？",
      answer: "系友會採取彈性會費制度，基本會員免收年費，可享受基本服務。VIP會員採年費制，享有優先報名活動、專屬服務等特殊權益。具體費用標準請參考官網或聯繫秘書處查詢。",
      dateCreated: "2024-01-01",
      upvoteCount: 15
    }
  ],

  // 就業與職涯
  CAREER_DEVELOPMENT: [
    {
      question: "智慧商務系畢業生就業方向為何？",
      answer: "畢業生就業領域廣泛，包括：數據分析師、AI工程師、電商營運專員、數位行銷經理、產品經理、商業分析師、系統分析師、創業家等。可投入科技業、金融業、零售業、顧問業等各行各業的數位轉型工作。",
      dateCreated: "2024-01-01",
      upvoteCount: 35
    },
    {
      question: "系友會如何協助就業媒合？",
      answer: "系友會建立就業媒合平台，定期發布系友企業職缺資訊、舉辦企業徵才說明會、安排一對一職涯諮詢、提供履歷健檢服務、舉辦面試技巧工作坊，並透過系友人脈網絡提供內推機會。",
      dateCreated: "2024-01-01",
      upvoteCount: 32
    },
    {
      question: "畢業後如何持續提升專業技能？",
      answer: "系友會定期舉辦專業研習課程，包括最新AI技術、數據分析工具、電商趨勢等主題。同時與業界合作開設認證課程，並提供線上學習資源推薦，協助系友持續精進專業能力。",
      dateCreated: "2024-01-01",
      upvoteCount: 27
    }
  ],

  // 產學合作
  INDUSTRY_COOPERATION: [
    {
      question: "如何與智慧商務系進行產學合作？",
      answer: "企業可透過系友會平台申請產學合作，包括：學生實習專案、畢業專題指導、教師研究合作、技術諮詢服務、人才培訓課程等。歡迎聯繫系友會秘書處討論合作方案。",
      dateCreated: "2024-01-01",
      upvoteCount: 19
    },
    {
      question: "系友企業有哪些合作優勢？",
      answer: "系友企業享有優先合作權，可獲得學系最新研究成果、優秀學生實習機會、專業技術支援，並可參與系上重要決策諮詢。透過系友網絡還能拓展更多商業合作機會。",
      dateCreated: "2024-01-01",
      upvoteCount: 16
    }
  ],

  // 技術相關
  TECHNICAL_TOPICS: [
    {
      question: "智慧商務需要具備哪些程式設計能力？",
      answer: "建議掌握Python（數據分析、AI開發）、R（統計分析）、SQL（資料庫操作）、JavaScript（前端開發）、HTML/CSS（網頁設計）等程式語言。同時要熟悉相關框架如TensorFlow、scikit-learn、React等。",
      dateCreated: "2024-01-01",
      upvoteCount: 40
    },
    {
      question: "如何開始學習人工智慧？",
      answer: "建議從基礎數學（統計學、線性代數）開始，接著學習Python程式設計，然後進入機器學習理論與實務。可參考系友會推薦的學習資源，或參加相關研習課程。重點是理論與實作並重。",
      dateCreated: "2024-01-01",
      upvoteCount: 38
    },
    {
      question: "大數據分析需要哪些工具？",
      answer: "常用工具包括：Python（pandas、numpy、matplotlib）、R（ggplot2、dplyr）、Tableau（資料視覺化）、SQL（資料庫查詢）、Spark（大數據處理）、Excel（基礎分析）等。選擇工具要依據數據規模和分析需求。",
      dateCreated: "2024-01-01",
      upvoteCount: 36
    }
  ]
};

/**
 * 根據頁面類型生成對應的FAQ
 */
export const generatePageFAQs = (pageType) => {
  switch (pageType) {
    case 'department':
      return DefaultFAQs.ABOUT_DEPARTMENT;
    case 'alumni':
      return DefaultFAQs.ABOUT_ALUMNI;
    case 'career':
      return DefaultFAQs.CAREER_DEVELOPMENT;
    case 'cooperation':
      return DefaultFAQs.INDUSTRY_COOPERATION;
    case 'technical':
      return DefaultFAQs.TECHNICAL_TOPICS;
    case 'homepage':
      // 首頁顯示各類別的精選問題
      return [
        ...DefaultFAQs.ABOUT_DEPARTMENT.slice(0, 2),
        ...DefaultFAQs.ABOUT_ALUMNI.slice(0, 2),
        ...DefaultFAQs.CAREER_DEVELOPMENT.slice(0, 1),
        ...DefaultFAQs.TECHNICAL_TOPICS.slice(0, 1)
      ];
    default:
      return [];
  }
};

export default FAQSchema;