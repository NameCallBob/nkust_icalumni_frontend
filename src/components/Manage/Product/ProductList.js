import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaPen, FaTrash, FaEye, FaCheck, FaTimes, FaCalendarAlt, FaImage } from 'react-icons/fa';
import { ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Button, Spinner, Card, Badge, EmptyState } from 'components/common/ui';
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
            <div className="flex flex-col items-center justify-center py-16">
                <Spinner size="lg" />
                <p className="mt-4 text-sm text-base-content/50">正在載入產品資料...</p>
            </div>
        );
    }

    // 如果沒有產品，顯示提示信息
    if (!products || products.length === 0) {
        return (
            <Card padding="none" className="overflow-hidden">
                <EmptyState
                    icon={<PackageSearch className="h-8 w-8" />}
                    title="無產品資料"
                    description="目前沒有符合查詢條件的產品，請嘗試調整搜索條件或新增產品。"
                />
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                    <Card
                        key={product.id}
                        hover
                        padding="none"
                        className="flex flex-col overflow-hidden"
                    >
                        {/* 圖片輪播區 */}
                        <div className="relative bg-slate-50">
                            <Swiper
                                modules={[Navigation, Pagination]}
                                navigation
                                pagination={{ clickable: true }}
                                className="product-carousel"
                            >
                                {product.images && product.images.length > 0 ? (
                                    product.images.map((image, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="flex h-52 items-center justify-center bg-slate-50">
                                                <img
                                                    className="max-h-52 max-w-full object-contain"
                                                    src={getImageSrc(getImageUrl(image), 'product')}
                                                    alt={`${product.name} - 圖片 ${index + 1}`}
                                                    onError={(e) => handleImageError(e, 'product')}
                                                />
                                            </div>
                                            {index === 0 && (
                                                <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-[#a0781c] px-2.5 py-0.5 text-xs font-medium text-white shadow-sm">
                                                    主圖
                                                </span>
                                            )}
                                        </SwiperSlide>
                                    ))
                                ) : (
                                    <SwiperSlide>
                                        <div className="flex h-52 items-center justify-center bg-slate-100">
                                            <FaImage size={40} className="text-base-content/30" />
                                        </div>
                                    </SwiperSlide>
                                )}
                            </Swiper>

                            <div className="absolute right-3 top-3 z-10">
                                <Badge variant={product.is_active ? 'success' : 'error'} className="gap-1 shadow-sm">
                                    {product.is_active ? (
                                        <><FaCheck /> 已啟用</>
                                    ) : (
                                        <><FaTimes /> 未啟用</>
                                    )}
                                </Badge>
                            </div>
                        </div>

                        {/* 內容區 */}
                        <div className="flex flex-1 flex-col p-5">
                            <h3
                                className="line-clamp-2 cursor-pointer text-base font-semibold text-[#0f172a] transition-colors hover:text-[#1e3a8a]"
                                onClick={() => onProductClick(product)}
                            >
                                {product.name}
                            </h3>

                            <div className="mt-2">
                                <Badge variant="primary">{product.category_name || '未分類'}</Badge>
                            </div>

                            <p className="mt-3 line-clamp-3 min-h-[3.75rem] text-sm text-base-content/60">
                                {truncateText(product.description)}
                            </p>

                            <div className="mt-auto flex items-center gap-1.5 pt-3 text-xs text-base-content/50">
                                <FaCalendarAlt />
                                {formatDate(product.created_at)}
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-base-300/60 pt-4">
                                <Tippy content="查看詳情">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onProductClick(product)}
                                    >
                                        <FaEye className="mr-1" /> 詳情
                                    </Button>
                                </Tippy>

                                <div className="flex items-center gap-1">
                                    <Tippy content="編輯產品">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(product);
                                            }}
                                        >
                                            <FaPen className="mr-1" /> 編輯
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
                    </Card>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center">
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {currentPage > 1 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(currentPage - 1)}
                            >
                                <ChevronLeft className="h-4 w-4" /> 上一頁
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
                                        size="sm"
                                        onClick={() => onPageChange(page)}
                                    >
                                        {page}
                                    </Button>
                                );
                            } else if (
                                (page === currentPage - 2 && currentPage > 3) ||
                                (page === currentPage + 2 && currentPage < totalPages - 2)
                            ) {
                                return (
                                    <span key={page} className="px-2 text-base-content/40">
                                        …
                                    </span>
                                );
                            } else {
                                return null;
                            }
                        })}

                        {currentPage < totalPages && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(currentPage + 1)}
                            >
                                下一頁 <ChevronRight className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
