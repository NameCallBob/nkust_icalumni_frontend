import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FaCheck, FaTimes, FaTag, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { Package } from 'lucide-react';
import AppModal from 'components/common/AppModal';
import { Button } from 'components/common/ui';
import { handleImageError, getImageSrc } from '../../../utils/imageDefaults';

const ProductDetailModal = ({ product, show, onClose }) => {
    // 控制分頁切換（純 UI 狀態，等同原 Tabs defaultActiveKey="basic"）
    const [activeTab, setActiveTab] = useState('basic');

    if (!product) return null;

    // 確保圖片可用性
    const hasImages = product.images && product.images.length > 0;

    // 格式化日期函數
    const formatDate = (dateString) => {
        if (!dateString) return '無日期資訊';
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppModal
            show={show}
            onHide={onClose}
            size="lg"
            variant="admin"
            icon={<Package size={18} />}
            title={
                <span className="flex items-center gap-2">
                    <span>{product.name}</span>
                    <span className={`badge ${product.is_active ? 'badge-success' : 'badge-error'} text-white`}>
                        {product.is_active ? '已啟用' : '未啟用'}
                    </span>
                </span>
            }
            footer={
                <Button variant="primary" onClick={onClose}>
                    關閉
                </Button>
            }
        >
            {/* 分頁列 */}
            <div role="tablist" className="tabs tabs-bordered mb-3">
                <button
                    type="button"
                    role="tab"
                    className={`tab ${activeTab === 'basic' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('basic')}
                >
                    基本資訊
                </button>
                <button
                    type="button"
                    role="tab"
                    className={`tab ${activeTab === 'images' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('images')}
                >
                    產品圖庫
                </button>
            </div>

            {/* 基本資訊 */}
            {activeTab === 'basic' && (
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-6">
                        {hasImages ? (
                            <Swiper
                                modules={[Pagination]}
                                pagination={{ clickable: true }}
                                className="product-detail-carousel mb-3 shadow-sm border border-base-300 rounded"
                            >
                                {product.images.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="h-[300px] bg-base-200 flex items-center justify-center relative">
                                            <img
                                                src={getImageSrc(
                                                    typeof image === 'string' ? image : process.env.REACT_APP_BASE_URL + image.image,
                                                    'product'
                                                )}
                                                alt={`產品圖片 ${index + 1}`}
                                                className="max-h-[300px] max-w-full object-contain"
                                                onError={(e) => handleImageError(e, 'product')}
                                            />
                                            {index === 0 && (
                                                <div className="absolute top-0 left-0 bg-warning text-warning-content p-1 m-2 rounded-full">
                                                    <small>主圖</small>
                                                </div>
                                            )}
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="flex items-center justify-center bg-base-200 h-[300px]">
                                <FaInfoCircle size={30} className="text-base-content/60 mr-2" />
                                <span className="text-base-content/60">無產品圖片</span>
                            </div>
                        )}

                        <div className="card card-bordered shadow-sm mt-3">
                            <div className="bg-base-200 px-4 py-3 font-semibold border-b border-base-300">
                                <FaTag className="inline mr-2" />
                                產品基本資訊
                            </div>
                            <div className="card-body p-3">
                                <dl className="grid grid-cols-12 gap-y-2 mb-0">
                                    <dt className="col-span-4 font-semibold">產品編號</dt>
                                    <dd className="col-span-8">{product.id}</dd>

                                    <dt className="col-span-4 font-semibold">產品名稱</dt>
                                    <dd className="col-span-8">{product.name}</dd>

                                    <dt className="col-span-4 font-semibold">產品分類</dt>
                                    <dd className="col-span-8">
                                        <span className="badge badge-neutral text-white">
                                            {product.category_name || '未分類'}
                                        </span>
                                    </dd>

                                    <dt className="col-span-4 font-semibold">啟用狀態</dt>
                                    <dd className="col-span-8">
                                        {product.is_active ? (
                                            <span className="text-success">
                                                <FaCheck className="inline mr-1" /> 已啟用
                                            </span>
                                        ) : (
                                            <span className="text-error">
                                                <FaTimes className="inline mr-1" /> 未啟用
                                            </span>
                                        )}
                                    </dd>

                                    <dt className="col-span-4 font-semibold">建立時間</dt>
                                    <dd className="col-span-8">
                                        <FaCalendarAlt className="inline mr-1" />
                                        {formatDate(product.created_at)}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                        <div className="card card-bordered shadow-sm h-full">
                            <div className="bg-base-200 px-4 py-3 font-semibold border-b border-base-300">
                                <FaInfoCircle className="inline mr-2" />
                                產品詳細描述
                            </div>
                            <div className="card-body p-3">
                                {product.description ? (
                                    <div className="product-description">
                                        {product.description.split('\n').map((paragraph, idx) => (
                                            <p key={idx} className="mb-3">{paragraph}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-5 text-base-content/60">
                                        <FaInfoCircle size={30} className="mx-auto mb-2" />
                                        <p>無產品描述</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 產品圖庫 */}
            {activeTab === 'images' && (
                <div>
                    <div className="text-center mb-3">
                        <h5 className="text-lg font-semibold">產品圖片 ({hasImages ? product.images.length : 0})</h5>
                        <p className="text-base-content/60">點擊圖片可放大查看</p>
                    </div>

                    {hasImages ? (
                        <div className="grid grid-cols-12 gap-4">
                            {product.images.map((image, index) => (
                                <div className="col-span-6 md:col-span-4 mb-4" key={index}>
                                    <div className="card card-bordered shadow-sm h-full image-card">
                                        <div className="h-[200px] overflow-hidden relative">
                                            <img
                                                src={typeof image === 'string' ? image : process.env.REACT_APP_BASE_URL + image.image}
                                                alt={`產品圖片 ${index + 1}`}
                                                className="w-full h-full object-cover cursor-pointer"
                                                onClick={() => window.open(typeof image === 'string' ? image : process.env.REACT_APP_BASE_URL + image.image, '_blank')}
                                            />
                                            {index === 0 && (
                                                <span className="absolute top-0 left-0 badge badge-warning m-1">
                                                    主圖
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-base-content/60 text-center px-4 py-3 border-t border-base-300">
                                            圖片 {index + 1}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5 bg-base-200 rounded">
                            <FaInfoCircle size={40} className="text-base-content/60 mx-auto mb-3" />
                            <h5 className="text-lg font-semibold text-base-content/60">此產品尚未添加任何圖片</h5>
                            <p className="text-base-content/60">可通過編輯產品來添加圖片</p>
                        </div>
                    )}
                </div>
            )}
        </AppModal>
    );
};

export default ProductDetailModal;
