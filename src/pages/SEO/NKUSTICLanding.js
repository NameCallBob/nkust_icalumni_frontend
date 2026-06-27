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
import { Section, Card } from 'components/common/ui';

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

      <div className="w-full bg-base-100">
        {/* Hero Section with NKUST Branding */}
        <section className="relative overflow-hidden bg-[#0f172a]">
          {/* 背景裝飾 */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a]" />
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#1e3a8a]/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#a0781c]/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
            <div className="max-w-3xl text-white">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium tracking-wide text-white/90 backdrop-blur">
                National Kaohsiung University of Science and Technology
              </span>
              <h1 className="mt-6 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                NKUST智慧商務系
                <span className="mt-3 block text-[#d4a83c]">引領數位商務革命</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-white/80 max-w-2xl">
                國立高雄科技大學智慧商務系（NKUST智慧商務系）是台灣南部培育智慧商務人才的領航者。
                我們結合扎實的商業理論與前瞻的科技應用，培養具備國際競爭力的數位商務專業人才，
                為學生在全球化的數位經濟中創造無限可能。
              </p>
              <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
                <Link
                  to="/IC/joinUs"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#a0781c] px-6 py-3 font-semibold text-white shadow-lg shadow-[#a0781c]/30 transition hover:bg-[#b88a26] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a83c]"
                >
                  <BsStarFill aria-hidden="true" />
                  加入NKUST智慧商務系友會
                </Link>
                <Link
                  to="/IC/intro"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <BsArrowRightCircle aria-hidden="true" />
                  探索NKUST智慧商務系
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/75">
                <div className="flex items-center gap-2">
                  <BsAward className="text-[#d4a83c]" aria-hidden="true" />
                  <span>教育部認證優質科系</span>
                </div>
                <div className="flex items-center gap-2">
                  <BsGlobe className="text-[#d4a83c]" aria-hidden="true" />
                  <span>國際產學合作</span>
                </div>
                <div className="flex items-center gap-2">
                  <BsPeople className="text-[#d4a83c]" aria-hidden="true" />
                  <span>500+ 活躍系友</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NKUST智慧商務系介紹 Section */}
        <Section width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div>
              <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-secondary uppercase">About</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-base-content">
                關於NKUST智慧商務系
              </h2>
              <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-secondary to-primary" />
              <p className="mt-6 text-base sm:text-lg text-base-content/70 leading-relaxed">
                國立高雄科技大學智慧商務系（NKUST智慧商務系）成立於數位轉型的關鍵時刻，
                致力於培育具備創新思維與實務能力的智慧商務專業人才。
              </p>
              <p className="mt-4 text-base-content/70 leading-relaxed">
                NKUST智慧商務系結合了國立高雄科技大學的深厚學術基礎與產業資源，
                提供學生最完整的智慧商務教育體驗。我們的課程涵蓋電子商務、數位行銷、
                商業智慧分析、創新創業等領域，讓學生具備迎接數位經濟挑戰的核心能力。
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { value: '15+', label: '年辦學經驗' },
                  { value: '98%', label: 'NKUST智慧商務系就業率' },
                  { value: '100+', label: '合作企業夥伴' },
                  { value: '30+', label: '專業教師團隊' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-base-300/70 bg-base-100 p-5 text-center shadow-sm"
                  >
                    <div className="font-serif text-3xl font-bold text-primary">{s.value}</div>
                    <div className="mt-1 text-sm text-base-content/60">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <Card padding="lg" className="lg:mt-2">
              <h3 className="font-serif text-xl font-bold text-primary">NKUST智慧商務系優勢</h3>
              <div className="mt-6 space-y-5">
                {[
                  { Icon: BsMortarboard, title: '頂尖教育品質', desc: 'NKUST提供世界級的教育資源與學術環境' },
                  { Icon: BsBuilding, title: '強大產學連結', desc: '與國內外知名企業建立緊密合作關係' },
                  { Icon: BsGlobe, title: '國際化視野', desc: '培養具備全球競爭力的國際化人才' },
                  { Icon: BsLightbulb, title: '創新創業育成', desc: '提供完整的創業輔導與資源支持' },
                ].map(({ Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="text-lg" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base-content">{title}</h4>
                      <p className="mt-1 text-sm text-base-content/60">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Section>

        {/* NKUST智慧商務系專業課程 Section */}
        <div className="bg-base-200">
          <Section
            width="wide"
            center
            eyebrow="Curriculum"
            title="NKUST智慧商務系專業課程"
            subtitle="完整的課程體系，培養學生具備智慧商務領域的專業競爭力"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                {
                  Icon: BsLaptop,
                  title: '核心基礎課程',
                  items: [
                    { name: '智慧商務概論', desc: '建立NKUST智慧商務系學生的專業基礎' },
                    { name: '電子商務系統設計', desc: '掌握電商平台架構與開發技能' },
                    { name: '商業數據分析', desc: '運用數據科學技術進行商業決策' },
                    { name: '數位行銷策略', desc: '學習現代數位行銷的核心技能' },
                  ],
                },
                {
                  Icon: BsRocket,
                  title: '進階專業課程',
                  items: [
                    { name: '人工智慧商業應用', desc: 'AI技術在商務領域的實際應用' },
                    { name: '區塊鏈與金融科技', desc: '探索新興金融科技的商業模式' },
                    { name: '跨境電商實務', desc: '國際市場拓展與營運策略' },
                    { name: '創業與創新管理', desc: '培養NKUST智慧商務系學生創業精神' },
                  ],
                },
                {
                  Icon: BsBriefcase,
                  title: '實務實習課程',
                  items: [
                    { name: '企業實習專案', desc: '與合作企業進行實際案例操作' },
                    { name: '電商平台實作', desc: '親手建置完整的電商營運系統' },
                    { name: '數位行銷企劃', desc: '實際執行數位行銷專案' },
                    { name: '畢業專題製作', desc: '整合四年所學的最終成果展現' },
                  ],
                },
                {
                  Icon: BsGlobe,
                  title: '國際交流課程',
                  items: [
                    { name: '國際商務英語', desc: '提升NKUST智慧商務系學生國際溝通能力' },
                    { name: '海外實習計畫', desc: '赴海外企業進行專業實習' },
                    { name: '國際學術交流', desc: '與國外大學進行學術合作' },
                    { name: '全球市場分析', desc: '深入了解國際商務環境與趨勢' },
                  ],
                },
              ].map(({ Icon, title, items }) => (
                <Card key={title} hover padding="none" className="overflow-hidden">
                  <div className="flex items-center gap-3 bg-primary px-6 py-4 text-primary-content">
                    <Icon className="text-xl" aria-hidden="true" />
                    <h3 className="font-serif text-lg font-bold">{title}</h3>
                  </div>
                  <ul className="divide-y divide-base-300/60 px-6 py-2">
                    {items.map((it) => (
                      <li key={it.name} className="py-3">
                        <strong className="text-base-content">{it.name}</strong>
                        <p className="mt-0.5 text-sm text-base-content/60">{it.desc}</p>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </Section>
        </div>

        {/* NKUST智慧商務系就業成果 Section */}
        <Section
          width="wide"
          center
          eyebrow="Outcomes"
          title="NKUST智慧商務系就業成果"
          subtitle="優秀的就業表現，證明NKUST智慧商務系教育品質的卓越"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '98%', title: '整體就業率', desc: 'NKUST智慧商務系畢業生六個月內就業率' },
              { value: '45K', title: '平均起薪', desc: 'NKUST智慧商務系新鮮人平均月薪' },
              { value: '150+', title: '合作企業', desc: '提供NKUST智慧商務系實習與就業機會' },
              { value: '25%', title: '創業比例', desc: 'NKUST智慧商務系系友自主創業比例' },
            ].map((s) => (
              <div key={s.title} className="text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#0f172a] shadow-lg shadow-primary/20">
                  <span className="font-serif text-2xl font-bold text-white">{s.value}</span>
                </div>
                <h3 className="mt-4 font-semibold text-base-content">{s.title}</h3>
                <p className="mt-1 text-sm text-base-content/60">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                Icon: BsBuildings,
                title: '科技業領域',
                desc: 'NKUST智慧商務系畢業生在科技公司擔任產品經理、數據分析師、電商營運專員等關鍵職位，發展前景優異。',
              },
              {
                Icon: BsShop,
                title: '電商零售業',
                desc: '在電商平台、零售企業從事營運管理、數位行銷、供應鏈管理等工作，是NKUST智慧商務系的熱門就業領域。',
              },
              {
                Icon: BsLightbulb,
                title: '創業創新',
                desc: '許多NKUST智慧商務系系友成功創立自己的事業，在電商、科技服務、數位行銷等領域展現創業精神。',
              },
            ].map(({ Icon, title, desc }) => (
              <Card key={title} hover className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                  <Icon className="text-2xl" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold text-base-content">{title}</h3>
                <p className="mt-2 text-sm text-base-content/65 leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* NKUST智慧商務系友會 Section */}
        <section className="relative overflow-hidden bg-[#0f172a] text-white">
          <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-[#1e3a8a]/40 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-2">
                <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-[#d4a83c] uppercase">Alumni Network</p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold">NKUST智慧商務系友會</h2>
                <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-[#a0781c] to-[#1e3a8a]" />
                <p className="mt-6 text-base sm:text-lg text-white/80 leading-relaxed">
                  國立高雄科技大學智慧商務系系友會是連結所有NKUST智慧商務系學生與系友的重要平台。
                  我們致力於促進系友間的交流合作，提供職涯發展資源，並支持母系的持續發展。
                </p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { Icon: BsPeopleFill, title: '強大系友網絡', desc: 'NKUST智慧商務系友遍布各行各業，提供豐富的人脈資源' },
                    { Icon: BsBriefcaseFill, title: '職涯發展支援', desc: '提供就業機會、職涯諮詢與專業成長資源' },
                    { Icon: BsLightbulbFill, title: '創業資源媒合', desc: '協助NKUST智慧商務系友創業，提供資金與技術支援' },
                    { Icon: BsCalendarEventFill, title: '定期交流活動', desc: '舉辦產業講座、聚會活動促進系友交流' },
                  ].map(({ Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#d4a83c]">
                        <Icon className="text-lg" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{title}</h3>
                        <p className="mt-1 text-sm text-white/70 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/5 p-8 text-center backdrop-blur">
                <h3 className="font-serif text-2xl font-bold text-[#d4a83c]">立即加入我們</h3>
                <p className="mt-3 text-white/80">
                  成為NKUST智慧商務系友會的一員，與優秀系友共同成長！
                </p>
                <Link
                  to="/IC/joinUs"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#a0781c] px-6 py-3 font-semibold text-white shadow-lg shadow-[#a0781c]/30 transition hover:bg-[#b88a26] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a83c]"
                >
                  加入系友會
                </Link>
                <Link
                  to="/IC/contactUs"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  聯繫我們
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 聯繫與更多資訊 Section */}
        <div className="bg-base-200">
          <Section
            width="wide"
            center
            eyebrow="Resources"
            title="探索更多NKUST智慧商務系資源"
            subtitle="了解更多關於國立高雄科技大學智慧商務系的詳細資訊，或與我們聯繫獲得專業諮詢"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { to: '/IC/intro', Icon: BsInfoCircle, label: '系所介紹' },
                { to: '/alumnilist', Icon: BsPeople, label: '系友名單' },
                { to: '/recruit', Icon: BsBriefcase, label: '職涯機會' },
                { to: '/IC/contactUs', Icon: BsEnvelope, label: '聯繫我們' },
                { to: '/IC/structure', Icon: BsDiagram3, label: '組織架構' },
              ].map(({ to, Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-base-300/70 bg-base-100 px-4 py-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-content">
                    <Icon className="text-xl" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-base-content">{label}</span>
                </Link>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </>
  );
};

export default NKUSTICLanding;
