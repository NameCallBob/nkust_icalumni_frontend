import React, { useState } from 'react';
import { Modal, Button, Form, Image } from 'react-bootstrap';

const ProductForm = ({
    show,
    onClose,
    onSave,
    categories,
    productData,
    setProductData,
}) => {
    const [imagePreviews, setImagePreviews] = useState(productData.images || []);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const promises = files.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises)
            .then((base64Images) => {
                setProductData((prev) => ({
                    ...prev,
                    images: [...prev.images, ...base64Images],
                }));
                setImagePreviews((prev) => [...prev, ...base64Images]);
            })
            .catch((error) => console.error('圖片處理失敗', error));
    };

    const handleSetMainImage = (index) => {
        const updatedImages = [...imagePreviews];
        const [mainImage] = updatedImages.splice(index, 1);
        setProductData((prev) => ({
            ...prev,
            images: [mainImage, ...updatedImages],
        }));
        setImagePreviews([mainImage, ...updatedImages]);
    };

    const handleDeleteImage = (index) => {
        const updatedImages = [...imagePreviews];
        updatedImages.splice(index, 1);
        setProductData((prev) => ({
            ...prev,
            images: updatedImages,
        }));
        setImagePreviews(updatedImages);
    };
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{productData.id ? '編輯產品' : '新增產品'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>產品名稱</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={productData.name}
                            onChange={(e) =>
                                setProductData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>產品簡介</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={productData.description}
                            onChange={(e) =>
                                setProductData((prev) => ({ ...prev, description: e.target.value }))
                            }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>分類</Form.Label>
                        <Form.Control
                            as="select"
                            name="category"
                            value={productData.category}
                            onChange={(e) =>
                                setProductData((prev) => ({ ...prev, category: e.target.value }))
                            }
                            required
                        >
                            <option value="">選擇分類</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>是否啟用</Form.Label>
                        <Form.Check
                            type="checkbox"
                            name="is_active"
                            label="啟用"
                            checked={productData.is_active}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>上傳圖片</Form.Label>
                        <Form.Control
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <div className="d-flex flex-wrap mt-3">
                        {imagePreviews.map((image, index) => (
                                <div key={index} className="position-relative me-2">
                                    <Image
                                        src={image}
                                        alt={`預覽圖片 ${index + 1}`}
                                        thumbnail
                                        width={100}
                                        height={100}
                                        className="me-2"
                                    />
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => handleSetMainImage(index)}
                                        className="position-absolute top-0 start-0"
                                    >
                                        主
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleDeleteImage(index)}
                                        className="position-absolute top-0 end-0"
                                    >
                                        刪
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    關閉
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        onSave(productData);
                        onClose();
                    }}
                >
                    保存
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductForm;