import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, FaBuilding, FaProductHunt, FaCamera, 
  FaClipboardList, FaTasks, FaSignOutAlt, 
  FaInfoCircle, FaGlobe 
} from 'react-icons/fa';
import logo from 'assets/logo.png';
import "css/Navlogo.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * 管理端專用導覽列組件
 * @returns {JSX.Element} 管理導覽列
 */
function ManagerNav() {
    const navigator = useNavigate();
    const [isAdmin, setAdminStatus] = useState(false);
    const [expanded, setExpanded] = useState(false);
    // 追蹤哪個下拉選單是開啟的
    const [openDropdown, setOpenDropdown] = useState(null);

    // 登出處理函數
    const handleLogout = () => {
        window.localStorage.setItem("jwt", "");
        toast.success("已登出，期待再見到您!", { 
            position: 'top-right',
            autoClose: 2000
        });
        setTimeout(() => {
            navigator("/");
        }, 2000);
    }

    // 檢查登入狀態
    useEffect(() => {
        const checkLoginStatus = () => {
            const currentTime = Math.floor(Date.now() / 1000);
            const expiry = localStorage.getItem("expiry");
            
            if (currentTime >= expiry) {
                toast.error("登入時效已過，請重新登入！", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000
                });
                setTimeout(() => {
                    navigator('/login');
                }, 2000);
                return false;
            }
            return true;
        };

        // 只有在登入有效時才檢查管理員狀態
        if (checkLoginStatus()) {
            setAdminStatus(window.localStorage.getItem("super") === 'true');
        }
    }, [navigator]);

    // 處理下拉選單點擊事件
    const handleDropdownToggle = (eventKey, isOpen) => {
        setOpenDropdown(isOpen ? eventKey : null);
    };

    // 處理選單項目點擊事件（僅在點擊實際項目時關閉選單）
    const handleNavItemClick = () => {
        if (window.innerWidth < 992) {
            setExpanded(false);
        }
    };
    
    // 處理招募總管理點擊，顯示功能尚未開放提示
    const handleRecruitAdminClick = (e) => {
        e.preventDefault();
        toast.info("此功能尚未開放，敬請期待！", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
        });
        handleNavItemClick();
    };

    // 定義導航菜單項的共同樣式
    const navItemClassName = 'nav-item-animated mx-2';
    
    return (
        <>
            <ToastContainer />
            <Navbar 
                bg="light" 
                expand="lg" 
                fixed="top" 
                className="navbar-custom shadow-sm w-100"
                expanded={expanded}
                onToggle={setExpanded}
            >
                <Container fluid className="px-3 px-lg-5 mx-auto">
                    {/* Logo 區塊 */}
                    <Navbar.Brand href="/" className="py-2 me-0">
                        <img
                            src={logo}
                            className="d-inline-block align-top logo-img"
                            alt="智商系友會LOGO"
                        />
                    </Navbar.Brand>
                    
                    {/* 漢堡菜單 */}
                    <Navbar.Toggle 
                        aria-controls="basic-navbar-nav" 
                        className="ms-auto border-0 focus-ring focus-ring-light"
                    />
                    
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            {/* 一般管理 */}
                            <NavDropdown 
                                title={
                                    <span className="nav-dropdown-title">
                                        <FaUsers className="me-1 nav-icon" /> 一般管理
                                    </span>
                                } 
                                id="general-management-dropdown" 
                                className={navItemClassName}
                                show={openDropdown === 'general-management-dropdown'}
                                onToggle={(isOpen) => handleDropdownToggle('general-management-dropdown', isOpen)}
                            >
                                <NavDropdown.Item href="/alumni/manage/" onClick={handleNavItemClick}>
                                    <FaUsers className="me-2 text-primary" /> 個人頁面
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/alumni/manage/company/" onClick={handleNavItemClick}>
                                    <FaBuilding className="me-2 text-primary" /> 公司登錄
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/alumni/manage/product/" onClick={handleNavItemClick}>
                                    <FaProductHunt className="me-2 text-primary" /> 商品登錄
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/alumni/manage/recruit/" onClick={handleNavItemClick}>
                                    <FaClipboardList className="me-2 text-primary" /> 招募登錄
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/alumni/manage/pic/" onClick={handleNavItemClick}>
                                    <FaCamera className="me-2 text-primary" /> 照片管理
                                </NavDropdown.Item>
                            </NavDropdown>

                            {/* 管理者管理 - 只對管理員顯示 */}
                            {isAdmin && (
                                <NavDropdown 
                                    title={
                                        <span className="nav-dropdown-title">
                                            <FaTasks className="me-1 nav-icon" /> 管理者管理
                                        </span>
                                    } 
                                    id="admin-management-dropdown" 
                                    className={navItemClassName}
                                    show={openDropdown === 'admin-management-dropdown'}
                                    onToggle={(isOpen) => handleDropdownToggle('admin-management-dropdown', isOpen)}
                                >
                                    <NavDropdown.Item href="/alumni/manage/member/" onClick={handleNavItemClick}>
                                        <FaUsers className="me-2 text-primary" /> 使用者管理
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/alumni/manage/article/" onClick={handleNavItemClick}>
                                        <FaTasks className="me-2 text-primary" /> 活動發布管理
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/alumni/manage/outstanding/" onClick={handleNavItemClick}>
                                        <FaUsers className="me-2 text-primary" /> 傑出系友設置
                                    </NavDropdown.Item>
                                    {/* <NavDropdown.Item onClick={handleRecruitAdminClick}> */}
                                    <NavDropdown.Item href="/alumni/manage/recruit/all/" onClick={handleNavItemClick}>
                                        <FaClipboardList className="me-2 text-primary" /> 招募總管理
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}

                            {/* 官網管理 - 只對管理員顯示 */}
                            {isAdmin && (
                                <NavDropdown 
                                    title={
                                        <span className="nav-dropdown-title">
                                            <FaGlobe className="me-1 nav-icon" /> 官網管理
                                        </span>
                                    } 
                                    id="website-management-dropdown" 
                                    className={navItemClassName}
                                    show={openDropdown === 'website-management-dropdown'}
                                    onToggle={(isOpen) => handleDropdownToggle('website-management-dropdown', isOpen)}
                                >
                                    <NavDropdown.Item href="/alumni/manage/website/" onClick={handleNavItemClick}>
                                        <FaGlobe className="me-2 text-primary" /> 官網照片設置
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/alumni/manage/other/" onClick={handleNavItemClick}>
                                        <FaTasks className="me-2 text-primary" /> 其他管理
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}

                            {/* 系友會資訊管理 - 只對管理員顯示 */}
                            {isAdmin && (
                                <NavDropdown 
                                    title={
                                        <span className="nav-dropdown-title">
                                            <FaInfoCircle className="me-1 nav-icon" /> 系友會資訊
                                        </span>
                                    } 
                                    id="alumni-info-dropdown" 
                                    className={navItemClassName}
                                    show={openDropdown === 'alumni-info-dropdown'}
                                    onToggle={(isOpen) => handleDropdownToggle('alumni-info-dropdown', isOpen)}
                                >

                                    <NavDropdown.Item href="/alumni/manage/info/?type=rule" onClick={handleNavItemClick}>
                                        <FaTasks className="me-2 text-primary" /> 介紹
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/alumni/manage/info/?type=structure" onClick={handleNavItemClick}>
                                        <FaTasks className="me-2 text-primary" /> 組織
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/alumni/manage/info/?type=us" onClick={handleNavItemClick}>
                                        <FaTasks className="me-2 text-primary" /> 加入我們
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/alumni/manage/constitutions/" onClick={handleNavItemClick}>
                                        <FaTasks className="me-2 text-primary" /> 章程
                                    </NavDropdown.Item>
                                    
                                </NavDropdown>
                            )}

                            {/* 帳號相關 */}
                            <NavDropdown 
                                title={
                                    <span className="nav-dropdown-title">
                                        <FaSignOutAlt className="me-1 nav-icon" /> 帳號相關
                                    </span>
                                } 
                                id="account-dropdown" 
                                className={navItemClassName}
                                align="end"
                                show={openDropdown === 'account-dropdown'}
                                onToggle={(isOpen) => handleDropdownToggle('account-dropdown', isOpen)}
                            >
                                <NavDropdown.Item onClick={() => { handleLogout(); handleNavItemClick(); }}>
                                    <FaSignOutAlt className="me-2 text-danger" /> 登出
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/Manager/User" onClick={handleNavItemClick}>
                                    <FaInfoCircle className="me-2 text-primary" /> 使用說明
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* 為固定頂部導航添加空間 */}
            <div className="navbar-spacer"></div>
        </>
    );
}

export default ManagerNav;