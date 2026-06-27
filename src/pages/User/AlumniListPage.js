import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Card, Tabs, Tab, Form,
    Button, Pagination, Alert, Badge, Spinner
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch, faFilter, faGraduationCap,
    faBriefcase, faExclamationTriangle, faTrophy, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from 'css/AlumniListPage.module.css';
import Axios from 'common/Axios';
import LoadingSpinner from 'components/LoadingSpinner';
import FeaturedAlumni from 'components/User/alumni/FeaturedAlumni';
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
        <Container fluid className="px-0" style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Container className="px-0 px-md-3">
            <SEO
                main={false}
                title="系友列表 | 智慧商務系友會"
                description="瀏覽智慧商務系友會成員名單，發現更多聯繫機會與合作夥伴。"
                keywords={["智慧商務", "系友列表", "成員", "校友"]}
            />
            </Container>

            {/* Page Header - Navy section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div style={{
                    background: '#1e3a8a',
                    padding: '3.5rem 2rem 3rem',
                    textAlign: 'center',
                    marginBottom: '0'
                }}>
                    <h1 style={{ fontWeight: '700', fontSize: '2.4rem', color: '#ffffff', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>系友名錄</h1>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', marginBottom: '0', maxWidth: '520px', margin: '0 auto' }}>探索並連結我們出色的校友網絡</p>
                    <div style={{ height: '3px', width: '60px', background: '#a0781c', margin: '1.25rem auto 0', borderRadius: '2px' }}></div>
                </div>
            </motion.div>

            <Container className="py-4 py-md-5">

            {/* 傑出校友區塊 */}
            {featuredSchool && featuredSchool.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ background: '#0f172a', borderRadius: '8px', padding: '2.5rem 2rem', marginBottom: '1.5rem' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.75rem' }}>
                        <FontAwesomeIcon icon={faTrophy} className="me-3" style={{ color: '#a0781c', fontSize: '1.5rem' }} />
                        <h2 style={{ color: '#ffffff', fontWeight: '700', margin: '0', fontSize: '1.5rem', letterSpacing: '-0.3px' }}>傑出校友</h2>
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
                    style={{ background: '#0f172a', borderRadius: '8px', padding: '2.5rem 2rem', marginBottom: '1.5rem' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.75rem' }}>
                        <FontAwesomeIcon icon={faTrophy} className="me-3" style={{ color: '#a0781c', fontSize: '1.5rem' }} />
                        <h2 style={{ color: '#ffffff', fontWeight: '700', margin: '0', fontSize: '1.5rem', letterSpacing: '-0.3px' }}>傑出系友</h2>
                    </div>
                    <FeaturedAlumni featuredAlumni={featured} />
                </motion.div>
            )}



            {/* 搜尋與篩選區塊 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={`${styles.filterSearchSection} mb-5`}
            >
                <Card className={styles.filterCard}>
                    <Card.Body className={styles.filterCardBody}>
                        <div className={styles.filterHeader}>
                            <div className={styles.filterHeaderLeft}>
                                <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
                                <h3 className={styles.filterTitle}>尋找系友</h3>
                            </div>
                            <Button
                                variant="link"
                                className={styles.helpButton}
                                onClick={toggleFilterInfo}
                            >
                                <small>篩選說明</small>
                            </Button>
                        </div>

                        {showFilterInfo && (
                            <Alert className={`${styles.infoAlert} mb-3`}>
                                <small>
                                    您可以透過「級別」查看不同屆別的系友，或透過「職位」篩選特定職務的系友。
                                    也可以直接在搜尋框中輸入關鍵字，查找特定系友、公司或專長。
                                </small>
                            </Alert>
                        )}

                        {/* 搜尋框 */}
                        <Form className={`${styles.searchForm} mb-4`} onKeyDown={handleEnterPress}>
                            <div className={styles.searchInputWrapper}>
                                <Form.Control
                                    type="text"
                                    placeholder="搜尋系友、公司、專長、產品..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className={styles.searchInput}
                                />
                                <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                                {isSearching && searchQuery && (
                                    <Button
                                        variant="link"
                                        className={styles.searchReset}
                                        onClick={resetSearch}
                                    >
                                        重置
                                    </Button>
                                )}
                            </div>
                        </Form>

                        {/* 父級 Tabs */}
                        <Tabs
                            id="parent-tabs"
                            activeKey={parentKey}
                            onSelect={(key) => handleParentKeyChange(key)}
                            className={`${styles.parentTabs} mb-3`}
                        >
                            <Tab
                                eventKey="級別"
                                title={
                                    <span>
                                        <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                                        級別
                                    </span>
                                }
                            />
                            <Tab
                                eventKey="職位"
                                title={
                                    <span>
                                        <FontAwesomeIcon icon={faBriefcase} className="me-2" />
                                        職位
                                    </span>
                                }
                            />
                        </Tabs>

                        {/* 子級 Tabs */}
                        {loading && !alumniList.length ? (
                            <div className="d-flex justify-content-center my-4">
                                <div className={styles.loadingSpinner}></div>
                            </div>
                        ) : error ? (
                            <Alert className={`${styles.errorAlert} mb-3`}>
                                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                                {error}
                            </Alert>
                        ) : (
                            <div className={styles.childTabsContainer}>
                                <Tabs
                                    id="child-tabs"
                                    activeKey={childKey}
                                    onSelect={(key) => handleChildKeyChange(key)}
                                    className={styles.childTabs}
                                >
                                    {childOptions.map((option) => (
                                        <Tab
                                            eventKey={option.value}
                                            title={option.label}
                                            key={option.value}
                                        />
                                    ))}
                                </Tabs>
                            </div>
                        )}
                    </Card.Body>
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
                    <div className="search-status mb-3">
                        <Badge bg="primary" className="p-2">
                            搜尋: "{searchQuery}" {alumniList.length > 0 ? `(${alumniList.length} 位系友)` : ''}
                        </Badge>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={resetSearch}
                            className="ms-2"
                        >
                            清除搜尋
                        </Button>
                    </div>
                )}

                {loading && alumniList.length > 0 ? (
                    <div className={styles.loadingOverlay}>
                        <Spinner animation="border" className={styles.loadingSpinner} />
                        <p className={`${styles.loadingText} mt-2`}>載入系友資料中...</p>
                    </div>
                ) : error ? (
                    <Alert className={`${styles.errorAlert} mb-3`}>
                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                        {error}
                    </Alert>
                ) : emptyResult ? (
                    <Alert className={`${styles.warningAlert} text-center py-5`}>
                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" size="lg" />
                        <h4 className="mt-3">沒有找到符合條件的系友</h4>
                        <p className="mb-0">請嘗試其他搜尋條件或篩選方式</p>
                        {isSearching && (
                            <Button
                                className={`${styles.resetButton} mt-3`}
                                onClick={resetSearch}
                            >
                                查看所有系友
                            </Button>
                        )}
                    </Alert>
                ) : (
                    <>
                        <div className={styles.alumniGrid}>
                            {alumniList.map((alumni) => (
                                <motion.div
                                    key={alumni.id}
                                    whileHover={{
                                        y: -3,
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    <Card
                                        className={`${styles.alumniCard} h-100`}
                                        onClick={() => window.location.href = `/alumni/${alumni.id}`}
                                    >
                                        <div className="row g-0 h-100">
                                            <div className="col-4">
                                                <div className={styles.imageWrapper}>
                                                    <div className={styles.imageOverlay}></div>
                                                    <Card.Img
                                                        src={getImageSrc(alumni.photo ? process.env.REACT_APP_BASE_URL + alumni.photo : null, 'avatar')}
                                                        alt={alumni.name}
                                                        className={styles.cardImage}
                                                        style={{ backgroundColor: '#f8fafc' }}
                                                        onError={(e) => handleImageError(e, 'avatar')}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-8">
                                                <Card.Body className={`${styles.cardBody} d-flex flex-column h-100`}>
                                                    <Card.Title className={`${styles.cardTitle} mb-1`}>{alumni.name || '未提供姓名'}</Card.Title>
                                                    <Card.Text className={`${styles.positionText} mb-1`}>
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
                                                    </Card.Text>
                                                    <span className={styles.gradeText}>
                                                        {alumni.graduate && alumni.graduate.grade ? `${alumni.graduate.grade}級` : '級別未提供'}
                                                    </span>
                                                    {alumni.company && (
                                                        <Card.Text className={`${styles.companyTag} mb-0`}>
                                                            {alumni.company}
                                                        </Card.Text>
                                                    )}
                                                    <div className={`${styles.viewProfile} mt-auto w-100`}>
                                                        查看介紹 <FontAwesomeIcon icon={faChevronRight} size="xs" />
                                                    </div>
                                                </Card.Body>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* 分頁按鈕 */}
                        {totalPages > 1 && (
                            <Pagination className={`${styles.pagination} justify-content-center mt-5`}>
                                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                                <Pagination.Prev onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} />

                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;
                                    // 只顯示當前頁附近的頁碼
                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === totalPages ||
                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                    ) {
                                        return (
                                            <Pagination.Item
                                                key={pageNumber}
                                                active={pageNumber === currentPage}
                                                onClick={() => handlePageChange(pageNumber)}
                                            >
                                                {pageNumber}
                                            </Pagination.Item>
                                        );
                                    } else if (
                                        (pageNumber === currentPage - 2 && currentPage > 3) ||
                                        (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                                    ) {
                                        return <Pagination.Ellipsis key={`ellipsis-${pageNumber}`} />;
                                    }
                                    return null;
                                })}

                                <Pagination.Next onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} />
                                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                            </Pagination>
                        )}
                    </>
                )}
            </motion.div>

            </Container>
        </Container>
    );
};

export default AlumniListPage;