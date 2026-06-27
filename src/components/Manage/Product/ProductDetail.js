import React from 'react';
import { Modal, Button, Row, Col, Image, Card, Badge, Carousel, Tab, Tabs } from 'react-bootstrap';
import { FaCheck, FaTimes, FaTag, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { handleImageError, getImageSrc } from '../../../utils/imageDefaults';

const ProductDetailModal = ({ product, show, onClose }) => {
    if (!product) return null;

    // 確保圖片可用性
    const hasImages = product.images && product.images.length > 0;
    
    // 格式化日期函數
    const formatDate = (dateString) => {
        if (!dateString) return '無日期資訊';
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title className="d-flex align-items-center">
                    <span className="me-2">{product.name}</span>
                    <Badge bg={product.is_active ? 'success' : 'danger'}>
                        {product.is_active ? '已啟用' : '未啟用'}
                    </Badge>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey="basic" className="mb-3">
                    <Tab eventKey="basic" title="基本資訊">
                        <Row>
                            <Col md={6}>
                                {hasImages ? (
                                    <Carousel variant="dark" className="product-detail-carousel mb-3 shadow-sm border">
                                        {product.images.map((image, index) => (
                                            <Carousel.Item key={index}>
                                                <div style={{ height: '300px', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image
                                                        src={getImageSrc(
                                                            typeof image === 'string' ? image : process.env.REACT_APP_BASE_URL + image.image,
                                                            'product'
                                                        )}
                                                        alt={`產品圖片 ${index + 1}`}
                                                        style={{ maxHeight: '300px', maxWidth: '100%', objectFit: 'contain' }}
                                                        onError={(e) => handleImageError(e, 'product')}
                                                    />
                                                </div>
                                                {index === 0 && (
                                                    <div className="position-absolute top-0 start-0 bg-warning text-dark p-1 m-2 rounded-pill">
                                                        <small>主圖</small>
                                                    </div>
                                                )}
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center bg-light" style={{height: '300px'}}>
                                        <FaInfoCircle size={30} className="text-muted me-2" />
                                        <span className="text-muted">無產品圖片</span>
                                    </div>
                                )}
                                
                                <Card className="mt-3 shadow-sm">
                                    <Card.Header className="bg-light">
                                        <FaTag className="me-2" />
                                        產品基本資訊
                                    </Card.Header>
                                    <Card.Body className="p-3">
                                        <dl className="row mb-0">
                                            <dt className="col-sm-4">產品編號</dt>
                                            <dd className="col-sm-8">{product.id}</dd>
                                            
                                            <dt className="col-sm-4">產品名稱</dt>
                                            <dd className="col-sm-8">{product.name}</dd>
                                            
                                            <dt className="col-sm-4">產品分類</dt>
                                            <dd className="col-sm-8">
                                                <Badge bg="secondary" className="text-white">
                                                    {product.category_name || '未分類'}
                                                </Badge>
                                            </dd>
                                            
                                            <dt className="col-sm-4">啟用狀態</dt>
                                            <dd className="col-sm-8">
                                                {product.is_active ? (
                                                    <span className="text-success">
                                                        <FaCheck className="me-1" /> 已啟用
                                                    </span>
                                                ) : (
                                                    <span className="text-danger">
                                                        <FaTimes className="me-1" /> 未啟用
                                                    </span>
                                                )}
                                            </dd>
                                            
                                            <dt className="col-sm-4">建立時間</dt>
                                            <dd className="col-sm-8">
                                                <FaCalendarAlt className="me-1" />
                                                {formatDate(product.created_at)}
                                            </dd>
                                        </dl>
                                    </Card.Body>
                                </Card>
                            </Col>
                            
                            <Col md={6}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Header className="bg-light">
                                        <FaInfoCircle className="me-2" />
                                        產品詳細描述
                                    </Card.Header>
                                    <Card.Body className="p-3">
                                        {product.description ? (
                                            <div className="product-description">
                                                {product.description.split('\n').map((paragraph, idx) => (
                                                    <p key={idx} className="mb-3">{paragraph}</p>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-5 text-muted">
                                                <FaInfoCircle size={30} className="mb-2" />
                                                <p>無產品描述</p>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab>
                    
                    <Tab eventKey="images" title="產品圖庫">
                        <div className="text-center mb-3">
                            <h5>產品圖片 ({hasImages ? product.images.length : 0})</h5>
                            <p className="text-muted">點擊圖片可放大查看</p>
                        </div>
                        
                        {hasImages ? (
                            <Row>
                                {product.images.map((image, index) => (
                                    <Col md={4} sm={6} className="mb-4" key={index}>
                                        <Card className="h-100 shadow-sm image-card">
                                            <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                                <Image
                                                    src={typeof image === 'string' ? image : process.env.REACT_APP_BASE_URL + image.image}
                                                    alt={`產品圖片 ${index + 1}`}
                                                    className="w-100 h-100 object-fit-cover"
                                                    onClick={() => window.open(typeof image === 'string' ? image : process.env.REACT_APP_BASE_URL + image.image, '_blank')}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                {index === 0 && (
                                                    <span className="position-absolute top-0 start-0 badge bg-warning m-1">
                                                        主圖
                                                    </span>
                                                )}
                                            </div>
                                            <Card.Footer className="text-muted text-center">
                                                圖片 {index + 1}
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <div className="text-center py-5 bg-light rounded">
                                <FaInfoCircle size={40} className="text-muted mb-3" />
                                <h5 className="text-muted">此產品尚未添加任何圖片</h5>
                                <p className="text-muted">可通過編輯產品來添加圖片</p>
                            </div>
                        )}
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onClose}>
                    關閉
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductDetailModal;