import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search, SlidersHorizontal, GraduationCap, Briefcase,
    AlertTriangle, Trophy, ChevronRight, ChevronLeft,
    ChevronsLeft, ChevronsRight, Info, Building2, RotateCcw
} from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Axios from 'common/Axios';
import LoadingSpinner from 'components/LoadingSpinner';
import FeaturedAlumni from 'components/User/alumni/FeaturedAlumni';
import { Button, Spinner, Card, Badge, EmptyState } from 'components/common/ui';
import SEO from 'SEO';
import { debounce } from 'lodash';
import { handleImageError, getImageSrc } from '../../utils/imageDefaults';

const AlumniListPage = () => {
    const [parentKey, setParentKey] = useState('級別');
    const [childKey, setChildKey] = useState('全部');  // 級別預設為 '全部'
    const [childOptions, setChildOptions] = useState([]);
    const [alumniList, setAlumniList] = useState([]);
    const [featured, setFeaturedAlumni] = useState([]);
    const [featuredSchool, setFeaturedSchoolAlumni] = useState([]); // 傑出校友
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emptyResult, setEmptyResult] = useState(false);

    // 分頁相關
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // 每頁顯示6筆資料
    const [totalPages, setTotalPages] = useState(1);

    // UI 相關狀態
    const [isSearching, setIsSearching] = useState(false);
    const [showFilterInfo, setShowFilterInfo] = useState(false);

    // 切換父級 Tabs 時
    const handleParentKeyChange = async (key) => {
        setParentKey(key);
        await fetchChildOptions(key);
        handleChildKeyChange(key === '級別' ? '全部' : 'all');
    };

    // 2. 修改 handleChildKeyChange 函數以處理職位"全部"的情況
    const handleChildKeyChange = (key) => {
        setError(null);
        setChildKey(key);
        setCurrentPage(1); // 重置分頁

        fetchAlumniList_normal(parentKey, key);
    };


    // 1. 修改 fetchChildOptions 函數
    const fetchChildOptions = (key) => {
        setLoading(true);
        setError(null);
        const endpoint = key === '級別' ? 'member/graduate/unique-grades/' : 'member/position/get-all/';

        Axios().get(endpoint)
            .then((res) => {
                let normalizedOptions = [];
                if (key === '級別') {
                    normalizedOptions = ['全部', ...res.data].map(grade => ({
                        value: grade,
                        label: grade === '全部' ? '全部' : `${grade}級`
                    }));
                } else {
                    normalizedOptions = [{ value: 'all', label: '全部' }];
                    if (res.data && Array.isArray(res.data)) {
                        const positions = res.data.map(pos => {
                            const id = pos.id || pos.pk;
                            const title = pos.title || pos.name || '未知職位';
                            return { value: String(id), label: title };
                        }).filter(pos => pos.value); // 過濾掉無效ID的職位
                        normalizedOptions.push(...positions);
                    }
                }
                setChildOptions(normalizedOptions);
                setEmptyResult(false);
            })
            .catch((error) => {
                setError(`無法獲取${key === '級別' ? '級別' : '職位'}資料，請稍後再試。`);
                setChildOptions([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // 從後端獲取系友資料 (具備錯誤處理與空結果處理)
    const fetchAlumniList_normal = (parent, child) => {
        setLoading(true);
        setError(null);
        setEmptyResult(false);
        const endpoint = parent === '級別' ? 'member/any/get-by-grade/' : 'member/any/get-by-position/';

        // 構建查詢參數
        let params = {
            page: currentPage,
            page_size: itemsPerPage
        };

        if (parent === '級別') {
            if (child && child !== '全部') {
                params.grade = child;
            }
        } else { // 職位
            if (child && child !== 'all') {
                params.position = child;
            }
        }

        Axios().get(endpoint, { params })
            .then((res) => {
                if (res.data && Array.isArray(res.data)) {
                    setAlumniList(res.data);
                    setTotalPages(Math.ceil(res.data.length / itemsPerPage));
                    setEmptyResult(res.data.length === 0);
                } else if (res.data && res.data.results) {
                    // 處理分頁 API 回傳格式
                    setAlumniList(res.data.results);
                    setTotalPages(Math.ceil(res.data.count / itemsPerPage));
                    setEmptyResult(res.data.results.length === 0);
                } else {
                    setAlumniList([]);
                    setEmptyResult(true);
                }
            })
            .catch((error) => {
                setError('獲取系友資料時發生錯誤，請稍後再試。');
                setAlumniList([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // 獲取傑出系友資料
    const fetchAlumniList_outstanding = () => {
        setLoading(true);
        // 同時獲取傑出校友和傑出系友
        const schoolAlumniPromise = Axios().get('member/school-outstanding-alumni/featured/')
            .then(res => res.data.results || [])
            .catch(err => {
                // console.error('Error fetching school outstanding alumni:', err);
                return []; // Return empty array on failure
            });

        const departmentAlumniPromise = Axios().get('member/outstanding-alumni/featured/')
            .then(res => res.data.results || [])
            .catch(err => {
                // console.error('Error fetching department outstanding alumni:', err);
                return []; // Return empty array on failure
            });

        Promise.all([
            schoolAlumniPromise,
            departmentAlumniPromise
        ])
            .then(([schoolAlumni, departmentAlumni]) => {
                setFeaturedSchoolAlumni(schoolAlumni);
                setFeaturedAlumni(departmentAlumni);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // 防抖處理的搜索功能
    const debouncedSearch = debounce(() => {
        performSearch();
    }, 500);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.length === 0) {
            setIsSearching(false);
            fetchAlumniList_normal(parentKey, childKey);
        }
    };

    const performSearch = () => {
        setLoading(true);
        setError(null);
        setEmptyResult(false);
        // 確保中文搜尋參數被正確編碼
        const searchTerm = searchQuery.trim();

        Axios().get("member/any/alumni-search/", {
            params: {
                q: searchTerm,
                page: currentPage,
                page_size: itemsPerPage
            }
        })
            .then((res) => {
                if (res.data && Array.isArray(res.data)) {
                    setAlumniList(res.data);
                    setTotalPages(Math.ceil(res.data.length / itemsPerPage));
                    setEmptyResult(res.data.length === 0);
                } else if (res.data && res.data.results) {
                    setAlumniList(res.data.results);
                    setTotalPages(Math.ceil(res.data.count / itemsPerPage));
                    setEmptyResult(res.data.results.length === 0);
                } else {
                    setAlumniList([]);
                    setEmptyResult(true);
                }
            })
            .catch((error) => {
                // console.error('Error fetching search results:', error);
                setError('搜尋時發生錯誤，請稍後再試。');
                setAlumniList([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            setIsSearching(true);
            performSearch();
        } else {
            setIsSearching(false);
            fetchAlumniList_normal(parentKey, childKey);
        }
    };

    // 處理分頁切換
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);

        // 滾動到系友列表區塊的頂部
        setTimeout(() => {
            const alumniGridSection = document.querySelector('.alumni-grid-section');
            if (alumniGridSection) {
                const rect = alumniGridSection.getBoundingClientRect();
                const scrollTop = window.pageYOffset + rect.top - 100; // 預留 100px 的空間
                window.scrollTo({
                    top: scrollTop,
                    behavior: 'smooth'
                });
            }
        }, 100);

        if (isSearching) {
            performSearch();
        } else {
            fetchAlumniList_normal(parentKey, childKey);
        }
    };

    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const resetSearch = () => {
        setSearchQuery('');
        setIsSearching(false);
        fetchAlumniList_normal(parentKey, childKey);
    };

    const toggleFilterInfo = () => {
        setShowFilterInfo(!showFilterInfo);
    };

    // 初始化數據
    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchInitialData = async () => {
            try {
                await fetchChildOptions(parentKey);
                await fetchAlumniList_normal(parentKey, childKey);
                await fetchAlumniList_outstanding();
            } catch (error) {
                // console.error('Error fetching initial data:', error);
                setError('獲取初始資料時發生錯誤，請重新整理頁面。');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    return (
        <div className="min-h-screen bg-base-200/40">
            <SEO
                main={false}
                title="系友列表 | 智慧商務系友會"
                description="瀏覽智慧商務系友會成員名單，發現更多聯繫機會與合作夥伴。"
                keywords={["智慧商務", "系友列表", "成員", "校友"]}
            />

            {/* Page Header - Navy hero */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#162e6e] to-[#0f172a]"
            >
                <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_top_right,white,transparent_55%)]" />
                <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20 text-center">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
                        Alumni Directory
                    </p>
                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                        系友名錄
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-white/70">
                        探索並連結我們出色的校友網絡
                    </p>
                    <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-secondary to-primary" />
                </div>
            </motion.div>

            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 space-y-8">

                {/* 傑出校友區塊 */}
                {featuredSchool && featuredSchool.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#162e6e] p-6 sm:p-9 shadow-md"
                    >
                        <div className="mb-7 flex items-center gap-3">
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                                <Trophy className="h-6 w-6" />
                            </span>
                            <div>
                                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">傑出校友</h2>
                                <div className="mt-1 h-0.5 w-10 rounded-full bg-secondary/70" />
                            </div>
                        </div>
                        <FeaturedAlumni featuredAlumni={featuredSchool} />
                    </motion.div>
                )}

                {/* 傑出系友區塊 */}
                {featured && featured.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#162e6e] p-6 sm:p-9 shadow-md"
                    >
                        <div className="mb-7 flex items-center gap-3">
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                                <Trophy className="h-6 w-6" />
                            </span>
                            <div>
                                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">傑出系友</h2>
                                <div className="mt-1 h-0.5 w-10 rounded-full bg-secondary/70" />
                            </div>
                        </div>
                        <FeaturedAlumni featuredAlumni={featured} />
                    </motion.div>
                )}

                {/* 搜尋與篩選區塊 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <Card padding="lg">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <SlidersHorizontal className="h-5 w-5" />
                                </span>
                                <h3 className="font-serif text-lg sm:text-xl font-bold text-base-content">尋找系友</h3>
                            </div>
                            <button
                                type="button"
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/10"
                                onClick={toggleFilterInfo}
                            >
                                <Info className="h-4 w-4" />
                                篩選說明
                            </button>
                        </div>

                        {showFilterInfo && (
                            <div className="mb-5 rounded-xl border border-info/20 bg-info/5 px-4 py-3 text-sm leading-relaxed text-base-content/70" role="alert">
                                您可以透過「級別」查看不同屆別的系友，或透過「職位」篩選特定職務的系友。
                                也可以直接在搜尋框中輸入關鍵字，查找特定系友、公司或專長。
                            </div>
                        )}

                        {/* 搜尋框 */}
                        <form className="mb-6" onKeyDown={handleEnterPress}>
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-base-content/40" />
                                <input
                                    type="text"
                                    placeholder="搜尋系友、公司、專長、產品..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="h-12 w-full rounded-xl border border-base-300 bg-base-100 pl-12 pr-24 text-base-content outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                                {isSearching && searchQuery && (
                                    <button
                                        type="button"
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-lg bg-base-200 px-3 py-1.5 text-sm font-medium text-base-content/70 transition hover:bg-base-300"
                                        onClick={resetSearch}
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        重置
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* 父級 Tabs */}
                        <div className="mb-5 inline-flex rounded-xl bg-base-200 p-1" role="tablist">
                            <button
                                type="button"
                                role="tab"
                                className={`inline-flex items-center gap-2 rounded-lg px-4 sm:px-5 py-2 text-sm font-semibold transition ${parentKey === '級別' ? 'bg-primary text-primary-content shadow-sm' : 'text-base-content/60 hover:text-base-content'}`}
                                onClick={() => handleParentKeyChange('級別')}
                            >
                                <GraduationCap className="h-4 w-4" />
                                級別
                            </button>
                            <button
                                type="button"
                                role="tab"
                                className={`inline-flex items-center gap-2 rounded-lg px-4 sm:px-5 py-2 text-sm font-semibold transition ${parentKey === '職位' ? 'bg-primary text-primary-content shadow-sm' : 'text-base-content/60 hover:text-base-content'}`}
                                onClick={() => handleParentKeyChange('職位')}
                            >
                                <Briefcase className="h-4 w-4" />
                                職位
                            </button>
                        </div>

                        {/* 子級 Tabs */}
                        {loading && !alumniList.length ? (
                            <div className="flex justify-center py-4">
                                <Spinner size="md" />
                            </div>
                        ) : error ? (
                            <div className="flex items-center gap-2 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error" role="alert">
                                <AlertTriangle className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2" role="tablist">
                                {childOptions.map((option) => (
                                    <button
                                        type="button"
                                        role="tab"
                                        key={option.value}
                                        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${childKey === option.value ? 'border-primary bg-primary text-primary-content shadow-sm' : 'border-base-300 bg-base-100 text-base-content/70 hover:border-primary/40 hover:text-primary'}`}
                                        onClick={() => handleChildKeyChange(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* 系友列表區塊 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="alumni-grid-section"
                >
                    {isSearching && (
                        <div className="mb-5 flex flex-wrap items-center gap-3">
                            <Badge variant="primary" className="text-sm">
                                搜尋：「{searchQuery}」{alumniList.length > 0 ? ` · ${alumniList.length} 位系友` : ''}
                            </Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={resetSearch}
                            >
                                清除搜尋
                            </Button>
                        </div>
                    )}

                    {loading && alumniList.length > 0 ? (
                        <Card padding="lg">
                            <Spinner size="lg" center label="載入系友資料中..." />
                        </Card>
                    ) : error ? (
                        <div className="flex items-center gap-2 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error" role="alert">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            {error}
                        </div>
                    ) : emptyResult ? (
                        <Card padding="lg">
                            <EmptyState
                                icon={<AlertTriangle className="h-8 w-8" />}
                                title="沒有找到符合條件的系友"
                                description="請嘗試其他搜尋條件或篩選方式"
                                action={isSearching ? (
                                    <Button variant="primary" onClick={resetSearch}>
                                        查看所有系友
                                    </Button>
                                ) : null}
                            />
                        </Card>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {alumniList.map((alumni) => (
                                    <motion.div
                                        key={alumni.id}
                                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                        className="h-full"
                                    >
                                        <Card
                                            hover
                                            padding="none"
                                            className="group h-full cursor-pointer overflow-hidden"
                                            onClick={() => window.location.href = `/alumni/${alumni.id}`}
                                        >
                                            <div className="flex h-full">
                                                <div className="relative w-2/5 shrink-0 overflow-hidden bg-base-200">
                                                    <div className="aspect-[3/4] h-full w-full">
                                                        <img
                                                            src={getImageSrc(alumni.photo ? process.env.REACT_APP_BASE_URL + alumni.photo : null, 'avatar')}
                                                            alt={alumni.name}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            style={{ backgroundColor: '#f8fafc' }}
                                                            onError={(e) => handleImageError(e, 'avatar')}
                                                        />
                                                    </div>
                                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f172a]/25 to-transparent" />
                                                </div>
                                                <div className="flex w-3/5 flex-col p-4 sm:p-5">
                                                    <h3 className="font-serif text-base sm:text-lg font-bold text-base-content truncate">
                                                        {alumni.name || '未提供姓名'}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-primary font-medium line-clamp-2">
                                                        {(() => {
                                                            if (!alumni.position) {
                                                                return '職位未提供';
                                                            }
                                                            if (typeof alumni.position === 'string') {
                                                                return alumni.position;
                                                            }
                                                            if (typeof alumni.position === 'object' && alumni.position !== null) {
                                                                return String(alumni.position.title || alumni.position.name || '職位未提供');
                                                            }
                                                            return '職位未提供';
                                                        })()}
                                                    </p>
                                                    <div className="mt-2">
                                                        <Badge variant="secondary">
                                                            {alumni.graduate && alumni.graduate.grade ? `${alumni.graduate.grade}級` : '級別未提供'}
                                                        </Badge>
                                                    </div>
                                                    {alumni.company && (
                                                        <div className="mt-2 flex items-center gap-1.5 text-xs text-base-content/60">
                                                            <Building2 className="h-3.5 w-3.5 shrink-0" />
                                                            <span className="truncate">{alumni.company}</span>
                                                        </div>
                                                    )}
                                                    <div className="mt-auto pt-3 flex items-center gap-1 text-sm font-semibold text-primary transition group-hover:gap-2">
                                                        查看介紹
                                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>

                            {/* 分頁按鈕 */}
                            {totalPages > 1 && (
                                <div className="join mt-10 flex justify-center">
                                    <button
                                        type="button"
                                        className="join-item btn btn-sm sm:btn-md"
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                        aria-label="第一頁"
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        className="join-item btn btn-sm sm:btn-md"
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        aria-label="上一頁"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>

                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;
                                        // 只顯示當前頁附近的頁碼
                                        if (
                                            pageNumber === 1 ||
                                            pageNumber === totalPages ||
                                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    type="button"
                                                    key={pageNumber}
                                                    className={`join-item btn btn-sm sm:btn-md ${pageNumber === currentPage ? 'btn-active btn-primary' : ''}`}
                                                    onClick={() => handlePageChange(pageNumber)}
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        } else if (
                                            (pageNumber === currentPage - 2 && currentPage > 3) ||
                                            (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                                        ) {
                                            return (
                                                <button
                                                    type="button"
                                                    key={`ellipsis-${pageNumber}`}
                                                    className="join-item btn btn-sm sm:btn-md btn-disabled"
                                                    disabled
                                                >
                                                    …
                                                </button>
                                            );
                                        }
                                        return null;
                                    })}

                                    <button
                                        type="button"
                                        className="join-item btn btn-sm sm:btn-md"
                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        aria-label="下一頁"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        className="join-item btn btn-sm sm:btn-md"
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                        aria-label="最後一頁"
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>

            </div>
        </div>
    );
};

export default AlumniListPage;
