import React from 'react';
import { Modal, Button, Row, Col, Image } from 'react-bootstrap';

const ProductDetailModal = ({ product, show, onClose }) => {
    if (!product) return null;

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{product.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <Image
                            src={product.images && product.images[0] ? product.images[0] : '/placeholder.png'}
                            alt="產品圖片"
                            fluid
                            className="mb-3"
                        />
                    </Col>
                    <Col md={6}>
                        <h5>產品簡介</h5>
                        <p>{product.description}</p>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    關閉
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductDetailModal;