import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaPen, FaTrash, FaEye, FaCheck, FaTimes, FaCalendarAlt, FaImage, FaInfoCircle } from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Button, Spinner } from 'components/common/ui';
import { handleImageError, getImageSrc } from '../../../utils/imageDefaults';

const ProductList = ({
    products,
    onEdit,
    onDelete,
    onProductClick,
    currentPage,
    totalPages,
    onPageChange,
    isLoading
}) => {
    // 獲取圖片URL，處理字符串或對象類型的圖片
    const getImageUrl = (image) => {
        if (!image) return '/placeholder.png';
        return typeof image === 'string' ? image : process.env.REACT_APP_BASE_URL + image.image;
    };

    // 格式化日期顯示
    const formatDate = (dateString) => {
        if (!dateString) return '無日期';
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // 截斷文本
    const truncateText = (text, maxLength = 80) => {
        if (!text) return '';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    // 如果正在加載，顯示加載指示器
    if (isLoading) {
        return (
            <div className="text-center py-12">
                <Spinner size="lg" />
                <p className="mt-3 text-base-content/60">正在載入產品資料...</p>
            </div>
        );
    }

    // 如果沒有產品，顯示提示信息
    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12 bg-base-200 rounded-lg">
                <FaInfoCircle size={40} className="text-base-content/60 mb-3 mx-auto" />
                <h4 className="text-base-content/60 text-xl font-semibold">無產品資料</h4>
                <p className="text-base-content/60">目前沒有符合查詢條件的產品，請嘗試調整搜索條件或新增產品。</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-12 gap-4 product-grid">
                {products.map((product) => (
                    <div className="col-span-12 md:col-span-6 lg:col-span-4 mb-4" key={product.id}>
                        <div className="card card-bordered bg-base-100 h-full product-card shadow-sm transition-hover">
                            <div className="relative">
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    className="product-carousel"
                                >
                                    {product.images && product.images.length > 0 ? (
                                        product.images.map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <div
                                                    className="product-image-container flex items-center justify-center"
                                                    style={{
                                                        height: '200px',
                                                        background: '#f8f9fa',
                                                    }}
                                                >
                                                    <img
                                                        className="product-image"
                                                        style={{
                                                            maxHeight: '200px',
                                                            maxWidth: '100%',
                                                            objectFit: 'contain',
                                                            backgroundColor: '#ffffff'
                                                        }}
                                                        src={getImageSrc(getImageUrl(image), 'product')}
                                                        alt={`${product.name} - 圖片 ${index + 1}`}
                                                        onError={(e) => handleImageError(e, 'product')}
                                                    />
                                                </div>
                                                {index === 0 && (
                                                    <div className="absolute top-0 left-0 bg-warning text-warning-content p-1 m-2 rounded-full z-10">
                                                        <small>主圖</small>
                                                    </div>
                                                )}
                                            </SwiperSlide>
                                        ))
                                    ) : (
                                        <SwiperSlide>
                                            <div className="flex items-center justify-center bg-base-200" style={{height: '200px'}}>
                                                <FaImage size={40} className="text-base-content/60" />
                                            </div>
                                        </SwiperSlide>
                                    )}
                                </Swiper>

                                <div className="absolute top-0 right-0 m-2 z-10">
                                    <span
                                        className={`badge ${product.is_active ? 'badge-success' : 'badge-error'} status-badge gap-1`}
                                    >
                                        {product.is_active ?
                                            <><FaCheck /> 已啟用</> :
                                            <><FaTimes /> 未啟用</>
                                        }
                                    </span>
                                </div>
                            </div>

                            <div className="card-body flex flex-col">
                                <h2
                                    className="card-title product-title font-bold mb-2 text-base"
                                    style={{cursor: 'pointer'}}
                                    onClick={() => onProductClick(product)}
                                >
                                    {product.name}
                                </h2>

                                <p className="text-base-content/60 text-sm mb-1">
                                    <span className="badge badge-neutral mr-1">
                                        {product.category_name || '未分類'}
                                    </span>
                                </p>

                                <p className="product-description text-base-content/60 mb-3 text-sm">
                                    {truncateText(product.description)}
                                </p>

                                <div className="text-base-content/60 text-sm mb-3 mt-auto flex items-center gap-1">
                                    <FaCalendarAlt />
                                    {formatDate(product.created_at)}
                                </div>

                                <div className="flex justify-between mt-auto">
                                    <Tippy content="查看詳情">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mr-1"
                                            onClick={() => onProductClick(product)}
                                        >
                                            <FaEye className="mr-1" /> 詳情
                                        </Button>
                                    </Tippy>

                                    <div>
                                        <Tippy content="編輯產品">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="mr-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(product);
                                                }}
                                            >
                                                <FaPen /> 編輯
                                            </Button>
                                        </Tippy>

                                        <Tippy content="刪除產品">
                                            <Button
                                                variant="error"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm(`確定要刪除「${product.name}」嗎？此操作不可恢復。`)) {
                                                        onDelete(product.id);
                                                    }
                                                }}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </Tippy>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <div className="join pagination-container">
                        {currentPage > 1 && (
                            <Button
                                variant="outline"
                                onClick={() => onPageChange(currentPage - 1)}
                                className="join-item"
                            >
                                &laquo; 上一頁
                            </Button>
                        )}

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // 如果頁數太多，只顯示當前頁附近的頁碼
                            if (
                                totalPages <= 7 ||
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <Button
                                        key={page}
                                        variant={page === currentPage ? 'primary' : 'outline'}
                                        onClick={() => onPageChange(page)}
                                        className="join-item"
                                    >
                                        {page}
                                    </Button>
                                );
                            } else if (
                                (page === currentPage - 2 && currentPage > 3) ||
                                (page === currentPage + 2 && currentPage < totalPages - 2)
                            ) {
                                return <span key={page} className="join-item btn btn-disabled">...</span>;
                            } else {
                                return null;
                            }
                        })}

                        {currentPage < totalPages && (
                            <Button
                                variant="outline"
                                onClick={() => onPageChange(currentPage + 1)}
                                className="join-item"
                            >
                                下一頁 &raquo;
                            </Button>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                .product-card {
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }

                .product-title {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    min-height: 48px;
                }

                .product-description {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    min-height: 60px;
                }

                .status-badge {
                    font-size: 0.75rem;
                }
            `}</style>
        </>
    );
};

export default ProductList;
