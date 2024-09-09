import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';

// 假資料：系友詳細資料
const alumniDetails = {
    1: { id: 1, name: '李小明', role: 'AI 研究員', description: '李小明在AI領域擁有多年的研究經驗...', photo: 'https://via.placeholder.com/150' },
    2: { id: 2, name: '王大華', role: '後端工程師', description: '王大華專注於高性能後端系統...', photo: 'https://via.placeholder.com/150' },
    3: { id: 3, name: '陳小花', role: '前端開發者', description: '陳小花對於使用者體驗與前端設計...', photo: 'https://via.placeholder.com/150' },
    // 更多假資料...
};

const AlumniDetailPage = () => {
    const { id } = useParams(); // 獲取 URL 中的 id
    const alumni = alumniDetails[id];

    if (!alumni) {
        return <p>系友資料未找到。</p>;
    }

    return (
        <Container className="my-4">
            <Card className="shadow-lg">
                <Card.Img variant="top" src={alumni.photo} alt={alumni.name} />
                <Card.Body>
                    <Card.Title>{alumni.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{alumni.role}</Card.Subtitle>
                    <Card.Text>{alumni.description}</Card.Text>
                    {/* 回到系友列表的按鈕 */}
                    <Link to="/" className="btn btn-secondary">
                        回到系友列表
                    </Link>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AlumniDetailPage;
