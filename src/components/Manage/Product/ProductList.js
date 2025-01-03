import React from 'react';
import { Row, Col, Card, Button, Carousel } from 'react-bootstrap';

const ProductList = ({ products, onEdit, onDelete, onProductClick, currentPage, totalPages, onPageChange }) => {
    return (
        <>
            <Row>
                {products.map((product) => (
                    <Col md={6} lg={4} className="mb-4" key={product.id}>
                        <Card>
                            <Carousel variant="dark">
                                {product.images && product.images.length > 0 ? (
                                    product.images.map((image, index) => (
                                        <Carousel.Item key={index}>
                                            <img
                                                className="d-block w-100"
                                                style={{
                                                    width: '300px', // 固定寬度
                                                    height: '200px', // 固定高度
                                                    objectFit: 'cover', // 防止圖片變形
                                                }}
                                                src={process.env.REACT_APP_BASE_URL + image.image}
                                                alt={`產品圖片 ${index + 1}`}
                                            />
                                        </Carousel.Item>
                                    ))
                                ) : (
                                    <Carousel.Item>
                                        <img
                                            className="d-block w-100"
                                            src="/placeholder.png"
                                            alt="預設圖片"
                                        />
                                    </Carousel.Item>
                                )}
                            </Carousel>
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>{product.description}</Card.Text>
                                <Button
                                    variant="primary"
                                    className="me-2"
                                    onClick={() => onEdit(product)}
                                >
                                    編輯
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => onDelete(product.id)}
                                >
                                    刪除
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className="d-flex justify-content-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        variant={page === currentPage ? 'primary' : 'outline-primary'}
                        onClick={() => onPageChange(page)}
                        className="mx-1"
                    >
                        {page}
                    </Button>
                ))}
            </div>
        </>
    );
};

export default ProductList;