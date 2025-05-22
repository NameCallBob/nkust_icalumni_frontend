import React from 'react';
import { Row, Col, Card, Button, Carousel, Badge, Spinner } from 'react-bootstrap';
import { FaPen, FaTrash, FaEye, FaCheck, FaTimes, FaCalendarAlt, FaImage, FaInfoCircle } from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const ProductList = ({ 
    products, 
    onEdit, 
    onDelete, 
    onProductClick, 
    currentPage, 
    totalPages, 
    onPageChange,
    isLoading
}) => {
    // 獲取圖片URL，處理字符串或對象類型的圖片
    const getImageUrl = (image) => {
        if (!image) return '/placeholder.png';
        return typeof image === 'string' ? image : process.env.REACT_APP_BASE_URL + image.image;
    };
    
    // 格式化日期顯示
    const formatDate = (dateString) => {
        if (!dateString) return '無日期';
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        });
    };
    
    // 截斷文本
    const truncateText = (text, maxLength = 80) => {
        if (!text) return '';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    // 如果正在加載，顯示加載指示器
    if (isLoading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">正在載入產品資料...</p>
            </div>
        );
    }

    // 如果沒有產品，顯示提示信息
    if (!products || products.length === 0) {
        return (
            <div className="text-center py-5 bg-light rounded">
                <FaInfoCircle size={40} className="text-muted mb-3" />
                <h4 className="text-muted">無產品資料</h4>
                <p className="text-muted">目前沒有符合查詢條件的產品，請嘗試調整搜索條件或新增產品。</p>
                <style jsx>{`
                    .empty-state {
                        padding: 3rem;
                        border-radius: 0.5rem;
                        background-color: #f8f9fa;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <>
            <Row className="product-grid">
                {products.map((product) => (
                    <Col md={6} lg={4} className="mb-4" key={product.id}>
                        <Card className="h-100 product-card shadow-sm transition-hover">
                            <div className="position-relative">
                                <Carousel interval={null} variant="dark" className="product-carousel">
                                    {product.images && product.images.length > 0 ? (
                                        product.images.map((image, index) => (
                                            <Carousel.Item key={index}>
                                                <div 
                                                    className="product-image-container"
                                                    style={{
                                                        height: '200px',
                                                        background: '#f8f9fa',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <img
                                                        className="product-image"
                                                        style={{
                                                            maxHeight: '200px',
                                                            maxWidth: '100%',
                                                            objectFit: 'contain',
                                                        }}
                                                        src={getImageUrl(image)}
                                                        alt={`${product.name} - 圖片 ${index + 1}`}
                                                    />
                                                </div>
                                                {index === 0 && (
                                                    <div className="position-absolute top-0 start-0 bg-warning text-dark p-1 m-2 rounded-pill">
                                                        <small>主圖</small>
                                                    </div>
                                                )}
                                            </Carousel.Item>
                                        ))
                                    ) : (
                                        <Carousel.Item>
                                            <div className="d-flex align-items-center justify-content-center bg-light" style={{height: '200px'}}>
                                                <FaImage size={40} className="text-muted" />
                                            </div>
                                        </Carousel.Item>
                                    )}
                                </Carousel>
                                
                                <div className="position-absolute top-0 end-0 m-2">
                                    <Badge 
                                        bg={product.is_active ? 'success' : 'danger'} 
                                        className="status-badge"
                                    >
                                        {product.is_active ? 
                                            <><FaCheck className="me-1" /> 已啟用</> : 
                                            <><FaTimes className="me-1" /> 未啟用</>
                                        }
                                    </Badge>
                                </div>
                            </div>
                            
                            <Card.Body className="d-flex flex-column">
                                <Card.Title 
                                    className="product-title fw-bold mb-2" 
                                    style={{cursor: 'pointer'}}
                                    onClick={() => onProductClick(product)}
                                >
                                    {product.name}
                                </Card.Title>
                                
                                <Card.Text className="text-muted small mb-1">
                                    <Badge bg="secondary" className="me-1">
                                        {product.category_name || '未分類'}
                                    </Badge>
                                </Card.Text>
                                
                                <Card.Text className="product-description text-muted mb-3 small">
                                    {truncateText(product.description)}
                                </Card.Text>
                                
                                <div className="text-muted small mb-3 mt-auto">
                                    <FaCalendarAlt className="me-1" /> 
                                    {formatDate(product.created_at)}
                                </div>
                                
                                <div className="d-flex justify-content-between mt-auto">
                                    <Tippy content="查看詳情">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="me-1"
                                            onClick={() => onProductClick(product)}
                                        >
                                            <FaEye className="me-1" /> 詳情
                                        </Button>
                                    </Tippy>
                                    
                                    <div>
                                        <Tippy content="編輯產品">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                className="me-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(product);
                                                }}
                                            >
                                                <FaPen /> 編輯
                                            </Button>
                                        </Tippy>
                                        
                                        <Tippy content="刪除產品">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm(`確定要刪除「${product.name}」嗎？此操作不可恢復。`)) {
                                                        onDelete(product.id);
                                                    }
                                                }}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </Tippy>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <div className="pagination-container">
                        {currentPage > 1 && (
                            <Button
                                variant="outline-primary"
                                onClick={() => onPageChange(currentPage - 1)}
                                className="mx-1"
                            >
                                &laquo; 上一頁
                            </Button>
                        )}
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // 如果頁數太多，只顯示當前頁附近的頁碼
                            if (
                                totalPages <= 7 ||
                                page === 1 || 
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <Button
                                        key={page}
                                        variant={page === currentPage ? 'primary' : 'outline-primary'}
                                        onClick={() => onPageChange(page)}
                                        className="mx-1"
                                    >
                                        {page}
                                    </Button>
                                );
                            } else if (
                                (page === currentPage - 2 && currentPage > 3) ||
                                (page === currentPage + 2 && currentPage < totalPages - 2)
                            ) {
                                return <span key={page} className="mx-1">...</span>;
                            } else {
                                return null;
                            }
                        })}
                        
                        {currentPage < totalPages && (
                            <Button
                                variant="outline-primary"
                                onClick={() => onPageChange(currentPage + 1)}
                                className="mx-1"
                            >
                                下一頁 &raquo;
                            </Button>
                        )}
                    </div>
                </div>
            )}
            
            <style jsx>{`
                .product-card {
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                
                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }
                
                .product-title {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    min-height: 48px;
                }
                
                .product-description {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    min-height: 60px;
                }
                
                .status-badge {
                    font-size: 0.75rem;
                }
            `}</style>
        </>
    );
};

export default ProductList;