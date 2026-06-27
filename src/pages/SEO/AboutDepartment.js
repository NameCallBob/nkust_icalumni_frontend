import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AboutDepartment = () => {
  return (
    <>
      <Helmet>
        <title>系所介紹 | 國立高雄科技大學智慧商務系 - 完整認識智商系教育特色</title>
        <meta name="description" content="深入了解國立高雄科技大學智慧商務系的教育理念、課程特色、師資陣容與學習環境。智慧商務系致力培育具備創新思維與實務能力的數位商務人才，歡迎了解智商系的完整介紹。" />
        <meta name="keywords" content="智慧商務系介紹, 智商系介紹, 國立高雄科技大學, NKUST, 系所特色, 課程介紹, 師資介紹, 教育目標" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="系所介紹 | 國立高雄科技大學智慧商務系" />
        <meta property="og:description" content="深入了解智慧商務系的教育理念、課程特色與學習環境" />
        <meta property="og:url" content="https://nkusticalumni.org/about-department" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="系所介紹 | 國立高雄科技大學智慧商務系" />
        <meta property="twitter:description" content="深入了解智慧商務系的教育理念、課程特色與學習環境" />

        {/* 結構化數據 */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "國立高雄科技大學智慧商務系",
            "description": "專注培育智慧商務、電子商務與數位創新專業人才的優質科系",
            "url": "https://nkusticalumni.org/about-department",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "TW",
              "addressRegion": "高雄市",
              "addressLocality": "燕巢區"
            },
            "parentOrganization": {
              "@type": "University",
              "name": "國立高雄科技大學"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "智慧商務系課程",
              "itemListElement": [
                {
                  "@type": "Course",
                  "name": "電子商務"
                },
                {
                  "@type": "Course",
                  "name": "數位行銷"
                },
                {
                  "@type": "Course",
                  "name": "商業智慧分析"
                }
              ]
            }
          })}
        </script>

        <link rel="canonical" href="https://nkusticalumni.org/about-department" />
      </Helmet>

      <div className="container-fluid">
        {/* Hero Section */}
        <section className="hero-section bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '60vh'
        }}>
          <div className="container">
            <div className="row align-items-center h-100">
              <div className="col-lg-8 mx-auto text-center">
                <h1 className="display-3 fw-bold mb-4">
                  國立高雄科技大學
                  <br />
                  <span className="text-warning">智慧商務系介紹</span>
                </h1>
                <p className="lead mb-4 opacity-90">
                  深入了解智慧商務系的教育理念、課程特色、師資陣容與發展願景。
                  我們致力於培育具備創新思維與實務能力的數位商務專業人才，
                  為學生在數位經濟時代創造競爭優勢。
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/IC/joinUs" className="btn btn-warning btn-lg px-4">
                    加入我們
                  </Link>
                  <Link to="/IC/contactUs" className="btn btn-outline-light btn-lg px-4">
                    聯繫諮詢
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 系所簡介 Section */}
        <section className="py-5">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <h2 className="display-5 fw-bold mb-4">系所發展沿革</h2>
                <p className="lead text-muted mb-4">
                  國立高雄科技大學智慧商務系成立於數位轉型的關鍵時刻，
                  順應產業發展趨勢與人才需求而設立。
                </p>
                <p className="mb-4">
                  智慧商務系的設立旨在培育具備智慧商務專業知識與實務技能的人才，
                  結合商業管理理論與資訊科技應用，讓學生具備迎接數位經濟挑戰的能力。
                  自成立以來，智慧商務系始終秉持「理論與實務並重、創新與傳承兼顧」的教育理念，
                  持續精進課程內容與教學方法。
                </p>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="bg-primary text-white rounded-3 p-3 text-center">
                      <h3 className="mb-1">2008</h3>
                      <small>智慧商務系成立年份</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-success text-white rounded-3 p-3 text-center">
                      <h3 className="mb-1">1000+</h3>
                      <small>累計培育學生數</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-warning text-white rounded-3 p-3 text-center">
                      <h3 className="mb-1">30+</h3>
                      <small>專業師資人數</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-info text-white rounded-3 p-3 text-center">
                      <h3 className="mb-1">150+</h3>
                      <small>產學合作企業</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card border-0 shadow-lg">
                  <div className="card-body p-5">
                    <h3 className="text-primary mb-4">智慧商務系核心理念</h3>
                    <div className="mb-4">
                      <h5 className="text-success mb-2">
                        <i className="bi bi-bullseye me-2"></i>
                        教育目標
                      </h5>
                      <p className="text-muted">
                        培育具備智慧商務專業知識、創新思維與實務能力的人才，
                        使其能在數位經濟時代發揮所長，成為產業發展的重要推手。
                      </p>
                    </div>
                    <div className="mb-4">
                      <h5 className="text-warning mb-2">
                        <i className="bi bi-lightbulb me-2"></i>
                        發展願景
                      </h5>
                      <p className="text-muted">
                        成為南台灣培育智慧商務人才的領導系所，
                        建立產學合作典範，提升台灣在全球數位經濟的競爭力。
                      </p>
                    </div>
                    <div>
                      <h5 className="text-info mb-2">
                        <i className="bi bi-gem me-2"></i>
                        核心價值
                      </h5>
                      <p className="text-muted">
                        創新、務實、卓越、服務 -
                        以創新精神追求卓越，以務實態度服務社會。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 課程特色 Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">智慧商務系課程特色</h2>
              <p className="lead text-muted">
                完整的課程體系，理論與實務並重的教學設計
              </p>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-lg-4">
                <div className="card border-0 shadow h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-primary rounded-circle mx-auto mb-3" style={{width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <i className="bi bi-laptop text-white fs-1"></i>
                    </div>
                    <h4 className="mb-3">基礎扎實</h4>
                    <p className="text-muted">
                      智慧商務系課程從基礎商業概念出發，逐步建立學生的專業知識體系，
                      確保每位學生都能具備紮實的理論基礎。
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card border-0 shadow h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-success rounded-circle mx-auto mb-3" style={{width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <i className="bi bi-gear text-white fs-1"></i>
                    </div>
                    <h4 className="mb-3">實務導向</h4>
                    <p className="text-muted">
                      強調實務操作與案例分析，讓智慧商務系學生在學習過程中
                      就能接觸真實的商業環境與挑戰。
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card border-0 shadow h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-warning rounded-circle mx-auto mb-3" style={{width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <i className="bi bi-globe text-white fs-1"></i>
                    </div>
                    <h4 className="mb-3">國際視野</h4>
                    <p className="text-muted">
                      智慧商務系課程融入國際商務元素，培養學生具備全球化思維
                      與跨文化溝通能力。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-6">
                <div className="card border-0 shadow">
                  <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">專業必修課程</h4>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0">
                        智慧商務概論
                        <span className="badge bg-primary rounded-pill">必修</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0">
                        電子商務系統設計
                        <span className="badge bg-primary rounded-pill">必修</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0">
                        數位行銷策略
                        <span className="badge bg-primary rounded-pill">必修</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0">
                        商業智慧與數據分析
                        <span className="badge bg-primary rounded-pill">必修</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0">
                        供應鏈管理
                        <span className="badge bg-primary rounded-pill">必修</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card border-0 shadow">
                  <div className="card-header bg-success text-white">
                    <h4 className="mb-0">專業選修課程</h4>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0">
                        人工智慧商業應用
                        <span className="badge bg-success rounded-pill">選修</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0">
                        區塊鏈與金融科技
                        <span className="badge bg-success rounded-pill">選修</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0">
                        跨境電商實務
                        <span className="badge bg-success rounded-pill">選修</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0">
                        創業與創新管理
                        <span className="badge bg-success rounded-pill">選修</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0">
                        社群媒體行銷
                        <span className="badge bg-success rounded-pill">選修</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 師資陣容 Section */}
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">智慧商務系師資陣容</h2>
              <p className="lead text-muted">
                優秀的師資團隊，結合學術專精與實務經驗
              </p>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-lg-4">
                <div className="text-center">
                  <div className="bg-primary rounded-circle mx-auto mb-3" style={{width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <h2 className="text-white mb-0">30+</h2>
                  </div>
                  <h4>專任教師</h4>
                  <p className="text-muted">智慧商務系擁有豐富的專任師資陣容</p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="text-center">
                  <div className="bg-success rounded-circle mx-auto mb-3" style={{width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <h2 className="text-white mb-0">85%</h2>
                  </div>
                  <h4>博士學位</h4>
                  <p className="text-muted">智慧商務系教師具博士學位比例</p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="text-center">
                  <div className="bg-warning rounded-circle mx-auto mb-3" style={{width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <h2 className="text-white mb-0">20+</h2>
                  </div>
                  <h4>業界經驗</h4>
                  <p className="text-muted">智慧商務系教師平均業界經驗年數</p>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-6">
                <div className="card border-0 shadow">
                  <div className="card-body p-4">
                    <h4 className="text-primary mb-3">學術專精領域</h4>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <span>電子商務</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <span>數位行銷</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <span>商業智慧</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <span>資訊管理</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <span>創新管理</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          <span>金融科技</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card border-0 shadow">
                  <div className="card-body p-4">
                    <h4 className="text-warning mb-3">實務經驗背景</h4>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-briefcase-fill text-warning me-2"></i>
                          <span>科技業高階主管</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-briefcase-fill text-warning me-2"></i>
                          <span>電商平台營運</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-briefcase-fill text-warning me-2"></i>
                          <span>數位行銷顧問</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-briefcase-fill text-warning me-2"></i>
                          <span>創業家</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-briefcase-fill text-warning me-2"></i>
                          <span>管理顧問師</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-briefcase-fill text-warning me-2"></i>
                          <span>金融業專家</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 學習環境與設施 Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">智慧商務系學習環境</h2>
              <p className="lead text-muted">
                現代化的教學設施，營造優質的學習環境
              </p>
            </div>

            <div className="row g-4">
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow text-center h-100">
                  <div className="card-body p-4">
                    <div className="bg-primary rounded-circle mx-auto mb-3" style={{width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <i className="bi bi-pc-display text-white fs-2"></i>
                    </div>
                    <h5>智慧商務實驗室</h5>
                    <p className="text-muted small">
                      配備最新電腦設備與商務軟體，讓智慧商務系學生進行實務操作
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow text-center h-100">
                  <div className="card-body p-4">
                    <div className="bg-success rounded-circle mx-auto mb-3" style={{width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <i className="bi bi-graph-up text-white fs-2"></i>
                    </div>
                    <h5>數據分析中心</h5>
                    <p className="text-muted small">
                      提供大數據分析工具與平台，培養學生數據科學能力
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow text-center h-100">
                  <div className="card-body p-4">
                    <div className="bg-warning rounded-circle mx-auto mb-3" style={{width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <i className="bi bi-people text-white fs-2"></i>
                    </div>
                    <h5>創新討論空間</h5>
                    <p className="text-muted small">
                      開放式討論空間，促進智慧商務系師生交流與創意發想
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow text-center h-100">
                  <div className="card-body p-4">
                    <div className="bg-info rounded-circle mx-auto mb-3" style={{width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <i className="bi bi-book text-white fs-2"></i>
                    </div>
                    <h5>專業圖書資源</h5>
                    <p className="text-muted small">
                      豐富的智慧商務相關書籍與電子資源供學生參考
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 產學合作 Section */}
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">智慧商務系產學合作</h2>
              <p className="lead text-muted">
                與業界緊密合作，提供學生實習與就業機會
              </p>
            </div>

            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <h3 className="mb-4">合作企業類型</h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="card border-primary h-100">
                      <div className="card-body text-center p-3">
                        <i className="bi bi-laptop text-primary fs-2 mb-2"></i>
                        <h6>科技公司</h6>
                        <small className="text-muted">軟體開發、系統整合</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-success h-100">
                      <div className="card-body text-center p-3">
                        <i className="bi bi-cart text-success fs-2 mb-2"></i>
                        <h6>電商平台</h6>
                        <small className="text-muted">線上零售、平台營運</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-warning h-100">
                      <div className="card-body text-center p-3">
                        <i className="bi bi-megaphone text-warning fs-2 mb-2"></i>
                        <h6>行銷公司</h6>
                        <small className="text-muted">數位行銷、廣告代理</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-info h-100">
                      <div className="card-body text-center p-3">
                        <i className="bi bi-bank text-info fs-2 mb-2"></i>
                        <h6>金融業</h6>
                        <small className="text-muted">銀行、保險、投資</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card border-0 shadow-lg">
                  <div className="card-body p-5">
                    <h3 className="text-primary mb-4">產學合作成果</h3>
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-primary rounded-circle me-3" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span className="text-white fw-bold">150+</span>
                        </div>
                        <div>
                          <h5 className="mb-0">合作企業</h5>
                          <small className="text-muted">提供智慧商務系實習與就業機會</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-success rounded-circle me-3" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span className="text-white fw-bold">200+</span>
                        </div>
                        <div>
                          <h5 className="mb-0">實習名額</h5>
                          <small className="text-muted">每年提供豐富實習機會</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="bg-warning rounded-circle me-3" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span className="text-white fw-bold">50+</span>
                        </div>
                        <div>
                          <h5 className="mb-0">專案合作</h5>
                          <small className="text-muted">學生參與企業實際專案</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 系所成就與認證 Section */}
        <section className="py-5 bg-primary text-white">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">智慧商務系榮譽與認證</h2>
              <p className="lead opacity-90">
                專業認證與獲獎肯定，證明智慧商務系的教育品質
              </p>
            </div>

            <div className="row g-4">
              <div className="col-lg-3 col-md-6">
                <div className="text-center">
                  <i className="bi bi-award text-warning fs-1 mb-3"></i>
                  <h5>教育部認證</h5>
                  <p className="opacity-75">通過教育部品質認證</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="text-center">
                  <i className="bi bi-trophy text-warning fs-1 mb-3"></i>
                  <h5>競賽獲獎</h5>
                  <p className="opacity-75">學生競賽表現優異</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="text-center">
                  <i className="bi bi-patch-check text-warning fs-1 mb-3"></i>
                  <h5>專業認證</h5>
                  <p className="opacity-75">課程符合產業需求</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="text-center">
                  <i className="bi bi-globe text-warning fs-1 mb-3"></i>
                  <h5>國際合作</h5>
                  <p className="opacity-75">與國外大學建立夥伴關係</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-5 bg-light">
          <div className="container text-center">
            <h2 className="display-5 fw-bold mb-4">加入智慧商務系大家庭</h2>
            <p className="lead mb-5">
              了解更多智慧商務系資訊，或聯繫我們獲得詳細諮詢
            </p>
            <div className="row g-3 justify-content-center">
              <div className="col-lg-2 col-md-4">
                <Link to="/IC/joinUs" className="btn btn-primary btn-lg w-100">
                  <i className="bi bi-person-plus me-2"></i>
                  加入系友會
                </Link>
              </div>
              <div className="col-lg-2 col-md-4">
                <Link to="/IC/contactUs" className="btn btn-success btn-lg w-100">
                  <i className="bi bi-envelope me-2"></i>
                  聯繫我們
                </Link>
              </div>
              <div className="col-lg-2 col-md-4">
                <Link to="/alumnilist" className="btn btn-warning btn-lg w-100">
                  <i className="bi bi-people me-2"></i>
                  系友名單
                </Link>
              </div>
              <div className="col-lg-2 col-md-4">
                <Link to="/recruit" className="btn btn-info btn-lg w-100">
                  <i className="bi bi-briefcase me-2"></i>
                  職涯機會
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

export default AboutDepartment;