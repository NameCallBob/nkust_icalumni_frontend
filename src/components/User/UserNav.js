import React, { useState, useEffect } from 'react';
import logo from 'assets/logo.png';
import { handleImageError, getImageSrc } from '../../utils/imageDefaults';
import { ChevronDown, LogIn, Menu, X } from 'lucide-react';

/**
 * 現代化深藍系友會導覽列（Tailwind/DaisyUI 重構，移除 css/nav.css 依賴）
 * 保留：捲動狀態、下拉(intro/member)、手機展開等全部互動邏輯與連結。
 */
const INTRO_LINKS = [
  { href: '/IC/intro', label: '簡介' },
  { href: '/IC/constitution', label: '章程' },
  { href: '/IC/structure', label: '組織' },
  { href: '/IC/joinUs', label: '入會方式' },
  { href: '/IC/contactUs', label: '聯絡我們' },
];
const NAV_LINKS = [
  { href: '/alumniList', label: '系友們' },
  { href: '/search', label: '公司查詢' },
  { href: '/recruit', label: '徵才啟示' },
];

function UserNav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDropdownEnter = (id) => {
    if (window.innerWidth >= 992) setActiveDropdown(id);
  };
  const handleDropdownLeave = () => {
    if (window.innerWidth >= 992) setActiveDropdown(null);
  };
  const handleNavItemClick = () => {
    if (window.innerWidth < 992) setExpanded(false);
  };
  const handleDropdownToggle = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };
  const handleDropdownItemClick = () => {
    setActiveDropdown(null);
    setExpanded(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-[1030] transition-all duration-300 ${
          scrolled
            ? 'bg-[#0f172a]/95 backdrop-blur shadow-lg'
            : 'bg-gradient-to-r from-[#1e3a8a] to-[#0f172a]'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex h-16 items-center justify-between">
            {/* 品牌 */}
            <a href="/" className="flex items-center gap-2.5 min-w-0">
              <img
                src={getImageSrc(logo, 'default')}
                className="h-10 w-10 rounded-lg bg-white object-contain p-0.5 shrink-0"
                alt="智商系友會LOGO"
                onError={(e) => handleImageError(e, 'default')}
              />
              <div className="hidden min-[480px]:flex flex-col leading-tight text-white">
                <span className="font-serif font-bold text-base">智商系友會</span>
                <span className="text-[10px] tracking-wider text-white/60">Alumni Association</span>
              </div>
            </a>

            {/* 手機選單鈕 */}
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={expanded}
              className="min-[992px]:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* 桌機選單 */}
            <div className="hidden min-[992px]:flex items-center gap-1">
              {/* 系友會介紹 */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter('intro')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white"
                  onClick={() => handleDropdownToggle('intro')}
                >
                  系友會介紹 <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {activeDropdown === 'intro' && (
                  <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-base-200 bg-base-100 py-1.5 shadow-xl">
                    {INTRO_LINKS.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        className="block px-4 py-2 text-sm text-base-content hover:bg-primary/10 hover:text-primary"
                        onClick={handleDropdownItemClick}
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white"
                  onClick={handleNavItemClick}
                >
                  {l.label}
                </a>
              ))}

              {/* 系友專區 */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter('member')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white"
                  onClick={() => handleDropdownToggle('member')}
                >
                  系友專區 <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {activeDropdown === 'member' && (
                  <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-base-200 bg-base-100 py-1.5 shadow-xl">
                    <a
                      href="/login"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-base-content hover:bg-primary/10 hover:text-primary"
                      onClick={handleDropdownItemClick}
                    >
                      <LogIn className="h-4 w-4" /> 登入
                    </a>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* 手機展開選單 */}
        {expanded && (
          <div className="min-[992px]:hidden border-t border-white/10 bg-[#0f172a]/98 backdrop-blur px-4 py-3">
            <div className="text-white/50 text-xs px-2 pt-2 pb-1">系友會介紹</div>
            {INTRO_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="block rounded-lg px-3 py-2.5 text-white/90 hover:bg-white/10" onClick={handleDropdownItemClick}>
                {l.label}
              </a>
            ))}
            <div className="my-2 h-px bg-white/10" />
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="block rounded-lg px-3 py-2.5 text-white/90 hover:bg-white/10" onClick={handleNavItemClick}>
                {l.label}
              </a>
            ))}
            <div className="my-2 h-px bg-white/10" />
            <a href="/login" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-white/90 hover:bg-white/10" onClick={handleDropdownItemClick}>
              <LogIn className="h-4 w-4" /> 登入
            </a>
          </div>
        )}
      </header>

      {/* 佔位，避免內容被固定導覽列覆蓋 */}
      <div className="h-16" />
    </>
  );
}

export default UserNav;
