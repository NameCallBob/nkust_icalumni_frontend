import React, { useState, useEffect } from 'react';
import { Container,Form, Button, Row, Col ,InputGroup} from 'react-bootstrap';
import Axios from 'common/Axios';
import ProductForm from 'components/Manage/Product/ProductForm';
import ProductDetailModal from 'components/Manage/Product/ProductDetail';
import ProductList from 'components/Manage/Product/ProductList';
import CategoryManagement from 'components/Manage/Product/Category';
import { toast } from 'react-toastify';

const ProductManagement = () => {

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
        is_active:true
    });
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await Axios().get('product/categories/');
            setCategories(response.data.results);
        } catch (error) {
            console.error('拉取分類失敗', error);
        }
    };

    const fetchProducts = async (params = {}) => {
        try {
            const response = await Axios().get('product/data/selfCompany/', { params });
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error('拉取產品失敗', error);
        }
    };

    const handleSearch = async () => {
        const params = {
            search: searchTerm,
            category: selectedCategory || undefined,
        };
        await fetchProducts(params);
    };

    const handleSaveProduct = async (productData) => {
        try {
            const updatedImages = productData.images.map((image, index) => ({
                image,
                is_primary: index === 0, // First image is primary by default
            }));

            const payload = { ...productData, images: updatedImages };
            let tmp_payload = payload
            tmp_payload['new_images']  = tmp_payload['images']
            delete tmp_payload['images']
            if (productData.id) {
                await Axios().put(`product/data/change/`, tmp_payload);
            } else {
                await Axios().post('product/data/new/', tmp_payload);
            }
            toast.success("保存成功")
            handleSearch(); // Refresh after save
        } catch (error) {
            toast.error('保存產品失敗');
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await Axios().delete(`product/data/remove/`,{data:{"id":id}});
            toast.success("刪除成功")
            handleSearch(); // Refresh after delete
        } catch (error) {
            toast.error("刪除失敗，請重整網頁確定是否存在")
        }
    };

    return (
        <Container className="py-4">
            <h1 className="text-center mb-4">自身公司產品</h1>
            <Row className="align-items-center mb-3">
                <Col md={4} className="mb-2 mb-md-0">
                    <Form.Group>
                        <Form.Select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
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
                <Col md={6} className="mb-2 mb-md-0">
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="搜尋產品名稱"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-secondary" onClick={handleSearch}>
                            搜尋
                        </Button>
                    </InputGroup>
                </Col>
                <Col md={2} className="text-md-end text-center">
                    <Button
                        variant="primary"
                        onClick={() => setShowProductModal(true)}
                        className="me-2"
                    >
                        新增商品
                    </Button>
                    <Button
                        variant="link"
                        onClick={() => setShowCategoryModal(true)}
                    >
                        管理分類
                    </Button>
                </Col>
            </Row>
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
            />
            <ProductForm
                show={showProductModal}
                onClose={() => setShowProductModal(false)}
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
