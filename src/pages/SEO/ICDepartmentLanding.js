import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  BsPersonPlus,
  BsInfoCircle,
  BsCheckCircleFill,
  BsCart,
  BsGraphUpArrow,
  BsMegaphone,
  BsLightbulb,
  BsStarFill,
  BsLaptop,
  BsBuilding,
  BsBook,
  BsPeople,
  BsCheck2Circle,
  BsEnvelope,
  BsBriefcase,
} from 'react-icons/bs';

const ICDepartmentLanding = () => {
  return (
    <>
      <Helmet>
        <title>智商系 | 高科大智商系系友會 - 智慧商務與創新科技的搖籃</title>
        <meta name="description" content="智商系（智慧商務系）是高科大重點科系，專注培育智慧商務人才。智商系系友會提供完整校友網絡，助力職涯發展。了解智商系課程特色、就業優勢與系友成功故事。" />
        <meta name="keywords" content="智商系, 智慧商務系, 高科大智商系, 國立高雄科技大學, NKUST, 電商人才, 數位商務, 系友會" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="智商系 | 高科大智商系系友會 - 智慧商務與創新科技的搖籃" />
        <meta property="og:description" content="智商系專注培育智慧商務人才，系友會提供完整校友網絡與職涯發展支援" />
        <meta property="og:url" content="https://nkusticalumni.org/ic-department" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="智商系 | 高科大智商系系友會" />
        <meta property="twitter:description" content="智商系專注培育智慧商務人才，系友會提供完整校友網絡與職涯發展支援" />

        {/* 結構化數據 */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "國立高雄科技大學智慧商務系",
            "alternateName": ["智商系", "智慧商務系", "高科大智商系"],
            "url": "https://nkusticalumni.org/ic-department",
            "description": "智商系專注培育智慧商務、電子商務與數位創新人才",
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

        <link rel="canonical" href="https://nkusticalumni.org/ic-department" />
      </Helmet>

      <div className="w-full px-4">
        {/* Hero Section */}
        <section className="hero-section text-white py-5" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center min-h-[50vh] -mx-2">
              <div className="w-full lg:w-2/3 px-2">
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                  智商系 - 開創智慧商務新紀元
                </h1>
                <p className="text-lg mb-4">
                  高科大智商系（智慧商務系）是南台灣培育數位商務領袖的重要基地。
                  我們致力於培養具備創新思維、科技應用與商業洞察力的新世代人才，
                  讓智商系學生在瞬息萬變的數位經濟中脫穎而出。
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/IC/joinUs" className="btn btn-lg px-4 bg-white text-primary border-white hover:bg-gray-100">
                    <BsPersonPlus className="mr-2" />
                    加入智商系友會
                  </Link>
                  <Link to="/IC/intro" className="btn btn-outline btn-lg px-4 text-white border-white hover:bg-white/10">
                    <BsInfoCircle className="mr-2" />
                    認識智商系
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 智商系簡介 Section */}
        <section className="py-5">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center -mx-2">
              <div className="w-full lg:w-1/2 px-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">關於智商系</h2>
                <p className="text-lg text-base-content/60 mb-4">
                  國立高雄科技大學智商系（智慧商務系）成立於數位轉型的關鍵時刻，
                  專注於培育具備智慧商務專業知識與實務技能的人才。
                </p>
                <div className="flex flex-wrap -m-2">
                  <div className="w-1/2 p-2">
                    <div className="text-center p-3 bg-base-200 rounded">
                      <h3 className="text-primary mb-1">500+</h3>
                      <small className="text-base-content/60">智商系畢業生</small>
                    </div>
                  </div>
                  <div className="w-1/2 p-2">
                    <div className="text-center p-3 bg-base-200 rounded">
                      <h3 className="text-success mb-1">95%</h3>
                      <small className="text-base-content/60">智商系就業率</small>
                    </div>
                  </div>
                  <div className="w-1/2 p-2">
                    <div className="text-center p-3 bg-base-200 rounded">
                      <h3 className="text-warning mb-1">50+</h3>
                      <small className="text-base-content/60">產學合作企業</small>
                    </div>
                  </div>
                  <div className="w-1/2 p-2">
                    <div className="text-center p-3 bg-base-200 rounded">
                      <h3 className="text-info mb-1">20+</h3>
                      <small className="text-base-content/60">專業師資</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 px-2">
                <div className="relative">
                  <div className="bg-primary rounded-lg p-4 text-white">
                    <h3 className="mb-3">智商系核心價值</h3>
                    <ul className="list-none">
                      <li className="mb-2">
                        <BsCheckCircleFill className="inline mr-2" />
                        <strong>創新思維：</strong>培養智商系學生具備創新創業精神
                      </li>
                      <li className="mb-2">
                        <BsCheckCircleFill className="inline mr-2" />
                        <strong>科技整合：</strong>結合最新科技與商業應用
                      </li>
                      <li className="mb-2">
                        <BsCheckCircleFill className="inline mr-2" />
                        <strong>實務導向：</strong>強調理論與實作並重的學習模式
                      </li>
                      <li className="mb-2">
                        <BsCheckCircleFill className="inline mr-2" />
                        <strong>國際視野：</strong>拓展智商系學生全球競爭力
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 智商系專業領域 Section */}
        <section className="py-5 bg-base-200">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-5">智商系專業領域</h2>
            <div className="flex flex-wrap -m-2">
              <div className="w-full md:w-1/2 lg:w-1/4 p-2">
                <div className="card border-0 shadow-sm h-full text-center">
                  <div className="card-body p-4">
                    <div className="bg-primary rounded-full mx-auto mb-3 flex items-center justify-center" style={{width: '70px', height: '70px'}}>
                      <BsCart className="text-white text-2xl" />
                    </div>
                    <h4 className="card-title">電子商務</h4>
                    <p className="text-base-content/60">
                      智商系電商課程涵蓋平台經營、網路行銷、消費者行為分析等核心技能，
                      培養學生成為電商產業的專業人才。
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 lg:w-1/4 p-2">
                <div className="card border-0 shadow-sm h-full text-center">
                  <div className="card-body p-4">
                    <div className="bg-success rounded-full mx-auto mb-3 flex items-center justify-center" style={{width: '70px', height: '70px'}}>
                      <BsGraphUpArrow className="text-white text-2xl" />
                    </div>
                    <h4 className="card-title">數據分析</h4>
                    <p className="text-base-content/60">
                      運用大數據技術進行商業智慧分析，讓智商系學生具備數據驅動決策的專業能力，
                      成為企業數位轉型的關鍵人才。
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 lg:w-1/4 p-2">
                <div className="card border-0 shadow-sm h-full text-center">
                  <div className="card-body p-4">
                    <div className="bg-warning rounded-full mx-auto mb-3 flex items-center justify-center" style={{width: '70px', height: '70px'}}>
                      <BsMegaphone className="text-white text-2xl" />
                    </div>
                    <h4 className="card-title">數位行銷</h4>
                    <p className="text-base-content/60">
                      掌握社群媒體經營、內容行銷、搜尋引擎優化等數位行銷策略，
                      讓智商系畢業生在行銷領域具備競爭優勢。
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 lg:w-1/4 p-2">
                <div className="card border-0 shadow-sm h-full text-center">
                  <div className="card-body p-4">
                    <div className="bg-info rounded-full mx-auto mb-3 flex items-center justify-center" style={{width: '70px', height: '70px'}}>
                      <BsLightbulb className="text-white text-2xl" />
                    </div>
                    <h4 className="card-title">創新創業</h4>
                    <p className="text-base-content/60">
                      培養創業思維與創新能力，提供智商系學生創業育成資源，
                      協助實現創業夢想與事業發展。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 智商系系友成功案例 Section */}
        <section className="py-5">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-5">智商系系友風采</h2>
            <div className="flex flex-wrap -m-2">
              <div className="w-full lg:w-1/3 p-2">
                <div className="card border-0 shadow">
                  <div className="card-body p-4">
                    <div className="flex items-center mb-3">
                      <div className="bg-primary rounded-full mr-3" style={{width: '50px', height: '50px'}}></div>
                      <div>
                        <h5 className="mb-0">電商創業家</h5>
                        <small className="text-base-content/60">智商系第一屆畢業生</small>
                      </div>
                    </div>
                    <p className="text-base-content/60">
                      "智商系的實務訓練讓我在創業路上更有信心。從課程中學到的電商營運知識，
                      成為我創立公司的重要基礎。"
                    </p>
                    <div className="text-warning flex gap-0.5">
                      <BsStarFill />
                      <BsStarFill />
                      <BsStarFill />
                      <BsStarFill />
                      <BsStarFill />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/3 p-2">
                <div className="card border-0 shadow">
                  <div className="card-body p-4">
                    <div className="flex items-center mb-3">
                      <div className="bg-success rounded-full mr-3" style={{width: '50px', height: '50px'}}></div>
                      <div>
                        <h5 className="mb-0">數據分析師</h5>
                        <small className="text-base-content/60">知名科技公司</small>
                      </div>
                    </div>
                    <p className="text-base-content/60">
                      "智商系的數據分析課程非常實用，讓我能夠快速適應職場需求。
                      現在我負責公司的商業智慧分析工作，發展順利。"
                    </p>
                    <div className="text-warning flex gap-0.5">
                      <BsStarFill />
                      <BsStarFill />
                      <BsStarFill />
                      <BsStarFill />
                      <BsStarFill />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/3 p-2">
                <div className="card border-0 shadow">
                  <div className="card-body p-4">
                    <div className="flex items-center mb-3">
                      <div className="bg-warning rounded-full mr-3" style={{width: '50px', height: '50px'}}></div>
                      <div>
                        <h5 className="mb-0">行銷總監</h5>
                        <small className="text-base-content/60">國際企業</small>
                      </div>
                    </div>
                    <p className="text-base-content/60">
                      "智商系的數位行銷課程讓我具備國際競爭力。系友會的人脈網絡也對我的職涯發展有很大幫助。"
                    </p>
                    <div className="text-warning flex gap-0.5">
                      <BsStarFill />
                      <BsStarFill />
                      <BsStarFill />
                      <BsStarFill />
                      <BsStarFill />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 智商系學習資源 Section */}
        <section className="py-5 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center -mx-2">
              <div className="w-full lg:w-1/2 px-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">智商系學習資源</h2>
                <p className="text-lg mb-4">
                  高科大智商系提供豐富的學習資源與設施，讓學生在優質的環境中學習成長。
                </p>
                <div className="flex flex-wrap -m-2">
                  <div className="w-full md:w-1/2 p-2">
                    <div className="flex items-center">
                      <BsLaptop className="mr-3 text-xl" />
                      <div>
                        <h5 className="mb-0">智慧商務實驗室</h5>
                        <small>最新設備與軟體</small>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 p-2">
                    <div className="flex items-center">
                      <BsBuilding className="mr-3 text-xl" />
                      <div>
                        <h5 className="mb-0">產學合作中心</h5>
                        <small>企業實習機會</small>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 p-2">
                    <div className="flex items-center">
                      <BsBook className="mr-3 text-xl" />
                      <div>
                        <h5 className="mb-0">專業圖書館</h5>
                        <small>豐富的學術資源</small>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 p-2">
                    <div className="flex items-center">
                      <BsPeople className="mr-3 text-xl" />
                      <div>
                        <h5 className="mb-0">師生交流空間</h5>
                        <small>促進學習互動</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 px-2">
                <div className="bg-white rounded-lg p-4 text-base-content">
                  <h3 className="text-primary mb-3">加入智商系友會的優勢</h3>
                  <ul className="list-none">
                    <li className="mb-2">
                      <BsCheck2Circle className="inline text-success mr-2" />
                      豐富的職涯發展機會與資源
                    </li>
                    <li className="mb-2">
                      <BsCheck2Circle className="inline text-success mr-2" />
                      智商系系友遍布各行各業的人脈網絡
                    </li>
                    <li className="mb-2">
                      <BsCheck2Circle className="inline text-success mr-2" />
                      定期舉辦產業趨勢分享會
                    </li>
                    <li className="mb-2">
                      <BsCheck2Circle className="inline text-success mr-2" />
                      創業諮詢與資源媒合服務
                    </li>
                    <li className="mb-2">
                      <BsCheck2Circle className="inline text-success mr-2" />
                      終身學習與進修課程資訊
                    </li>
                  </ul>
                  <Link to="/IC/joinUs" className="btn btn-primary">
                    立即加入智商系友會
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 智商系常見問題 Section */}
        <section className="py-5">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-5">智商系常見問題</h2>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full lg:w-2/3 px-2 mx-auto">
                <div className="flex flex-col gap-2" id="icDeptFaq">
                  <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="icDeptFaq" defaultChecked />
                    <h3 className="collapse-title text-base font-medium m-0">
                      智商系（智慧商務系）的主要學習內容是什麼？
                    </h3>
                    <div className="collapse-content">
                      <p>
                        智商系課程涵蓋電子商務、數位行銷、商業智慧分析、創新創業等領域。
                        學生將學習到電商平台經營、數據分析工具運用、社群媒體行銷策略等實務技能，
                        培養在數位經濟時代所需的核心競爭力。
                      </p>
                    </div>
                  </div>

                  <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="icDeptFaq" />
                    <h3 className="collapse-title text-base font-medium m-0">
                      智商系畢業生的就業前景如何？
                    </h3>
                    <div className="collapse-content">
                      <p>
                        智商系畢業生就業率高達95%以上，主要從事電商經理、數位行銷專員、商業分析師、
                        產品經理等職務。隨著企業數位轉型需求增加，智商系人才在市場上供不應求，
                        薪資待遇與發展前景都相當優異。
                      </p>
                    </div>
                  </div>

                  <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="icDeptFaq" />
                    <h3 className="collapse-title text-base font-medium m-0">
                      高科大智商系與其他學校的商管科系有何不同？
                    </h3>
                    <div className="collapse-content">
                      <p>
                        高科大智商系更專注於智慧商務與科技的結合，課程設計緊跟產業趨勢，
                        強調實務操作與產學合作。相較於傳統商管科系，智商系學生更具備數位科技素養
                        與創新思維，在數位經濟時代具有明顯的競爭優勢。
                      </p>
                    </div>
                  </div>

                  <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="icDeptFaq" />
                    <h3 className="collapse-title text-base font-medium m-0">
                      如何參與智商系的活動和系友會？
                    </h3>
                    <div className="collapse-content">
                      <p>
                        歡迎智商系在校生、畢業系友及對智慧商務有興趣的朋友加入我們。
                        您可以透過線上申請表單加入系友會，或關注我們的社群媒體獲得最新活動資訊。
                        我們定期舉辦產業講座、職涯分享會、創業交流等活動。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 聯繫我們 Section */}
        <section className="py-5 bg-base-200">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">開啟您的智商系之路</h2>
            <p className="text-lg mb-5">
              無論您是準備加入智商系的高中生、在學中的智商系學生，
              或是已經畢業的智商系系友，我們都歡迎您與我們聯繫！
            </p>
            <div className="flex flex-wrap -m-2 justify-center">
              <div className="w-full md:w-1/4 p-2">
                <Link to="/IC/contactUs" className="btn btn-primary btn-lg w-full">
                  <BsEnvelope className="mr-2" />
                  聯繫我們
                </Link>
              </div>
              <div className="w-full md:w-1/4 p-2">
                <Link to="/alumnilist" className="btn btn-outline btn-primary btn-lg w-full">
                  <BsPeople className="mr-2" />
                  系友名單
                </Link>
              </div>
              <div className="w-full md:w-1/4 p-2">
                <Link to="/recruit" className="btn btn-success btn-lg w-full">
                  <BsBriefcase className="mr-2" />
                  職涯機會
                </Link>
              </div>
              <div className="w-full md:w-1/4 p-2">
                <Link to="/IC/intro" className="btn btn-info btn-lg w-full">
                  <BsInfoCircle className="mr-2" />
                  更多資訊
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ICDepartmentLanding;
