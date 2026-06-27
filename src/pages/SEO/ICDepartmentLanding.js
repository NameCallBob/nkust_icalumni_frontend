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
  BsMortarboardFill,
  BsBriefcaseFill,
  BsBuildingsFill,
  BsPersonBadgeFill,
} from 'react-icons/bs';
import { Section, Card, StatCard, Badge } from 'components/common/ui';

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

      <div className="w-full bg-base-200/40">
        {/* Hero Section */}
        <section
          className="relative overflow-hidden text-white"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }}
        >
          {/* 裝飾光暈 */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-secondary uppercase backdrop-blur">
                NKUST 智慧商務系系友會
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                智商系 — 開創智慧商務新紀元
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-white/80 mb-8">
                高科大智商系（智慧商務系）是南台灣培育數位商務領袖的重要基地。
                我們致力於培養具備創新思維、科技應用與商業洞察力的新世代人才，
                讓智商系學生在瞬息萬變的數位經濟中脫穎而出。
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <Link
                  to="/IC/joinUs"
                  className="btn btn-lg bg-secondary border-secondary text-white hover:brightness-110 rounded-xl shadow-lg"
                >
                  <BsPersonPlus className="mr-2 text-lg" />
                  加入智商系友會
                </Link>
                <Link
                  to="/IC/intro"
                  className="btn btn-lg btn-outline text-white border-white/40 hover:bg-white/10 hover:border-white rounded-xl"
                >
                  <BsInfoCircle className="mr-2 text-lg" />
                  認識智商系
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 智商系簡介 Section */}
        <Section
          eyebrow="About"
          title="關於智商系"
          width="wide"
          className="bg-base-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <p className="text-base sm:text-lg leading-relaxed text-base-content/70 mb-8">
                國立高雄科技大學智商系（智慧商務系）成立於數位轉型的關鍵時刻，
                專注於培育具備智慧商務專業知識與實務技能的人才。
              </p>
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  accent="primary"
                  value="500+"
                  label="智商系畢業生"
                  icon={<BsMortarboardFill className="text-xl" />}
                />
                <StatCard
                  accent="success"
                  value="95%"
                  label="智商系就業率"
                  icon={<BsGraphUpArrow className="text-xl" />}
                />
                <StatCard
                  accent="warning"
                  value="50+"
                  label="產學合作企業"
                  icon={<BsBuildingsFill className="text-xl" />}
                />
                <StatCard
                  accent="secondary"
                  value="20+"
                  label="專業師資"
                  icon={<BsPersonBadgeFill className="text-xl" />}
                />
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-2xl p-7 sm:p-9 text-white shadow-xl"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)' }}
            >
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-secondary/20 blur-2xl" />
              <h3 className="relative font-serif text-2xl font-bold mb-6">智商系核心價值</h3>
              <ul className="relative space-y-4">
                <li className="flex gap-3">
                  <BsCheckCircleFill className="mt-1 shrink-0 text-secondary" />
                  <span><strong>創新思維：</strong>培養智商系學生具備創新創業精神</span>
                </li>
                <li className="flex gap-3">
                  <BsCheckCircleFill className="mt-1 shrink-0 text-secondary" />
                  <span><strong>科技整合：</strong>結合最新科技與商業應用</span>
                </li>
                <li className="flex gap-3">
                  <BsCheckCircleFill className="mt-1 shrink-0 text-secondary" />
                  <span><strong>實務導向：</strong>強調理論與實作並重的學習模式</span>
                </li>
                <li className="flex gap-3">
                  <BsCheckCircleFill className="mt-1 shrink-0 text-secondary" />
                  <span><strong>國際視野：</strong>拓展智商系學生全球競爭力</span>
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 智商系專業領域 Section */}
        <Section
          eyebrow="Expertise"
          title="智商系專業領域"
          center
          width="wide"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <BsCart className="text-2xl" />,
                accent: 'bg-primary',
                title: '電子商務',
                desc: '智商系電商課程涵蓋平台經營、網路行銷、消費者行為分析等核心技能，培養學生成為電商產業的專業人才。',
              },
              {
                icon: <BsGraphUpArrow className="text-2xl" />,
                accent: 'bg-success',
                title: '數據分析',
                desc: '運用大數據技術進行商業智慧分析，讓智商系學生具備數據驅動決策的專業能力，成為企業數位轉型的關鍵人才。',
              },
              {
                icon: <BsMegaphone className="text-2xl" />,
                accent: 'bg-warning',
                title: '數位行銷',
                desc: '掌握社群媒體經營、內容行銷、搜尋引擎優化等數位行銷策略，讓智商系畢業生在行銷領域具備競爭優勢。',
              },
              {
                icon: <BsLightbulb className="text-2xl" />,
                accent: 'bg-secondary',
                title: '創新創業',
                desc: '培養創業思維與創新能力，提供智商系學生創業育成資源，協助實現創業夢想與事業發展。',
              },
            ].map((item) => (
              <Card key={item.title} hover className="h-full text-center">
                <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-md ${item.accent}`}>
                  {item.icon}
                </div>
                <h4 className="font-serif text-lg font-bold text-base-content mb-3">{item.title}</h4>
                <p className="text-sm leading-relaxed text-base-content/60">{item.desc}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* 智商系系友成功案例 Section */}
        <Section
          eyebrow="Alumni Stories"
          title="智商系系友風采"
          center
          width="wide"
          className="bg-base-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                badge: 'bg-primary',
                name: '電商創業家',
                role: '智商系第一屆畢業生',
                quote: '「智商系的實務訓練讓我在創業路上更有信心。從課程中學到的電商營運知識，成為我創立公司的重要基礎。」',
              },
              {
                badge: 'bg-success',
                name: '數據分析師',
                role: '知名科技公司',
                quote: '「智商系的數據分析課程非常實用，讓我能夠快速適應職場需求。現在我負責公司的商業智慧分析工作，發展順利。」',
              },
              {
                badge: 'bg-secondary',
                name: '行銷總監',
                role: '國際企業',
                quote: '「智商系的數位行銷課程讓我具備國際競爭力。系友會的人脈網絡也對我的職涯發展有很大幫助。」',
              },
            ].map((p) => (
              <Card key={p.name} hover className="h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-12 w-12 shrink-0 rounded-full ${p.badge}`} />
                  <div className="min-w-0">
                    <h5 className="font-semibold text-base-content truncate">{p.name}</h5>
                    <small className="text-base-content/60">{p.role}</small>
                  </div>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-base-content/70 mb-4">{p.quote}</p>
                <div className="flex gap-0.5 text-secondary">
                  <BsStarFill />
                  <BsStarFill />
                  <BsStarFill />
                  <BsStarFill />
                  <BsStarFill />
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* 智商系學習資源 Section */}
        <section
          className="px-4 sm:px-6 py-14 sm:py-20 text-white"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
              <div>
                <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-secondary uppercase">Resources</p>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3">智商系學習資源</h2>
                <div className="mb-6 h-1 w-16 rounded-full bg-gradient-to-r from-secondary to-primary" />
                <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8">
                  高科大智商系提供豐富的學習資源與設施，讓學生在優質的環境中學習成長。
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: <BsLaptop className="text-xl" />, title: '智慧商務實驗室', desc: '最新設備與軟體' },
                    { icon: <BsBuilding className="text-xl" />, title: '產學合作中心', desc: '企業實習機會' },
                    { icon: <BsBook className="text-xl" />, title: '專業圖書館', desc: '豐富的學術資源' },
                    { icon: <BsPeople className="text-xl" />, title: '師生交流空間', desc: '促進學習互動' },
                  ].map((r) => (
                    <div key={r.title} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary/20 text-secondary">
                        {r.icon}
                      </span>
                      <div className="min-w-0">
                        <h5 className="font-semibold leading-tight">{r.title}</h5>
                        <small className="text-white/70">{r.desc}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Card padding="lg" className="text-base-content">
                <h3 className="font-serif text-xl font-bold text-primary mb-5">加入智商系友會的優勢</h3>
                <ul className="space-y-3 mb-7">
                  {[
                    '豐富的職涯發展機會與資源',
                    '智商系系友遍布各行各業的人脈網絡',
                    '定期舉辦產業趨勢分享會',
                    '創業諮詢與資源媒合服務',
                    '終身學習與進修課程資訊',
                  ].map((t) => (
                    <li key={t} className="flex gap-3">
                      <BsCheck2Circle className="mt-0.5 shrink-0 text-success text-lg" />
                      <span className="text-base-content/80">{t}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/IC/joinUs" className="btn btn-primary rounded-xl w-full sm:w-auto">
                  <BsPersonPlus className="mr-2" />
                  立即加入智商系友會
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* 智商系常見問題 Section */}
        <Section
          eyebrow="FAQ"
          title="智商系常見問題"
          center
          width="narrow"
          className="bg-base-100"
        >
          <div className="flex flex-col gap-3" id="icDeptFaq">
            <div className="collapse collapse-arrow rounded-2xl border border-base-300/70 bg-base-100 shadow-sm">
              <input type="radio" name="icDeptFaq" defaultChecked />
              <h3 className="collapse-title text-base font-semibold m-0">
                智商系（智慧商務系）的主要學習內容是什麼？
              </h3>
              <div className="collapse-content">
                <p className="text-base-content/70 leading-relaxed">
                  智商系課程涵蓋電子商務、數位行銷、商業智慧分析、創新創業等領域。
                  學生將學習到電商平台經營、數據分析工具運用、社群媒體行銷策略等實務技能，
                  培養在數位經濟時代所需的核心競爭力。
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow rounded-2xl border border-base-300/70 bg-base-100 shadow-sm">
              <input type="radio" name="icDeptFaq" />
              <h3 className="collapse-title text-base font-semibold m-0">
                智商系畢業生的就業前景如何？
              </h3>
              <div className="collapse-content">
                <p className="text-base-content/70 leading-relaxed">
                  智商系畢業生就業率高達95%以上，主要從事電商經理、數位行銷專員、商業分析師、
                  產品經理等職務。隨著企業數位轉型需求增加，智商系人才在市場上供不應求，
                  薪資待遇與發展前景都相當優異。
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow rounded-2xl border border-base-300/70 bg-base-100 shadow-sm">
              <input type="radio" name="icDeptFaq" />
              <h3 className="collapse-title text-base font-semibold m-0">
                高科大智商系與其他學校的商管科系有何不同？
              </h3>
              <div className="collapse-content">
                <p className="text-base-content/70 leading-relaxed">
                  高科大智商系更專注於智慧商務與科技的結合，課程設計緊跟產業趨勢，
                  強調實務操作與產學合作。相較於傳統商管科系，智商系學生更具備數位科技素養
                  與創新思維，在數位經濟時代具有明顯的競爭優勢。
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow rounded-2xl border border-base-300/70 bg-base-100 shadow-sm">
              <input type="radio" name="icDeptFaq" />
              <h3 className="collapse-title text-base font-semibold m-0">
                如何參與智商系的活動和系友會？
              </h3>
              <div className="collapse-content">
                <p className="text-base-content/70 leading-relaxed">
                  歡迎智商系在校生、畢業系友及對智慧商務有興趣的朋友加入我們。
                  您可以透過線上申請表單加入系友會，或關注我們的社群媒體獲得最新活動資訊。
                  我們定期舉辦產業講座、職涯分享會、創業交流等活動。
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* 聯繫我們 Section */}
        <Section width="wide" className="bg-base-200/40">
          <div className="text-center mb-10">
            <Badge variant="secondary">CONTACT</Badge>
            <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-bold text-base-content">
              開啟您的智商系之路
            </h2>
            <div className="mt-3 mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-secondary to-primary" />
            <p className="mt-5 mx-auto max-w-2xl text-base sm:text-lg text-base-content/70 leading-relaxed">
              無論您是準備加入智商系的高中生、在學中的智商系學生，
              或是已經畢業的智商系系友，我們都歡迎您與我們聯繫！
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/IC/contactUs" className="btn btn-primary btn-lg w-full rounded-xl">
              <BsEnvelope className="mr-2" />
              聯繫我們
            </Link>
            <Link to="/alumnilist" className="btn btn-outline btn-primary btn-lg w-full rounded-xl">
              <BsPeople className="mr-2" />
              系友名單
            </Link>
            <Link to="/recruit" className="btn btn-success btn-lg w-full rounded-xl">
              <BsBriefcaseFill className="mr-2" />
              職涯機會
            </Link>
            <Link to="/IC/intro" className="btn btn-lg w-full rounded-xl bg-secondary border-secondary text-white hover:brightness-110">
              <BsInfoCircle className="mr-2" />
              更多資訊
            </Link>
          </div>
        </Section>
      </div>
    </>
  );
};

export default ICDepartmentLanding;
