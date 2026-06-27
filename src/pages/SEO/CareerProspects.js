import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  BsBriefcase,
  BsPeople,
  BsCart,
  BsMegaphone,
  BsGraphUp,
  BsKanban,
  BsLightbulb,
  BsPersonGear,
  BsPeopleFill,
  BsBriefcaseFill,
  BsCalendarEventFill,
  BsSearch,
  BsTelephone,
  BsInfoCircle,
  BsPersonPlus
} from 'react-icons/bs';
import { Network } from 'lucide-react';
import { Section, Card, Badge } from 'components/common/ui';

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

      <div className="w-full bg-base-200/40">
        {/* Hero Section */}
        <section className="relative overflow-hidden text-white">
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1e3a8a 100%)' }}
          />
          {/* 裝飾光暈 */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
                Career Prospects
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                智慧商務系就業前景
                <br />
                <span className="text-secondary">開啟無限職涯可能</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-white/80">
                智慧商務系培育的專業人才在數位經濟時代備受市場青睞。
                優異的就業率、競爭力十足的薪資水準，以及豐富的職涯發展機會，
                讓智商系畢業生在各行各業都能發光發熱。
              </p>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur-sm">
                  <div className="font-serif text-3xl font-bold text-secondary">98%</div>
                  <div className="mt-1 text-sm font-medium text-white/80">智慧商務系就業率</div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur-sm">
                  <div className="font-serif text-3xl font-bold text-secondary">45K+</div>
                  <div className="mt-1 text-sm font-medium text-white/80">平均起薪</div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur-sm">
                  <div className="font-serif text-3xl font-bold text-secondary">25%</div>
                  <div className="mt-1 text-sm font-medium text-white/80">創業比例</div>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/recruit"
                  className="btn btn-lg gap-2 border-none bg-secondary text-white hover:brightness-110"
                >
                  <BsBriefcase />
                  查看職缺
                </Link>
                <Link
                  to="/IC/joinUs"
                  className="btn btn-lg gap-2 border-white/40 bg-transparent text-white hover:bg-white/10"
                >
                  <BsPeople />
                  加入系友會
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 就業統計 Section */}
        <Section
          title="智慧商務系就業成果"
          subtitle="數據說話：智商系畢業生的優異就業表現"
          center
          width="wide"
          className="bg-base-100"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {[
              { value: '98%', label: '整體就業率', desc: '智慧商務系畢業生六個月內成功就業比例', accent: 'primary' },
              { value: '45K', label: '平均起薪', desc: '智慧商務系新鮮人平均月薪（台幣）', accent: 'success' },
              { value: '85%', label: '專業對口率', desc: '智商系畢業生從事相關專業工作比例', accent: 'warning' },
              { value: '60K', label: '三年後薪資', desc: '智慧商務系畢業生三年後平均月薪', accent: 'info' },
            ].map((s) => (
              <Card key={s.label} hover padding="lg" className="text-center">
                <div
                  className={[
                    'mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full font-serif text-xl font-bold text-white',
                    s.accent === 'primary' ? 'bg-primary' : '',
                    s.accent === 'success' ? 'bg-success' : '',
                    s.accent === 'warning' ? 'bg-warning' : '',
                    s.accent === 'info' ? 'bg-info' : '',
                  ].join(' ')}
                >
                  {s.value}
                </div>
                <h5 className="mb-2 font-semibold text-base-content">{s.label}</h5>
                <p className="text-sm text-base-content/60">{s.desc}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="none" className="overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <h4 className="font-serif text-lg font-semibold text-white">薪資成長趨勢</h4>
              </div>
              <div className="p-6 space-y-5">
                {[
                  { label: '新鮮人（0-1年）', value: '35-50K', width: '60%', color: 'bg-primary' },
                  { label: '資深專員（2-3年）', value: '45-70K', width: '75%', color: 'bg-success' },
                  { label: '主管職（5年以上）', value: '70-120K', width: '90%', color: 'bg-warning' },
                  { label: '高階主管/創業', value: '100K+', width: '100%', color: 'bg-error' },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-base-content/80">{row.label}</span>
                      <span className="font-bold text-base-content">{row.value}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-base-300">
                      <div className={`h-full rounded-full ${row.color}`} style={{ width: row.width }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card padding="none" className="overflow-hidden">
              <div className="bg-success px-6 py-4">
                <h4 className="font-serif text-lg font-semibold text-white">行業分布比例</h4>
              </div>
              <div className="p-6 space-y-5">
                {[
                  { label: '科技業', value: '35%', width: '35%', color: 'bg-primary' },
                  { label: '電商零售業', value: '25%', width: '25%', color: 'bg-success' },
                  { label: '金融服務業', value: '15%', width: '15%', color: 'bg-warning' },
                  { label: '創業', value: '15%', width: '15%', color: 'bg-info' },
                  { label: '其他行業', value: '10%', width: '10%', color: 'bg-secondary' },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-base-content/80">{row.label}</span>
                      <span className="font-bold text-base-content">{row.value}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-base-300">
                      <div className={`h-full rounded-full ${row.color}`} style={{ width: row.width }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Section>

        {/* 熱門職業 Section */}
        <Section
          title="智慧商務系熱門職業"
          subtitle="智商系畢業生的多元職涯選擇"
          center
          width="wide"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BsCart, color: 'bg-primary', text: 'text-primary', name: '電商經理', salary: '平均薪資：50-80K', desc: '負責電商平台營運、商品管理、銷售策略規劃等工作。智慧商務系學生在此領域具有強大競爭優勢。', skills: ['電商營運', '數據分析', '專案管理'], fit: 90, bar: 'bg-primary' },
              { icon: BsMegaphone, color: 'bg-success', text: 'text-success', name: '數位行銷專員', salary: '平均薪資：40-65K', desc: '執行數位行銷策略、管理社群媒體、分析行銷成效。智慧商務系課程完美對應此職位需求。', skills: ['SEO/SEM', '社群經營', '內容行銷'], fit: 95, bar: 'bg-success' },
              { icon: BsGraphUp, color: 'bg-warning', text: 'text-warning', name: '商業分析師', salary: '平均薪資：55-85K', desc: '運用數據分析技術協助企業決策，發掘商業機會。智慧商務系的數據分析訓練在此展現價值。', skills: ['數據分析', '統計分析', '商業洞察'], fit: 85, bar: 'bg-warning' },
              { icon: BsKanban, color: 'bg-info', text: 'text-info', name: '產品經理', salary: '平均薪資：60-100K', desc: '負責產品策略規劃、市場分析、跨部門協作。智慧商務系培養的綜合能力在此發揮關鍵作用。', skills: ['產品策略', '市場分析', '專案管理'], fit: 80, bar: 'bg-info' },
              { icon: BsLightbulb, color: 'bg-error', text: 'text-error', name: '創業家', salary: '收入：依事業規模', desc: '創立自己的事業，在電商、科技服務等領域發揮所長。智慧商務系提供完整的創業知識與技能。', skills: ['商業企劃', '領導管理', '市場開發'], fit: 75, bar: 'bg-error' },
              { icon: BsPersonGear, color: 'bg-secondary', text: 'text-secondary', name: '管理顧問', salary: '平均薪資：65-120K', desc: '協助企業解決經營問題、數位轉型諮詢。智慧商務系的理論基礎與實務經驗兼備優勢明顯。', skills: ['策略分析', '流程改善', '簡報溝通'], fit: 70, bar: 'bg-secondary' },
            ].map((job) => {
              const Icon = job.icon;
              return (
                <Card key={job.name} hover padding="lg" className="flex h-full flex-col">
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${job.color}`}>
                      <Icon className="text-xl text-white" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-semibold text-base-content">{job.name}</h5>
                      <small className="text-base-content/60">{job.salary}</small>
                    </div>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-base-content/70">{job.desc}</p>
                  <div className="mb-4">
                    <h6 className={`mb-2 text-sm font-semibold ${job.text}`}>核心技能需求：</h6>
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.map((sk) => (
                        <Badge key={sk} variant="neutral">{sk}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-base-300">
                      <div className={`h-full rounded-full ${job.bar}`} style={{ width: `${job.fit}%` }} />
                    </div>
                    <small className="text-base-content/60">智商系適配度：{job.fit}%</small>
                  </div>
                </Card>
              );
            })}
          </div>
        </Section>

        {/* 職涯發展路徑 Section */}
        <Section
          title="智慧商務系職涯發展路徑"
          subtitle="從新鮮人到企業領導者的完整發展藍圖"
          center
          width="wide"
          className="bg-base-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                header: '技術專業路線',
                headerBg: 'bg-primary',
                steps: [
                  { n: 1, dot: 'bg-primary', text: 'text-primary', title: '專員/助理（0-2年）', body: '電商專員、數位行銷助理、數據分析專員', salary: '35-50K' },
                  { n: 2, dot: 'bg-success', text: 'text-success', title: '資深專員（3-5年）', body: '資深電商經理、數位行銷專家、商業分析師', salary: '50-80K' },
                  { n: 3, dot: 'bg-warning', text: 'text-warning', title: '技術專家（5年以上）', body: '首席分析師、技術總監、產品架構師', salary: '80-150K' },
                ],
              },
              {
                header: '管理領導路線',
                headerBg: 'bg-success',
                steps: [
                  { n: 1, dot: 'bg-primary', text: 'text-primary', title: '基層主管（3-5年）', body: '小組長、專案經理、部門副理', salary: '55-75K' },
                  { n: 2, dot: 'bg-success', text: 'text-success', title: '中階主管（5-8年）', body: '部門經理、營運總監、產品總監', salary: '80-120K' },
                  { n: 3, dot: 'bg-warning', text: 'text-warning', title: '高階主管（8年以上）', body: 'VP、CTO、CEO、創業家', salary: '120K+' },
                ],
              },
            ].map((path) => (
              <Card key={path.header} padding="none" className="overflow-hidden">
                <div className={`${path.headerBg} px-6 py-4`}>
                  <h4 className="font-serif text-lg font-semibold text-white">{path.header}</h4>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {path.steps.map((step) => (
                      <div key={step.n} className="flex gap-4">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${step.dot}`}>
                          <span className="font-bold text-white">{step.n}</span>
                        </div>
                        <div>
                          <h5 className={`font-semibold ${step.text}`}>{step.title}</h5>
                          <p className="mt-1 text-sm text-base-content/70">
                            {step.body}
                            <br />
                            <strong>薪資範圍：</strong>{step.salary}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* 系友成功案例 Section */}
        <Section
          title="智慧商務系友成功故事"
          subtitle="真實案例分享，證明智商系教育的成功"
          center
          width="wide"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { ring: 'bg-primary', text: 'text-primary', name: '陳○○ 學長', cls: '智慧商務系第三屆畢業生', role: '電商平台創業家', story: '畢業三年後創立電商平台，年營收突破億元。智慧商務系的扎實訓練讓我在創業路上更有信心。', now: '某電商平台執行長' },
              { ring: 'bg-success', text: 'text-success', name: '林○○ 學姊', cls: '智慧商務系第五屆畢業生', role: '科技業產品總監', story: '從數位行銷專員做起，五年內晉升為產品總監。智商系的課程讓我具備全方位的商業思維。', now: '知名科技公司產品總監' },
              { ring: 'bg-warning', text: 'text-warning', name: '王○○ 學長', cls: '智慧商務系第二屆畢業生', role: '數據分析專家', story: '現為某金融集團首席數據科學家，年薪超過200萬。智慧商務系的數據分析課程奠定了基礎。', now: '金融集團首席數據科學家' },
            ].map((p) => (
              <Card key={p.name} hover padding="lg" className="text-center">
                <div className={`mx-auto mb-4 h-20 w-20 rounded-full ${p.ring}`} />
                <h5 className="font-semibold text-base-content">{p.name}</h5>
                <p className="mb-3 text-sm text-base-content/60">{p.cls}</p>
                <h6 className={`mb-2 font-semibold ${p.text}`}>{p.role}</h6>
                <p className="mb-4 text-sm leading-relaxed text-base-content/70">{p.story}</p>
                <div className="rounded-xl bg-base-200 p-3">
                  <small className="text-base-content/80"><strong>現職：</strong>{p.now}</small>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* 就業資源與支援 Section */}
        <section className="relative overflow-hidden text-white">
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)' }}
          />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">智慧商務系就業支援</h2>
              <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-secondary" />
              <p className="mx-auto mt-4 max-w-2xl text-white/80">
                完整的職涯發展資源，助力學生成功就業
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { Icon: BsPeopleFill, title: '就業輔導', desc: '專業職涯諮詢師提供一對一就業指導' },
                { Icon: BsBriefcaseFill, title: '企業實習', desc: '與150+企業合作提供實習機會' },
                { Icon: BsCalendarEventFill, title: '就業博覽會', desc: '定期舉辦企業徵才說明會' },
              ].map((item) => {
                const Icon = item.Icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                    <Icon className="mx-auto mb-3 text-4xl text-secondary" />
                    <h5 className="font-semibold">{item.title}</h5>
                    <p className="mt-1 text-sm text-white/70">{item.desc}</p>
                  </div>
                );
              })}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                <Network className="mx-auto mb-3 text-secondary" size={40} />
                <h5 className="font-semibold">系友網絡</h5>
                <p className="mt-1 text-sm text-white/70">強大的系友人脈提供職涯發展機會</p>
              </div>
            </div>

            <div className="mt-14 text-center">
              <h3 className="mb-6 font-serif text-xl sm:text-2xl font-bold">立即開啟您的智慧商務職涯</h3>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  to="/recruit"
                  className="btn btn-lg gap-2 border-none bg-secondary text-white hover:brightness-110"
                >
                  <BsSearch />
                  瀏覽職缺
                </Link>
                <Link
                  to="/IC/joinUs"
                  className="btn btn-lg gap-2 border-white/40 bg-transparent text-white hover:bg-white/10"
                >
                  <BsPeople />
                  加入系友會
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <Section width="default" center className="bg-base-100">
          <div className="text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-base-content">
              準備開始您的智慧商務職涯嗎？
            </h2>
            <p className="mx-auto mt-4 mb-10 max-w-2xl text-base-content/60">
              了解更多就業資訊，或聯繫我們獲得職涯諮詢
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <Link to="/recruit" className="btn btn-primary btn-lg w-full gap-2">
                <BsBriefcase />
                查看職缺
              </Link>
              <Link to="/IC/contactUs" className="btn btn-primary btn-lg w-full gap-2">
                <BsTelephone />
                職涯諮詢
              </Link>
              <Link to="/alumnilist" className="btn btn-lg w-full gap-2 border-none bg-secondary text-white hover:brightness-110">
                <BsPeople />
                系友網絡
              </Link>
              <Link to="/IC/intro" className="btn btn-info btn-lg w-full gap-2">
                <BsInfoCircle />
                系所介紹
              </Link>
              <Link to="/IC/joinUs" className="btn btn-outline btn-primary btn-lg w-full gap-2">
                <BsPersonPlus />
                加入我們
              </Link>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
};

export default CareerProspects;
