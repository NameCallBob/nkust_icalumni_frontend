import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import logo from 'assets/logo.png'; // 請替換為你的 logo 圖片路徑
import 'css/nav.css'; // 我們會建立這個檔案來包含所有自定義樣式

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
                <Container fluid className="px-3 px-lg-4">
                    <Navbar 
                        expand="lg" 
                        className="custom-navbar" 
                        expanded={expanded}
                        onToggle={(expanded) => setExpanded(expanded)}
                    >
                        <Navbar.Brand href="/" className="navbar-brand-custom me-0">
                            <div className="logo-container">
                                <img
                                    src={logo}
                                    className="logo-img"
                                    alt="智商系友會LOGO"
                                />
                                <div className="brand-text d-none d-sm-flex">
                                    <span className="brand-main">智商系友會</span>
                                    <span className="brand-sub">Alumni Association</span>
                                </div>
                            </div>
                        </Navbar.Brand>
                        
                        <Navbar.Toggle 
                            aria-controls="basic-navbar-nav" 
                            className="custom-toggler ms-auto"
                        >
                            <span className="navbar-toggler-icon custom-toggler-icon"></span>
                        </Navbar.Toggle>
                        
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto nav-items">
                                {/* 系友會介紹下拉選單 */}
                                <div 
                                    className={`nav-item-wrapper ${activeDropdown === 'intro' ? 'active' : ''}`}
                                    onMouseEnter={() => handleDropdownEnter('intro')}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    <NavDropdown 
                                        title={<span className="nav-link-text">系友會介紹</span>} 
                                        id="intro-dropdown"
                                        className="custom-dropdown"
                                        show={activeDropdown === 'intro'}
                                        onClick={() => handleDropdownToggle('intro')}
                                    >
                                        <div className="dropdown-content">
                                            <NavDropdown.Item href="/IC/intro" className="dropdown-item-custom" onClick={handleDropdownItemClick}>簡介</NavDropdown.Item>
                                            <NavDropdown.Item href="/IC/constitution" className="dropdown-item-custom" onClick={handleDropdownItemClick}>章程</NavDropdown.Item>
                                            <NavDropdown.Item href="/IC/structure" className="dropdown-item-custom" onClick={handleDropdownItemClick}>組織</NavDropdown.Item>
                                            <NavDropdown.Item href="/IC/joinUs" className="dropdown-item-custom" onClick={handleDropdownItemClick}>入會方式</NavDropdown.Item>
                                            <NavDropdown.Item href="/IC/contactUs" className="dropdown-item-custom" onClick={handleDropdownItemClick}>聯絡我們</NavDropdown.Item>
                                        </div>
                                    </NavDropdown>
                                </div>

                                {/* 一般導航連結 */}
                                <Nav.Link href="/alumniList" className="nav-link-custom" onClick={handleNavItemClick}>
                                    <span className="nav-link-text">系友們</span>
                                </Nav.Link>
                                
                                <Nav.Link href="/search" className="nav-link-custom" onClick={handleNavItemClick}>
                                    <span className="nav-link-text">公司查詢</span>
                                </Nav.Link>
                                
                                <Nav.Link href="/recruit" className="nav-link-custom" onClick={handleNavItemClick}>
                                    <span className="nav-link-text">徵才啟示</span>
                                </Nav.Link>
                                
                                {/* 系友專區下拉選單 */}
                                <div 
                                    className={`nav-item-wrapper ${activeDropdown === 'member' ? 'active' : ''}`}
                                    onMouseEnter={() => handleDropdownEnter('member')}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    <NavDropdown 
                                        title={<span className="nav-link-text">系友專區</span>} 
                                        id="member-dropdown"
                                        className="custom-dropdown"
                                        show={activeDropdown === 'member'}
                                        onClick={() => handleDropdownToggle('member')}
                                    >
                                        <div className="dropdown-content">
                                            <NavDropdown.Item href="/login" className="dropdown-item-custom" onClick={handleDropdownItemClick}>
                                                <i className="bi bi-box-arrow-in-right me-2"></i>登入
                                            </NavDropdown.Item>
                                        </div>
                                    </NavDropdown>
                                </div>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Container>
            </div>
            
            {/* 導航欄佔位元素，防止內容被覆蓋 */}
            <div className="navbar-spacer"></div>
        </>
    );
}

export default UserNav;