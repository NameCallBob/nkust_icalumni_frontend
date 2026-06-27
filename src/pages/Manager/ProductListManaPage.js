import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, InputGroup, Card, Tabs, Tab, Alert } from 'react-bootstrap';
import { FaSearch, FaPlus, FaTags, FaInfoCircle, FaQuestion } from 'react-icons/fa';
import useRWD from 'hooks/useRWD';
import Axios from 'common/Axios';
import ProductForm from 'components/Manage/Product/ProductForm';
import ProductDetailModal from 'components/Manage/Product/ProductDetail';
import ProductList from 'components/Manage/Product/ProductList';
import CategoryManagement from 'components/Manage/Product/Category';
import { toast } from 'react-toastify';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const ProductManagement = () => {
    // 響應式設計 hook
    const rwd = useRWD();

    // 狀態管理
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [productFormData, setProductFormData] = useState({
        id: null,
        name: '',
        description: '',
        category: '',
        images: [],
        is_active: true
    });
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [isFirstVisit, setIsFirstVisit] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    // 初始化加載
    useEffect(() => {
        Promise.all([fetchCategories(), fetchProducts()])
            .then(() => {
                setIsLoading(false);
                // 檢查是否為首次訪問
                const visited = localStorage.getItem('productManagementVisited');
                if (!visited) {
                    setIsFirstVisit(true);
                    localStorage.setItem('productManagementVisited', 'true');
                } else {
                    setIsFirstVisit(false);
                }
            });
    }, []);

    // 獲取分類資料
    const fetchCategories = async () => {
        try {
            const response = await Axios().get('product/categories/');
            setCategories(response.data.results);
            return response.data.results;
        } catch (error) {
            toast.error('無法載入產品分類，請檢查網路連接');
            return [];
        }
    };

    // 獲取產品資料
    const fetchProducts = async (params = {}) => {
        setIsLoading(true);
        try {
            const response = await Axios().get('product/data/selfCompany/', { params });
            const data = response.data;
            setProducts(data);
            setFilteredProducts(data);
            return data;
        } catch (error) {
            toast.error('無法載入產品資料，請檢查網路連接');
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // 處理搜索
    const handleSearch = async () => {
        const params = {
            search: searchTerm,
            category: selectedCategory || undefined,
            is_active: activeTab === 'active' ? true : activeTab === 'inactive' ? false : undefined
        };
        await fetchProducts(params);
    };

    // 處理標籤頁變更
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
        
        // 透過API獲取篩選後的數據，而不是本地篩選
        const params = {
            search: searchTerm,
            category: selectedCategory || undefined,
            is_active: tab === 'active' ? true : tab === 'inactive' ? false : undefined
        };
        
        fetchProducts(params);
    };

    // 重置產品表單資料
    const resetProductFormData = () => {
        setProductFormData({
            id: null,
            name: '',
            description: '',
            category: '',
            images: [],
            is_active: true
        });
    };

    // 關閉產品模態框
    const handleCloseProductModal = () => {
        setShowProductModal(false);
        resetProductFormData();
    };

    // 保存產品
    const handleSaveProduct = async (productData) => {
        try {
            const updatedImages = productData.images.map((image, index) => ({
                image,
                is_primary: index === 0 // 第一張圖片預設為主圖
            }));

            const payload = { ...productData, images: updatedImages };
            let tmp_payload = payload
            tmp_payload['new_images'] = tmp_payload['images']
            delete tmp_payload['images']
            
            if (productData.id) {
                await Axios().put(`product/data/change/`, tmp_payload);
                toast.success("產品已成功更新！");
            } else {
                await Axios().post('product/data/new/', tmp_payload);
                toast.success("產品已成功創建！");
            }
            handleSearch(); // 重新載入產品列表
            handleCloseProductModal(); // 關閉模態框並重置表單
        } catch (error) {
            toast.error('儲存產品失敗，請檢查所有必填欄位');
        }
    };

    // 刪除產品
    const handleDeleteProduct = async (id) => {
        try {
            await Axios().delete(`product/data/remove/`, { data: { "id": id } });
            toast.success("產品已成功刪除");
            handleSearch(); // 重新載入產品列表
        } catch (error) {
            toast.error("刪除失敗，請確認產品是否存在");
        }
    };

    return (
        <Container
            className="admin-container py-4 product-management-container"
            style={rwd.getContainerStyle()}
        >
            {isFirstVisit && (
                <Alert variant="info" dismissible onClose={() => setIsFirstVisit(false)}>
                    <Alert.Heading><FaInfoCircle className="me-2" />歡迎使用產品管理系統</Alert.Heading>
                    <p>
                        這是您的產品管理中心，在這裡您可以管理所有公司產品。
                        <ul>
                            <li>使用<strong>搜尋欄</strong>快速尋找特定產品</li>
                            <li>點擊<strong>新增商品</strong>按鈕來創建新產品</li>
                            <li>使用<strong>管理分類</strong>功能組織您的產品</li>
                            <li>點擊產品卡片查看詳細資訊，或使用編輯和刪除功能</li>
                        </ul>
                    </p>
                </Alert>
            )}
            
            <Card className="shadow-sm mb-4">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">產品管理中心</h3>
                    <Tippy content="在此管理您的所有產品，包括新增、編輯、刪除及分類">
                        <Button variant="light" size="sm" className="rounded-circle">
                            <FaQuestion />
                        </Button>
                    </Tippy>
                </Card.Header>
                <Card.Body>
                    <Row className="align-items-center mb-4">
                        <Col md={3} className="mb-2 mb-md-0">
                            <Form.Group>
                                <Form.Label className="text-muted small">
                                    <FaTags className="me-1" />
                                    依分類篩選
                                </Form.Label>
                                <Form.Select
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        // 選擇分類後立即觸發搜尋
                                        setCurrentPage(1);
                                        const newCategory = e.target.value;
                                        const params = {
                                            search: searchTerm,
                                            category: newCategory || undefined,
                                            is_active: activeTab === 'active' ? true : activeTab === 'inactive' ? false : undefined
                                        };
                                        fetchProducts(params);
                                    }}
                                    className="shadow-sm"
                                >
                                    <option value="">所有分類</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={5} className="mb-2 mb-md-0">
                            <Form.Label className="text-muted small">
                                <FaSearch className="me-1" />
                                搜尋產品
                            </Form.Label>
                            <InputGroup className="shadow-sm">
                                <Form.Control
                                    type="text"
                                    placeholder="輸入產品名稱關鍵字..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                />
                                <Button 
                                    variant="primary" 
                                    onClick={handleSearch}
                                >
                                    <FaSearch /> 搜尋
                                </Button>
                            </InputGroup>
                        </Col>
                        <Col md={4} className="d-flex justify-content-md-end mt-3 mt-md-0">
                            <Tippy content="管理產品分類">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowCategoryModal(true)}
                                    className="me-2"
                                >
                                    <FaTags className="me-1" /> 管理分類
                                </Button>
                            </Tippy>
                            
                            <Tippy content="新增產品到系統">
                                <Button
                                    variant="success"
                                    onClick={() => {
                                        resetProductFormData();
                                        setShowProductModal(true);
                                    }}
                                    className="me-2"
                                >
                                    <FaPlus className="me-1" /> 新增商品
                                </Button>
                            </Tippy>
                        </Col>
                    </Row>

                    <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => handleTabChange(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="all" title="所有產品">
                            {rwd.renderForDevice(
                                // 移動設備：卡片式佈局
                                <div className="row g-3">
                                    {Array.isArray(filteredProducts) &&
                                        filteredProducts
                                            .slice(
                                                (currentPage - 1) * productsPerPage,
                                                currentPage * productsPerPage
                                            )
                                            .map((product) => (
                                                <div key={product.id} className="col-12">
                                                    <Card className="h-100 shadow-sm" style={{ fontSize: rwd.getFontSize('body') }}>
                                                        <Card.Body style={{ padding: rwd.getSpacing('medium') }}>
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <h6 className="card-title mb-1" style={{ fontSize: rwd.getFontSize('h3') }}>
                                                                    {product.name}
                                                                </h6>
                                                                <span className={`badge ${product.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                                                    {product.is_active ? '已啟用' : '未啟用'}
                                                                </span>
                                                            </div>
                                                            <p className="text-muted small mb-2" style={{ fontSize: rwd.getFontSize('small') }}>
                                                                {product.description}
                                                            </p>
                                                            <div className="d-flex flex-column gap-2">
                                                                <Button
                                                                    variant="primary"
                                                                    size="sm"
                                                                    onClick={() => setSelectedProduct(product)}
                                                                    style={rwd.getButtonStyle('block')}
                                                                >
                                                                    查看詳情
                                                                </Button>
                                                                <div className="d-flex gap-2">
                                                                    <Button
                                                                        variant="outline-primary"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setProductFormData(product);
                                                                            setShowProductModal(true);
                                                                        }}
                                                                        className="flex-fill"
                                                                    >
                                                                        編輯
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteProduct(product.id)}
                                                                        className="flex-fill"
                                                                    >
                                                                        刪除
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </div>
                                            ))
                                    }
                                </div>,
                                // 平板設備：表格佈局（橫向滾動）
                                <div style={{ overflowX: 'auto' }}>
                                    <ProductList
                                        products={Array.isArray(filteredProducts)
                                            ? filteredProducts.slice(
                                                (currentPage - 1) * productsPerPage,
                                                currentPage * productsPerPage
                                            )
                                            : []}
                                        onEdit={(product) => {
                                            setProductFormData(product);
                                            setShowProductModal(true);
                                        }}
                                        onDelete={handleDeleteProduct}
                                        onProductClick={setSelectedProduct}
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(
                                            (Array.isArray(filteredProducts) ? filteredProducts.length : 0) / productsPerPage
                                        )}
                                        onPageChange={setCurrentPage}
                                        isLoading={isLoading}
                                        tableStyle={rwd.getTableStyle()}
                                    />
                                </div>,
                                // 桌面設備：完整表格佈局
                                <ProductList
                                    products={Array.isArray(filteredProducts)
                                        ? filteredProducts.slice(
                                            (currentPage - 1) * productsPerPage,
                                            currentPage * productsPerPage
                                        )
                                        : []}
                                    onEdit={(product) => {
                                        setProductFormData(product);
                                        setShowProductModal(true);
                                    }}
                                    onDelete={handleDeleteProduct}
                                    onProductClick={setSelectedProduct}
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(
                                        (Array.isArray(filteredProducts) ? filteredProducts.length : 0) / productsPerPage
                                    )}
                                    onPageChange={setCurrentPage}
                                    isLoading={isLoading}
                                    tableStyle={rwd.getTableStyle()}
                                />
                            )}
                        </Tab>
                        <Tab eventKey="active" title="已啟用產品">
                            {rwd.renderForDevice(
                                // 移動設備：卡片式佈局
                                <div className="row g-3">
                                    {Array.isArray(filteredProducts) &&
                                        filteredProducts
                                            .slice(
                                                (currentPage - 1) * productsPerPage,
                                                currentPage * productsPerPage
                                            )
                                            .map((product) => (
                                                <div key={product.id} className="col-12">
                                                    <Card className="h-100 shadow-sm" style={{ fontSize: rwd.getFontSize('body') }}>
                                                        <Card.Body style={{ padding: rwd.getSpacing('medium') }}>
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <h6 className="card-title mb-1" style={{ fontSize: rwd.getFontSize('h3') }}>
                                                                    {product.name}
                                                                </h6>
                                                                <span className={`badge ${product.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                                                    {product.is_active ? '已啟用' : '未啟用'}
                                                                </span>
                                                            </div>
                                                            <p className="text-muted small mb-2" style={{ fontSize: rwd.getFontSize('small') }}>
                                                                {product.description}
                                                            </p>
                                                            <div className="d-flex flex-column gap-2">
                                                                <Button
                                                                    variant="primary"
                                                                    size="sm"
                                                                    onClick={() => setSelectedProduct(product)}
                                                                    style={rwd.getButtonStyle('block')}
                                                                >
                                                                    查看詳情
                                                                </Button>
                                                                <div className="d-flex gap-2">
                                                                    <Button
                                                                        variant="outline-primary"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setProductFormData(product);
                                                                            setShowProductModal(true);
                                                                        }}
                                                                        className="flex-fill"
                                                                    >
                                                                        編輯
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteProduct(product.id)}
                                                                        className="flex-fill"
                                                                    >
                                                                        刪除
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </div>
                                            ))
                                    }
                                </div>,
                                // 平板設備：表格佈局（橫向滾動）
                                <div style={{ overflowX: 'auto' }}>
                                    <ProductList
                                        products={Array.isArray(filteredProducts)
                                            ? filteredProducts.slice(
                                                (currentPage - 1) * productsPerPage,
                                                currentPage * productsPerPage
                                            )
                                            : []}
                                        onEdit={(product) => {
                                            setProductFormData(product);
                                            setShowProductModal(true);
                                        }}
                                        onDelete={handleDeleteProduct}
                                        onProductClick={setSelectedProduct}
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(
                                            (Array.isArray(filteredProducts) ? filteredProducts.length : 0) / productsPerPage
                                        )}
                                        onPageChange={setCurrentPage}
                                        isLoading={isLoading}
                                        tableStyle={rwd.getTableStyle()}
                                    />
                                </div>,
                                // 桌面設備：完整表格佈局
                                <ProductList
                                    products={Array.isArray(filteredProducts)
                                        ? filteredProducts.slice(
                                            (currentPage - 1) * productsPerPage,
                                            currentPage * productsPerPage
                                        )
                                        : []}
                                    onEdit={(product) => {
                                        setProductFormData(product);
                                        setShowProductModal(true);
                                    }}
                                    onDelete={handleDeleteProduct}
                                    onProductClick={setSelectedProduct}
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(
                                        (Array.isArray(filteredProducts) ? filteredProducts.length : 0) / productsPerPage
                                    )}
                                    onPageChange={setCurrentPage}
                                    isLoading={isLoading}
                                    tableStyle={rwd.getTableStyle()}
                                />
                            )}
                        </Tab>
                        <Tab eventKey="inactive" title="未啟用產品">
                            {rwd.renderForDevice(
                                // 移動設備：卡片式佈局
                                <div className="row g-3">
                                    {Array.isArray(filteredProducts) &&
                                        filteredProducts
                                            .slice(
                                                (currentPage - 1) * productsPerPage,
                                                currentPage * productsPerPage
                                            )
                                            .map((product) => (
                                                <div key={product.id} className="col-12">
                                                    <Card className="h-100 shadow-sm" style={{ fontSize: rwd.getFontSize('body') }}>
                                                        <Card.Body style={{ padding: rwd.getSpacing('medium') }}>
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <h6 className="card-title mb-1" style={{ fontSize: rwd.getFontSize('h3') }}>
                                                                    {product.name}
                                                                </h6>
                                                                <span className={`badge ${product.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                                                    {product.is_active ? '已啟用' : '未啟用'}
                                                                </span>
                                                            </div>
                                                            <p className="text-muted small mb-2" style={{ fontSize: rwd.getFontSize('small') }}>
                                                                {product.description}
                                                            </p>
                                                            <div className="d-flex flex-column gap-2">
                                                                <Button
                                                                    variant="primary"
                                                                    size="sm"
                                                                    onClick={() => setSelectedProduct(product)}
                                                                    style={rwd.getButtonStyle('block')}
                                                                >
                                                                    查看詳情
                                                                </Button>
                                                                <div className="d-flex gap-2">
                                                                    <Button
                                                                        variant="outline-primary"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setProductFormData(product);
                                                                            setShowProductModal(true);
                                                                        }}
                                                                        className="flex-fill"
                                                                    >
                                                                        編輯
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteProduct(product.id)}
                                                                        className="flex-fill"
                                                                    >
                                                                        刪除
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </div>
                                            ))
                                    }
                                </div>,
                                // 平板設備：表格佈局（橫向滾動）
                                <div style={{ overflowX: 'auto' }}>
                                    <ProductList
                                        products={Array.isArray(filteredProducts)
                                            ? filteredProducts.slice(
                                                (currentPage - 1) * productsPerPage,
                                                currentPage * productsPerPage
                                            )
                                            : []}
                                        onEdit={(product) => {
                                            setProductFormData(product);
                                            setShowProductModal(true);
                                        }}
                                        onDelete={handleDeleteProduct}
                                        onProductClick={setSelectedProduct}
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(
                                            (Array.isArray(filteredProducts) ? filteredProducts.length : 0) / productsPerPage
                                        )}
                                        onPageChange={setCurrentPage}
                                        isLoading={isLoading}
                                        tableStyle={rwd.getTableStyle()}
                                    />
                                </div>,
                                // 桌面設備：完整表格佈局
                                <ProductList
                                    products={Array.isArray(filteredProducts)
                                        ? filteredProducts.slice(
                                            (currentPage - 1) * productsPerPage,
                                            currentPage * productsPerPage
                                        )
                                        : []}
                                    onEdit={(product) => {
                                        setProductFormData(product);
                                        setShowProductModal(true);
                                    }}
                                    onDelete={handleDeleteProduct}
                                    onProductClick={setSelectedProduct}
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(
                                        (Array.isArray(filteredProducts) ? filteredProducts.length : 0) / productsPerPage
                                    )}
                                    onPageChange={setCurrentPage}
                                    isLoading={isLoading}
                                    tableStyle={rwd.getTableStyle()}
                                />
                            )}
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>

            {/* 各種模態框 */}
            <ProductForm
                show={showProductModal}
                onClose={handleCloseProductModal}
                onSave={handleSaveProduct}
                categories={categories}
                productData={productFormData}
                setProductData={setProductFormData}
            />
            <ProductDetailModal
                product={selectedProduct}
                show={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
            <CategoryManagement
                categories={categories}
                fetchCategories={fetchCategories}
                saveCategory={async (name) => Axios().post('product/categories/', { name })}
                updateCategory={async (id, name) => Axios().put(`product/categories/${id}/`, { name })}
                deleteCategory={async (id) => Axios().delete(`product/categories/${id}/`)}
                show={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
            />
        </Container>
    );
};

export default ProductManagement;