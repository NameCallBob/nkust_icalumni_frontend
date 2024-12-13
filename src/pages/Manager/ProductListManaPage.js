import React, { useState, useEffect } from 'react';

import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import ProductFormModal from 'components/Manage/ProductManage/ProductFormModal';
import SearchBar from 'components/Manage/ProductManage/SearchBar';
import Axios from 'common/Axios';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // 讀取產品資料
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await Axios().get('product/data/selfCompnay/');
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const handleSearch = (query) => {
        if (!query) {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleAdd = () => {
        setSelectedProduct(null);
        setShowModal(true);
    };

    const handleCloseModal = async (newProduct) => {
        setShowModal(false);

        if (newProduct) {
            try {
                if (selectedProduct) {
                    // 更新產品
                    await updateProduct(selectedProduct.id, newProduct);
                } else {
                    // 新增產品
                    await createProduct(newProduct);
                }
                fetchProducts(); // 更新列表
            } catch (error) {
                console.error('Failed to save product:', error);
            }
        }
    };

    const createProduct = async (product) => {
        try {
            await Axios().post('product/data/new/', product);
        } catch (error) {
            console.error('Failed to create product:', error);
        }
    };

    const updateProduct = async (id, product) => {
        try {
            let tmp_product = product
            tmp_product['id'] = id
            await Axios().put(`product/data/change/`, tmp_product);
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await Axios().delete(`product/data/remove/` , {data:{'id':id}});
            fetchProducts(); // 更新列表
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    return (
        <Container className="my-5">
            <h2>產品列表</h2>
            <Row>
                <Col>
                    <SearchBar onSearch={handleSearch} />
                </Col>
                <Col>
                    <Button onClick={handleAdd} className="mb-3">新增產品</Button>
                </Col>
            </Row>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>名稱</th>
                        <th>簡介</th>
                        <th>照片預覽</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>
                                {product.photo ? (
                                    <img
                                        src={product.photo}
                                        alt={product.name}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <span>無照片</span>
                                )}
                            </td>
                            <td>
                                <Button variant="primary" onClick={() => handleEdit(product)}>編輯</Button>{' '}
                                <Button
                                    variant="danger"
                                    onClick={() => deleteProduct(product.id)}
                                >
                                    刪除
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {showModal && (
                <ProductFormModal
                    product={selectedProduct}
                    show={showModal}
                    handleClose={handleCloseModal}
                />
            )}
        </Container>
    );
}

export default ProductList;
