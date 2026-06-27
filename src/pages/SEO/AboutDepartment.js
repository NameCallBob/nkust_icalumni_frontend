import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  BsBullseye, BsLightbulb, BsGem, BsLaptop, BsGear, BsGlobe,
  BsCheckCircleFill, BsBriefcaseFill, BsPcDisplay, BsGraphUp,
  BsPeople, BsBook, BsCart, BsMegaphone, BsBank, BsAward,
  BsTrophy, BsPatchCheck, BsPersonPlus, BsEnvelope, BsDiagram3,
  BsBriefcase
} from 'react-icons/bs';
import { Section, Card, Badge } from 'components/common/ui';

// 靜態色彩對照（避免 Tailwind 動態字串無法被掃描編譯）
const TONE = {
  primary: { soft: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30', hoverBg: 'group-hover:bg-primary' },
  success: { soft: 'bg-success/10', text: 'text-success', border: 'border-success/30', hoverBg: 'group-hover:bg-success' },
  secondary: { soft: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/30', hoverBg: 'group-hover:bg-secondary' },
  info: { soft: 'bg-info/10', text: 'text-info', border: 'border-info/30', hoverBg: 'group-hover:bg-info' },
};

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

      <div className="bg-base-200/40">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#15244d] to-[#1e3a8a] text-white">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-28 text-center">
            <p className="mb-4 text-xs sm:text-sm font-semibold tracking-[0.3em] text-secondary uppercase">
              National Kaohsiung University of Science and Technology
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              國立高雄科技大學
              <br />
              <span className="text-secondary">智慧商務系介紹</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/80">
              深入了解智慧商務系的教育理念、課程特色、師資陣容與發展願景。
              我們致力於培育具備創新思維與實務能力的數位商務專業人才，
              為學生在數位經濟時代創造競爭優勢。
            </p>
            <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/IC/joinUs"
                className="inline-flex items-center justify-center rounded-xl bg-secondary px-7 py-3 font-semibold text-white shadow-lg shadow-secondary/20 transition hover:brightness-110"
              >
                加入我們
              </Link>
              <Link
                to="/IC/contactUs"
                className="inline-flex items-center justify-center rounded-xl border border-white/40 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                聯繫諮詢
              </Link>
            </div>
          </div>
        </section>

        {/* 系所簡介 Section */}
        <Section width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-secondary uppercase">Our Story</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-base-content">系所發展沿革</h2>
              <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-secondary to-primary" />
              <p className="mt-6 text-lg text-base-content/70">
                國立高雄科技大學智慧商務系成立於數位轉型的關鍵時刻，
                順應產業發展趨勢與人才需求而設立。
              </p>
              <p className="mt-4 text-base-content/70 leading-relaxed">
                智慧商務系的設立旨在培育具備智慧商務專業知識與實務技能的人才，
                結合商業管理理論與資訊科技應用，讓學生具備迎接數位經濟挑戰的能力。
                自成立以來，智慧商務系始終秉持「理論與實務並重、創新與傳承兼顧」的教育理念，
                持續精進課程內容與教學方法。
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { num: '2008', label: '智慧商務系成立年份' },
                  { num: '1000+', label: '累計培育學生數' },
                  { num: '30+', label: '專業師資人數' },
                  { num: '150+', label: '產學合作企業' },
                ].map((s) => (
                  <Card key={s.label} padding="md" className="text-center">
                    <div className="font-serif text-3xl font-bold text-primary">{s.num}</div>
                    <div className="mt-1 text-sm text-base-content/60">{s.label}</div>
                  </Card>
                ))}
              </div>
            </div>

            <Card padding="lg" className="bg-base-100">
              <h3 className="font-serif text-2xl font-bold text-primary">智慧商務系核心理念</h3>
              <div className="mt-6 space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BsBullseye className="text-xl" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-base-content">教育目標</h5>
                    <p className="mt-1 text-sm text-base-content/60 leading-relaxed">
                      培育具備智慧商務專業知識、創新思維與實務能力的人才，
                      使其能在數位經濟時代發揮所長，成為產業發展的重要推手。
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <BsLightbulb className="text-xl" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-base-content">發展願景</h5>
                    <p className="mt-1 text-sm text-base-content/60 leading-relaxed">
                      成為南台灣培育智慧商務人才的領導系所，
                      建立產學合作典範，提升台灣在全球數位經濟的競爭力。
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-info/10 text-info">
                    <BsGem className="text-xl" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-base-content">核心價值</h5>
                    <p className="mt-1 text-sm text-base-content/60 leading-relaxed">
                      創新、務實、卓越、服務 -
                      以創新精神追求卓越，以務實態度服務社會。
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        {/* 課程特色 Section */}
        <Section title="智慧商務系課程特色" subtitle="完整的課程體系，理論與實務並重的教學設計" eyebrow="Curriculum" center width="wide" className="bg-base-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {[
              { Icon: BsLaptop, tone: 'primary', title: '基礎扎實', desc: '智慧商務系課程從基礎商業概念出發，逐步建立學生的專業知識體系，確保每位學生都能具備紮實的理論基礎。' },
              { Icon: BsGear, tone: 'success', title: '實務導向', desc: '強調實務操作與案例分析，讓智慧商務系學生在學習過程中就能接觸真實的商業環境與挑戰。' },
              { Icon: BsGlobe, tone: 'secondary', title: '國際視野', desc: '智慧商務系課程融入國際商務元素，培養學生具備全球化思維與跨文化溝通能力。' },
            ].map(({ Icon, tone, title, desc }) => (
              <Card key={title} hover padding="lg" className="text-center">
                <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl ${TONE[tone].soft} ${TONE[tone].text}`}>
                  <Icon className="text-3xl" />
                </div>
                <h4 className="font-serif text-xl font-bold text-base-content">{title}</h4>
                <p className="mt-3 text-base-content/60 leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="none" className="overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <h4 className="font-serif text-lg font-bold text-white">專業必修課程</h4>
              </div>
              <ul className="divide-y divide-base-200 px-6">
                {['智慧商務概論', '電子商務系統設計', '數位行銷策略', '商業智慧與數據分析', '供應鏈管理'].map((c) => (
                  <li key={c} className="flex items-center justify-between py-3 text-base-content/80">
                    {c}
                    <Badge variant="primary">必修</Badge>
                  </li>
                ))}
              </ul>
            </Card>

            <Card padding="none" className="overflow-hidden">
              <div className="bg-success px-6 py-4">
                <h4 className="font-serif text-lg font-bold text-white">專業選修課程</h4>
              </div>
              <ul className="divide-y divide-base-200 px-6">
                {['人工智慧商業應用', '區塊鏈與金融科技', '跨境電商實務', '創業與創新管理', '社群媒體行銷'].map((c) => (
                  <li key={c} className="flex items-center justify-between py-3 text-base-content/80">
                    {c}
                    <Badge variant="success">選修</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Section>

        {/* 師資陣容 Section */}
        <Section title="智慧商務系師資陣容" subtitle="優秀的師資團隊，結合學術專精與實務經驗" eyebrow="Faculty" center width="wide">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {[
              { num: '30+', tone: 'primary', title: '專任教師', desc: '智慧商務系擁有豐富的專任師資陣容' },
              { num: '85%', tone: 'success', title: '博士學位', desc: '智慧商務系教師具博士學位比例' },
              { num: '20+', tone: 'secondary', title: '業界經驗', desc: '智慧商務系教師平均業界經驗年數' },
            ].map(({ num, tone, title, desc }) => (
              <Card key={title} padding="lg" className="text-center">
                <div className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full ${TONE[tone].soft}`}>
                  <span className={`font-serif text-2xl font-bold ${TONE[tone].text}`}>{num}</span>
                </div>
                <h4 className="font-serif text-xl font-bold text-base-content">{title}</h4>
                <p className="mt-2 text-base-content/60">{desc}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="lg">
              <h4 className="font-serif text-lg font-bold text-primary">學術專精領域</h4>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['電子商務', '數位行銷', '商業智慧', '資訊管理', '創新管理', '金融科技'].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-base-content/80">
                    <BsCheckCircleFill className="flex-none text-success" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card padding="lg">
              <h4 className="font-serif text-lg font-bold text-secondary">實務經驗背景</h4>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['科技業高階主管', '電商平台營運', '數位行銷顧問', '創業家', '管理顧問師', '金融業專家'].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-base-content/80">
                    <BsBriefcaseFill className="flex-none text-secondary" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Section>

        {/* 學習環境與設施 Section */}
        <Section title="智慧商務系學習環境" subtitle="現代化的教學設施，營造優質的學習環境" eyebrow="Campus" center width="wide" className="bg-base-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { Icon: BsPcDisplay, tone: 'primary', title: '智慧商務實驗室', desc: '配備最新電腦設備與商務軟體，讓智慧商務系學生進行實務操作' },
              { Icon: BsGraphUp, tone: 'success', title: '數據分析中心', desc: '提供大數據分析工具與平台，培養學生數據科學能力' },
              { Icon: BsPeople, tone: 'secondary', title: '創新討論空間', desc: '開放式討論空間，促進智慧商務系師生交流與創意發想' },
              { Icon: BsBook, tone: 'info', title: '專業圖書資源', desc: '豐富的智慧商務相關書籍與電子資源供學生參考' },
            ].map(({ Icon, tone, title, desc }) => (
              <Card key={title} hover padding="lg" className="text-center">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${TONE[tone].soft} ${TONE[tone].text}`}>
                  <Icon className="text-2xl" />
                </div>
                <h5 className="font-semibold text-base-content">{title}</h5>
                <p className="mt-2 text-sm text-base-content/60 leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* 產學合作 Section */}
        <Section title="智慧商務系產學合作" subtitle="與業界緊密合作，提供學生實習與就業機會" eyebrow="Partnership" center width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h3 className="font-serif text-2xl font-bold text-base-content">合作企業類型</h3>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { Icon: BsLaptop, tone: 'primary', title: '科技公司', desc: '軟體開發、系統整合' },
                  { Icon: BsCart, tone: 'success', title: '電商平台', desc: '線上零售、平台營運' },
                  { Icon: BsMegaphone, tone: 'secondary', title: '行銷公司', desc: '數位行銷、廣告代理' },
                  { Icon: BsBank, tone: 'info', title: '金融業', desc: '銀行、保險、投資' },
                ].map(({ Icon, tone, title, desc }) => (
                  <Card key={title} hover padding="md" className={`${TONE[tone].border} text-center`}>
                    <Icon className={`mx-auto mb-2 text-3xl ${TONE[tone].text}`} />
                    <h6 className="font-semibold text-base-content">{title}</h6>
                    <small className="text-base-content/60">{desc}</small>
                  </Card>
                ))}
              </div>
            </div>

            <Card padding="lg">
              <h3 className="font-serif text-2xl font-bold text-primary">產學合作成果</h3>
              <div className="mt-6 space-y-5">
                {[
                  { num: '150+', tone: 'primary', title: '合作企業', desc: '提供智慧商務系實習與就業機會' },
                  { num: '200+', tone: 'success', title: '實習名額', desc: '每年提供豐富實習機會' },
                  { num: '50+', tone: 'secondary', title: '專案合作', desc: '學生參與企業實際專案' },
                ].map(({ num, tone, title, desc }) => (
                  <div key={title} className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-full ${TONE[tone].soft}`}>
                      <span className={`text-sm font-bold ${TONE[tone].text}`}>{num}</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-base-content">{title}</h5>
                      <small className="text-base-content/60">{desc}</small>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Section>

        {/* 系所成就與認證 Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white">
          <div className="pointer-events-none absolute -top-20 left-1/3 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
            <div className="text-center">
              <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-secondary uppercase">Honors</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">智慧商務系榮譽與認證</h2>
              <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-secondary to-primary" />
              <p className="mt-4 text-white/80">專業認證與獲獎肯定，證明智慧商務系的教育品質</p>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { Icon: BsAward, title: '教育部認證', desc: '通過教育部品質認證' },
                { Icon: BsTrophy, title: '競賽獲獎', desc: '學生競賽表現優異' },
                { Icon: BsPatchCheck, title: '專業認證', desc: '課程符合產業需求' },
                { Icon: BsGlobe, title: '國際合作', desc: '與國外大學建立夥伴關係' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                  <Icon className="mx-auto mb-3 text-4xl text-secondary" />
                  <h5 className="font-semibold">{title}</h5>
                  <p className="mt-1 text-sm text-white/70">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <Section width="wide" className="bg-base-100">
          <div className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-base-content">加入智慧商務系大家庭</h2>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-secondary to-primary" />
            <p className="mt-4 text-lg text-base-content/60">了解更多智慧商務系資訊，或聯繫我們獲得詳細諮詢</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { to: '/IC/joinUs', Icon: BsPersonPlus, label: '加入系友會' },
              { to: '/IC/contactUs', Icon: BsEnvelope, label: '聯繫我們' },
              { to: '/alumnilist', Icon: BsPeople, label: '系友名單' },
              { to: '/recruit', Icon: BsBriefcase, label: '職涯機會' },
              { to: '/IC/structure', Icon: BsDiagram3, label: '組織架構' },
            ].map(({ to, Icon, label }) => (
              <Link
                key={to}
                to={to}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-base-300/70 bg-base-100 px-4 py-6 text-center font-semibold text-base-content shadow-sm transition hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <Icon className="text-xl" />
                </span>
                {label}
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
};

export default AboutDepartment;
