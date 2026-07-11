import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, SlidersHorizontal, GraduationCap, Briefcase,
    AlertTriangle, Trophy, Award, ChevronRight, Info, Building2, RotateCcw
} from 'lucide-react';
import Axios from 'common/Axios';
import FeaturedAlumni from 'components/User/alumni/FeaturedAlumni';
import {
    Button, Spinner, Card, Badge, EmptyState, Alert, Input, Pagination,
    Tabs, TabsList, TabsTrigger,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import SEO from 'SEO';
import { handleImageError, getImageSrc } from '../../utils/imageDefaults';

const AlumniListPage = () => {
    const navigate = useNavigate();

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
    const fetchAlumniList_normal = (parent, child, page = currentPage) => {
        setLoading(true);
        setError(null);
        setEmptyResult(false);
        const endpoint = parent === '級別' ? 'member/any/get-by-grade/' : 'member/any/get-by-position/';

        // 構建查詢參數
        let params = {
            page: page,
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
                if (res.data && res.data.results) {
                    // 分頁 API 回傳格式：以回應的 count 計算總頁數
                    setAlumniList(res.data.results);
                    setTotalPages(Math.max(1, Math.ceil(res.data.count / itemsPerPage)));
                    setEmptyResult(res.data.results.length === 0);
                } else if (res.data && Array.isArray(res.data)) {
                    // 後端回傳純陣列（無分頁 count）：沿用原本以陣列長度估算的邏輯
                    setAlumniList(res.data);
                    setTotalPages(Math.max(1, Math.ceil(res.data.length / itemsPerPage)));
                    setEmptyResult(res.data.length === 0);
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
                return []; // Return empty array on failure
            });

        const departmentAlumniPromise = Axios().get('member/outstanding-alumni/featured/')
            .then(res => res.data.results || [])
            .catch(err => {
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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.length === 0) {
            setIsSearching(false);
            fetchAlumniList_normal(parentKey, childKey);
        }
    };

    const performSearch = (page = currentPage) => {
        setLoading(true);
        setError(null);
        setEmptyResult(false);
        // 確保中文搜尋參數被正確編碼
        const searchTerm = searchQuery.trim();

        Axios().get("member/any/alumni-search/", {
            params: {
                q: searchTerm,
                page: page,
                page_size: itemsPerPage
            }
        })
            .then((res) => {
                if (res.data && res.data.results) {
                    setAlumniList(res.data.results);
                    setTotalPages(Math.max(1, Math.ceil(res.data.count / itemsPerPage)));
                    setEmptyResult(res.data.results.length === 0);
                } else if (res.data && Array.isArray(res.data)) {
                    // 純陣列（無分頁 count）：沿用原本以陣列長度估算的邏輯
                    setAlumniList(res.data);
                    setTotalPages(Math.max(1, Math.ceil(res.data.length / itemsPerPage)));
                    setEmptyResult(res.data.length === 0);
                } else {
                    setAlumniList([]);
                    setEmptyResult(true);
                }
            })
            .catch((error) => {
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
            performSearch(pageNumber);
        } else {
            fetchAlumniList_normal(parentKey, childKey, pageNumber);
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

    const goToAlumni = (id) => {
        if (id != null) navigate(`/alumni/${id}`);
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
                setError('獲取初始資料時發生錯誤，請重新整理頁面。');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
        // 僅在掛載時以初始 parentKey/childKey 執行一次；後續切換由
        // handleParentKeyChange / handleChildKeyChange 自行觸發 fetch，
        // 若把它們列為依賴會導致每次切換 tab 都重複打兩次 API。
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderPosition = (position) => {
        if (!position) return '職位未提供';
        if (typeof position === 'string') return position;
        if (typeof position === 'object') {
            return String(position.title || position.name || '職位未提供');
        }
        return '職位未提供';
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                main={false}
                title="系友列表 | 智慧商務系友會"
                description="瀏覽智慧商務系友會成員名單，發現更多聯繫機會與合作夥伴。"
                keywords={["智慧商務", "系友列表", "成員", "校友"]}
            />

            {/* Page Header - Navy hero */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--brand-navy-deep))] via-[hsl(var(--brand-navy))] to-[hsl(var(--primary))]">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_top_right,white,transparent_55%)]" />
                <div className="relative mx-auto max-w-6xl px-6 py-16 text-center sm:py-20">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
                        Alumni Directory
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                        系友名錄
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-sm text-white/70 sm:text-base">
                        探索並連結我們出色的校友網絡
                    </p>
                    <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-brand-gold to-brand-blue" />
                </div>
            </div>

            <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">

                {/* 傑出校友區塊 — 金色調，深色底 */}
                {featuredSchool && featuredSchool.length > 0 && (
                    <section
                        aria-labelledby="featured-school-heading"
                        className="rounded-2xl border-l-4 border-brand-gold bg-gradient-to-br from-[hsl(var(--brand-navy-deep))] to-[hsl(var(--brand-navy))] p-6 shadow-card sm:p-9"
                    >
                        <div className="mb-7 flex items-center gap-3">
                            <span aria-hidden="true" className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold">
                                <Trophy className="h-6 w-6" />
                            </span>
                            <div>
                                <h2 id="featured-school-heading" className="text-xl font-bold tracking-tight text-white sm:text-2xl">傑出校友</h2>
                                <p className="mt-1 text-xs text-white/60">本校傑出校友代表</p>
                                <div className="mt-1.5 h-0.5 w-10 rounded-full bg-brand-gold/70" />
                            </div>
                        </div>
                        <FeaturedAlumni featuredAlumni={featuredSchool} accent="gold" />
                    </section>
                )}

                {/* 傑出系友區塊 — 藍色調，淺色卡片底，與校友區塊做視覺區隔 */}
                {featured && featured.length > 0 && (
                    <section
                        aria-labelledby="featured-dept-heading"
                        className="rounded-2xl border-l-4 border-brand-blue bg-card p-6 shadow-card sm:p-9"
                    >
                        <div className="mb-7 flex items-center gap-3">
                            <span aria-hidden="true" className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                                <Award className="h-6 w-6" />
                            </span>
                            <div>
                                <h2 id="featured-dept-heading" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">傑出系友</h2>
                                <p className="mt-1 text-xs text-muted-foreground">智慧商務系傑出系友代表</p>
                                <div className="mt-1.5 h-0.5 w-10 rounded-full bg-brand-blue/70" />
                            </div>
                        </div>
                        <FeaturedAlumni featuredAlumni={featured} accent="blue" />
                    </section>
                )}

                {/* 搜尋與篩選區塊 */}
                <Card className="p-6 sm:p-8">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <span aria-hidden="true" className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <SlidersHorizontal className="h-5 w-5" />
                            </span>
                            <h3 className="text-lg font-bold text-foreground sm:text-xl">尋找系友</h3>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-primary"
                            onClick={toggleFilterInfo}
                            aria-expanded={showFilterInfo}
                        >
                            <Info className="h-4 w-4" />
                            篩選說明
                        </Button>
                    </div>

                    {showFilterInfo && (
                        <Alert variant="info" className="mb-5">
                            <Info className="h-4 w-4" />
                            <div className="text-sm leading-relaxed">
                                您可以透過「級別」查看不同屆別的系友，或透過「職位」篩選特定職務的系友。
                                也可以直接在搜尋框中輸入關鍵字，查找特定系友、公司或專長。
                            </div>
                        </Alert>
                    )}

                    {/* 搜尋框 */}
                    <form className="mb-6" onKeyDown={handleEnterPress} onSubmit={(e) => e.preventDefault()} role="search">
                        <div className="relative">
                            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                aria-label="搜尋系友"
                                placeholder="搜尋系友、公司、專長、產品..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="h-12 pl-12 pr-24"
                            />
                            {isSearching && searchQuery && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2"
                                    onClick={resetSearch}
                                >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    重置
                                </Button>
                            )}
                        </div>
                    </form>

                    {/* 父級 Tabs（級別 / 職位） */}
                    <div className="mb-5">
                        <Tabs value={parentKey} onValueChange={handleParentKeyChange}>
                            <TabsList>
                                <TabsTrigger value="級別">
                                    <GraduationCap className="h-4 w-4" />
                                    級別
                                </TabsTrigger>
                                <TabsTrigger value="職位">
                                    <Briefcase className="h-4 w-4" />
                                    職位
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* 子級篩選 */}
                    {loading && !alumniList.length ? (
                        <div className="flex justify-center py-4">
                            <Spinner size="md" />
                        </div>
                    ) : error ? (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <div>{error}</div>
                        </Alert>
                    ) : (
                        <div className="flex flex-wrap gap-2" role="group" aria-label="篩選條件">
                            {childOptions.map((option) => {
                                const active = childKey === option.value;
                                return (
                                    <button
                                        type="button"
                                        key={option.value}
                                        aria-pressed={active}
                                        className={cn(
                                            'inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                            active
                                                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                                : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary'
                                        )}
                                        onClick={() => handleChildKeyChange(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </Card>

                {/* 系友列表區塊 */}
                <div className="alumni-grid-section">
                    {isSearching && (
                        <div className="mb-5 flex flex-wrap items-center gap-3">
                            <Badge variant="default" className="text-sm">
                                搜尋：「{searchQuery}」{alumniList.length > 0 ? ` · ${alumniList.length} 位系友` : ''}
                            </Badge>
                            <Button variant="outline" size="sm" onClick={resetSearch}>
                                清除搜尋
                            </Button>
                        </div>
                    )}

                    {loading && alumniList.length > 0 ? (
                        <Card className="p-6 sm:p-8">
                            <Spinner size="lg" center label="載入系友資料中..." />
                        </Card>
                    ) : error ? (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <div>{error}</div>
                        </Alert>
                    ) : emptyResult ? (
                        <Card className="p-6 sm:p-8">
                            <EmptyState
                                icon={AlertTriangle}
                                title="沒有找到符合條件的系友"
                                description="請嘗試其他搜尋條件或篩選方式"
                                action={isSearching ? (
                                    <Button variant="default" onClick={resetSearch}>
                                        查看所有系友
                                    </Button>
                                ) : null}
                            />
                        </Card>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {alumniList.map((alumni) => (
                                    <div
                                        key={alumni.id}
                                        role="link"
                                        tabIndex={0}
                                        aria-label={`查看 ${alumni.name || '系友'} 的介紹`}
                                        onClick={() => goToAlumni(alumni.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                goToAlumni(alumni.id);
                                            }
                                        }}
                                        className="group h-full cursor-pointer overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-card transition-shadow hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <div className="flex h-full">
                                            <div className="relative w-2/5 shrink-0 overflow-hidden bg-muted">
                                                <div className="aspect-[3/4] h-full w-full">
                                                    <img
                                                        src={getImageSrc(alumni.photo ? process.env.REACT_APP_BASE_URL + alumni.photo : null, 'avatar')}
                                                        alt={alumni.name || '系友照片'}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                                                        onError={(e) => handleImageError(e, 'avatar')}
                                                    />
                                                </div>
                                                <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[hsl(var(--brand-navy-deep))]/25 to-transparent" />
                                            </div>
                                            <div className="flex w-3/5 flex-col p-4 sm:p-5">
                                                <h3 className="truncate text-base font-bold text-foreground sm:text-lg">
                                                    {alumni.name || '未提供姓名'}
                                                </h3>
                                                <p className="mt-1 line-clamp-2 text-sm font-medium text-primary">
                                                    {renderPosition(alumni.position)}
                                                </p>
                                                <div className="mt-2">
                                                    <Badge variant="secondary">
                                                        {alumni.graduate && alumni.graduate.grade ? `${alumni.graduate.grade}級` : '級別未提供'}
                                                    </Badge>
                                                </div>
                                                {alumni.company && (
                                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Building2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                                                        <span className="truncate">{alumni.company}</span>
                                                    </div>
                                                )}
                                                <div className="mt-auto flex items-center gap-1 pt-3 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                                                    查看介紹
                                                    <ChevronRight aria-hidden="true" className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 分頁 */}
                            <Pagination
                                className="mt-10"
                                page={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AlumniListPage;
