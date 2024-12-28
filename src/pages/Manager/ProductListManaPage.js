import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Tabs,
    Tab,
    Carousel,
    Button,
    Modal,
    Form,
    InputGroup,
    FormControl,
    Image,
} from 'react-bootstrap';
import Axios from 'common/Axios';
import { toast } from 'react-toastify';

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
    // 分頁
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    useEffect(() => {
        fetchCategories().then(setCategories); // 拉取分類資料
        fetchProducts({ category: activeCategory === 'all' ? '' : activeCategory });
    }, [activeCategory]);

    // 篩選切換
    const handleCategoryChange = async (category) => {
        setActiveCategory(category);
        try {
            const updatedProducts = await fetchProducts({
                category: category === 'all' ? '' : category,
            }); // 拉取指定分類的產品數據
            setProducts(updatedProducts);
        } catch (error) {
            console.error('切換分類失敗', error);
            toast.error('切換分類失敗，請稍後再試！');
        }
    };

    // 產品詳情顯示
    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleModalClose = () => {
        setSelectedProduct(null);
    };

    const fetchProducts = async (params) => {
        if (params.category == "manage"){
            return ; 
        }
        try {
            const response = await Axios().get('product/data/selfCompany/', { params });
            setProducts(response.data);
        } catch (error) {
            console.error('拉取產品失敗', error);
        }
    };

    const saveProduct = async (productData) => {
        try {
            if (productData.id) {
                await Axios().put(`product/data/change/`, productData);
            } else {
                await Axios().post('product/data/new/', productData);
            }
            fetchProducts({ category: activeCategory === 'all' ? '' : activeCategory });
        } catch (error) {
            console.error('保存產品失敗', error);
        }
    };

    const fetchCategories = async () => {
        const response = await Axios().get('product/categories/');
        return response.data.results;
    };
    
    // 新增分類
     const saveCategory = async (name) => {
        const response = await Axios().post('product/categories/', { name });
        return response.data;
    };
    
    // 更新分類
    const updateCategory = async (id, name) => {
        const response = await Axios().put(`product/categories/${id}/`, { name });
        return response.data;
    };
    
    // 刪除分類
    const deleteCategory = async (id) => {
        try{
            await Axios().delete(`/product/categories/${id}/`);
            toast.success("刪除成功！")
        }catch{
            toast.error("未找到，請重新刷新")
        }
        
    };

    const handleAddCategory = async () => {
        if (newCategory.trim() === '') return;
        try {
            const category = await saveCategory(newCategory.trim());
            const updatedCategories = await fetchCategories(); // 確保從伺服器拉取最新的數據
            setCategories(updatedCategories);
            setNewCategory(''); // 清空輸入框
            toast.success('新增分類成功！');
        } catch (error) {
            console.error('新增分類失敗', error);
            toast.error('新增分類失敗，請稍後再試！');
        }
    };

    // 更新分類
    const handleUpdateCategory = async (id, newName) => {
        try {
            await updateCategory(id, newName);
            const updatedCategories = await fetchCategories(); // 確保從伺服器拉取最新的數據
            setCategories(updatedCategories);
            toast.success('分類更新成功！');
        } catch (error) {
            console.error('更新分類失敗', error);
            toast.error('更新分類失敗，請稍後再試！');
        }
    };
    const handleDeleteCategory = async (id) => {
        try {
            await deleteCategory(id);
            const updatedCategories = await fetchCategories(); // 確保從伺服器拉取最新的數據
            setCategories(updatedCategories);
            toast.success('分類刪除成功！');
        } catch (error) {
            console.error('刪除分類失敗', error);
            toast.error('刪除分類失敗，請稍後再試！');
        }
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
                reader.readAsDataURL(file); // 將檔案轉換為 Base64 格式
            });
        });
    
        Promise.all(promises)
            .then((base64Images) => {
                // 更新表單數據
                setProductFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, ...base64Images],
                }));
    
                // 預覽圖片顯示
                setImagePreviews((prev) => [...prev, ...base64Images]);
    
                console.log('Base64 Images:', base64Images); // Debug: 打印轉換後的 Base64
            })
            .catch((error) => console.error('圖片處理失敗', error));
    };
    // 保存產品
    const handleSaveProduct = async () => {
        if (productFormData.images.length === 0) {
            toast.error("請上傳至少一張圖片");
            return;
        }
    
        try {
            await saveProduct(productFormData);
            const updatedProducts = await fetchProducts({
                category: activeCategory === 'all' ? '' : activeCategory,
            }); // 確保從伺服器拉取最新的數據
            setProducts(updatedProducts);
            setShowProductModal(false); // 關閉表單
            toast.success('產品保存成功！');
        } catch (error) {
            console.error('保存產品失敗', error);
            toast.error('保存產品失敗，請稍後再試！');
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    // 計算當前頁面產品
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = Array.isArray(products)
    ? products.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];
    const totalPages = Math.ceil((products?.length || 0) / productsPerPage);
    return (
        <Container className="py-4">
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
                {categories && categories.map((category) => (
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
                {currentProducts.map((product) => (
                    <Col md={6} lg={4} className="mb-4" key={product.id}>
                        <Card>
                            <Carousel variant="dark">
                                {product.images && product.images.length > 0 ? (
                                    product.images.map((image, index) => (
                                        <Carousel.Item key={index}>
                                            <img
                                                className="d-block w-100"
                                                src={image}
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
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                <Col className="text-center">
                    <Button variant="success" onClick={() => handleProductFormOpen()}>
                        新增產品
                    </Button>
                </Col>
                <div className="d-flex justify-content-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        variant={page === currentPage ? 'primary' : 'outline-primary'}
                        onClick={() => handlePageChange(page)}
                        className="mx-1"
                    >
                        {page}
                    </Button>
                ))}
                </div>
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
            {/* 新增分類 */}
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

                {/* 已存在的分類列表 */}
                <h5>已存在的分類</h5>
                <ul className="list-unstyled">
                    {categories.map((category) => (
                        <li key={category.id} className="d-flex justify-content-between align-items-center mb-2">
                            {/* 顯示分類名稱 */}
                            <span>{category.name}</span>
                            <div>
                                {/* 編輯按鈕 */}
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => {
                                        const newName = prompt(
                                            `修改分類名稱（目前: ${category.name}）:`,
                                            category.name
                                        );
                                        if (newName && newName.trim()) {
                                            handleUpdateCategory(category.id, newName.trim());
                                        }
                                    }}
                                >
                                    編輯
                                </Button>
                                {/* 刪除按鈕 */}
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => {
                                        if (window.confirm(`確定要刪除分類 "${category.name}" 嗎？`)) {
                                        handleDeleteCategory(category.id);
                                        }
                                    }}
                                >
                                    刪除
                                </Button>
                            </div>
                        </li>
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
