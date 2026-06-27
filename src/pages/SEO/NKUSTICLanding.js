import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  BsStarFill,
  BsArrowRightCircle,
  BsAward,
  BsGlobe,
  BsPeople,
  BsMortarboard,
  BsBuilding,
  BsLightbulb,
  BsLaptop,
  BsRocket,
  BsBriefcase,
  BsBuildings,
  BsShop,
  BsPeopleFill,
  BsBriefcaseFill,
  BsLightbulbFill,
  BsCalendarEventFill,
  BsInfoCircle,
  BsEnvelope,
  BsDiagram3
} from 'react-icons/bs';

const NKUSTICLanding = () => {
  return (
    <>
      <Helmet>
        <title>NKUST智慧商務系 | 國立高雄科技大學智慧商務系 - 領航數位商務未來</title>
        <meta name="description" content="NKUST智慧商務系是國立高雄科技大學的重點科系，專注培育智慧商務與電子商務人才。NKUST智慧商務系系友會提供豐富的校友資源與職涯發展機會，助力學生與系友在數位經濟時代成功發展。" />
        <meta name="keywords" content="NKUST智慧商務系, 國立高雄科技大學智慧商務系, NKUST, 高科大, 智慧商務, 電子商務, 數位行銷, 系友會" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="NKUST智慧商務系 | 國立高雄科技大學智慧商務系 - 領航數位商務未來" />
        <meta property="og:description" content="NKUST智慧商務系專注培育智慧商務人才，系友會提供完整的職涯發展支援與校友網絡" />
        <meta property="og:url" content="https://nkusticalumni.org/nkust-ic" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="NKUST智慧商務系 | 國立高雄科技大學智慧商務系" />
        <meta property="twitter:description" content="NKUST智慧商務系專注培育智慧商務人才，系友會提供完整的職涯發展支援與校友網絡" />

        {/* 結構化數據 */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "國立高雄科技大學智慧商務系",
            "alternateName": ["NKUST智慧商務系", "NKUST IC", "高科大智慧商務系"],
            "url": "https://nkusticalumni.org/nkust-ic",
            "description": "NKUST智慧商務系致力於培育智慧商務、電子商務與數位創新專業人才",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "TW",
              "addressRegion": "高雄市",
              "addressLocality": "燕巢區",
              "streetAddress": "深坑里深坑路58號"
            },
            "parentOrganization": {
              "@type": "University",
              "name": "國立高雄科技大學",
              "alternateName": "NKUST"
            },
            "sameAs": [
              "https://nkusticalumni.org"
            ]
          })}
        </script>

        <link rel="canonical" href="https://nkusticalumni.org/nkust-ic" />
      </Helmet>

      <div className="w-full px-4">
        {/* Hero Section with NKUST Branding */}
        <section className="hero-section relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #00b4db 100%)',
          minHeight: '70vh'
        }}>
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap -mx-2 items-center min-h-[70vh]">
              <div className="w-full lg:w-2/3 px-2 text-white">
                <div className="mb-3">
                  <span className="badge bg-base-100 text-primary text-base px-3 py-2">
                    National Kaohsiung University of Science and Technology
                  </span>
                </div>
                <h1 className="text-5xl font-bold mb-4">
                  NKUST智慧商務系
                  <br />
                  <span className="text-warning">引領數位商務革命</span>
                </h1>
                <p className="text-lg mb-4 opacity-90">
                  國立高雄科技大學智慧商務系（NKUST智慧商務系）是台灣南部培育智慧商務人才的領航者。
                  我們結合扎實的商業理論與前瞻的科技應用，培養具備國際競爭力的數位商務專業人才，
                  為學生在全球化的數位經濟中創造無限可能。
                </p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <Link to="/IC/joinUs" className="btn btn-warning btn-lg px-4 font-bold">
                    <BsStarFill className="mr-2 inline-block" />
                    加入NKUST智慧商務系友會
                  </Link>
                  <Link to="/IC/intro" className="btn btn-outline btn-lg px-4 border-white text-white">
                    <BsArrowRightCircle className="mr-2 inline-block" />
                    探索NKUST智慧商務系
                  </Link>
                </div>
                <div className="flex flex-wrap -mx-2 gap-y-3 mt-3">
                  <div className="w-auto px-2">
                    <div className="flex items-center text-white opacity-90">
                      <BsAward className="mr-2 inline-block" />
                      <small>教育部認證優質科系</small>
                    </div>
                  </div>
                  <div className="w-auto px-2">
                    <div className="flex items-center text-white opacity-90">
                      <BsGlobe className="mr-2 inline-block" />
                      <small>國際產學合作</small>
                    </div>
                  </div>
                  <div className="w-auto px-2">
                    <div className="flex items-center text-white opacity-90">
                      <BsPeople className="mr-2 inline-block" />
                      <small>500+ 活躍系友</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Floating Elements */}
          <div className="absolute top-0 right-0 opacity-25">
            <div className="bg-white rounded-full" style={{width: '200px', height: '200px', transform: 'translate(50%, -50%)'}}></div>
          </div>
          <div className="absolute bottom-0 left-0 opacity-[0.15]">
            <div className="bg-warning rounded-full" style={{width: '150px', height: '150px', transform: 'translate(-50%, 50%)'}}></div>
          </div>
        </section>

        {/* NKUST智慧商務系介紹 Section */}
        <section className="py-5">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap -mx-2 items-center gap-y-5">
              <div className="w-full lg:w-1/2 px-2">
                <div className="lg:pr-4">
                  <h2 className="text-4xl font-bold mb-4">
                    關於NKUST智慧商務系
                  </h2>
                  <p className="text-lg text-base-content/60 mb-4">
                    國立高雄科技大學智慧商務系（NKUST智慧商務系）成立於數位轉型的關鍵時刻，
                    致力於培育具備創新思維與實務能力的智慧商務專業人才。
                  </p>
                  <p className="mb-4">
                    NKUST智慧商務系結合了國立高雄科技大學的深厚學術基礎與產業資源，
                    提供學生最完整的智慧商務教育體驗。我們的課程涵蓋電子商務、數位行銷、
                    商業智慧分析、創新創業等領域，讓學生具備迎接數位經濟挑戰的核心能力。
                  </p>
                  <div className="flex flex-wrap -mx-2 gap-y-3">
                    <div className="w-1/2 px-2">
                      <div className="bg-primary text-primary-content rounded-lg p-3 text-center">
                        <h3 className="mb-1">15+</h3>
                        <small>年辦學經驗</small>
                      </div>
                    </div>
                    <div className="w-1/2 px-2">
                      <div className="bg-success text-success-content rounded-lg p-3 text-center">
                        <h3 className="mb-1">98%</h3>
                        <small>NKUST智慧商務系就業率</small>
                      </div>
                    </div>
                    <div className="w-1/2 px-2">
                      <div className="bg-warning text-white rounded-lg p-3 text-center">
                        <h3 className="mb-1">100+</h3>
                        <small>合作企業夥伴</small>
                      </div>
                    </div>
                    <div className="w-1/2 px-2">
                      <div className="bg-info text-info-content rounded-lg p-3 text-center">
                        <h3 className="mb-1">30+</h3>
                        <small>專業教師團隊</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 px-2">
                <div className="relative">
                  <div className="card border-0 shadow-lg">
                    <div className="card-body p-5">
                      <h3 className="text-primary mb-4">NKUST智慧商務系優勢</h3>
                      <div className="mb-4">
                        <div className="flex items-start mb-3">
                          <div className="bg-primary rounded-full mr-3 shrink-0" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <BsMortarboard className="text-white" />
                          </div>
                          <div>
                            <h5 className="mb-1">頂尖教育品質</h5>
                            <p className="text-base-content/60 mb-0">NKUST提供世界級的教育資源與學術環境</p>
                          </div>
                        </div>
                        <div className="flex items-start mb-3">
                          <div className="bg-success rounded-full mr-3 shrink-0" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <BsBuilding className="text-white" />
                          </div>
                          <div>
                            <h5 className="mb-1">強大產學連結</h5>
                            <p className="text-base-content/60 mb-0">與國內外知名企業建立緊密合作關係</p>
                          </div>
                        </div>
                        <div className="flex items-start mb-3">
                          <div className="bg-warning rounded-full mr-3 shrink-0" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <BsGlobe className="text-white" />
                          </div>
                          <div>
                            <h5 className="mb-1">國際化視野</h5>
                            <p className="text-base-content/60 mb-0">培養具備全球競爭力的國際化人才</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-info rounded-full mr-3 shrink-0" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <BsLightbulb className="text-white" />
                          </div>
                          <div>
                            <h5 className="mb-1">創新創業育成</h5>
                            <p className="text-base-content/60 mb-0">提供完整的創業輔導與資源支持</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NKUST智慧商務系專業課程 Section */}
        <section className="py-5 bg-base-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-5">
              <h2 className="text-4xl font-bold mb-3">NKUST智慧商務系專業課程</h2>
              <p className="text-lg text-base-content/60">
                完整的課程體系，培養學生具備智慧商務領域的專業競爭力
              </p>
            </div>

            <div className="flex flex-wrap -mx-2 gap-y-4">
              <div className="w-full lg:w-1/2 px-2">
                <div className="card border-0 shadow h-full">
                  <div className="bg-primary text-primary-content px-4 py-3 rounded-t-2xl">
                    <h4 className="mb-0">
                      <BsLaptop className="mr-2 inline-block" />
                      核心基礎課程
                    </h4>
                  </div>
                  <div className="card-body">
                    <ul className="flex flex-col">
                      <li className="py-2">
                        <strong>智慧商務概論</strong>
                        <p className="text-base-content/60 mb-0 text-sm">建立NKUST智慧商務系學生的專業基礎</p>
                      </li>
                      <li className="py-2">
                        <strong>電子商務系統設計</strong>
                        <p className="text-base-content/60 mb-0 text-sm">掌握電商平台架構與開發技能</p>
                      </li>
                      <li className="py-2">
                        <strong>商業數據分析</strong>
                        <p className="text-base-content/60 mb-0 text-sm">運用數據科學技術進行商業決策</p>
                      </li>
                      <li className="py-2">
                        <strong>數位行銷策略</strong>
                        <p className="text-base-content/60 mb-0 text-sm">學習現代數位行銷的核心技能</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 px-2">
                <div className="card border-0 shadow h-full">
                  <div className="bg-success text-success-content px-4 py-3 rounded-t-2xl">
                    <h4 className="mb-0">
                      <BsRocket className="mr-2 inline-block" />
                      進階專業課程
                    </h4>
                  </div>
                  <div className="card-body">
                    <ul className="flex flex-col">
                      <li className="py-2">
                        <strong>人工智慧商業應用</strong>
                        <p className="text-base-content/60 mb-0 text-sm">AI技術在商務領域的實際應用</p>
                      </li>
                      <li className="py-2">
                        <strong>區塊鏈與金融科技</strong>
                        <p className="text-base-content/60 mb-0 text-sm">探索新興金融科技的商業模式</p>
                      </li>
                      <li className="py-2">
                        <strong>跨境電商實務</strong>
                        <p className="text-base-content/60 mb-0 text-sm">國際市場拓展與營運策略</p>
                      </li>
                      <li className="py-2">
                        <strong>創業與創新管理</strong>
                        <p className="text-base-content/60 mb-0 text-sm">培養NKUST智慧商務系學生創業精神</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 px-2">
                <div className="card border-0 shadow h-full">
                  <div className="bg-warning text-white px-4 py-3 rounded-t-2xl">
                    <h4 className="mb-0">
                      <BsBriefcase className="mr-2 inline-block" />
                      實務實習課程
                    </h4>
                  </div>
                  <div className="card-body">
                    <ul className="flex flex-col">
                      <li className="py-2">
                        <strong>企業實習專案</strong>
                        <p className="text-base-content/60 mb-0 text-sm">與合作企業進行實際案例操作</p>
                      </li>
                      <li className="py-2">
                        <strong>電商平台實作</strong>
                        <p className="text-base-content/60 mb-0 text-sm">親手建置完整的電商營運系統</p>
                      </li>
                      <li className="py-2">
                        <strong>數位行銷企劃</strong>
                        <p className="text-base-content/60 mb-0 text-sm">實際執行數位行銷專案</p>
                      </li>
                      <li className="py-2">
                        <strong>畢業專題製作</strong>
                        <p className="text-base-content/60 mb-0 text-sm">整合四年所學的最終成果展現</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 px-2">
                <div className="card border-0 shadow h-full">
                  <div className="bg-info text-info-content px-4 py-3 rounded-t-2xl">
                    <h4 className="mb-0">
                      <BsGlobe className="mr-2 inline-block" />
                      國際交流課程
                    </h4>
                  </div>
                  <div className="card-body">
                    <ul className="flex flex-col">
                      <li className="py-2">
                        <strong>國際商務英語</strong>
                        <p className="text-base-content/60 mb-0 text-sm">提升NKUST智慧商務系學生國際溝通能力</p>
                      </li>
                      <li className="py-2">
                        <strong>海外實習計畫</strong>
                        <p className="text-base-content/60 mb-0 text-sm">赴海外企業進行專業實習</p>
                      </li>
                      <li className="py-2">
                        <strong>國際學術交流</strong>
                        <p className="text-base-content/60 mb-0 text-sm">與國外大學進行學術合作</p>
                      </li>
                      <li className="py-2">
                        <strong>全球市場分析</strong>
                        <p className="text-base-content/60 mb-0 text-sm">深入了解國際商務環境與趨勢</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NKUST智慧商務系就業成果 Section */}
        <section className="py-5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-5">
              <h2 className="text-4xl font-bold mb-3">NKUST智慧商務系就業成果</h2>
              <p className="text-lg text-base-content/60">
                優秀的就業表現，證明NKUST智慧商務系教育品質的卓越
              </p>
            </div>

            <div className="flex flex-wrap -mx-2 gap-y-4 mb-5">
              <div className="w-full md:w-1/2 lg:w-1/4 px-2">
                <div className="text-center">
                  <div className="bg-primary rounded-full mx-auto mb-3 flex items-center justify-center" style={{width: '100px', height: '100px'}}>
                    <h2 className="text-white mb-0">98%</h2>
                  </div>
                  <h4>整體就業率</h4>
                  <p className="text-base-content/60">NKUST智慧商務系畢業生六個月內就業率</p>
                </div>
              </div>
              <div className="w-full md:w-1/2 lg:w-1/4 px-2">
                <div className="text-center">
                  <div className="bg-success rounded-full mx-auto mb-3 flex items-center justify-center" style={{width: '100px', height: '100px'}}>
                    <h2 className="text-white mb-0">45K</h2>
                  </div>
                  <h4>平均起薪</h4>
                  <p className="text-base-content/60">NKUST智慧商務系新鮮人平均月薪</p>
                </div>
              </div>
              <div className="w-full md:w-1/2 lg:w-1/4 px-2">
                <div className="text-center">
                  <div className="bg-warning rounded-full mx-auto mb-3 flex items-center justify-center" style={{width: '100px', height: '100px'}}>
                    <h2 className="text-white mb-0">150+</h2>
                  </div>
                  <h4>合作企業</h4>
                  <p className="text-base-content/60">提供NKUST智慧商務系實習與就業機會</p>
                  </div>
              </div>
              <div className="w-full md:w-1/2 lg:w-1/4 px-2">
                <div className="text-center">
                  <div className="bg-info rounded-full mx-auto mb-3 flex items-center justify-center" style={{width: '100px', height: '100px'}}>
                    <h2 className="text-white mb-0">25%</h2>
                  </div>
                  <h4>創業比例</h4>
                  <p className="text-base-content/60">NKUST智慧商務系系友自主創業比例</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap -mx-2 gap-y-4">
              <div className="w-full lg:w-1/3 px-2">
                <div className="card border-0 shadow-sm h-full">
                  <div className="card-body text-center p-4">
                    <div className="bg-primary rounded-full mx-auto mb-3" style={{width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <BsBuildings className="text-white text-2xl" />
                    </div>
                    <h4>科技業領域</h4>
                    <p className="text-base-content/60">
                      NKUST智慧商務系畢業生在科技公司擔任產品經理、數據分析師、
                      電商營運專員等關鍵職位，發展前景優異。
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/3 px-2">
                <div className="card border-0 shadow-sm h-full">
                  <div className="card-body text-center p-4">
                    <div className="bg-success rounded-full mx-auto mb-3" style={{width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <BsShop className="text-white text-2xl" />
                    </div>
                    <h4>電商零售業</h4>
                    <p className="text-base-content/60">
                      在電商平台、零售企業從事營運管理、數位行銷、
                      供應鏈管理等工作，是NKUST智慧商務系的熱門就業領域。
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/3 px-2">
                <div className="card border-0 shadow-sm h-full">
                  <div className="card-body text-center p-4">
                    <div className="bg-warning rounded-full mx-auto mb-3" style={{width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <BsLightbulb className="text-white text-2xl" />
                    </div>
                    <h4>創業創新</h4>
                    <p className="text-base-content/60">
                      許多NKUST智慧商務系系友成功創立自己的事業，
                      在電商、科技服務、數位行銷等領域展現創業精神。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NKUST智慧商務系友會 Section */}
        <section className="py-5 bg-neutral text-neutral-content">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap -mx-2 items-center">
              <div className="w-full lg:w-2/3 px-2">
                <h2 className="text-4xl font-bold mb-4">NKUST智慧商務系友會</h2>
                <p className="text-lg mb-4">
                  國立高雄科技大學智慧商務系系友會是連結所有NKUST智慧商務系學生與系友的重要平台。
                  我們致力於促進系友間的交流合作，提供職涯發展資源，並支持母系的持續發展。
                </p>
                <div className="flex flex-wrap -mx-2 gap-y-4">
                  <div className="w-full md:w-1/2 px-2">
                    <div className="flex items-start">
                      <BsPeopleFill className="mr-3 text-xl text-warning shrink-0" />
                      <div>
                        <h5>強大系友網絡</h5>
                        <p className="opacity-75 mb-0">
                          NKUST智慧商務系友遍布各行各業，提供豐富的人脈資源
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 px-2">
                    <div className="flex items-start">
                      <BsBriefcaseFill className="mr-3 text-xl text-warning shrink-0" />
                      <div>
                        <h5>職涯發展支援</h5>
                        <p className="opacity-75 mb-0">
                          提供就業機會、職涯諮詢與專業成長資源
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 px-2">
                    <div className="flex items-start">
                      <BsLightbulbFill className="mr-3 text-xl text-warning shrink-0" />
                      <div>
                        <h5>創業資源媒合</h5>
                        <p className="opacity-75 mb-0">
                          協助NKUST智慧商務系友創業，提供資金與技術支援
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 px-2">
                    <div className="flex items-start">
                      <BsCalendarEventFill className="mr-3 text-xl text-warning shrink-0" />
                      <div>
                        <h5>定期交流活動</h5>
                        <p className="opacity-75 mb-0">
                          舉辦產業講座、聚會活動促進系友交流
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/3 px-2 text-center">
                <div className="bg-warning rounded-lg p-4 text-warning-content">
                  <h3 className="mb-3">立即加入我們</h3>
                  <p className="mb-4">
                    成為NKUST智慧商務系友會的一員，與優秀系友共同成長！
                  </p>
                  <Link to="/IC/joinUs" className="btn btn-neutral btn-lg w-full mb-3">
                    加入系友會
                  </Link>
                  <Link to="/IC/contactUs" className="btn btn-outline w-full">
                    聯繫我們
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 聯繫與更多資訊 Section */}
        <section className="py-5 bg-base-200">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">探索更多NKUST智慧商務系資源</h2>
            <p className="text-lg mb-5">
              了解更多關於國立高雄科技大學智慧商務系的詳細資訊，
              或與我們聯繫獲得專業諮詢
            </p>
            <div className="flex flex-wrap -mx-2 gap-y-3 justify-center">
              <div className="w-full md:w-1/3 lg:w-1/6 px-2">
                <Link to="/IC/intro" className="btn btn-primary btn-lg w-full">
                  <BsInfoCircle className="mr-2 inline-block" />
                  系所介紹
                </Link>
              </div>
              <div className="w-full md:w-1/3 lg:w-1/6 px-2">
                <Link to="/alumnilist" className="btn btn-success btn-lg w-full">
                  <BsPeople className="mr-2 inline-block" />
                  系友名單
                </Link>
              </div>
              <div className="w-full md:w-1/3 lg:w-1/6 px-2">
                <Link to="/recruit" className="btn btn-warning btn-lg w-full">
                  <BsBriefcase className="mr-2 inline-block" />
                  職涯機會
                </Link>
              </div>
              <div className="w-full md:w-1/3 lg:w-1/6 px-2">
                <Link to="/IC/contactUs" className="btn btn-info btn-lg w-full">
                  <BsEnvelope className="mr-2 inline-block" />
                  聯繫我們
                </Link>
              </div>
              <div className="w-full md:w-1/3 lg:w-1/6 px-2">
                <Link to="/IC/structure" className="btn btn-outline btn-primary btn-lg w-full">
                  <BsDiagram3 className="mr-2 inline-block" />
                  組織架構
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default NKUSTICLanding;
