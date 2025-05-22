import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Image, Row, Col, Card, Alert, ProgressBar } from 'react-bootstrap';
import { FaCamera, FaTrash, FaStar, FaRegStar, FaInfoCircle, FaCheck, FaTimes } from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { toast } from 'react-toastify';

const ProductForm = ({
    show,
    onClose,
    onSave,
    categories,
    productData,
    setProductData,
}) => {
    const [imagePreviews, setImagePreviews] = useState(productData.images || []);
    const [isDragging, setIsDragging] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [showHelp, setShowHelp] = useState(false);
    const fileInputRef = useRef(null);
    
    // 重置表單狀態
    useEffect(() => {
        if (show) {
            setImagePreviews(productData.images || []);
            setValidationErrors({});
        }
    }, [show, productData]);

    // 處理圖片上傳
    const handleImageUpload = (e) => {
        processFiles(e.target.files);
    };

    // 處理拖放文件上傳
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    };

    // 處理文件讀取
    const processFiles = (files) => {
        if (!files || files.length === 0) return;
        
        const fileArray = Array.from(files);
        const validImageFiles = fileArray.filter(file => file.type.startsWith('image/'));
        
        if (validImageFiles.length !== fileArray.length) {
            toast.warning('請只上傳圖片檔案');
        }
        
        if (validImageFiles.length === 0) return;
        
        // 檢查文件大小
        const oversizedFiles = validImageFiles.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.warning('部分圖片超過5MB，已被跳過');
        }
        
        const validFiles = validImageFiles.filter(file => file.size <= 5 * 1024 * 1024);
        
        const promises = validFiles.map((file) => {
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
            .catch((error) => toast.error('圖片處理失敗'));
    };

    // 設置主圖
    const handleSetMainImage = (index) => {
        const updatedImages = [...imagePreviews];
        const [mainImage] = updatedImages.splice(index, 1);
        setProductData((prev) => ({
            ...prev,
            images: [mainImage, ...updatedImages],
        }));
        setImagePreviews([mainImage, ...updatedImages]);
    };

    // 刪除圖片
    const handleDeleteImage = (index) => {
        const updatedImages = [...imagePreviews];
        updatedImages.splice(index, 1);
        setProductData((prev) => ({
            ...prev,
            images: updatedImages,
        }));
        setImagePreviews(updatedImages);
    };
    
    // 表單欄位變更
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        
        // 清除對應欄位的驗證錯誤
        if (validationErrors[name]) {
            setValidationErrors({
                ...validationErrors,
                [name]: null
            });
        }
    };
    
    // 表單提交前驗證
    const validateForm = () => {
        const errors = {};
        
        if (!productData.name.trim()) {
            errors.name = '請輸入產品名稱';
        }
        
        if (!productData.description.trim()) {
            errors.description = '請輸入產品描述';
        }
        
        if (!productData.category) {
            errors.category = '請選擇產品分類';
        }
        
        if (imagePreviews.length === 0) {
            errors.images = '請至少上傳一張產品圖片';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // 保存產品
    const handleSaveProduct = () => {
        if (validateForm()) {
            onSave(productData);
            onClose();
        } else {
            // 滾動到第一個錯誤
            const firstError = document.querySelector('.is-invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    return (
        <Modal 
            show={show} 
            onHide={onClose} 
            size="lg" 
            backdrop="static"
            centered
        >
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    {productData.id ? '編輯產品' : '新增產品'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Button 
                    variant="link" 
                    className="mb-3 text-decoration-none"
                    onClick={() => setShowHelp(!showHelp)}
                >
                    <FaInfoCircle className="me-1" />
                    {showHelp ? '隱藏填寫說明' : '顯示填寫說明'}
                </Button>
                
                {showHelp && (
                    <Alert variant="info" className="mb-4">
                        <Alert.Heading>產品資料填寫說明</Alert.Heading>
                        <ul className="mb-0">
                            <li><strong>產品名稱</strong>：應簡潔明確，避免過長或難以理解的名稱，建議在30字以內。</li>
                            <li><strong>產品簡介</strong>：詳細描述產品特點與用途，可包含規格、特性等重要資訊。</li>
                            <li><strong>分類</strong>：選擇最符合產品的分類，以便客戶快速尋找。</li>
                            <li><strong>圖片</strong>：上傳清晰的產品圖片，首張圖片將作為主圖展示。支援拖放上傳。</li>
                            <li><strong>啟用狀態</strong>：勾選「啟用」表示產品會在前台顯示，取消勾選則不會顯示。</li>
                        </ul>
                    </Alert>
                )}
                
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">產品名稱 <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={productData.name}
                                    onChange={handleChange}
                                    placeholder="輸入產品名稱..."
                                    className={validationErrors.name ? 'is-invalid' : ''}
                                    maxLength={100}
                                />
                                <Form.Text className="text-muted">
                                    建議30字以內，目前已輸入 {productData.name.length} 字
                                </Form.Text>
                                {validationErrors.name && (
                                    <div className="invalid-feedback">{validationErrors.name}</div>
                                )}
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">分類 <span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    name="category"
                                    value={productData.category}
                                    onChange={handleChange}
                                    className={validationErrors.category ? 'is-invalid' : ''}
                                >
                                    <option value="">-- 選擇分類 --</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Select>
                                {validationErrors.category && (
                                    <div className="invalid-feedback">{validationErrors.category}</div>
                                )}
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">狀態</Form.Label>
                                <div className="d-flex align-items-center p-2 border rounded">
                                    <Form.Check
                                        type="switch"
                                        id="product-status-switch"
                                        name="is_active"
                                        checked={productData.is_active}
                                        onChange={handleChange}
                                        className="me-2"
                                    />
                                    <span>
                                        {productData.is_active ? (
                                            <><FaCheck className="text-success me-1" /> 產品已啟用</>
                                        ) : (
                                            <><FaTimes className="text-danger me-1" /> 產品未啟用</>
                                        )}
                                    </span>
                                </div>
                                <Form.Text className="text-muted">
                                    啟用的產品將顯示在前台，未啟用則不會顯示。
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">產品簡介 <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={productData.description}
                                    onChange={handleChange}
                                    placeholder="詳細描述產品的特點、用途、規格等..."
                                    className={validationErrors.description ? 'is-invalid' : ''}
                                    style={{ height: '172px' }}
                                />
                                {validationErrors.description && (
                                    <div className="invalid-feedback">{validationErrors.description}</div>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <hr className="my-4" />
                    
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">產品圖片 <span className="text-danger">*</span></Form.Label>
                        
                        <div 
                            className={`upload-area p-4 text-center border rounded mb-3 ${isDragging ? 'border-primary bg-light' : ''} ${validationErrors.images ? 'border-danger' : ''}`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            style={{ cursor: 'pointer' }}
                        >
                            <FaCamera size={40} className="mb-3 text-primary" />
                            <h6>點擊或拖放圖片至此處上傳</h6>
                            <p className="text-muted mb-0">支援 JPG、PNG 格式，每張圖片最大 5MB</p>
                            <Form.Control
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="d-none"
                            />
                        </div>
                        
                        {validationErrors.images && (
                            <div className="text-danger mb-3">{validationErrors.images}</div>
                        )}
                        
                        {imagePreviews.length > 0 && (
                            <Card className="shadow-sm">
                                <Card.Header className="bg-light">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold">已上傳圖片 ({imagePreviews.length})</span>
                                        <Tippy content="第一張圖片將作為主圖顯示">
                                            <span className="text-muted">
                                                <FaInfoCircle /> 主圖標示為 <FaStar className="text-warning" />
                                            </span>
                                        </Tippy>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="d-flex flex-wrap">
                                        {imagePreviews.map((image, index) => (
                                            <div key={index} className="position-relative me-3 mb-3">
                                                <Card style={{ width: '150px' }}>
                                                    <div style={{ height: '150px', overflow: 'hidden' }}>
                                                        <Image
                                                            src={image}
                                                            alt={`預覽圖片 ${index + 1}`}
                                                            className="w-100 h-100 object-fit-cover"
                                                        />
                                                    </div>
                                                    <Card.Footer className="p-2 d-flex justify-content-between">
                                                        <Tippy content={index === 0 ? "目前為主圖" : "設為主圖"}>
                                                            <Button
                                                                size="sm"
                                                                variant={index === 0 ? "warning" : "outline-warning"}
                                                                onClick={() => index !== 0 && handleSetMainImage(index)}
                                                                disabled={index === 0}
                                                            >
                                                                {index === 0 ? <FaStar /> : <FaRegStar />}
                                                            </Button>
                                                        </Tippy>
                                                        <Tippy content="刪除圖片">
                                                            <Button
                                                                size="sm"
                                                                variant="outline-danger"
                                                                onClick={() => handleDeleteImage(index)}
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        </Tippy>
                                                    </Card.Footer>
                                                </Card>
                                                {index === 0 && (
                                                    <span className="position-absolute top-0 start-0 badge bg-warning m-1">
                                                        主圖
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </Card.Body>
                            </Card>
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    取消
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSaveProduct}
                >
                    {productData.id ? '更新產品' : '建立產品'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductForm;