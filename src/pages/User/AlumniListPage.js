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
import 'css/AlumniListPage.css';
import Axios from 'common/Axios';
import LoadingSpinner from 'components/LoadingSpinner';
import FeaturedAlumni from 'components/User/alumni/featrued';
import SEO from 'SEO';
import { debounce } from 'lodash';

const AlumniListPage = () => {
    const [parentKey, setParentKey] = useState('級別');
    const [childKey, setChildKey] = useState('全部');
    const [childOptions, setChildOptions] = useState([]);
    const [alumniList, setAlumniList] = useState([]);
    const [featured, setFeaturedAlumni] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [yearsOrder, setYearOrder] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emptyResult, setEmptyResult] = useState(false);

    // 分頁相關
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // 增加每頁顯示的數量
    const [totalPages, setTotalPages] = useState(1);
    
    // UI 相關狀態
    const [isSearching, setIsSearching] = useState(false);
    const [showFilterInfo, setShowFilterInfo] = useState(false);

    // 切換父級 Tabs 時
    const handleParentKeyChange = (key) => {
        setError(null);
        setParentKey(key);
        setChildKey('全部');
        fetchChildOptions(key);
    };

    // 2. 修改 handleChildKeyChange 函數以處理職位"全部"的情況
    const handleChildKeyChange = (key) => {
        setError(null);
        setChildKey(key);
        setCurrentPage(1); // 重置分頁
        
        // 處理職位"全部"的特殊情況
        if (parentKey === '職位' && key === 'all') {
            fetchAlumniList_normal(parentKey, null);
        } else {
            fetchAlumniList_normal(parentKey, key);
        }
    };


