import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Carousel,
  Badge,
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Pagination,
} from "react-bootstrap";
import Axios from "common/Axios";
import searchImage from "assets/searching.png"
import "css/ProductDisplay.css";
const ProductDisplay = ({ memberId }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const itemsPerPage = 3;

  const fetchProducts = (category) => {
    // 清除現有產品並重置動畫狀態
    setIsLoadingProducts(true);
    setFadeIn(false);
    setProducts([]);

    const params = {
      member_id: memberId,
      category: category !== "All" ? category : undefined,
    };

    Axios()
      .get("product/data/member/", { params })
      .then((response) => {
        const transformedData = response.data.map((item) => {
          const sortedImages = item.images.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));

          // 確保 category 是字串，如果是物件則取其 name 屬性
          let categoryName = "";
          if (typeof item.category === 'object' && item.category !== null) {
            categoryName = item.category.name || item.category.id || "未分類";
          } else if (typeof item.category === 'string' || typeof item.category === 'number') {
            categoryName = String(item.category);
          } else {
            categoryName = "未分類";
          }

          return {
            name: item.name,
            photos: sortedImages.map((image) => image.image),
            tags: [categoryName], // 只保留類別名稱，不加前綴
            description: item.description,
            price: 0,
          };
        });

        setProducts(transformedData);
        setIsLoadingProducts(false);

        // 觸發淡入動畫
        setTimeout(() => {
          setFadeIn(true);
        }, 50);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setIsLoadingProducts(false);
      });
  };

  const fetchCategories = () => {
    Axios()
      .get("product/categories/", { params: { member_id: memberId } })
      .then((response) => {
        setCategories(response.data.results);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts("All");
  }, [memberId]);

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    // 先清除產品，確保動畫能重新觸發
    setProducts([]);
    setFadeIn(false);
    // 短暫延遲後再載入新產品
    setTimeout(() => {
      fetchProducts(tab);
    }, 100);
  };

  const handleModalShow = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };
  const handleModalClose = () => setShowModal(false);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container className="mt-4">
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => handleTabSelect(k)}
        className="mb-4"
      >
        <Tab eventKey="All" title="所有商品" />
        {categories.map((category) => (
          <Tab eventKey={category.id} title={category.name} key={category.id} />
        ))}
      </Tabs>

      <Row className="g-4" style={{
        opacity: fadeIn ? 1 : 0,
        transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out'
      }}>
      {paginatedProducts.length > 0 ? (
    paginatedProducts.map((product) => (
      <Col md={4} sm={6} xs={12} key={product.name}>
        <Card
          className="shadow-sm product-card"
          onClick={() => handleModalShow(product)}
          style={{
            animation: fadeIn ? 'fadeInUp 0.6s ease-in-out' : 'none',
            animationDelay: `${paginatedProducts.indexOf(product) * 0.1}s`,
            animationFillMode: 'both'
          }}
        >
          <Carousel fade>
            {product.photos.map((photo, index) => (
              <Carousel.Item key={index}>
                <img
                  style={{
                    width: "300px", // 固定寬度
                    height: "200px", // 固定高度
                    objectFit: "cover", // 防止圖片變形
                  }}
                  className="d-block w-100"
                  src={process.env.REACT_APP_BASE_URL + photo}
                  alt={`Product Image ${index + 1}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
          <Card.Body>
            <Card.Title>{product.name}</Card.Title>
            {product.tags && product.tags.length > 0 && (
              <div className="mt-2">
                {product.tags.map((tag, tagIndex) => (
                  <Badge
                    key={tagIndex}
                    bg="secondary"
                    className="me-1"
                    style={{
                      animation: fadeIn ? 'fadeIn 0.8s ease-in-out' : 'none',
                      animationDelay: `${(paginatedProducts.indexOf(product) * 0.1 + 0.2)}s`,
                      animationFillMode: 'both'
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    ))
  ) : (
    <Col>
      <div className="d-flex flex-column align-items-center text-muted py-5">
        <img
          src={searchImage} // 可替換為您的圖示檔案
          alt="沒有產品找到"
          style={{ width: "150px", height: "150px", marginBottom: "20px" }}
        />
        <h5>目前沒有商品可供顯示</h5>
        <p className="text-center">
          嘗試切換分類或稍後再試，<br />
          若問題持續發生，系友可能尚未上架商品！。
        </p>
        <Button
          variant="primary"
          onClick={() => handleTabSelect("All")}
        >
          查看所有商品
        </Button>
      </div>
    </Col>
  )}
      </Row>

      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
          <Pagination.Prev
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={currentPage === idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>

      {selectedProduct && (
        <Modal show={showModal} onHide={handleModalClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedProduct.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Carousel>
                  {selectedProduct.photos.map((photo, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100"
                        style={{
                          width: '500px', // 固定寬度
                          height: '500px', // 固定高度
                          objectFit: 'cover', // 防止圖片變形
                      }}
                        src={process.env.REACT_APP_BASE_URL + photo}
                        alt={`Product Image ${index + 1}`}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </Col>
              <Col md={6}>
                <h5>簡介</h5>
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
    </Container>
  );
};

export default ProductDisplay;
