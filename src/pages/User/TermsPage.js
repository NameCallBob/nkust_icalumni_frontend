import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'css/user/terms.css'; // 自定義樣式表

const TermsAndConditionsPage = () => {
  // 用於追蹤目前的活動章節
  const [activeSection, setActiveSection] = useState('section1');
  // 用於追蹤視窗寬度，用於響應式設計
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  // 用於追蹤側邊欄是否顯示（僅用於行動裝置）
  const [showSidebar, setShowSidebar] = useState(false);

  // 章節數據
  const sections = [
    { id: 'section1', title: '一般規定', color: 'primary' },
    { id: 'section2', title: '帳號管理與內容發布', color: 'success' },
    { id: 'section3', title: '商業活動', color: 'info' },
    { id: 'section4', title: '法律權益', color: 'warning' },
    { id: 'section5', title: '管理與終止', color: 'danger' }
  ];

  // 跟蹤視窗大小變化
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 監聽滾動事件，更新活動章節
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // 找出當前滾動位置對應的章節
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          // 若滾動位置在當前章節範圍內，則設為活動章節
          if (scrollPosition >= offsetTop - 100 && scrollPosition < offsetTop + offsetHeight - 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // 處理章節點擊
  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 60,
        behavior: 'smooth'
      });
    }
    // 在移動端點擊導航後自動關閉側邊欄
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  // 返回頂部功能
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 切換側邊欄顯示（僅用於行動裝置）
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="terms-container">
      {/* 頂部標題 */}
      <div className="terms-header bg-light py-4 shadow-sm">
        <div className="container">
          <h1 className="text-center fw-bold">智慧商務系友會網站使用條款</h1>
          <p className="text-center text-muted mt-2">
            最後更新日期：2025年4月30日
          </p>
        </div>
      </div>
      
      {/* 移動設備上的導航切換按鈕 */}
      {isMobile && (
        <div className="container mt-3">
          <button
            className="btn btn-outline-primary w-100 d-flex justify-content-between align-items-center"
            onClick={toggleSidebar}
          >
            <span>章節導覽</span>
            <i className={`bi ${showSidebar ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
          </button>
        </div>
      )}

      <div className="container mt-4">
        <div className="row">
          {/* 側邊導航欄 */}
          <div className={`col-lg-3 terms-sidebar ${isMobile ? (showSidebar ? 'show-mobile' : 'hide-mobile') : ''}`}>
            <div className="sidebar-wrapper p-3 rounded shadow-sm bg-light">
              <h5 className="fw-bold mb-3">目錄</h5>
              <ul className="nav flex-column">
                {sections.map((section) => (
                  <li key={section.id} className="nav-item mb-2">
                    <a
                      className={`nav-link ${activeSection === section.id ? 'active bg-' + section.color + ' text-white' : 'text-dark'} rounded p-2`}
                      href={`#${section.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSectionClick(section.id);
                      }}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 主要內容區域 */}
          <div className="col-lg-9">
            <div className="terms-content bg-white p-4 rounded shadow-sm">
              {/* 一般規定 */}
              <section id="section1" className="mb-5">
                <div className="section-header bg-primary text-white p-3 rounded">
                  <h2 className="h4 mb-0 fw-bold">一般規定</h2>
                </div>
                <div className="section-body p-3">
                  <article className="mb-4">
                    <h3 className="h5 fw-bold">一、總則</h3>
                    <div className="pl-3 content-block">
                      <p>1.1 本使用條款（以下簡稱「本條款」）由智慧商務系友會（以下簡稱「本會」）制定，適用於智慧商務系友會網站（以下簡稱「本網站」）之所有使用者。</p>
                      <p>1.2 使用者於使用本網站前，應詳細閱讀本條款。一旦使用本網站，即視為使用者已閱讀、理解並同意遵守本條款的所有內容。</p>
                      <p>1.3 本會保留隨時修改本條款之權利，修改後的條款將公布於本網站上。使用者應定期查閱本條款，持續使用本網站將視為接受修改後之條款。</p>
                    </div>
                  </article>
                  
                  <article className="mb-4">
                    <h3 className="h5 fw-bold">十一、準據法與管轄法院</h3>
                    <div className="pl-3 content-block">
                      <p>11.1 本條款之解釋、效力、履行及其他相關事項，均適用中華民國法律。</p>
                      <p>11.2 因本條款所生之爭議，雙方同意以臺灣臺北地方法院為第一審管轄法院。</p>
                    </div>
                  </article>
                  
                  <article className="mb-4">
                    <h3 className="h5 fw-bold">十二、其他條款</h3>
                    <div className="pl-3 content-block">
                      <p>12.1 本條款構成使用者與本會之完整協議，並取代先前任何口頭或書面之協議。</p>
                      <p>12.2 本條款中任何條款如被認定為無效或無法執行，不影響其餘條款之效力。</p>
                      <p>12.3 本會未行使或執行本條款中之任何權利或規定，不構成對該權利或規定之放棄。</p>
                      <p>12.4 本條款若有未盡事宜，悉依中華民國相關法令及一般網路慣例辦理。</p>
                    </div>
                  </article>
                </div>
              </section>

              {/* 帳號管理與內容發布 */}
              <section id="section2" className="mb-5">
                <div className="section-header bg-success text-white p-3 rounded">
                  <h2 className="h4 mb-0 fw-bold">帳號管理與內容發布</h2>
                </div>
                <div className="section-body p-3">
                  <article className="mb-4">
                    <h3 className="h5 fw-bold">二、使用者資格與帳號管理</h3>
                    <div className="pl-3 content-block">
                      <p>2.1 本網站主要服務對象為本校智慧商務系所之畢業生、在校生、教職員及經本會邀請或核准之人士。</p>
                      <p>2.2 使用者需提供真實、準確、完整且最新的個人資料進行註冊。</p>
                      <p>2.3 使用者應妥善保管帳號及密碼，並對所有使用該帳號之活動負完全責任。如發現任何未經授權使用或安全漏洞，應立即通知本會。</p>
                      <p>2.4 本會有權依據《個人資料保護法》及相關法規，驗證使用者身分及資格。提供虛假資訊可能導致帳號被暫停或終止。</p>
                    </div>
                  </article>
                  
                  <article className="mb-4">
                    <h3 className="h5 fw-bold">三、內容發布與限制</h3>
                    <div className="pl-3 content-block">
                      <p>3.1 使用者於本網站發布之所有內容（包括但不限於文字、圖片、影片、連結等）應遵守中華民國法律法規及本條款規定。</p>
                      <p>3.2 使用者不得發布下列內容：</p>
                      <div className="bg-light p-3 rounded mb-3">
                        <ul className="mb-0">
                          <li>a) 違反中華民國法律法規之內容</li>
                          <li>b) 侵害他人智慧財產權、肖像權、隱私權等合法權益之內容</li>
                          <li>c) 含有歧視、誹謗、侮辱、威脅或騷擾性質之內容</li>
                          <li>d) 散布虛假或誤導性資訊之內容</li>
                          <li>e) 含有電腦病毒或其他可能危害本網站或其他使用者之惡意程式</li>
                          <li>f) 商業廣告或推銷內容（非經本會授權之企業招募或公司介紹除外）</li>
                          <li>g) 其他本會認為不適當之內容</li>
                        </ul>
                      </div>
                      <p>3.3 本會有權但無義務審核使用者發布之內容，並保留不經通知刪除或修改違規內容之權利。</p>
                    </div>
                  </article>
                </div>
              </section>

              {/* 商業活動 */}
              <section id="section3" className="mb-5">
                <div className="section-header bg-info text-white p-3 rounded">
                  <h2 className="h4 mb-0 fw-bold">商業活動</h2>
                </div>
                <div className="section-body p-3">
                  <article className="mb-4">
                    <h3 className="h5 fw-bold">四、公司介紹、產品資訊與招募發布</h3>
                    <div className="pl-3 content-block">
                      <p>4.1 經本會核准之系友可發布公司介紹、產品資訊及人才招募訊息，惟必須遵守以下規定：</p>
                      <p>4.2 公司及產品資訊必須真實、準確，不得有虛假宣傳或誇大不實之情形，應符合《公平交易法》及《消費者保護法》之規定。</p>
                      <p>4.3 招募訊息必須符合《就業服務法》及《性別工作平等法》等相關法規，不得有任何歧視性內容，包括但不限於性別、年齡、種族、宗教信仰、婚姻狀況等方面之歧視。</p>
                      <p>4.4 發布招募訊息之使用者應確保有合法招聘員工之資格，並對招募內容之真實性及合法性負責。</p>
                      <p>4.5 本會對使用者透過本網站之招募活動不負任何媒合責任，亦不對任何招募結果承擔責任。</p>
                    </div>
                  </article>
                  
                  <article className="mb-4">
                    <h3 className="h5 fw-bold">八、系友媒合與招募之責任歸屬</h3>
                    <div className="pl-3 content-block">
                      <p>8.1 本網站僅為系友提供資訊交流及招募訊息發布平台，不涉及實際媒合、招募過程或勞動契約之簽訂。</p>
                      <p>8.2 因招募資訊而產生之任何爭議，應由相關使用者自行協商解決。本會不參與任何招募或雇用過程，亦不對招募結果承擔任何責任。</p>
                      <p>8.3 系友透過本網站進行之任何交易、合作或雇用關係，其權利義務應由當事人依據相關法律自行約定，與本會無關。</p>
                      <p>8.4 如因使用本網站發布之招募訊息而產生勞資爭議，應依《勞動基準法》、《勞資爭議處理法》等相關法規處理，本會不負任何調解或賠償責任。</p>
                    </div>
                  </article>
                </div>
              </section>

              {/* 法律權益 */}
              <section id="section4" className="mb-5">
                <div className="section-header bg-warning text-dark p-3 rounded">
                  <h2 className="h4 mb-0 fw-bold">法律權益</h2>
                </div>
                <div className="section-body p-3">
                  <article className="mb-4">
                    <h3 className="h5 fw-bold">五、智慧財產權</h3>
                    <div className="pl-3 content-block">
                      <p>5.1 本網站及其內容（包括但不限於網站架構、設計、程式、文字、圖片、影音資料等）之智慧財產權均屬於本會或其授權方所有，受《著作權法》及其他智慧財產權法律保護。</p>
                      <p>5.2 使用者發布於本網站之內容，其智慧財產權仍歸使用者所有，但使用者同意授予本會非專屬、全球性、免權利金、可轉授權且不可撤銷之權利，以使用、複製、修改、改編、出版、翻譯及展示該等內容。</p>
                      <p>5.3 使用者不得未經授權使用、複製、修改或散布本網站或其他使用者之智慧財產權內容。</p>
                    </div>
                  </article>
                  
                  <article className="mb-4">
                    <h3 className="h5 fw-bold">六、隱私保護</h3>
                    <div className="pl-3 content-block">
                      <p>6.1 本會將依據《個人資料保護法》及本網站「隱私權政策」收集、處理及利用使用者之個人資料。</p>
                      <p>6.2 本會將採取合理安全措施保護使用者個人資料，但不對因網路傳輸過程中可能發生之資料外洩負責。</p>
                      <p>6.3 使用者同意本會可將其提供之資料用於系友聯繫、活動通知、統計分析及系友服務改善等用途。</p>
                      <p>6.4 使用者有權查詢、閱覽、複製、補充、更正、停止蒐集、處理、利用及刪除其個人資料，但可能影響其享有之服務。</p>
                    </div>
                  </article>
                  
                  <article className="mb-4">
                    <h3 className="h5 fw-bold">七、責任限制</h3>
                    <div className="pl-3 content-block">
                      <p>7.1 本網站係依「現狀」及「現有」基礎提供服務，本會不保證服務不中斷、安全或無錯誤，亦不對服務之及時性、安全性、準確性做任何明示或暗示之擔保。</p>
                      <p>7.2 使用者應自行承擔使用本網站之風險。本會對使用者或任何第三方因使用或無法使用本網站而導致之任何直接、間接、附帶、特殊、衍生性或懲罰性損害賠償，不負任何責任。</p>
                      <p>7.3 對於使用者間或使用者與第三方之交易或互動，本會不負任何責任。使用者應自行判斷網站內容之可靠性，並承擔相關風險。</p>
                      <p>7.4 本會不對使用者透過本網站獲得之任何建議、資訊或服務作任何形式之保證。</p>
                    </div>
                  </article>
                </div>
              </section>

              {/* 管理與終止 */}
              <section id="section5" className="mb-5">
                <div className="section-header bg-danger text-white p-3 rounded">
                  <h2 className="h4 mb-0 fw-bold">管理與終止</h2>
                </div>
                <div className="section-body p-3">
                  <article className="mb-4">
                    <h3 className="h5 fw-bold">九、違規處理</h3>
                    <div className="pl-3 content-block">
                      <p>9.1 使用者若違反本條款，本會有權依情節輕重採取下列措施：</p>
                      <div className="bg-light p-3 rounded mb-3">
                        <ul className="mb-0">
                          <li>a) 發出警告</li>
                          <li>b) 刪除違規內容</li>
                          <li>c) 暫停或限制使用部分功能</li>
                          <li>d) 終止帳號使用權限</li>
                          <li>e) 移送相關機關處理</li>
                        </ul>
                      </div>
                      <p>9.2 因違反本條款而導致他人權益受損，使用者應自行負擔所有法律責任及賠償責任。</p>
                    </div>
                  </article>
                  
                  <article className="mb-4">
                    <h3 className="h5 fw-bold">十、終止服務</h3>
                    <div className="pl-3 content-block">
                      <p>10.1 使用者可隨時停止使用本網站服務。</p>
                      <p>10.2 本會保留因下列原因終止部分或全部服務之權利：</p>
                      <div className="bg-light p-3 rounded mb-3">
                        <ul className="mb-0">
                          <li>a) 網站維護或更新</li>
                          <li>b) 不可抗力因素</li>
                          <li>c) 使用者違反本條款</li>
                          <li>d) 其他本會認為必要之情形</li>
                        </ul>
                      </div>
                      <p>10.3 服務終止後，本會可能會依據《個人資料保護法》等相關法規，在必要的期間內保留使用者資料。</p>
                    </div>
                  </article>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* 返回頂部按鈕 */}
      <button
        className="btn btn-primary back-to-top"
        onClick={scrollToTop}
        title="返回頂部"
      >
        <i className="bi bi-arrow-up"></i>
      </button>
    </div>
  );
};

export default TermsAndConditionsPage;