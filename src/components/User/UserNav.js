import React, { useState, useEffect } from 'react';
import logo from 'assets/logo.png'; // 請替換為你的 logo 圖片路徑
import 'css/nav.css'; // 我們會建立這個檔案來包含所有自定義樣式
import { handleImageError, getImageSrc } from '../../utils/imageDefaults';
import { BsChevronDown, BsBoxArrowInRight } from 'react-icons/bs';

/**
 * 現代化深藍色系友會導航欄 - 改進版
 * @returns JSX
 */
function UserNav() {
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [expanded, setExpanded] = useState(false);

    // 監聽滾動事件，當頁面滾動時改變導航欄樣式
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // 處理下拉選單的滑鼠懸停事件
    const handleDropdownEnter = (id) => {
        if (window.innerWidth >= 992) { // 只在桌面版啟用懸停效果
            setActiveDropdown(id);
        }
    };

    const handleDropdownLeave = () => {
        if (window.innerWidth >= 992) {
            setActiveDropdown(null);
        }
    };

    // 處理導航項目點擊事件（在移動設備上自動關閉菜單）
    const handleNavItemClick = () => {
        if (window.innerWidth < 992) {
            setExpanded(false);
        }
    };

    // 手動切換下拉菜單（用於移動設備）
    const handleDropdownToggle = (id) => {
        if (window.innerWidth < 992) {
            setActiveDropdown(activeDropdown === id ? null : id);
        }
    };

    // 處理下拉選單項目點擊事件，確保在移動設備上關閉菜單
    const handleDropdownItemClick = () => {
        if (window.innerWidth < 992) {
            setActiveDropdown(null);
            setExpanded(false);
        }
    };

    return (
        <>
            {/* 導航欄 */}
            <div className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
                <div className="w-full px-3 lg:px-4">
                    <nav className="custom-navbar relative flex items-center justify-between h-full">
                        <a href="/" className="navbar-brand-custom mr-0">
                            <div className="logo-container">
                                <img
                                    src={getImageSrc(logo, 'default')}
                                    className="logo-img"
                                    alt="智商系友會LOGO"
                                    style={{ backgroundColor: '#ffffff' }}
                                    onError={(e) => handleImageError(e, 'default')}
                                />
                                <div className="brand-text hidden min-[576px]:flex">
                                    <span className="brand-main">智商系友會</span>
                                    <span className="brand-sub">Alumni Association</span>
                                </div>
                            </div>
                        </a>

                        <button
                            type="button"
                            aria-controls="basic-navbar-nav"
                            aria-expanded={expanded}
                            aria-label="Toggle navigation"
                            className="custom-toggler ml-auto min-[992px]:hidden"
                            onClick={() => setExpanded(!expanded)}
                        >
                            <span className="navbar-toggler-icon custom-toggler-icon inline-block w-[1.5em] h-[1.5em] bg-no-repeat bg-center bg-contain"></span>
                        </button>

                        <div
                            id="basic-navbar-nav"
                            className={`navbar-collapse ${expanded ? 'show flex' : 'hidden'} min-[992px]:!flex min-[992px]:items-center`}
                        >
                            <div className="nav-items ml-auto">
                                {/* 系友會介紹下拉選單 */}
                                <div
                                    className={`nav-item-wrapper ${activeDropdown === 'intro' ? 'active' : ''}`}
                                    onMouseEnter={() => handleDropdownEnter('intro')}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    <div className={`custom-dropdown ${activeDropdown === 'intro' ? 'show' : ''}`}>
                                        <button
                                            type="button"
                                            id="intro-dropdown"
                                            className="dropdown-toggle flex items-center"
                                            onClick={() => handleDropdownToggle('intro')}
                                        >
                                            <span className="nav-link-text">系友會介紹</span>
                                            <BsChevronDown className="ml-1 text-xs" />
                                        </button>
                                        {activeDropdown === 'intro' && (
                                            <div className="dropdown-content min-[992px]:absolute min-[992px]:top-full min-[992px]:right-0 min-[992px]:z-[1050]">
                                                <a href="/IC/intro" className="dropdown-item-custom block" onClick={handleDropdownItemClick}>簡介</a>
                                                <a href="/IC/constitution" className="dropdown-item-custom block" onClick={handleDropdownItemClick}>章程</a>
                                                <a href="/IC/structure" className="dropdown-item-custom block" onClick={handleDropdownItemClick}>組織</a>
                                                <a href="/IC/joinUs" className="dropdown-item-custom block" onClick={handleDropdownItemClick}>入會方式</a>
                                                <a href="/IC/contactUs" className="dropdown-item-custom block" onClick={handleDropdownItemClick}>聯絡我們</a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 一般導航連結 */}
                                <a href="/alumniList" className="nav-link-custom" onClick={handleNavItemClick}>
                                    <span className="nav-link-text">系友們</span>
                                </a>

                                <a href="/search" className="nav-link-custom" onClick={handleNavItemClick}>
                                    <span className="nav-link-text">公司查詢</span>
                                </a>

                                <a href="/recruit" className="nav-link-custom" onClick={handleNavItemClick}>
                                    <span className="nav-link-text">徵才啟示</span>
                                </a>


                                {/* 系友專區下拉選單 */}
                                <div
                                    className={`nav-item-wrapper ${activeDropdown === 'member' ? 'active' : ''}`}
                                    onMouseEnter={() => handleDropdownEnter('member')}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    <div className={`custom-dropdown ${activeDropdown === 'member' ? 'show' : ''}`}>
                                        <button
                                            type="button"
                                            id="member-dropdown"
                                            className="dropdown-toggle flex items-center"
                                            onClick={() => handleDropdownToggle('member')}
                                        >
                                            <span className="nav-link-text">系友專區</span>
                                            <BsChevronDown className="ml-1 text-xs" />
                                        </button>
                                        {activeDropdown === 'member' && (
                                            <div className="dropdown-content min-[992px]:absolute min-[992px]:top-full min-[992px]:right-0 min-[992px]:z-[1050]">
                                                <a href="/login" className="dropdown-item-custom block" onClick={handleDropdownItemClick}>
                                                    <BsBoxArrowInRight className="mr-2 inline-block" />登入
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>

            {/* 導航欄佔位元素，防止內容被覆蓋 */}
            <div className="navbar-spacer"></div>
        </>
    );
}

export default UserNav;
