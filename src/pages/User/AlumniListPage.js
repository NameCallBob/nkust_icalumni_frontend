import React, { useState } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'css/AlumniListPage.css'; // 為動畫效果準備的 CSS

// 假資料：系友名單
const alumniData = [
    { id: 1, name: '李小明', role: 'AI 研究員', year: 100, photo: 'https://via.placeholder.com/100' },
    { id: 2, name: '王大華', role: '後端工程師', year: 101, photo: 'https://via.placeholder.com/100' },
    { id: 3, name: '陳小花', role: '前端開發者', year: 102, photo: 'https://via.placeholder.com/100' },
    { id: 4, name: '林小真', role: '全端工程師', year: 103, photo: 'https://via.placeholder.com/100' },
    { id: 5, name: '張大龍', role: '資料科學家', year: 104, photo: 'https://via.placeholder.com/100' },
    { id: 6, name: '吳小杰', role: '網路工程師', year: 105, photo: 'https://via.placeholder.com/100' },
    { id: 7, name: '黃小光', role: '系統管理員', year: 106, photo: 'https://via.placeholder.com/100' },
    // 更多假資料...
];

// 學年度排序
const yearsOrder = ['全部', 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];

// 搜尋過濾功能
const filterAlumniBySearch = (alumniList, searchQuery) => {
    if (!searchQuery) return alumniList;
    return alumniList.filter((alumni) =>
        alumni.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
};

// 根據學年度過濾
const filterAlumniByYear = (alumniList, selectedYear) => {
    if (selectedYear === '全部') return alumniList; // 若選擇的是 "全部"，返回所有資料
    return alumniList.filter((alumni) => alumni.year === parseInt(selectedYear)); // 確保 year 是數字
};

const AlumniListPage = () => {
    const [key, setKey] = useState('全部'); // 預設顯示 "全部"
    const [searchQuery, setSearchQuery] = useState(''); // 搜尋字串

    // 根據搜尋與學年度篩選資料
    const filteredAlumni = filterAlumniBySearch(
        filterAlumniByYear(alumniData, key),
        searchQuery
    );

    return (
        <Container>
            <h1 className="text-center my-4">系友介紹</h1>

            {/* 搜尋框 */}
            <Form className="mb-4">
                <Form.Control
                    type="text"
                    placeholder="搜尋系友、公司、專長、產品..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Form>

            {/* 使用 Tabs 來區分不同學年度 */}
            <Tabs
                id="alumni-year-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-4"
            >
                {yearsOrder.map((year) => (
                    <Tab eventKey={year.toString()} title={year === '全部' ? '全部' : `${year}級`} key={year}>
                        <Row>
                            {filteredAlumni.map((alumni) => (
                                <Col xs={12} sm={6} md={4} lg={2} className="mb-4 fade-in" key={alumni.id}>
                                    <Card
                                        className="h-100 shadow"
                                        onClick={() => window.location.href = `/alumni/${alumni.id}`} // 點擊整個卡片跳轉
                                        style={{ cursor: 'pointer' }} // 滑鼠移過去變成手形
                                    >
                                        <Card.Img variant="top" src={alumni.photo} alt={alumni.name} />
                                        <Card.Body>
                                            <Card.Title>{alumni.name}</Card.Title>
                                            <Card.Text>{alumni.role}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Tab>
                ))}
            </Tabs>
        </Container>
    );
};

export default AlumniListPage;
