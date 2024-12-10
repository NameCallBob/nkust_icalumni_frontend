import React, { useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';

const FeaturedAlumni = ({ featuredAlumni }) => {
    const itemsPerPage = 6; // 每頁顯示6個
    const [currentPage, setCurrentPage] = useState(1); // 當前頁數

    // 計算分頁的範圍
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAlumni = featuredAlumni.slice(startIndex, startIndex + itemsPerPage);

    // 處理頁面切換
    const handleNextPage = () => {
        if (currentPage < Math.ceil(featuredAlumni.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <h2 className="text-center my-4">傑出系友</h2>
            <Row className="mb-4">
                {currentAlumni.map((alumni) => (
                    <Col key={alumni.id} xs={12} md={6} className="mb-4">
                        <Card
                            className="h-100 shadow d-flex flex-row"
                            style={{ cursor: 'pointer' }}
                            onClick={() => (window.location.href = `/alumni/${alumni.id}`)}
                        >
                            <Card.Img
                                variant="left"
                                src={alumni.photo}
                                alt={alumni.name}
                                style={{ width:'200px' , height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>
                                    {alumni.name}&nbsp;{alumni?.position?.title}
                                </Card.Title>
                                {/* 強調的成就 */}
                                <Card.Text style={{ fontWeight: 'bold', color: '#007bff' }}>
                                    {alumni.achievements}
                                </Card.Text>
                                {/* 可滾動的亮點描述 */}
                                <Card.Text
                                    style={{
                                        maxHeight: '80px',
                                        overflowY: 'auto',
                                        border: '1px solid #ddd',
                                        padding: '5px',
                                        borderRadius: '5px',
                                        backgroundColor: '#f9f9f9',
                                    }}
                                >
                                    {alumni.highlight}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {featuredAlumni.length > itemsPerPage && (
                <div className="d-flex justify-content-between">
                    <Button
                        variant="primary"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        上一頁
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleNextPage}
                        disabled={currentPage === Math.ceil(featuredAlumni.length / itemsPerPage)}
                    >
                        下一頁
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FeaturedAlumni;
