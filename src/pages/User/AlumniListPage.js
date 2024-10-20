import React, { useState ,useEffect} from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'css/AlumniListPage.css'; // 為動畫效果準備的 CSS
import Axios from 'common/Axios';
import LoadingSpinner from 'components/LoadingSpinner';

const AlumniListPage = () => {
    const [key, setKey] = useState('全部'); // 預設顯示 "全部"
    const [alumnilist,setAlumniList] = useState([])
    const [searchQuery, setSearchQuery] = useState(''); // 搜尋字串
    const [yearsOrder,setYearOrder] = useState([])
    const [loading,setLoading] = useState(false)

    const handleKeyChange = (k) => {
        setLoading(true);
        setKey(k);
        Axios().get("member/any/get-by-grade/",{params:{
            grade:k
        }})
        .then((res) => {
            setAlumniList(res.data);
        })
        .catch((error) => {
            console.error('Error fetching alumni list:', error);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    const handleSearch = () => {
        setLoading(true);
        // 使用搜尋字串進行查詢
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
    }

    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(); // 當按下 Enter 時觸發搜尋
        }
    }

    // 根據搜尋與學年度篩選資料
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

        Axios().get("member/any/get-by-grade/",{params:{
            grade:key
        }})
        .then((res) => {
            setAlumniList(res.data);
        })
        .catch((error) => {
            console.error('Error fetching alumni list:', error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <Container>
            <h1 className="text-center my-4">系友介紹</h1>

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
                                {alumnilist.map((alumni) => (
                                    <Col xs={12} sm={6} md={4} lg={2} className="mb-4 fade-in" key={alumni.id}>
                                        <Card
                                            className="h-100 shadow"
                                            onClick={() => window.location.href = `/alumni/${alumni.id}`} // 點擊整個卡片跳轉
                                            style={{ cursor: 'pointer' }} // 滑鼠移過去變成手形
                                        >
                                            <Card.Img variant="top" src={process.env.REACT_APP_BASE_URL+alumni.photo} alt={alumni.name} />
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
