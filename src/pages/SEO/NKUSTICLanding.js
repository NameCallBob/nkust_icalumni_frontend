import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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

      <div className="container-fluid">
        {/* Hero Section with NKUST Branding */}
        <section className="hero-section position-relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #00b4db 100%)',
          minHeight: '70vh'
        }}>
          <div className="container">
            <div className="row align-items-center min-vh-70">
              <div className="col-lg-8 text-white">
                <div className="mb-3">
                  <span className="badge bg-light text-primary fs-6 px-3 py-2">
                    National Kaohsiung University of Science and Technology
                  </span>
                </div>
                <h1 className="display-3 fw-bold mb-4">
                  NKUST智慧商務系
                  <br />
                  <span className="text-warning">引領數位商務革命</span>
                </h1>
                <p className="lead mb-4 opacity-90">
                  國立高雄科技大學智慧商務系（NKUST智慧商務系）是台灣南部培育智慧商務人才的領航者。
                  我們結合扎實的商業理論與前瞻的科技應用，培養具備國際競爭力的數位商務專業人才，
                  為學生在全球化的數位經濟中創造無限可能。
                </p>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <Link to="/IC/joinUs" className="btn btn-warning btn-lg px-4 fw-bold">
                    <i className="bi bi-star-fill me-2"></i>
                    加入NKUST智慧商務系友會
                  </Link>
                  <Link to="/IC/intro" className="btn btn-outline-light btn-lg px-4">
                    <i className="bi bi-arrow-right-circle me-2"></i>
                    探索NKUST智慧商務系
                  </Link>
                </div>
                <div className="row g-3 mt-3">
                  <div className="col-auto">
                    <div className="d-flex align-items-center text-white opacity-90">
                      <i className="bi bi-award me-2"></i>
                      <small>教育部認證優質科系</small>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="d-flex align-items-center text-white opacity-90">
                      <i className="bi bi-globe me-2"></i>
                      <small>國際產學合作</small>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="d-flex align-items-center text-white opacity-90">
                      <i className="bi bi-people me-2"></i>
                      <small>500+ 活躍系友</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Floating Elements */}
          <div className="position-absolute top-0 end-0 opacity-25">
            <div className="bg-white rounded-circle" style={{width: '200px', height: '200px', transform: 'translate(50%, -50%)'}}></div>
          </div>
          <div className="position-absolute bottom-0 start-0 opacity-15">
            <div className="bg-warning rounded-circle" style={{width: '150px', height: '150px', transform: 'translate(-50%, 50%)'}}></div>
          </div>
        </section>

        {/* NKUST智慧商務系介紹 Section */}
        <section className="py-5">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <div className="pe-lg-4">
                  <h2 className="display-5 fw-bold mb-4">
                    關於NKUST智慧商務系
                  </h2>
                  <p className="lead text-muted mb-4">
                    國立高雄科技大學智慧商務系（NKUST智慧商務系）成立於數位轉型的關鍵時刻，
                    致力於培育具備創新思維與實務能力的智慧商務專業人才。
                  </p>
                  <p className="mb-4">
                    NKUST智慧商務系結合了國立高雄科技大學的深厚學術基礎與產業資源，
                    提供學生最完整的智慧商務教育體驗。我們的課程涵蓋電子商務、數位行銷、
                    商業智慧分析、創新創業等領域，讓學生具備迎接數位經濟挑戰的核心能力。
                  </p>
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="bg-primary text-white rounded-3 p-3 text-center">
                        <h3 className="mb-1">15+</h3>
                        <small>年辦學經驗</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-success text-white rounded-3 p-3 text-center">
                        <h3 className="mb-1">98%</h3>
                        <small>NKUST智慧商務系就業率</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-warning text-white rounded-3 p-3 text-center">
                        <h3 className="mb-1">100+</h3>
                        <small>合作企業夥伴</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-info text-white rounded-3 p-3 text-center">
                        <h3 className="mb-1">30+</h3>
                        <small>專業教師團隊</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="position-relative">
                  <div className="card border-0 shadow-lg">
                    <div className="card-body p-5">
                      <h3 className="text-primary mb-4">NKUST智慧商務系優勢</h3>
                      <div className="mb-4">
                        <div className="d-flex align-items-start mb-3">
                          <div className="bg-primary rounded-circle me-3 flex-shrink-0" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="bi bi-mortarboard text-white"></i>
                          </div>
                          <div>
                            <h5 className="mb-1">頂尖教育品質</h5>
                            <p className="text-muted mb-0">NKUST提供世界級的教育資源與學術環境</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-start mb-3">
                          <div className="bg-success rounded-circle me-3 flex-shrink-0" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="bi bi-building text-white"></i>
                          </div>
                          <div>
                            <h5 className="mb-1">強大產學連結</h5>
                            <p className="text-muted mb-0">與國內外知名企業建立緊密合作關係</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-start mb-3">
                          <div className="bg-warning rounded-circle me-3 flex-shrink-0" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="bi bi-globe text-white"></i>
                          </div>
                          <div>
                            <h5 className="mb-1">國際化視野</h5>
                            <p className="text-muted mb-0">培養具備全球競爭力的國際化人才</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-start">
                          <div className="bg-info rounded-circle me-3 flex-shrink-0" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="bi bi-lightbulb text-white"></i>
                          </div>
                          <div>
                            <h5 className="mb-1">創新創業育成</h5>
                            <p className="text-muted mb-0">提供完整的創業輔導與資源支持</p>
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
        <section className="py-5 bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">NKUST智慧商務系專業課程</h2>
              <p className="lead text-muted">
                完整的課程體系，培養學生具備智慧商務領域的專業競爭力
              </p>
            </div>

            <div className="row g-4">
              <div className="col-lg-6">
                <div className="card border-0 shadow h-100">
                  <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">
                      <i className="bi bi-laptop me-2"></i>
                      核心基礎課程
                    </h4>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item border-0">
                        <strong>智慧商務概論</strong>
                        <p className="text-muted mb-0 small">建立NKUST智慧商務系學生的專業基礎</p>
                      </li>
                      <li className="list-group-item border-0">
                        <strong>電子商務系統設計</strong>
                        <p className="text-muted mb-0 small">掌握電商平台架構與開發技能</p>
                      </li>
                      <li className="list-group-item border-0">
                        <strong>商業數據分析</strong>
                        <p className="text-muted mb-0 small">運用數據科學技術進行商業決策</p>
                      </li>
                      <li className="list-group-item border-0">
                        <strong>數位行銷策略</strong>
                        <p className="text-muted mb-0 small">學習現代數位行銷的核心技能</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card border-0 shadow h-100">
                  <div className="card-header bg-success text-white">
                    <h4 className="mb-0">
                      <i className="bi bi-rocket me-2"></i>
                      進階專業課程
                    </h4>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item border-0">
                        <strong>人工智慧商業應用</strong>
                        <p className="text-muted mb-0 small">AI技術在商務領域的實際應用</p>
                      </li>
                      <li className="list-group-item border-0">
                        <strong>區塊鏈與金融科技</strong>
                        <p className="text-muted mb-0 small">探索新興金融科技的商業模式</p>
                      </li>
                      <li className="list-group-item border-0">
                        <strong>跨境電商實務</strong>
                        <p className="text-muted mb-0 small">國際市場拓展與營運策略</p>
                      </li>
                      <li className="list-group-item border-0">
                        <strong>創業與創新管理</strong>
                        <p className="text-muted mb-0 small">培養NKUST智慧商務系學生創業精神</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card border-0 shadow h-100">
                  <div className="card-header bg-warning text-white">
                    <h4 className="mb-0">
                      <i className="bi bi-briefcase me-2"></i>
                      實務實習課程
                    </h4>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item border-0">
                        <strong>企業實習專案</strong>
                        <p className="text-muted mb-0 small">與合作企業進行實際案例操作</p>
                      </li>
                      <li className="list-group-item border-0">
                        <strong>電商平台實作</strong>
                        <p className="text-muted mb-0 small">親手建置完整的電商營運系統</p>
                      </li>
                      <li className="list-group-item border-0">
                        <strong>數位行銷企劃</strong>
                        <p className="text-muted mb-0 small">實際執行數位行銷專案</p>
                      </li>
                      <li className="list-group-item border-0">
                        <strong>畢業專題製作</strong>
                        <p className="text-muted mb-0 small">整合四年所學的最終成果展現</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card border-0 shadow h-100">
                  <div className="card-header bg-info text-white">
                    <h4 className="mb-0">
                      <i className="bi bi-globe me-2"></i>
                      國際交流課程
                    </h4>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item border-0">
                        <strong>國際商務英語</strong>
                        <p className="text-muted mb-0 small">提升NKUST智慧商務系學生國際溝通能力</p>
                      </li>
                      <li className="list-group-item border-0">
                        <strong>海外實習計畫</strong>
                        <p className="text-muted mb-0 small">赴海外企業進行專業實習</p>
                      </li>
                      <li className="list-group-item border-0">
                        <strong>國際學術交流</strong>
                        <p className="text-muted mb-0 small">與國外大學進行學術合作</p>
                      </li>
                      <li className="list-group-item border-0">
                        <strong>全球市場分析</strong>
                        <p className="text-muted mb-0 small">深入了解國際商務環境與趨勢</p>
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
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">NKUST智慧商務系就業成果</h2>
              <p className="lead text-muted">
                優秀的就業表現，證明NKUST智慧商務系教育品質的卓越
              </p>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-lg-3 col-md-6">
                <div className="text-center">
                  <div className="bg-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '100px', height: '100px'}}>
                    <h2 className="text-white mb-0">98%</h2>
                  </div>
                  <h4>整體就業率</h4>
                  <p className="text-muted">NKUST智慧商務系畢業生六個月內就業率</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="text-center">
                  <div className="bg-success rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '100px', height: '100px'}}>
                    <h2 className="text-white mb-0">45K</h2>
                  </div>
                  <h4>平均起薪</h4>
                  <p className="text-muted">NKUST智慧商務系新鮮人平均月薪</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="text-center">
                  <div className="bg-warning rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '100px', height: '100px'}}>
                    <h2 className="text-white mb-0">150+</h2>
                  </div>
                  <h4>合作企業</h4>
                  <p className="text-muted">提供NKUST智慧商務系實習與就業機會</p>
                  </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="text-center">
                  <div className="bg-info rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '100px', height: '100px'}}>
                    <h2 className="text-white mb-0">25%</h2>
                  </div>
                  <h4>創業比例</h4>
                  <p className="text-muted">NKUST智慧商務系系友自主創業比例</p>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-primary rounded-circle mx-auto mb-3" style={{width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <i className="bi bi-buildings text-white fs-3"></i>
                    </div>
                    <h4>科技業領域</h4>
                    <p className="text-muted">
                      NKUST智慧商務系畢業生在科技公司擔任產品經理、數據分析師、
                      電商營運專員等關鍵職位，發展前景優異。
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-success rounded-circle mx-auto mb-3" style={{width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <i className="bi bi-shop text-white fs-3"></i>
                    </div>
                    <h4>電商零售業</h4>
                    <p className="text-muted">
                      在電商平台、零售企業從事營運管理、數位行銷、
                      供應鏈管理等工作，是NKUST智慧商務系的熱門就業領域。
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-warning rounded-circle mx-auto mb-3" style={{width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <i className="bi bi-lightbulb text-white fs-3"></i>
                    </div>
                    <h4>創業創新</h4>
                    <p className="text-muted">
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
        <section className="py-5 bg-dark text-white">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h2 className="display-5 fw-bold mb-4">NKUST智慧商務系友會</h2>
                <p className="lead mb-4">
                  國立高雄科技大學智慧商務系系友會是連結所有NKUST智慧商務系學生與系友的重要平台。
                  我們致力於促進系友間的交流合作，提供職涯發展資源，並支持母系的持續發展。
                </p>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-people-fill me-3 fs-4 text-warning"></i>
                      <div>
                        <h5>強大系友網絡</h5>
                        <p className="text-light opacity-75 mb-0">
                          NKUST智慧商務系友遍布各行各業，提供豐富的人脈資源
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-briefcase-fill me-3 fs-4 text-warning"></i>
                      <div>
                        <h5>職涯發展支援</h5>
                        <p className="text-light opacity-75 mb-0">
                          提供就業機會、職涯諮詢與專業成長資源
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-lightbulb-fill me-3 fs-4 text-warning"></i>
                      <div>
                        <h5>創業資源媒合</h5>
                        <p className="text-light opacity-75 mb-0">
                          協助NKUST智慧商務系友創業，提供資金與技術支援
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-calendar-event-fill me-3 fs-4 text-warning"></i>
                      <div>
                        <h5>定期交流活動</h5>
                        <p className="text-light opacity-75 mb-0">
                          舉辦產業講座、聚會活動促進系友交流
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 text-center">
                <div className="bg-warning rounded-3 p-4 text-dark">
                  <h3 className="mb-3">立即加入我們</h3>
                  <p className="mb-4">
                    成為NKUST智慧商務系友會的一員，與優秀系友共同成長！
                  </p>
                  <Link to="/IC/joinUs" className="btn btn-dark btn-lg w-100 mb-3">
                    加入系友會
                  </Link>
                  <Link to="/IC/contactUs" className="btn btn-outline-dark w-100">
                    聯繫我們
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 聯繫與更多資訊 Section */}
        <section className="py-5 bg-light">
          <div className="container text-center">
            <h2 className="display-5 fw-bold mb-4">探索更多NKUST智慧商務系資源</h2>
            <p className="lead mb-5">
              了解更多關於國立高雄科技大學智慧商務系的詳細資訊，
              或與我們聯繫獲得專業諮詢
            </p>
            <div className="row g-3 justify-content-center">
              <div className="col-lg-2 col-md-4">
                <Link to="/IC/intro" className="btn btn-primary btn-lg w-100">
                  <i className="bi bi-info-circle me-2"></i>
                  系所介紹
                </Link>
              </div>
              <div className="col-lg-2 col-md-4">
                <Link to="/alumnilist" className="btn btn-success btn-lg w-100">
                  <i className="bi bi-people me-2"></i>
                  系友名單
                </Link>
              </div>
              <div className="col-lg-2 col-md-4">
                <Link to="/recruit" className="btn btn-warning btn-lg w-100">
                  <i className="bi bi-briefcase me-2"></i>
                  職涯機會
                </Link>
              </div>
              <div className="col-lg-2 col-md-4">
                <Link to="/IC/contactUs" className="btn btn-info btn-lg w-100">
                  <i className="bi bi-envelope me-2"></i>
                  聯繫我們
                </Link>
              </div>
              <div className="col-lg-2 col-md-4">
                <Link to="/IC/structure" className="btn btn-outline-primary btn-lg w-100">
                  <i className="bi bi-diagram-3 me-2"></i>
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