// 1. 修改 fetchChildOptions 函數
const fetchChildOptions = (key) => {
    setLoading(true);
    setError(null);
    const endpoint = key === '級別' ? 'member/graduate/unique-grades/' : 'member/position/get-all/';
    
    Axios().get(endpoint)
        .then((res) => {
            if (key === '級別') {
                setChildOptions(['全部', ...res.data]);
            } else {
                // 確保數據格式正確
                const positions = res.data && Array.isArray(res.data) 
                    ? [{ id: 'all', title: '全部' }, ...res.data]
                    : [{ id: 'all', title: '全部' }];
                setChildOptions(positions);
            }
            setEmptyResult(false);
            
            // 在獲取新選項後，自動選擇"全部"選項
            if (key === '級別') {
                setChildKey('全部');
                fetchAlumniList_normal('級別', '全部');
            } else {
                setChildKey('all');  // 使用 'all' 作為職位的全部選項ID
                fetchAlumniList_normal('職位', 'all');
            }
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
        
        // 根據父標籤類型添加不同參數
        if (parent === '級別') {
            params.grade = child === '全部' ? null : child;
        } else {
            // 職位參數 - 如果是 'all' 或者 null，則不添加 position 參數
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
        Axios().get('member/outstanding-alumni/featured/')
            .then((res) => {
                setFeaturedAlumni(res.data.results || []);
            })
            .catch((error) => {
                // console.error('Error fetching featured alumni:', error);
                // 傑出系友讀取失敗不顯示錯誤信息，只在控制台輸出
                setFeaturedAlumni([]);
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
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
        
        // 並行請求，提高加載效率
        const fetchInitialData = async () => {
            try {
                // 獲取年級數據
                const gradesResponse = await Axios().get("member/graduate/unique-grades/");
                let tmp_array = ["全部"];
                setYearOrder(tmp_array.concat(gradesResponse.data));
                
                // 獲取子級選項
                await fetchChildOptions(parentKey);
                
                // 獲取系友列表
                await fetchAlumniList_normal(parentKey, childKey);
                
                // 獲取傑出系友
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
        <Container className="alumni-list-container py-5 my-5">
            <SEO
                main={false}
                title="系友列表 | 智慧商務系友會"
                description="瀏覽智慧商務系友會成員名單，發現更多聯繫機會與合作夥伴。"
                keywords={["智慧商務", "系友列表", "成員", "校友"]}
            />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="header-section mb-5">
                    <h1 className="text-center display-4 fw-bold mb-2">系友介紹</h1>
                    <p className="text-center text-muted lead">探索並連結我們出色的校友網絡</p>
                    <div className="header-divider"></div>
                </div>
            </motion.div>

            {/* 傑出系友區塊 */}
            {featured && featured.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="featured-section mb-5"
                >
                    <div className="section-header d-flex align-items-center mb-4">
                        <FontAwesomeIcon icon={faTrophy} className="text-warning me-2" />
                        <h2 className="m-0">傑出系友</h2>
                    </div>
                    <FeaturedAlumni featuredAlumni={featured} />
                </motion.div>
            )}

            {/* 搜尋與篩選區塊 */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="filter-search-section mb-5"
            >
                <Card className="shadow-sm border-0">
                    <Card.Body>
                        <div className="section-header d-flex align-items-center justify-content-between mb-4">
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faFilter} className="text-primary me-2" />
                                <h3 className="m-0">尋找系友</h3>
                            </div>
                            <Button 
                                variant="link" 
                                className="text-muted p-0" 
                                onClick={toggleFilterInfo}
                            >
                                <small>篩選說明</small>
                            </Button>
                        </div>
                        
                        {showFilterInfo && (
                            <Alert variant="info" className="mb-3">
                                <small>
                                    您可以透過「級別」查看不同屆別的系友，或透過「職位」篩選特定職務的系友。
                                    也可以直接在搜尋框中輸入關鍵字，查找特定系友、公司或專長。
                                </small>
                            </Alert>
                        )}
                        
                        {/* 搜尋框 */}
                        <Form className="mb-4 search-form" onKeyDown={handleEnterPress}>
                            <div className="position-relative">
                                <Form.Control
                                    type="text"
                                    placeholder="搜尋系友、公司、專長、產品..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="py-2 ps-4 shadow-sm border-0"
                                />
                                <FontAwesomeIcon icon={faSearch} className="position-absolute search-icon" />
                                {isSearching && searchQuery && (
                                    <Button 
                                        variant="link" 
                                        className="position-absolute search-reset" 
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
                            className="mb-3 parent-tabs"
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
                                <LoadingSpinner />
                            </div>
                        ) : error ? (
                            <Alert variant="danger" className="mb-3">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                                {error}
                            </Alert>
                        ) : (
                            <div className="child-tabs-container">
                                <Tabs
                                    id="child-tabs"
                                    activeKey={childKey}
                                    onSelect={(key) => handleChildKeyChange(key)}
                                    className="child-tabs"
                                >
                                    {childOptions.map((option) => {
                                        if (parentKey === '級別') {
                                            // 級別是字符串
                                            return (
                                                <Tab 
                                                    eventKey={option} 
                                                    title={option === '全部' ? '全部' : `${option}級`} 
                                                    key={option} 
                                                />
                                            );
                                        } else {
                                            // 職位是對象，檢查確保有必要的屬性
                                            if (typeof option === 'object' && option !== null) {
                                                return (
                                                    <Tab 
                                                        eventKey={option.id} 
                                                        title={option.title || '未知職位'} 
                                                        key={option.id || Math.random().toString()} 
                                                    />
                                                );
                                            }
                                            return null;
                                        }
                                    })}
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
                    <div className="alumni-loading-overlay">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">載入系友資料中...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="mb-3">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                        {error}
                    </Alert>
                ) : emptyResult ? (
                    <Alert variant="warning" className="text-center py-5">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" size="lg" />
                        <h4 className="mt-3">沒有找到符合條件的系友</h4>
                        <p className="mb-0">請嘗試其他搜尋條件或篩選方式</p>
                        {isSearching && (
                            <Button 
                                variant="outline-primary" 
                                className="mt-3" 
                                onClick={resetSearch}
                            >
                                查看所有系友
                            </Button>
                        )}
                    </Alert>
                ) : (
                    <>
                        <Row className="alumni-grid">
                            {alumniList.map((alumni) => (
                                <Col xs={12} sm={6} md={4} lg={3} className="mb-4" key={alumni.id}>
                                    <motion.div
                                        whileHover={{ 
                                            y: -5,
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        <Card
                                            className="alumni-card h-100 border-0 shadow-sm"
                                            onClick={() => window.location.href = `/alumni/${alumni.id}`}
                                        >
                                            <div className="image-wrapper">
                                                <div className="overlay"></div>
                                                {alumni.photo ? (
                                                    <Card.Img
                                                        variant="top"
                                                        src={process.env.REACT_APP_BASE_URL + alumni.photo}
                                                        alt={alumni.name}
                                                        className="card-img"
                                                        onError={(e) => {
                                                            // 先前出現反覆拿預設圖片的問題
                                                                if (!e.target.getAttribute('data-error-handled')) {
                                                                    e.target.setAttribute('data-error-handled', 'true');
                                                                    e.target.src = '/images/avatar-placeholder.png';
                                                                }
                                                        }}
                                                    />
                                                ) : (
                                                    <Card.Img
                                                        variant="top"
                                                        src="/images/avatar-placeholder.png"
                                                        alt={alumni.name}
                                                        className="card-img"
                                                    />
                                                )}
                                            </div>
                                            <Card.Body className="d-flex flex-column align-items-start">
                                                <Card.Title className="mb-1 fw-bold">{alumni.name || '未提供姓名'}</Card.Title>
                                                <Card.Text className="text-muted small mb-1">
                                                    {alumni.position && alumni.position.title ? alumni.position.title : '職位未提供'}
                                                </Card.Text>
                                                <Card.Text className="text-primary small mb-2">
                                                    {alumni.graduate && alumni.graduate.grade ? `${alumni.graduate.grade}級` : '級別未提供'}
                                                </Card.Text>
                                                {alumni.company && (
                                                    <Card.Text className="company-tag">
                                                        {alumni.company}
                                                    </Card.Text>
                                                )}
                                                <div className="mt-auto pt-2 w-100 text-end">
                                                    <small className="text-muted view-profile">
                                                        查看詳情 <FontAwesomeIcon icon={faChevronRight} size="xs" />
                                                    </small>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>

                        {/* 分頁按鈕 */}
                        {totalPages > 1 && (
                            <Pagination className="justify-content-center mt-5">
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
    );
};

export default AlumniListPage;