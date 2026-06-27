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
import { Section, Card } from 'components/common/ui';

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

      <div className="w-full bg-base-200/40">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] text-white">
          {/* 裝飾光暈 */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-secondary uppercase">
                NKUST · 智慧商務系系友會
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                智慧商務系
                <span className="block mt-2 bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent">
                  培育未來數位商務領袖
                </span>
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-white/80 mb-8 max-w-2xl">
                國立高雄科技大學智慧商務系致力於培育具備電子商務、數位行銷、商業智慧分析能力的專業人才。
                透過產學合作與實務導向的課程設計，讓學生具備迎接數位經濟時代的核心競爭力。
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/IC/joinUs"
                  className="btn btn-lg rounded-xl border-0 bg-white text-primary shadow-lg shadow-black/20 hover:bg-base-200"
                >
                  加入系友會
                </Link>
                <Link
                  to="/IC/intro"
                  className="btn btn-lg rounded-xl border-white/40 bg-transparent text-white hover:bg-white hover:text-primary"
                >
                  了解更多
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 系所特色 Section */}
        <Section title="智慧商務系核心特色" eyebrow="Core Strengths" center width="wide" className="bg-base-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BsLaptop,
                color: 'from-[#1e3a8a] to-[#0f172a]',
                title: '電子商務專業',
                desc: '深入學習電商平台經營、網路行銷策略、跨境電商等實務技能，培養智慧商務系學生具備完整的電商營運能力。',
              },
              {
                icon: BsGraphUp,
                color: 'from-emerald-600 to-emerald-800',
                title: '商業智慧分析',
                desc: '運用大數據分析、機器學習等技術，培養智慧商務系學生具備數據驅動的商業決策能力，成為企業數位轉型的重要推手。',
              },
              {
                icon: BsPeople,
                color: 'from-[#a0781c] to-[#7a5a12]',
                title: '產學合作實務',
                desc: '與知名企業建立緊密的產學合作關係，提供智慧商務系學生實習機會與就業管道，確保理論與實務的完美結合。',
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <Card key={title} hover padding="lg" className="text-center h-full">
                <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-md`}>
                  <Icon className="text-2xl" />
                </div>
                <h3 className="font-serif text-xl font-bold text-base-content mb-3">{title}</h3>
                <p className="text-sm leading-relaxed text-base-content/60">{desc}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* 課程特色 Section */}
        <Section title="智慧商務系課程規劃" eyebrow="Curriculum" center width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                heading: '核心專業課程',
                items: [
                  ['電子商務概論', '建立智慧商務系學生對電商產業的基礎認知'],
                  ['數位行銷策略', '掌握網路行銷、社群媒體經營等技能'],
                  ['商業智慧與大數據分析', '學習數據分析工具與商業應用'],
                  ['電商平台設計與管理', '實作電商網站建置與營運'],
                  ['供應鏈管理', '了解現代商務流程與物流管理'],
                ],
              },
              {
                heading: '實務應用課程',
                items: [
                  ['企業實習專案', '與合作企業進行實際案例操作'],
                  ['創業與創新管理', '培養智慧商務系學生創業精神'],
                  ['跨境電商實務', '掌握國際市場拓展策略'],
                  ['金融科技應用', '了解數位支付與區塊鏈技術'],
                  ['畢業專題製作', '整合四年所學完成專業作品'],
                ],
              },
            ].map(({ heading, items }) => (
              <Card key={heading} padding="lg" className="h-full">
                <h3 className="font-serif text-xl font-bold text-primary mb-5 flex items-center gap-3">
                  <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-secondary to-primary" />
                  {heading}
                </h3>
                <ul className="divide-y divide-base-300/70">
                  {items.map(([name, info]) => (
                    <li key={name} className="flex gap-3 py-3.5">
                      <BsCheckCircleFill className="mt-1 shrink-0 text-secondary" />
                      <span className="text-sm leading-relaxed text-base-content/80">
                        <strong className="text-base-content">{name}</strong>
                        <span className="text-base-content/50"> － {info}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Section>

        {/* 就業前景 Section */}
        <Section title="智慧商務系就業前景" eyebrow="Career Prospects" center width="wide" className="bg-base-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BsBriefcase,
                color: 'from-[#1e3a8a] to-[#0f172a]',
                title: '就業領域廣泛',
                desc: '智慧商務系畢業生可投入電商平台、數位行銷公司、科技業、金融業、零售業等多元領域，職涯發展空間寬廣。',
              },
              {
                icon: BsGraphUpArrow,
                color: 'from-emerald-600 to-emerald-800',
                title: '薪資競爭力佳',
                desc: '因應數位轉型趨勢，智慧商務系專業人才需求持續增長，起薪與發展前景均優於一般商管科系。',
              },
              {
                icon: BsRocket,
                color: 'from-[#a0781c] to-[#7a5a12]',
                title: '創業機會豐富',
                desc: '智慧商務系培養的創新思維與實務技能，為學生創業提供堅實基礎，許多系友已成功創立事業。',
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <Card key={title} hover padding="lg" className="text-center h-full">
                <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${color} text-white shadow-lg`}>
                  <Icon className="text-3xl" />
                </div>
                <h3 className="font-serif text-xl font-bold text-base-content mb-3">{title}</h3>
                <p className="text-sm leading-relaxed text-base-content/60">{desc}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* 系友會介紹 Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] text-white">
          <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
              <div className="lg:col-span-2">
                <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-secondary uppercase">Alumni Network</p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-5">加入智慧商務系系友會</h2>
                <p className="text-base sm:text-lg leading-relaxed text-white/80 mb-8">
                  國立高雄科技大學智慧商務系系友會匯聚了各行各業的優秀系友，
                  提供職涯諮詢、人脈拓展、創業資源等多元服務。
                  無論您是在學生、畢業系友或是對智慧商務系有興趣的朋友，
                  我們都歡迎您的加入！
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['職涯發展諮詢', '產業趨勢分享', '人脈網絡建立', '創業資源媒合'].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <BsCheckCircleFill className="shrink-0 text-secondary" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center lg:text-right">
                <Link
                  to="/IC/joinUs"
                  className="btn btn-lg rounded-xl border-0 bg-white px-8 text-primary shadow-lg shadow-black/20 hover:bg-base-200"
                >
                  立即加入
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <Section title="常見問題" eyebrow="FAQ" center width="default">
          <div className="mx-auto max-w-3xl join join-vertical w-full">
            <div className="collapse collapse-arrow join-item rounded-xl border border-base-300/70 bg-base-100 mb-3">
              <input type="radio" name="faqAccordion" defaultChecked />
              <h3 className="collapse-title text-base sm:text-lg font-semibold text-base-content m-0">
                智慧商務系與一般商管系的差異是什麼？
              </h3>
              <div className="collapse-content">
                <p className="text-sm leading-relaxed text-base-content/70">
                  智慧商務系更注重數位科技與商業的結合，課程涵蓋電子商務、數位行銷、商業智慧分析等新興領域。
                  相較於傳統商管系，智慧商務系學生更具備數位時代所需的技術能力與創新思維。
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow join-item rounded-xl border border-base-300/70 bg-base-100 mb-3">
              <input type="radio" name="faqAccordion" />
              <h3 className="collapse-title text-base sm:text-lg font-semibold text-base-content m-0">
                智慧商務系畢業生主要從事哪些工作？
              </h3>
              <div className="collapse-content">
                <p className="text-sm leading-relaxed text-base-content/70">
                  智慧商務系畢業生可從事電商經理、數位行銷專員、商業分析師、產品經理、創業家等職務。
                  隨著企業數位轉型需求增加，智慧商務系專業人才在各行各業都有很好的發展機會。
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow join-item rounded-xl border border-base-300/70 bg-base-100">
              <input type="radio" name="faqAccordion" />
              <h3 className="collapse-title text-base sm:text-lg font-semibold text-base-content m-0">
                如何加入國立高雄科技大學智慧商務系系友會？
              </h3>
              <div className="collapse-content">
                <p className="text-sm leading-relaxed text-base-content/70">
                  歡迎智慧商務系在校生、畢業系友及相關產業人士加入我們的系友會。
                  您可以透過線上申請表單加入，或是聯繫系友會幹部了解更多詳情。
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Call to Action Section */}
        <section className="px-4 sm:px-6 pb-16">
          <div className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] px-6 sm:px-10 py-12 sm:py-16 text-center text-white shadow-xl">
              <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />
              <div className="relative">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">準備加入智慧商務系的未來嗎？</h2>
                <p className="text-base sm:text-lg leading-relaxed text-white/80 mb-8 max-w-2xl mx-auto">
                  探索更多關於國立高雄科技大學智慧商務系的資訊，
                  或與我們的系友會聯繫，開啟您的數位商務職涯之路！
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
                  <Link to="/IC/contactUs" className="btn btn-lg rounded-xl border-0 bg-white text-primary hover:bg-base-200">
                    聯繫我們
                  </Link>
                  <Link to="/alumnilist" className="btn btn-lg rounded-xl border-white/40 bg-transparent text-white hover:bg-white hover:text-primary">
                    查看系友名單
                  </Link>
                  <Link to="/recruit" className="btn btn-lg rounded-xl border-0 bg-secondary text-white hover:brightness-110">
                    職涯機會
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SmartBusinessLanding;
