import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Container ,Row,Col} from 'react-bootstrap';
import axios from 'axios';
import ProductFormModal from 'components/Manage/ProductManage/ProductFormModal';
import SearchBar from 'components/Manage/ProductManage/SearchBar';

function ProductList() {
    // 假資料
    const fakeProducts = [
        { id: 1, name: '產品A', description: '這是產品A的描述', photo: null },
        { id: 2, name: '產品B', description: '這是產品B的描述', photo: null },
        { id: 3, name: '產品C', description: '這是產品C的描述', photo: null },
    ];

    const [products, setProducts] = useState(fakeProducts);
    const [filteredProducts, setFilteredProducts] = useState(fakeProducts);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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

    const handleCloseModal = (newProduct) => {
        setShowModal(false);

        // 如果有新的產品（新增或更新），更新產品列表
        if (newProduct) {
            if (selectedProduct) {
                // 更新現有產品
                setProducts((prev) =>
                    prev.map((p) => (p.id === selectedProduct.id ? newProduct : p))
                );
            } else {
                // 新增產品
                setProducts((prev) => [...prev, { ...newProduct, id: prev.length + 1 }]);
            }
            setFilteredProducts(products);
        }
    };

    return (
        <Container className='my-5'>
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
                        <th>照片預覽</th> {/* 新增的欄位 */}
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
                                <Button variant="primary" onClick={() => handleEdit(product)}>編輯</Button>
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
        </Container>    );
}

export default ProductList;