import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Form, Button } from 'react-bootstrap';
import Slider from 'react-slick';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'css/AlumniListPage.css';
import Axios from 'common/Axios';
import LoadingSpinner from 'components/LoadingSpinner';

const AlumniListPage = () => {
    const [key, setKey] = useState('全部'); // 預設顯示 "全部"
    const [alumniList, setAlumniList] = useState([]);
    const [featuredAlumni, setFeaturedAlumni] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // 搜尋字串
    const [yearsOrder, setYearOrder] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleKeyChange = (k) => {
        setLoading(true);
        setKey(k);
        Axios().get("member/any/get-by-grade/", { params: { grade: k } })
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

        // Fetch featured alumni
        Axios().get("member/any/featured-alumni/")
            .then((res) => {
                setFeaturedAlumni(res.data);
            })
            .catch((error) => {
                console.error('Error fetching featured alumni:', error);
            });
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
            <h1 className="text-center my-4">系友介紹</h1>

            {/* 傑出系友區塊 */}
            <h2 className="text-center my-4">傑出系友</h2>
            <Slider {...sliderSettings} className="mb-5">
                {featuredAlumni.slice(0, 8).map((alumni) => (
                    <div key={alumni.id} className="px-2">
                        <Card
                            className="h-100 shadow"
                            onClick={() => window.location.href = `/alumni/${alumni.id}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card.Img variant="top" src={process.env.REACT_APP_BASE_URL + alumni.photo} alt={alumni.name} />
                            <Card.Body>
                                <Card.Title>{alumni.name}</Card.Title>
                                <Card.Text>{alumni.position.title}</Card.Text>
                                <Card.Text>{alumni.graduate.grade}級</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </Slider>
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

            {/* 使用 Tabs 來區分不同學年度 */}
            {loading ? (
                <div className="d-flex justify-content-center my-4">
                    <LoadingSpinner />
                </div>
            ) : (
                <Tabs
                    id="alumni-year-tabs"
                    activeKey={key}
                    onSelect={(k) => handleKeyChange(k)}
                    className="mb-4"
                >
                    {yearsOrder.map((year) => (
                        <Tab eventKey={year.toString()} title={year === '全部' ? '全部' : `${year}級`} key={year}>
                            <Row>
                                {alumniList.map((alumni) => (
                                    <Col xs={12} sm={6} md={4} lg={2} className="mb-4 fade-in" key={alumni.id}>
                                        <Card
                                            className="h-100 shadow"
                                            onClick={() => window.location.href = `/alumni/${alumni.id}`}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Card.Img variant="top" src={process.env.REACT_APP_BASE_URL + alumni.photo} alt={alumni.name} />
                                            <Card.Body>
                                                <Card.Title>{alumni.name}</Card.Title>
                                                <Card.Text>{alumni.position.title}</Card.Text>
                                                <Card.Text>{alumni.graduate.grade}級</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Tab>
                    ))}
                </Tabs>
            )}
        </Container>
    );
};

export default AlumniListPage;
