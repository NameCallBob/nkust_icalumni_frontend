import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ProductFormModal({ product, show, handleClose }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        photos: [], // 使用陣列來儲存多張圖片
    });

    const [previews, setPreviews] = useState([]); // 用來儲存圖片預覽

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                photos: [],
            });
            setPreviews([]); // 清除預覽
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); // 取得選擇的多張圖片
        setFormData({ ...formData, photos: files });

        // 產生圖片預覽
        const filePreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews(filePreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 假設新增/編輯成功，呼叫 handleClose 並將新的產品資料回傳
        handleClose({
            name: formData.name,
            description: formData.description,
            photos: formData.photos,
        });

        // 清除預覽 URL 以避免記憶體洩漏
        previews.forEach((preview) => URL.revokeObjectURL(preview));
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
                    <Form.Group controlId="formProductPhotos">
                        <Form.Label>產品照片</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleFileChange}
                            multiple // 允許多張圖片上傳
                        />
                    </Form.Group>
                    
                    {/* 圖片預覽區塊 */}
                    <div className="image-previews">
                        {previews.map((preview, index) => (
                            <img
                                key={index}
                                src={preview}
                                alt={`preview ${index}`}
                                style={{ width: '100px', height: '100px', margin: '5px' }}
                            />
                        ))}
                    </div>

                    <Button variant="primary" type="submit">
                        {product ? '更新產品' : '新增產品'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ProductFormModal;
