import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Form, Button, Pagination } from 'react-bootstrap';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'css/AlumniListPage.css';
import Axios from 'common/Axios';
import LoadingSpinner from 'components/LoadingSpinner';
import FeaturedAlumni from 'components/User/alumni/featrued';
import SEO from 'SEO';

const AlumniListPage = () => {
    const [parentKey, setParentKey] = useState('級別'); // 父級 Tabs 預設
    const [childKey, setChildKey] = useState('全部'); // 子級 Tabs 預設
    const [childOptions, setChildOptions] = useState([]); // 子級選項

    const [key, setKey] = useState('全部'); // 預設顯示 "全部"
    const [alumniList, setAlumniList] = useState([]);
    const [featured, setFeaturedAlumni] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // 搜尋字串
    const [yearsOrder, setYearOrder] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1); // 當前頁碼
    const [itemsPerPage] = useState(8); // 每頁顯示的項目數量
    const [paginatedList, setPaginatedList] = useState([]); // 當前分頁的資料

    // 切換父級 Tabs 時
    const handleParentKeyChange = (key) => {
        setParentKey(key);
        setChildKey('全部');
        fetchChildOptions(key); // 獲取子級資料
    };

    // 切換子級 Tabs 時
    const handleChildKeyChange = (key) => {
        setChildKey(key);
        fetchAlumniList_normal(parentKey, key); // 根據父子級請求資料
    };

    // 從後端獲取子級選項
    const fetchChildOptions = (key) => {
        setLoading(true);
        const endpoint = key === '級別' ? 'member/graduate/unique-grades/' : 'member/position/get-all/';
        Axios().get(endpoint)
            .then((res) => {
                if (key === '級別') {
                    setChildOptions(['全部', ...res.data]);
                } else {
                    const positions = [{ id: null, title: '全部' }, ...res.data];
                    setChildOptions(positions);
                }
            })
            .catch((error) => {
                console.error(`Error fetching ${key} options:`, error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // 從後端獲取系友資料
    const fetchAlumniList_normal = (parent, child) => {
        setLoading(true);
        const endpoint = parent === '級別' ? 'member/any/get-by-grade/' : 'member/any/get-by-position/';
        const params = { [parent === '級別' ? 'grade' : 'position']: child === '全部' ? null : child };

        Axios().get(endpoint, { params })
            .then((res) => {
                setAlumniList(res.data);
            })
            .catch((error) => {
                console.error('Error fetching alumni list:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // 獲取傑出系友資料
    const fetchAlumniList_outstanding = () => {
        Axios().get('member/outstanding-alumni/')
            .then((res) => {
                setFeaturedAlumni(res.data.results);
            })
    };

    const handleSearch = () => {
        setLoading(true);
        Axios().get("member/any/alumni-search/", { params: { q: searchQuery } })
            .then((res) => {
                setAlumniList(res.data);
            })
            .catch((error) => {
                console.error('Error fetching search results:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // 處理分頁切換
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(); // 當按下 Enter 時觸發搜尋
        }
    };

    useEffect(() => {
        setLoading(true);
        Axios().get("member/graduate/unique-grades/")
            .then((res) => {
                let tmp_array = ["全部"];
                setYearOrder(tmp_array.concat(res.data));
            })
            .catch((error) => {
                console.error('Error fetching year data:', error);
            });

        Axios().get("member/any/get-by-grade/", { params: { grade: key } })
            .then((res) => {
                setAlumniList(res.data);
            })
            .catch((error) => {
                console.error('Error fetching alumni list:', error);
            })
            .finally(() => {
                setLoading(false);
            });
            fetchChildOptions(parentKey);
            fetchAlumniList_normal(parentKey, childKey);
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992, // For tablets and smaller devices
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 576, // For mobile devices
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <Container>
            <SEO
            main={false}
      title="系友們"
      description="瀏覽智慧商務系友會成員名單，發現更多聯繫機會與合作夥伴。"
      keywords={["智慧商務", "系友列表", "成員"]}
    />

            <h1 className="text-center my-4">系友介紹</h1>

            <FeaturedAlumni featuredAlumni={featured} />

            <h2 className="text-center my-4">各系友級別</h2>
            {/* 搜尋框 */}
            <Form className="mb-4" onKeyDown={handleEnterPress}>
                <Row>
                    <Col xs={10}>
                        <Form.Control
                            type="text"
                            placeholder="搜尋系友、公司、專長、產品..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Col>
                    <Col xs={2}>
                        <Button variant="primary" onClick={handleSearch} block>查詢</Button>
                    </Col>
                </Row>
            </Form>
            
            {/* 父級 Tabs */}
            <Tabs
                id="parent-tabs"
                activeKey={parentKey}
                onSelect={(key) => handleParentKeyChange(key)}
                className="mb-4"
            >
                <Tab eventKey="級別" title="級別" />
                <Tab eventKey="職位" title="職位" />
            </Tabs>

            {/* 子級 Tabs */}
            {loading ? (
                <div className="d-flex justify-content-center my-4">
                    <LoadingSpinner />
                </div>
            ) : (
                <Tabs
                    id="child-tabs"
                    activeKey={childKey}
                    onSelect={(key) => handleChildKeyChange(key)}
                    className="mb-4"
                >
                    {childOptions.map((option) =>
                        parentKey === '級別' ? (
                            <Tab eventKey={option} title={option === '全部' ? '全部' : option} key={option} />
                        ) : (
                            <Tab eventKey={option.id} title={option.title} key={option.id} />
                        )
                    )}
                </Tabs>
            )}

<>
                    <Row>
                        {paginatedList.map((alumni) => (
                            <Col xs={12} sm={6} md={4} lg={3} className="mb-4" key={alumni.id}>
                                <Card
                                    className="h-100 shadow-hover position-relative"
                                    onClick={() => window.location.href = `/alumni/${alumni.id}`}
                                    style={{ cursor: 'pointer', overflow: 'hidden' }}
                                >
                                    <div className="image-wrapper">
                                        <div className="overlay"></div>
                                        <Card.Img
                                            variant="top"
                                            src={process.env.REACT_APP_BASE_URL + alumni.photo}
                                            alt={alumni.name}
                                            className="image-fixed"
                                        />
                                    </div>
                                    <Card.Body className="d-flex flex-column align-items-start">
                                        <Card.Title className="title-hover mb-1">{alumni.name}&nbsp;</Card.Title>
                                        <Card.Text className="text-muted small">{alumni.position.title}</Card.Text>
                                        <Card.Text className="text-primary small">{alumni.graduate.grade}級</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* 分頁按鈕 */}
                    <Pagination className="justify-content-center mt-4">
                        {Array.from({ length: Math.ceil(alumniList.length / itemsPerPage) }).map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </>

        </Container>
    );
};

export default AlumniListPage;
