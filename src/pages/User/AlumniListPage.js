import React, { useState } from 'react';
import { Container, Row, Col, Card, Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'css/AlumniListPage.css'; // 為動畫效果準備的 CSS

// 假資料：系友名單
const alumniData = [
    { id: 1, name: '李小明', role: 'AI 研究員', position: '會長', photo: 'https://via.placeholder.com/100' },
    { id: 2, name: '王大華', role: '後端工程師', position: '副會長', photo: 'https://via.placeholder.com/100' },
    { id: 3, name: '陳小花', role: '前端開發者', position: '幹部', photo: 'https://via.placeholder.com/100' },
    { id: 4, name: '林小真', role: '全端工程師', position: '會員', photo: 'https://via.placeholder.com/100' },
    { id: 5, name: '張大龍', role: '資料科學家', position: '師長', photo: 'https://via.placeholder.com/100' },
    { id: 6, name: '吳小杰', role: '網路工程師', position: '理事', photo: 'https://via.placeholder.com/100' },
    { id: 7, name: '黃小光', role: '系統管理員', position: '監事', photo: 'https://via.placeholder.com/100' },
    // 更多假資料...
];

// 將資料根據職位分組
const positionsOrder = [
    '師長', '會長', '副會長', '總幹事', '常務理事', '常務監事', '理事', '監事', '幹部', '會員'
];

// 將系友資料依照職位進行分類
const groupByPosition = (data) => {
    const grouped = {};
    data.forEach((alumni) => {
        const position = alumni.position;
        if (!grouped[position]) {
            grouped[position] = [];
        }
        grouped[position].push(alumni);
    });
    return grouped;
};

const AlumniListPage = () => {
    const groupedAlumni = groupByPosition(alumniData);
    const [key, setKey] = useState('師長'); // 預設顯示 "師長"

    return (
        <Container>
            <h1 className="text-center my-4">系友介紹</h1>

            {/* 使用 Tabs 來區分不同職位 */}
            <Tabs
                id="alumni-position-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-4"
            >
                {positionsOrder.map((position) => (
                    groupedAlumni[position] && (
                        <Tab eventKey={position} title={position} key={position}>
                            <Row>
                                {groupedAlumni[position].map((alumni) => (
                                    <Col xs={12} sm={6} md={4} lg={2} className="mb-4 fade-in" key={alumni.id}>
                                        <Card className="h-100 shadow">
                                            <Card.Img variant="top" src={alumni.photo} alt={alumni.name} />
                                            <Card.Body>
                                                <Card.Title>{alumni.name}</Card.Title>
                                                <Card.Text>{alumni.role}</Card.Text>
                                                {/* 點擊卡片跳轉到對應的系友詳細介紹頁面 */}
                                                <a href={`/alumni/${alumni.id}`} className="btn btn-primary">
                                                    查看詳細介紹
                                                </a>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Tab>
                    )
                ))}
            </Tabs>
        </Container>
    );
};

export default AlumniListPage;
