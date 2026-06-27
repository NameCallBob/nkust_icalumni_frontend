import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination as SwiperPagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import AppModal from "components/common/AppModal";
import { Button } from "components/common/ui";
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
    <div className="container mx-auto px-4 mt-4">
      {/* 分類標籤列 */}
      <div className="tabs tabs-bordered mb-4">
        <button
          type="button"
          className={`tab ${activeTab === "All" ? "tab-active" : ""}`}
          onClick={() => handleTabSelect("All")}
        >
          所有商品
        </button>
        {categories.map((category) => (
          <button
            type="button"
            key={category.id}
            className={`tab ${activeTab === category.id ? "tab-active" : ""}`}
            onClick={() => handleTabSelect(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4" style={{
        opacity: fadeIn ? 1 : 0,
        transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out'
      }}>
      {paginatedProducts.length > 0 ? (
    paginatedProducts.map((product) => (
      <div className="col-span-12 sm:col-span-6 md:col-span-4" key={product.name}>
        <div
          className="card card-bordered bg-base-100 shadow-sm product-card cursor-pointer"
          onClick={() => handleModalShow(product)}
          style={{
            animation: fadeIn ? 'fadeInUp 0.6s ease-in-out' : 'none',
            animationDelay: `${paginatedProducts.indexOf(product) * 0.1}s`,
            animationFillMode: 'both'
          }}
        >
          <Swiper
            modules={[SwiperPagination]}
            pagination={{ clickable: true }}
            className="w-full"
          >
            {product.photos.map((photo, index) => (
              <SwiperSlide key={index}>
                <img
                  style={{
                    width: "300px", // 固定寬度
                    height: "200px", // 固定高度
                    objectFit: "cover", // 防止圖片變形
                  }}
                  className="block w-full"
                  src={process.env.REACT_APP_BASE_URL + photo}
                  alt={`Product Image ${index + 1}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="card-body">
            <h2 className="card-title">{product.name}</h2>
            {product.tags && product.tags.length > 0 && (
              <div className="mt-2">
                {product.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="badge badge-secondary mr-1"
                    style={{
                      animation: fadeIn ? 'fadeIn 0.8s ease-in-out' : 'none',
                      animationDelay: `${(paginatedProducts.indexOf(product) * 0.1 + 0.2)}s`,
                      animationFillMode: 'both'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="col-span-12">
      <div className="flex flex-col items-center text-base-content/60 py-5">
        <img
          src={searchImage} // 可替換為您的圖示檔案
          alt="沒有產品找到"
          style={{ width: "150px", height: "150px", marginBottom: "20px" }}
        />
        <h5 className="text-lg font-semibold">目前沒有商品可供顯示</h5>
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
    </div>
  )}
      </div>

      <div className="flex justify-center mt-4">
        <div className="join">
          <button
            type="button"
            className="join-item btn"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            «
          </button>
          <button
            type="button"
            className="join-item btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              type="button"
              key={idx + 1}
              className={`join-item btn ${currentPage === idx + 1 ? "btn-active" : ""}`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            type="button"
            className="join-item btn"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
          <button
            type="button"
            className="join-item btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>

      {selectedProduct && (
        <AppModal
          show={showModal}
          onHide={handleModalClose}
          size="lg"
          variant="showcase"
          title={selectedProduct.name}
          footer={
            <Button variant="secondary" onClick={handleModalClose}>
              關閉
            </Button>
          }
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <Swiper
                modules={[SwiperPagination]}
                pagination={{ clickable: true }}
                className="w-full"
              >
                {selectedProduct.photos.map((photo, index) => (
                  <SwiperSlide key={index}>
                    <img
                      className="block w-full"
                      style={{
                        width: '500px', // 固定寬度
                        height: '500px', // 固定高度
                        objectFit: 'cover', // 防止圖片變形
                    }}
                      src={process.env.REACT_APP_BASE_URL + photo}
                      alt={`Product Image ${index + 1}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="col-span-12 md:col-span-6">
              <h5 className="text-lg font-semibold">簡介</h5>
              <p>{selectedProduct.description}</p>
            </div>
          </div>
        </AppModal>
      )}
    </div>
  );
};

export default ProductDisplay;
