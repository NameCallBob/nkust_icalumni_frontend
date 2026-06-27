import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers, FaBuilding, FaProductHunt, FaCamera,
  FaClipboardList, FaTasks, FaSignOutAlt,
  FaInfoCircle, FaGlobe, FaBars
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
    const handleDropdownToggle = (eventKey) => {
        setOpenDropdown(openDropdown === eventKey ? null : eventKey);
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
    // 下拉選單容器樣式（桌機絕對定位、手機內嵌）
    const dropdownMenuClassName = 'dropdown-menu list-none min-[992px]:absolute min-[992px]:top-full min-[992px]:right-0 min-[992px]:z-[1050]';
    // 下拉選單項目樣式
    const dropdownItemClassName = 'dropdown-item flex items-center cursor-pointer';

    return (
        <>
            <ToastContainer />
            <nav className="navbar-custom shadow-sm w-full fixed top-0 inset-x-0 z-[1030]">
                <div className="container-fluid px-3 px-lg-5 mx-auto flex items-center flex-wrap">
                    {/* Logo 區塊 */}
                    <a href="/" className="navbar-brand py-2 mr-0">
                        <img
                            src={logo}
                            className="inline-block align-top logo-img"
                            alt="智商系友會LOGO"
                        />
                    </a>

                    {/* 漢堡菜單 */}
                    <button
                        type="button"
                        aria-controls="basic-navbar-nav"
                        aria-expanded={expanded}
                        aria-label="Toggle navigation"
                        className="navbar-toggler ml-auto border-0 min-[992px]:hidden p-2 rounded-md text-[#475569]"
                        onClick={() => setExpanded(!expanded)}
                    >
                        <FaBars className="text-xl" />
                    </button>

                    <div
                        id="basic-navbar-nav"
                        className={`navbar-collapse basis-full grow min-[992px]:basis-auto min-[992px]:grow ${expanded ? 'block' : 'hidden'} min-[992px]:!block`}
                    >
                        <ul className="navbar-nav list-none mb-0 ml-auto flex flex-col min-[992px]:flex-row min-[992px]:items-center">
                            {/* 一般管理 */}
                            <li className={`relative ${navItemClassName}`}>
                                <button
                                    type="button"
                                    id="general-management-dropdown"
                                    className="nav-dropdown-title bg-transparent border-0 w-full"
                                    onClick={() => handleDropdownToggle('general-management-dropdown')}
                                >
                                    <FaUsers className="mr-1 nav-icon" /> 一般管理
                                </button>
                                {openDropdown === 'general-management-dropdown' && (
                                    <ul className={dropdownMenuClassName}>
                                        <li><a href="/alumni/manage/" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                            <FaUsers className="mr-2 text-primary" /> 個人頁面
                                        </a></li>
                                        <li><a href="/alumni/manage/company/" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                            <FaBuilding className="mr-2 text-primary" /> 公司登錄
                                        </a></li>
                                        <li><a href="/alumni/manage/product/" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                            <FaProductHunt className="mr-2 text-primary" /> 商品登錄
                                        </a></li>
                                        <li><a href="/alumni/manage/recruit/" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                            <FaClipboardList className="mr-2 text-primary" /> 招募登錄
                                        </a></li>
                                        <li><a href="/alumni/manage/pic/" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                            <FaCamera className="mr-2 text-primary" /> 照片管理
                                        </a></li>
                                    </ul>
                                )}
                            </li>

                            {/* 管理者管理 - 只對管理員顯示 */}
                            {isAdmin && (
                                <li className={`relative ${navItemClassName}`}>
                                    <button
                                        type="button"
                                        id="admin-management-dropdown"
                                        className="nav-dropdown-title bg-transparent border-0 w-full"
                                        onClick={() => handleDropdownToggle('admin-management-dropdown')}
                                    >
                                        <FaTasks className="mr-1 nav-icon" /> 管理者管理
                                    </button>
                                    {openDropdown === 'admin-management-dropdown' && (
                                        <ul className={dropdownMenuClassName}>
                                            <li><a href="/alumni/manage/member/" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                                <FaUsers className="mr-2 text-primary" /> 使用者管理
                                            </a></li>
                                            <li><a href="/alumni/manage/article/" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                                <FaTasks className="mr-2 text-primary" /> 活動發布管理
                                            </a></li>
                                            <li><a href="/alumni/manage/outstanding/" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                                <FaUsers className="mr-2 text-primary" /> 傑出系友設置
                                            </a></li>
                                            <li><a href="/alumni/manage/outstanding-alumni/" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                                <FaUsers className="mr-2 text-primary" /> 傑出校友設置
                                            </a></li>
                                            {/* <li><a className={dropdownItemClassName} onClick={handleRecruitAdminClick}> */}
                                            <li><a href="/alumni/manage/recruit/all/" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                                <FaClipboardList className="mr-2 text-primary" /> 招募總管理
                                            </a></li>
                                        </ul>
                                    )}
                                </li>
                            )}

                            {/* 官網管理 - 只對管理員顯示 */}
                            {isAdmin && (
                                <li className={`relative ${navItemClassName}`}>
                                    <button
                                        type="button"
                                        id="website-management-dropdown"
                                        className="nav-dropdown-title bg-transparent border-0 w-full"
                                        onClick={() => handleDropdownToggle('website-management-dropdown')}
                                    >
                                        <FaGlobe className="mr-1 nav-icon" /> 官網管理
                                    </button>
                                    {openDropdown === 'website-management-dropdown' && (
                                        <ul className={dropdownMenuClassName}>
                                            <li><a href="/alumni/manage/website/" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                                <FaGlobe className="mr-2 text-primary" /> 官網照片設置
                                            </a></li>
                                            <li><a href="/alumni/manage/other/" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                                <FaTasks className="mr-2 text-primary" /> 其他管理
                                            </a></li>
                                        </ul>
                                    )}
                                </li>
                            )}

                            {/* 系友會資訊管理 - 只對管理員顯示 */}
                            {isAdmin && (
                                <li className={`relative ${navItemClassName}`}>
                                    <button
                                        type="button"
                                        id="alumni-info-dropdown"
                                        className="nav-dropdown-title bg-transparent border-0 w-full"
                                        onClick={() => handleDropdownToggle('alumni-info-dropdown')}
                                    >
                                        <FaInfoCircle className="mr-1 nav-icon" /> 系友會資訊
                                    </button>
                                    {openDropdown === 'alumni-info-dropdown' && (
                                        <ul className={dropdownMenuClassName}>
                                            <li><a href="/alumni/manage/info/?type=rule" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                                <FaTasks className="mr-2 text-primary" /> 介紹
                                            </a></li>
                                            <li><a href="/alumni/manage/info/?type=structure" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                                <FaTasks className="mr-2 text-primary" /> 組織
                                            </a></li>
                                            <li><a href="/alumni/manage/info/?type=us" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                                <FaTasks className="mr-2 text-primary" /> 加入我們
                                            </a></li>
                                            <li><a href="/alumni/manage/constitutions/" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                                <FaTasks className="mr-2 text-primary" /> 章程
                                            </a></li>
                                        </ul>
                                    )}
                                </li>
                            )}

                            {/* 帳號相關 */}
                            <li className={`relative ${navItemClassName}`}>
                                <button
                                    type="button"
                                    id="account-dropdown"
                                    className="nav-dropdown-title bg-transparent border-0 w-full"
                                    onClick={() => handleDropdownToggle('account-dropdown')}
                                >
                                    <FaSignOutAlt className="mr-1 nav-icon" /> 帳號相關
                                </button>
                                {openDropdown === 'account-dropdown' && (
                                    <ul className={dropdownMenuClassName}>
                                        <li><a className={dropdownItemClassName} onClick={() => { handleLogout(); handleNavItemClick(); }}>
                                            <FaSignOutAlt className="mr-2 text-error" /> 登出
                                        </a></li>
                                        {/* <li><a href="/Manager/User" className={dropdownItemClassName} onClick={handleNavItemClick}>
                                            <FaInfoCircle className="mr-2 text-primary" /> 使用說明
                                        </a></li> */}
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* 為固定頂部導航添加空間 */}
            <div className="navbar-spacer"></div>
        </>
    );
}

export default ManagerNav;
