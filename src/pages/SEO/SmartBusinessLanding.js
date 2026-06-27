import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  BsLaptop,
  BsGraphUp,
  BsPeople,
  BsBriefcase,
  BsGraphUpArrow,
  BsRocket,
  BsCheckCircleFill,
} from 'react-icons/bs';

const SmartBusinessLanding = () => {
  return (
    <>
      <Helmet>
        <title>智慧商務系 | 國立高雄科技大學智慧商務系系友會 - 培育電商與數位商務專才</title>
        <meta name="description" content="智慧商務系致力於培育電子商務、數位行銷、商業智慧分析專業人才。國立高雄科技大學智慧商務系系友會提供完整的校友網絡與職涯發展資源。了解智慧商務系課程特色、就業前景與系友成功案例。" />
        <meta name="keywords" content="智慧商務系, 國立高雄科技大學, 高科大, 電子商務, 數位行銷, 商業智慧, 系友會, 智商系, NKUST智慧商務系" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="智慧商務系 | 國立高雄科技大學智慧商務系系友會" />
        <meta property="og:description" content="智慧商務系培育電商與數位商務專才，提供完整的校友網絡與職涯發展資源" />
        <meta property="og:url" content="https://nkusticalumni.org/smart-business-department" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="智慧商務系 | 國立高雄科技大學智慧商務系系友會" />
        <meta property="twitter:description" content="智慧商務系培育電商與數位商務專才，提供完整的校友網絡與職涯發展資源" />

        {/* 結構化數據 */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "國立高雄科技大學智慧商務系",
            "alternateName": ["智慧商務系", "智商系", "NKUST智慧商務系"],
            "url": "https://nkusticalumni.org/smart-business-department",
            "description": "智慧商務系致力於培育電子商務、數位行銷、商業智慧分析專業人才",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "TW",
              "addressRegion": "高雄市",
              "addressLocality": "燕巢區"
            },
            "parentOrganization": {
              "@type": "University",
              "name": "國立高雄科技大學"
            }
          })}
        </script>

        <link rel="canonical" href="https://nkusticalumni.org/smart-business-department" />
      </Helmet>

      <div className="w-full px-4">
        {/* Hero Section */}
        <section className="hero-section bg-primary text-white py-5">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap -mx-2 items-center">
              <div className="w-full lg:w-2/3 px-2">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  智慧商務系 - 培育未來數位商務領袖
                </h1>
                <p className="text-lg mb-4">
                  國立高雄科技大學智慧商務系致力於培育具備電子商務、數位行銷、商業智慧分析能力的專業人才。
                  透過產學合作與實務導向的課程設計，讓學生具備迎接數位經濟時代的核心競爭力。
                </p>
                <div className="flex gap-3">
                  <Link to="/IC/joinUs" className="btn btn-lg bg-white text-primary border-white hover:bg-base-200">
                    加入系友會
                  </Link>
                  <Link to="/IC/intro" className="btn btn-lg btn-outline text-white border-white hover:bg-white hover:text-primary">
                    了解更多
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 系所特色 Section */}
        <section className="py-5">
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-5">智慧商務系核心特色</h2>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-4">
                <div className="card h-full shadow-sm">
                  <div className="card-body text-center">
                    <div className="bg-primary rounded-full mx-auto mb-3" style={{width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <BsLaptop className="text-white text-2xl" />
                    </div>
                    <h4>電子商務專業</h4>
                    <p className="text-base-content/60">
                      深入學習電商平台經營、網路行銷策略、跨境電商等實務技能，
                      培養智慧商務系學生具備完整的電商營運能力。
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <div className="card h-full shadow-sm">
                  <div className="card-body text-center">
                    <div className="bg-success rounded-full mx-auto mb-3" style={{width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <BsGraphUp className="text-white text-2xl" />
                    </div>
                    <h4>商業智慧分析</h4>
                    <p className="text-base-content/60">
                      運用大數據分析、機器學習等技術，培養智慧商務系學生具備數據驅動的商業決策能力，
                      成為企業數位轉型的重要推手。
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <div className="card h-full shadow-sm">
                  <div className="card-body text-center">
                    <div className="bg-warning rounded-full mx-auto mb-3" style={{width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <BsPeople className="text-white text-2xl" />
                    </div>
                    <h4>產學合作實務</h4>
                    <p className="text-base-content/60">
                      與知名企業建立緊密的產學合作關係，提供智慧商務系學生實習機會與就業管道，
                      確保理論與實務的完美結合。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 課程特色 Section */}
        <section className="py-5 bg-base-200">
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-5">智慧商務系課程規劃</h2>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full lg:w-1/2 px-2">
                <h3 className="mb-4">核心專業課程</h3>
                <ul className="divide-y divide-base-300">
                  <li className="py-2 bg-transparent">
                    <strong>電子商務概論</strong> - 建立智慧商務系學生對電商產業的基礎認知
                  </li>
                  <li className="py-2 bg-transparent">
                    <strong>數位行銷策略</strong> - 掌握網路行銷、社群媒體經營等技能
                  </li>
                  <li className="py-2 bg-transparent">
                    <strong>商業智慧與大數據分析</strong> - 學習數據分析工具與商業應用
                  </li>
                  <li className="py-2 bg-transparent">
                    <strong>電商平台設計與管理</strong> - 實作電商網站建置與營運
                  </li>
                  <li className="py-2 bg-transparent">
                    <strong>供應鏈管理</strong> - 了解現代商務流程與物流管理
                  </li>
                </ul>
              </div>
              <div className="w-full lg:w-1/2 px-2">
                <h3 className="mb-4">實務應用課程</h3>
                <ul className="divide-y divide-base-300">
                  <li className="py-2 bg-transparent">
                    <strong>企業實習專案</strong> - 與合作企業進行實際案例操作
                  </li>
                  <li className="py-2 bg-transparent">
                    <strong>創業與創新管理</strong> - 培養智慧商務系學生創業精神
                  </li>
                  <li className="py-2 bg-transparent">
                    <strong>跨境電商實務</strong> - 掌握國際市場拓展策略
                  </li>
                  <li className="py-2 bg-transparent">
                    <strong>金融科技應用</strong> - 了解數位支付與區塊鏈技術
                  </li>
                  <li className="py-2 bg-transparent">
                    <strong>畢業專題製作</strong> - 整合四年所學完成專業作品
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 就業前景 Section */}
        <section className="py-5">
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-5">智慧商務系就業前景</h2>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full lg:w-1/3 px-2 mb-4">
                <div className="text-center">
                  <div className="bg-info rounded-full mx-auto mb-3" style={{width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <BsBriefcase className="text-white text-3xl" />
                  </div>
                  <h4>就業領域廣泛</h4>
                  <p className="text-base-content/60">
                    智慧商務系畢業生可投入電商平台、數位行銷公司、科技業、金融業、
                    零售業等多元領域，職涯發展空間寬廣。
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-1/3 px-2 mb-4">
                <div className="text-center">
                  <div className="bg-success rounded-full mx-auto mb-3" style={{width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <BsGraphUpArrow className="text-white text-3xl" />
                  </div>
                  <h4>薪資競爭力佳</h4>
                  <p className="text-base-content/60">
                    因應數位轉型趨勢，智慧商務系專業人才需求持續增長，
                    起薪與發展前景均優於一般商管科系。
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-1/3 px-2 mb-4">
                <div className="text-center">
                  <div className="bg-warning rounded-full mx-auto mb-3" style={{width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <BsRocket className="text-white text-3xl" />
                  </div>
                  <h4>創業機會豐富</h4>
                  <p className="text-base-content/60">
                    智慧商務系培養的創新思維與實務技能，
                    為學生創業提供堅實基礎，許多系友已成功創立事業。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 系友會介紹 Section */}
        <section className="py-5 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap -mx-2 items-center">
              <div className="w-full lg:w-2/3 px-2">
                <h2 className="mb-4">加入智慧商務系系友會</h2>
                <p className="text-lg mb-4">
                  國立高雄科技大學智慧商務系系友會匯聚了各行各業的優秀系友，
                  提供職涯諮詢、人脈拓展、創業資源等多元服務。
                  無論您是在學生、畢業系友或是對智慧商務系有興趣的朋友，
                  我們都歡迎您的加入！
                </p>
                <div className="flex flex-wrap -mx-2">
                  <div className="w-full md:w-1/2 px-2 mb-3">
                    <div className="flex items-center">
                      <BsCheckCircleFill className="mr-2" />
                      <span>職涯發展諮詢</span>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 px-2 mb-3">
                    <div className="flex items-center">
                      <BsCheckCircleFill className="mr-2" />
                      <span>產業趨勢分享</span>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 px-2 mb-3">
                    <div className="flex items-center">
                      <BsCheckCircleFill className="mr-2" />
                      <span>人脈網絡建立</span>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 px-2 mb-3">
                    <div className="flex items-center">
                      <BsCheckCircleFill className="mr-2" />
                      <span>創業資源媒合</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/3 px-2 text-center">
                <Link to="/IC/joinUs" className="btn btn-lg px-5 bg-white text-primary border-white hover:bg-base-200">
                  立即加入
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-5">
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-5">常見問題</h2>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full lg:w-2/3 px-2 mx-auto">
                <div className="join join-vertical w-full">
                  <div className="collapse collapse-arrow join-item border border-base-300">
                    <input type="radio" name="faqAccordion" defaultChecked />
                    <h3 className="collapse-title text-lg font-medium m-0">
                      智慧商務系與一般商管系的差異是什麼？
                    </h3>
                    <div className="collapse-content">
                      <p>
                        智慧商務系更注重數位科技與商業的結合，課程涵蓋電子商務、數位行銷、商業智慧分析等新興領域。
                        相較於傳統商管系，智慧商務系學生更具備數位時代所需的技術能力與創新思維。
                      </p>
                    </div>
                  </div>

                  <div className="collapse collapse-arrow join-item border border-base-300">
                    <input type="radio" name="faqAccordion" />
                    <h3 className="collapse-title text-lg font-medium m-0">
                      智慧商務系畢業生主要從事哪些工作？
                    </h3>
                    <div className="collapse-content">
                      <p>
                        智慧商務系畢業生可從事電商經理、數位行銷專員、商業分析師、產品經理、創業家等職務。
                        隨著企業數位轉型需求增加，智慧商務系專業人才在各行各業都有很好的發展機會。
                      </p>
                    </div>
                  </div>

                  <div className="collapse collapse-arrow join-item border border-base-300">
                    <input type="radio" name="faqAccordion" />
                    <h3 className="collapse-title text-lg font-medium m-0">
                      如何加入國立高雄科技大學智慧商務系系友會？
                    </h3>
                    <div className="collapse-content">
                      <p>
                        歡迎智慧商務系在校生、畢業系友及相關產業人士加入我們的系友會。
                        您可以透過線上申請表單加入，或是聯繫系友會幹部了解更多詳情。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-5 bg-base-200">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4">準備加入智慧商務系的未來嗎？</h2>
            <p className="text-lg mb-4">
              探索更多關於國立高雄科技大學智慧商務系的資訊，
              或與我們的系友會聯繫，開啟您的數位商務職涯之路！
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/IC/contactUs" className="btn btn-primary btn-lg">
                聯繫我們
              </Link>
              <Link to="/alumnilist" className="btn btn-outline btn-primary btn-lg">
                查看系友名單
              </Link>
              <Link to="/recruit" className="btn btn-success btn-lg">
                職涯機會
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SmartBusinessLanding;
