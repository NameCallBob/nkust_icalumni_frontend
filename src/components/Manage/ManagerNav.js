import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building2, Package, Camera,
  ClipboardList, ListChecks, LogOut,
  Info, Globe, Menu, X, ChevronDown
} from 'lucide-react';
import logo from 'assets/logo.png';
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

    // 導覽選單資料（保留原有 href / 顯示條件 / 點擊行為）
    const menuGroups = [
        {
            id: 'general-management-dropdown',
            label: '一般管理',
            icon: Users,
            adminOnly: false,
            items: [
                { href: '/alumni/manage/', label: '個人頁面', icon: Users },
                { href: '/alumni/manage/company/', label: '公司登錄', icon: Building2 },
                { href: '/alumni/manage/product/', label: '商品登錄', icon: Package },
                { href: '/alumni/manage/recruit/', label: '招募登錄', icon: ClipboardList },
                { href: '/alumni/manage/pic/', label: '照片管理', icon: Camera },
            ],
        },
        {
            id: 'admin-management-dropdown',
            label: '管理者管理',
            icon: ListChecks,
            adminOnly: true,
            items: [
                { href: '/alumni/manage/member/', label: '使用者管理', icon: Users },
                { href: '/alumni/manage/article/', label: '活動發布管理', icon: ListChecks },
                { href: '/alumni/manage/outstanding/', label: '傑出系友設置', icon: Users },
                { href: '/alumni/manage/outstanding-alumni/', label: '傑出校友設置', icon: Users },
                { href: '/alumni/manage/recruit/all/', label: '招募總管理', icon: ClipboardList },
            ],
        },
        {
            id: 'website-management-dropdown',
            label: '官網管理',
            icon: Globe,
            adminOnly: true,
            items: [
                { href: '/alumni/manage/website/', label: '官網照片設置', icon: Globe },
                { href: '/alumni/manage/other/', label: '其他管理', icon: ListChecks },
            ],
        },
        {
            id: 'alumni-info-dropdown',
            label: '系友會資訊',
            icon: Info,
            adminOnly: true,
            items: [
                { href: '/alumni/manage/info/?type=rule', label: '介紹', icon: ListChecks },
                { href: '/alumni/manage/info/?type=structure', label: '組織', icon: ListChecks },
                { href: '/alumni/manage/info/?type=us', label: '加入我們', icon: ListChecks },
                { href: '/alumni/manage/constitutions/', label: '章程', icon: ListChecks },
            ],
        },
        {
            id: 'account-dropdown',
            label: '帳號相關',
            icon: LogOut,
            adminOnly: false,
            items: [
                {
                    label: '登出',
                    icon: LogOut,
                    danger: true,
                    onClick: () => { handleLogout(); handleNavItemClick(); },
                },
            ],
        },
    ];

    const visibleGroups = menuGroups.filter((group) => !group.adminOnly || isAdmin);

    return (
        <>
            <ToastContainer />
            <nav className="fixed top-0 inset-x-0 z-[1030] w-full bg-gradient-to-r from-[#0f172a] via-[#16264a] to-[#1e3a8a] shadow-[0_4px_20px_-6px_rgba(15,23,42,0.6)] border-b border-white/10">
                <div className="mx-auto w-full max-w-[1400px] px-3 lg:px-6">
                    <div className="flex h-16 items-center justify-between gap-3">
                        {/* Logo 區塊 */}
                        <a href="/" className="flex items-center gap-3 shrink-0 group">
                            <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/95 shadow-sm ring-1 ring-white/30 overflow-hidden">
                                <img
                                    src={logo}
                                    className="h-8 w-8 object-contain"
                                    alt="智商系友會LOGO"
                                />
                            </span>
                            <span className="hidden sm:flex flex-col leading-tight">
                                <span className="text-sm font-semibold text-white tracking-wide">智商系友會</span>
                                <span className="text-[11px] font-medium text-[#d6b25e]">後台管理系統</span>
                            </span>
                        </a>

                        {/* 桌機選單 */}
                        <ul className="hidden min-[992px]:flex items-center gap-1">
                            {visibleGroups.map((group) => {
                                const GroupIcon = group.icon;
                                const isOpen = openDropdown === group.id;
                                return (
                                    <li key={group.id} className="relative">
                                        <button
                                            type="button"
                                            id={group.id}
                                            onClick={() => handleDropdownToggle(group.id)}
                                            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                                                isOpen
                                                    ? 'bg-white/15 text-white'
                                                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            <GroupIcon className="h-4 w-4 text-[#d6b25e]" />
                                            {group.label}
                                            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isOpen && (
                                            <ul className="absolute right-0 top-full z-[1050] mt-2 min-w-[210px] rounded-xl border border-slate-100 bg-white p-1.5 shadow-[0_12px_30px_-8px_rgba(15,23,42,0.35)]">
                                                {group.items.map((item, idx) => {
                                                    const ItemIcon = item.icon;
                                                    const baseCls = 'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer transition-colors duration-150';
                                                    const colorCls = item.danger
                                                        ? 'text-red-600 hover:bg-red-50'
                                                        : 'text-slate-700 hover:bg-[#1e3a8a]/8 hover:text-[#1e3a8a]';
                                                    return (
                                                        <li key={item.href || `${group.id}-${idx}`}>
                                                            <a
                                                                href={item.href}
                                                                onClick={item.onClick || handleNavItemClick}
                                                                className={`${baseCls} ${colorCls}`}
                                                            >
                                                                <ItemIcon className={`h-4 w-4 ${item.danger ? 'text-red-500' : 'text-[#a0781c]'}`} />
                                                                {item.label}
                                                            </a>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>

                        {/* 漢堡菜單 */}
                        <button
                            type="button"
                            aria-controls="manager-mobile-nav"
                            aria-expanded={expanded}
                            aria-label="Toggle navigation"
                            className="min-[992px]:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg text-white hover:bg-white/10 transition-colors"
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* 手機抽屜選單 */}
                <div
                    id="manager-mobile-nav"
                    className={`min-[992px]:hidden overflow-hidden border-t border-white/10 transition-[max-height] duration-300 ease-in-out ${
                        expanded ? 'max-h-[80vh] overflow-y-auto' : 'max-h-0'
                    }`}
                >
                    <ul className="space-y-1 px-3 py-3">
                        {visibleGroups.map((group) => {
                            const GroupIcon = group.icon;
                            const isOpen = openDropdown === group.id;
                            return (
                                <li key={group.id} className="rounded-xl bg-white/5">
                                    <button
                                        type="button"
                                        id={`mobile-${group.id}`}
                                        onClick={() => handleDropdownToggle(group.id)}
                                        className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-3 text-sm font-medium text-white"
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <GroupIcon className="h-4 w-4 text-[#d6b25e]" />
                                            {group.label}
                                        </span>
                                        <ChevronDown className={`h-4 w-4 text-slate-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isOpen && (
                                        <ul className="space-y-0.5 px-2 pb-2">
                                            {group.items.map((item, idx) => {
                                                const ItemIcon = item.icon;
                                                const colorCls = item.danger
                                                    ? 'text-red-300 hover:bg-red-500/15'
                                                    : 'text-slate-200 hover:bg-white/10';
                                                return (
                                                    <li key={item.href || `${group.id}-m-${idx}`}>
                                                        <a
                                                            href={item.href}
                                                            onClick={item.onClick || handleNavItemClick}
                                                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer transition-colors ${colorCls}`}
                                                        >
                                                            <ItemIcon className={`h-4 w-4 ${item.danger ? 'text-red-400' : 'text-[#d6b25e]'}`} />
                                                            {item.label}
                                                        </a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
            {/* 為固定頂部導航添加空間 */}
            <div className="h-16"></div>
        </>
    );
}

export default ManagerNav;
