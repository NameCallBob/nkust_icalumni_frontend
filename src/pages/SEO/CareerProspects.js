import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CareerProspects = () => {
  return (
    <>
      <Helmet>
        <title>智慧商務系就業前景 | 智商系職涯發展 - 高薪就業與創業機會</title>
        <meta name="description" content="探索智慧商務系畢業生的豐富就業前景與職涯發展機會。智商系培育的專業人才在電商、科技業、金融業等領域備受青睞，平均起薪優於同級科系。了解智慧商務系就業統計、職業選擇與發展路徑。" />
        <meta name="keywords" content="智慧商務系就業, 智商系職涯, 智慧商務系薪資, 電商就業, 數位行銷工作, 商業分析師, 智商系前景, 創業機會" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="智慧商務系就業前景 | 智商系職涯發展機會" />
        <meta property="og:description" content="探索智慧商務系畢業生的豐富就業前景，高薪就業與創業機會等你來發掘" />
        <meta property="og:url" content="https://nkusticalumni.org/career-prospects" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="智慧商務系就業前景 | 智商系職涯發展機會" />
        <meta property="twitter:description" content="探索智慧商務系畢業生的豐富就業前景，高薪就業與創業機會等你來發掘" />

        {/* 結構化數據 */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "智慧商務系就業前景",
            "description": "智慧商務系畢業生就業前景分析，包含職業選擇、薪資水準與發展機會",
            "url": "https://nkusticalumni.org/career-prospects",
            "mainEntity": {
              "@type": "EducationalOccupationalProgram",
              "name": "智慧商務系職涯發展",
              "description": "培育智慧商務專業人才，提供豐富的就業與創業機會",
              "provider": {
                "@type": "EducationalOrganization",
                "name": "國立高雄科技大學智慧商務系"
              },
              "occupationalCategory": [
                "電子商務專員",
                "數位行銷專員",
                "商業分析師",
                "產品經理",
                "創業家"
              ]
            }
          })}
        </script>

        <link rel="canonical" href="https://nkusticalumni.org/career-prospects" />
      </Helmet>

      <div className="container-fluid">
        {/* Hero Section */}
        <section className="hero-section position-relative text-white py-5" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '70vh'
        }}>
          <div className="container">
            <div className="row align-items-center h-100">
              <div className="col-lg-8">
                <h1 className="display-3 fw-bold mb-4">
                  智慧商務系就業前景
                  <br />
                  <span className="text-warning">開啟無限職涯可能</span>
                </h1>
                <p className="lead mb-4 opacity-90">
                  智慧商務系培育的專業人才在數位經濟時代備受市場青睞。
                  優異的就業率、競爭力十足的薪資水準，以及豐富的職涯發展機會，
                  讓智商系畢業生在各行各業都能發光發熱。
                </p>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="bg-warning rounded-3 p-3 text-dark text-center">
                      <h3 className="mb-1">98%</h3>
                      <small className="fw-bold">智慧商務系就業率</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="bg-light rounded-3 p-3 text-dark text-center">
                      <h3 className="mb-1">45K+</h3>
                      <small className="fw-bold">平均起薪</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="bg-success rounded-3 p-3 text-white text-center">
                      <h3 className="mb-1">25%</h3>
                      <small className="fw-bold">創業比例</small>
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <Link to="/recruit" className="btn btn-warning btn-lg px-4">
                    <i className="bi bi-briefcase me-2"></i>
                    查看職缺
                  </Link>
                  <Link to="/IC/joinUs" className="btn btn-outline-light btn-lg px-4">
                    <i className="bi bi-people me-2"></i>
                    加入系友會
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 就業統計 Section */}
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">智慧商務系就業成果</h2>
              <p className="lead text-muted">
                數據說話：智商系畢業生的優異就業表現
              </p>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm text-center h-100">
                  <div className="card-body p-4">
                    <div className="bg-primary rounded-circle mx-auto mb-3" style={{width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <h3 className="text-white mb-0">98%</h3>
                    </div>
                    <h5 className="mb-2">整體就業率</h5>
                    <p className="text-muted small">
                      智慧商務系畢業生六個月內成功就業比例
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm text-center h-100">
                  <div className="card-body p-4">
                    <div className="bg-success rounded-circle mx-auto mb-3" style={{width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <h3 className="text-white mb-0">45K</h3>
                    </div>
                    <h5 className="mb-2">平均起薪</h5>
                    <p className="text-muted small">
                      智慧商務系新鮮人平均月薪（台幣）
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm text-center h-100">
                  <div className="card-body p-4">
                    <div className="bg-warning rounded-circle mx-auto mb-3" style={{width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <h3 className="text-white mb-0">85%</h3>
                    </div>
                    <h5 className="mb-2">專業對口率</h5>
                    <p className="text-muted small">
                      智商系畢業生從事相關專業工作比例
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm text-center h-100">
                  <div className="card-body p-4">
                    <div className="bg-info rounded-circle mx-auto mb-3" style={{width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <h3 className="text-white mb-0">60K</h3>
                    </div>
                    <h5 className="mb-2">三年後薪資</h5>
                    <p className="text-muted small">
                      智慧商務系畢業生三年後平均月薪
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-6">
                <div className="card border-0 shadow">
                  <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">薪資成長趨勢</h4>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>新鮮人（0-1年）</span>
                        <span className="fw-bold">35-50K</span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar bg-primary" style={{width: '60%'}}></div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>資深專員（2-3年）</span>
                        <span className="fw-bold">45-70K</span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar bg-success" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>主管職（5年以上）</span>
                        <span className="fw-bold">70-120K</span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar bg-warning" style={{width: '90%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>高階主管/創業</span>
                        <span className="fw-bold">100K+</span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar bg-danger" style={{width: '100%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card border-0 shadow">
                  <div className="card-header bg-success text-white">
                    <h4 className="mb-0">行業分布比例</h4>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>科技業</span>
                        <span className="fw-bold">35%</span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar bg-primary" style={{width: '35%'}}></div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>電商零售業</span>
                        <span className="fw-bold">25%</span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar bg-success" style={{width: '25%'}}></div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>金融服務業</span>
                        <span className="fw-bold">15%</span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar bg-warning" style={{width: '15%'}}></div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>創業</span>
                        <span className="fw-bold">15%</span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar bg-info" style={{width: '15%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>其他行業</span>
                        <span className="fw-bold">10%</span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar bg-secondary" style={{width: '10%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 熱門職業 Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">智慧商務系熱門職業</h2>
              <p className="lead text-muted">
                智商系畢業生的多元職涯選擇
              </p>
            </div>

            <div className="row g-4">
              <div className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-3 me-3 p-2">
                        <i className="bi bi-cart text-white fs-4"></i>
                      </div>
                      <div>
                        <h5 className="mb-0">電商經理</h5>
                        <small className="text-muted">平均薪資：50-80K</small>
                      </div>
                    </div>
                    <p className="text-muted mb-3">
                      負責電商平台營運、商品管理、銷售策略規劃等工作。
                      智慧商務系學生在此領域具有強大競爭優勢。
                    </p>
                    <div className="mb-3">
                      <h6 className="text-primary mb-2">核心技能需求：</h6>
                      <div className="d-flex flex-wrap gap-1">
                        <span className="badge bg-light text-dark">電商營運</span>
                        <span className="badge bg-light text-dark">數據分析</span>
                        <span className="badge bg-light text-dark">專案管理</span>
                      </div>
                    </div>
                    <div className="progress mb-2">
                      <div className="progress-bar bg-primary" style={{width: '90%'}}></div>
                    </div>
                    <small className="text-muted">智商系適配度：90%</small>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-success rounded-3 me-3 p-2">
                        <i className="bi bi-megaphone text-white fs-4"></i>
                      </div>
                      <div>
                        <h5 className="mb-0">數位行銷專員</h5>
                        <small className="text-muted">平均薪資：40-65K</small>
                      </div>
                    </div>
                    <p className="text-muted mb-3">
                      執行數位行銷策略、管理社群媒體、分析行銷成效。
                      智慧商務系課程完美對應此職位需求。
                    </p>
                    <div className="mb-3">
                      <h6 className="text-success mb-2">核心技能需求：</h6>
                      <div className="d-flex flex-wrap gap-1">
                        <span className="badge bg-light text-dark">SEO/SEM</span>
                        <span className="badge bg-light text-dark">社群經營</span>
                        <span className="badge bg-light text-dark">內容行銷</span>
                      </div>
                    </div>
                    <div className="progress mb-2">
                      <div className="progress-bar bg-success" style={{width: '95%'}}></div>
                    </div>
                    <small className="text-muted">智商系適配度：95%</small>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-warning rounded-3 me-3 p-2">
                        <i className="bi bi-graph-up text-white fs-4"></i>
                      </div>
                      <div>
                        <h5 className="mb-0">商業分析師</h5>
                        <small className="text-muted">平均薪資：55-85K</small>
                      </div>
                    </div>
                    <p className="text-muted mb-3">
                      運用數據分析技術協助企業決策，發掘商業機會。
                      智慧商務系的數據分析訓練在此展現價值。
                    </p>
                    <div className="mb-3">
                      <h6 className="text-warning mb-2">核心技能需求：</h6>
                      <div className="d-flex flex-wrap gap-1">
                        <span className="badge bg-light text-dark">數據分析</span>
                        <span className="badge bg-light text-dark">統計分析</span>
                        <span className="badge bg-light text-dark">商業洞察</span>
                      </div>
                    </div>
                    <div className="progress mb-2">
                      <div className="progress-bar bg-warning" style={{width: '85%'}}></div>
                    </div>
                    <small className="text-muted">智商系適配度：85%</small>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-info rounded-3 me-3 p-2">
                        <i className="bi bi-kanban text-white fs-4"></i>
                      </div>
                      <div>
                        <h5 className="mb-0">產品經理</h5>
                        <small className="text-muted">平均薪資：60-100K</small>
                      </div>
                    </div>
                    <p className="text-muted mb-3">
                      負責產品策略規劃、市場分析、跨部門協作。
                      智慧商務系培養的綜合能力在此發揮關鍵作用。
                    </p>
                    <div className="mb-3">
                      <h6 className="text-info mb-2">核心技能需求：</h6>
                      <div className="d-flex flex-wrap gap-1">
                        <span className="badge bg-light text-dark">產品策略</span>
                        <span className="badge bg-light text-dark">市場分析</span>
                        <span className="badge bg-light text-dark">專案管理</span>
                      </div>
                    </div>
                    <div className="progress mb-2">
                      <div className="progress-bar bg-info" style={{width: '80%'}}></div>
                    </div>
                    <small className="text-muted">智商系適配度：80%</small>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-danger rounded-3 me-3 p-2">
                        <i className="bi bi-lightbulb text-white fs-4"></i>
                      </div>
                      <div>
                        <h5 className="mb-0">創業家</h5>
                        <small className="text-muted">收入：依事業規模</small>
                      </div>
                    </div>
                    <p className="text-muted mb-3">
                      創立自己的事業，在電商、科技服務等領域發揮所長。
                      智慧商務系提供完整的創業知識與技能。
                    </p>
                    <div className="mb-3">
                      <h6 className="text-danger mb-2">核心技能需求：</h6>
                      <div className="d-flex flex-wrap gap-1">
                        <span className="badge bg-light text-dark">商業企劃</span>
                        <span className="badge bg-light text-dark">領導管理</span>
                        <span className="badge bg-light text-dark">市場開發</span>
                      </div>
                    </div>
                    <div className="progress mb-2">
                      <div className="progress-bar bg-danger" style={{width: '75%'}}></div>
                    </div>
                    <small className="text-muted">智商系適配度：75%</small>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-secondary rounded-3 me-3 p-2">
                        <i className="bi bi-person-gear text-white fs-4"></i>
                      </div>
                      <div>
                        <h5 className="mb-0">管理顧問</h5>
                        <small className="text-muted">平均薪資：65-120K</small>
                      </div>
                    </div>
                    <p className="text-muted mb-3">
                      協助企業解決經營問題、數位轉型諮詢。
                      智慧商務系的理論基礎與實務經驗兼備優勢明顯。
                    </p>
                    <div className="mb-3">
                      <h6 className="text-secondary mb-2">核心技能需求：</h6>
                      <div className="d-flex flex-wrap gap-1">
                        <span className="badge bg-light text-dark">策略分析</span>
                        <span className="badge bg-light text-dark">流程改善</span>
                        <span className="badge bg-light text-dark">簡報溝通</span>
                      </div>
                    </div>
                    <div className="progress mb-2">
                      <div className="progress-bar bg-secondary" style={{width: '70%'}}></div>
                    </div>
                    <small className="text-muted">智商系適配度：70%</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 職涯發展路徑 Section */}
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">智慧商務系職涯發展路徑</h2>
              <p className="lead text-muted">
                從新鮮人到企業領導者的完整發展藍圖
              </p>
            </div>

            <div className="row g-4">
              <div className="col-lg-6">
                <div className="card border-0 shadow-lg">
                  <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">技術專業路線</h4>
                  </div>
                  <div className="card-body p-4">
                    <div className="timeline">
                      <div className="d-flex mb-4">
                        <div className="bg-primary rounded-circle me-3 flex-shrink-0" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span className="text-white fw-bold">1</span>
                        </div>
                        <div>
                          <h5 className="text-primary">專員/助理（0-2年）</h5>
                          <p className="text-muted mb-0">
                            電商專員、數位行銷助理、數據分析專員
                            <br />
                            <strong>薪資範圍：</strong>35-50K
                          </p>
                        </div>
                      </div>
                      <div className="d-flex mb-4">
                        <div className="bg-success rounded-circle me-3 flex-shrink-0" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span className="text-white fw-bold">2</span>
                        </div>
                        <div>
                          <h5 className="text-success">資深專員（3-5年）</h5>
                          <p className="text-muted mb-0">
                            資深電商經理、數位行銷專家、商業分析師
                            <br />
                            <strong>薪資範圍：</strong>50-80K
                          </p>
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="bg-warning rounded-circle me-3 flex-shrink-0" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span className="text-white fw-bold">3</span>
                        </div>
                        <div>
                          <h5 className="text-warning">技術專家（5年以上）</h5>
                          <p className="text-muted mb-0">
                            首席分析師、技術總監、產品架構師
                            <br />
                            <strong>薪資範圍：</strong>80-150K
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card border-0 shadow-lg">
                  <div className="card-header bg-success text-white">
                    <h4 className="mb-0">管理領導路線</h4>
                  </div>
                  <div className="card-body p-4">
                    <div className="timeline">
                      <div className="d-flex mb-4">
                        <div className="bg-primary rounded-circle me-3 flex-shrink-0" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span className="text-white fw-bold">1</span>
                        </div>
                        <div>
                          <h5 className="text-primary">基層主管（3-5年）</h5>
                          <p className="text-muted mb-0">
                            小組長、專案經理、部門副理
                            <br />
                            <strong>薪資範圍：</strong>55-75K
                          </p>
                        </div>
                      </div>
                      <div className="d-flex mb-4">
                        <div className="bg-success rounded-circle me-3 flex-shrink-0" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span className="text-white fw-bold">2</span>
                        </div>
                        <div>
                          <h5 className="text-success">中階主管（5-8年）</h5>
                          <p className="text-muted mb-0">
                            部門經理、營運總監、產品總監
                            <br />
                            <strong>薪資範圍：</strong>80-120K
                          </p>
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="bg-warning rounded-circle me-3 flex-shrink-0" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span className="text-white fw-bold">3</span>
                        </div>
                        <div>
                          <h5 className="text-warning">高階主管（8年以上）</h5>
                          <p className="text-muted mb-0">
                            VP、CTO、CEO、創業家
                            <br />
                            <strong>薪資範圍：</strong>120K+
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 系友成功案例 Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">智慧商務系友成功故事</h2>
              <p className="lead text-muted">
                真實案例分享，證明智商系教育的成功
              </p>
            </div>

            <div className="row g-4">
              <div className="col-lg-4">
                <div className="card border-0 shadow">
                  <div className="card-body p-4 text-center">
                    <div className="bg-primary rounded-circle mx-auto mb-3" style={{width: '80px', height: '80px'}}></div>
                    <h5>陳○○ 學長</h5>
                    <p className="text-muted mb-3">智慧商務系第三屆畢業生</p>
                    <h6 className="text-primary mb-2">電商平台創業家</h6>
                    <p className="text-muted small mb-3">
                      畢業三年後創立電商平台，年營收突破億元。
                      智慧商務系的扎實訓練讓我在創業路上更有信心。
                    </p>
                    <div className="bg-light rounded-3 p-2">
                      <small><strong>現職：</strong>某電商平台執行長</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card border-0 shadow">
                  <div className="card-body p-4 text-center">
                    <div className="bg-success rounded-circle mx-auto mb-3" style={{width: '80px', height: '80px'}}></div>
                    <h5>林○○ 學姊</h5>
                    <p className="text-muted mb-3">智慧商務系第五屆畢業生</p>
                    <h6 className="text-success mb-2">科技業產品總監</h6>
                    <p className="text-muted small mb-3">
                      從數位行銷專員做起，五年內晉升為產品總監。
                      智商系的課程讓我具備全方位的商業思維。
                    </p>
                    <div className="bg-light rounded-3 p-2">
                      <small><strong>現職：</strong>知名科技公司產品總監</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card border-0 shadow">
                  <div className="card-body p-4 text-center">
                    <div className="bg-warning rounded-circle mx-auto mb-3" style={{width: '80px', height: '80px'}}></div>
                    <h5>王○○ 學長</h5>
                    <p className="text-muted mb-3">智慧商務系第二屆畢業生</p>
                    <h6 className="text-warning mb-2">數據分析專家</h6>
                    <p className="text-muted small mb-3">
                      現為某金融集團首席數據科學家，
                      年薪超過200萬。智慧商務系的數據分析課程奠定了基礎。
                    </p>
                    <div className="bg-light rounded-3 p-2">
                      <small><strong>現職：</strong>金融集團首席數據科學家</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 就業資源與支援 Section */}
        <section className="py-5 bg-primary text-white">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">智慧商務系就業支援</h2>
              <p className="lead opacity-90">
                完整的職涯發展資源，助力學生成功就業
              </p>
            </div>

            <div className="row g-4">
              <div className="col-lg-3 col-md-6">
                <div className="text-center">
                  <i className="bi bi-people-fill fs-1 text-warning mb-3"></i>
                  <h5>就業輔導</h5>
                  <p className="opacity-75">
                    專業職涯諮詢師提供一對一就業指導
                  </p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="text-center">
                  <i className="bi bi-briefcase-fill fs-1 text-warning mb-3"></i>
                  <h5>企業實習</h5>
                  <p className="opacity-75">
                    與150+企業合作提供實習機會
                  </p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="text-center">
                  <i className="bi bi-calendar-event-fill fs-1 text-warning mb-3"></i>
                  <h5>就業博覽會</h5>
                  <p className="opacity-75">
                    定期舉辦企業徵才說明會
                  </p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="text-center">
                  <i className="bi bi-network-wired fs-1 text-warning mb-3"></i>
                  <h5>系友網絡</h5>
                  <p className="opacity-75">
                    強大的系友人脈提供職涯發展機會
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-5">
              <h3 className="mb-4">立即開啟您的智慧商務職涯</h3>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/recruit" className="btn btn-warning btn-lg px-4">
                  <i className="bi bi-search me-2"></i>
                  瀏覽職缺
                </Link>
                <Link to="/IC/joinUs" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-people me-2"></i>
                  加入系友會
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-5 bg-light">
          <div className="container text-center">
            <h2 className="display-5 fw-bold mb-4">準備開始您的智慧商務職涯嗎？</h2>
            <p className="lead mb-5">
              了解更多就業資訊，或聯繫我們獲得職涯諮詢
            </p>
            <div className="row g-3 justify-content-center">
              <div className="col-lg-2 col-md-4">
                <Link to="/recruit" className="btn btn-primary btn-lg w-100">
                  <i className="bi bi-briefcase me-2"></i>
                  查看職缺
                </Link>
              </div>
              <div className="col-lg-2 col-md-4">
                <Link to="/IC/contactUs" className="btn btn-success btn-lg w-100">
                  <i className="bi bi-telephone me-2"></i>
                  職涯諮詢
                </Link>
              </div>
              <div className="col-lg-2 col-md-4">
                <Link to="/alumnilist" className="btn btn-warning btn-lg w-100">
                  <i className="bi bi-people me-2"></i>
                  系友網絡
                </Link>
              </div>
              <div className="col-lg-2 col-md-4">
                <Link to="/IC/intro" className="btn btn-info btn-lg w-100">
                  <i className="bi bi-info-circle me-2"></i>
                  系所介紹
                </Link>
              </div>
              <div className="col-lg-2 col-md-4">
                <Link to="/IC/joinUs" className="btn btn-outline-primary btn-lg w-100">
                  <i className="bi bi-person-plus me-2"></i>
                  加入我們
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CareerProspects;