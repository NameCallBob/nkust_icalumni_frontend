import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ProductFormModal({ product, show, handleClose }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        photo: null,
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                photo: null,
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 假設新增/編輯成功，呼叫 handleClose 並將新的產品資料回傳
        handleClose({
            name: formData.name,
            description: formData.description,
            photo: formData.photo,
        });
    };

    return (
        <Modal show={show} onHide={() => handleClose(null)}>
            <Modal.Header closeButton>
                <Modal.Title>{product ? '編輯產品' : '新增產品'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formProductName">
                        <Form.Label>產品名稱</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formProductDescription">
                        <Form.Label>產品簡介</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formProductPhoto">
                        <Form.Label>產品照片</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleFileChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        {product ? '更新產品' : '新增產品'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ProductFormModal;
