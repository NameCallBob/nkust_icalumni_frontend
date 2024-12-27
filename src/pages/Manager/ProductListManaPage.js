import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Tabs,
    Tab,
    Button,
    Modal,
    Form,
    InputGroup,
    FormControl,
    Image,
} from 'react-bootstrap';
import { fetchProducts, fetchCategories, saveCategory, saveProduct } from '../utils/api';

const ProductManagement = () => {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all'); // 預設顯示所有產品
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null); // 用於顯示產品詳情的 Modal
    const [showCategoryModal, setShowCategoryModal] = useState(false); // 用於顯示分類管理的 Modal
    const [showProductModal, setShowProductModal] = useState(false); // 用於新增/編輯產品的 Modal
    const [newCategory, setNewCategory] = useState(''); // 新增分類的名稱
    const [productFormData, setProductFormData] = useState({
        id: null,
        name: '',
        description: '',
        category: '',
        images: [],
    }); // 產品表單數據
    const [imagePreviews, setImagePreviews] = useState([]); // 圖片預覽

    useEffect(() => {
        fetchCategories().then(setCategories); // 拉取分類資料
        fetchProducts({ category: activeCategory === 'all' ? '' : activeCategory }).then(setProducts);
    }, [activeCategory]);

    // 篩選切換
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    // 產品詳情顯示
    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleModalClose = () => {
        setSelectedProduct(null);
    };

    // 顯示產品表單 (新增或編輯)
    const handleProductFormOpen = (product = null) => {
        if (product) {
            setProductFormData({
                id: product.id,
                name: product.name,
                description: product.description,
                category: product.category_id,
                images: [], // 編輯時不允許直接修改已存在的圖片，需重新上傳
            });
        } else {
            setProductFormData({
                id: null,
                name: '',
                description: '',
                category: '',
                images: [],
            });
        }
        setImagePreviews([]);
        setShowProductModal(true);
    };

    const handleProductFormClose = () => {
        setShowProductModal(false);
        setProductFormData({
            id: null,
            name: '',
            description: '',
            category: '',
            images: [],
        });
        setImagePreviews([]);
    };

    // 新增/修改分類
    const handleAddCategory = () => {
        if (newCategory.trim() === '') return;
        saveCategory(newCategory).then((category) => {
            setCategories([...categories, category]);
            setNewCategory('');
        });
    };

    // 更新產品表單數據
    const handleProductFormChange = (e) => {
        const { name, value } = e.target;
        setProductFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 圖片上傳與預覽
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
                setImagePreviews((prev) => [...prev, ...base64Images]);
                setProductFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, ...base64Images],
                }));
            })
            .catch((error) => console.error('圖片處理失敗', error));
    };

    // 保存產品
    const handleSaveProduct = () => {
        saveProduct(productFormData).then(() => {
            setShowProductModal(false);
            fetchProducts({ category: activeCategory === 'all' ? '' : activeCategory }).then(setProducts);
        });
    };

    return (
        <Container fluid className="py-4">
            <h1 className="text-center mb-4">產品管理</h1>

            {/* Tabs for category management */}
            <Tabs
                id="category-tabs"
                activeKey={activeCategory}
                onSelect={handleCategoryChange}
                className="mb-4"
            >
                <Tab eventKey="all" title="全部">
                    {/* All Products */}
                </Tab>
                {categories.map((category) => (
                    <Tab eventKey={category.id} title={category.name} key={category.id}>
                        {/* Products in specific category */}
                    </Tab>
                ))}
                <Tab
                    eventKey="manage"
                    title={<Button variant="link" onClick={() => setShowCategoryModal(true)}>管理分類</Button>}
                />
            </Tabs>

            {/* Product List */}
            <Row>
                {products.map((product) => (
                    <Col md={6} lg={4} className="mb-4" key={product.id}>
                        <Card>
                            <Card.Img
                                variant="top"
                                src={product.photo || '/placeholder.png'}
                                alt="產品圖片"
                                className="img-fluid"
                            />
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>{product.description}</Card.Text>
                                <Button
                                    variant="outline-primary"
                                    onClick={() => handleProductFormOpen(product)}
                                >
                                    編輯
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                <Col className="text-center">
                    <Button variant="success" onClick={() => handleProductFormOpen()}>
                        新增產品
                    </Button>
                </Col>
            </Row>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <Modal show={!!selectedProduct} onHide={handleModalClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedProduct.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Image
                                    src={selectedProduct.photo || '/placeholder.png'}
                                    alt="產品圖片"
                                    fluid
                                    className="mb-3"
                                />
                            </Col>
                            <Col md={6}>
                                <h5>產品簡介</h5>
                                <p>{selectedProduct.description}</p>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                            關閉
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Product Form Modal */}
            <Modal show={showProductModal} onHide={handleProductFormClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{productFormData.id ? '編輯產品' : '新增產品'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>產品名稱</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={productFormData.name}
                                onChange={handleProductFormChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>產品簡介</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={productFormData.description}
                                onChange={handleProductFormChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>分類</Form.Label>
                            <Form.Control
                                as="select"
                                name="category"
                                value={productFormData.category}
                                onChange={handleProductFormChange}
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
                            <Form.Label>上傳圖片</Form.Label>
                            <Form.Control type="file" multiple accept="image/*" onChange={handleImageUpload} />
                            <div className="d-flex flex-wrap mt-3">
                                {imagePreviews.map((image, index) => (
                                    <Image
                                        key={index}
                                        src={image}
                                        alt={`預覽圖片 ${index + 1}`}
                                        thumbnail
                                        width={100}
                                        height={100}
                                        className="me-2"
                                    />
                                ))}
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleProductFormClose}>
                        關閉
                    </Button>
                    <Button variant="primary" onClick={handleSaveProduct}>
                        保存
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Category Management Modal */}
            <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>管理分類</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>新增分類名稱</Form.Label>
                            <InputGroup>
                                <FormControl
                                    placeholder="輸入分類名稱..."
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                />
                                <Button variant="primary" onClick={handleAddCategory}>
                                    新增
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <h5>已存在的分類</h5>
                        <ul>
                            {categories.map((category) => (
                                <li key={category.id}>{category.name}</li>
                            ))}
                        </ul>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
                        關閉
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProductManagement;
