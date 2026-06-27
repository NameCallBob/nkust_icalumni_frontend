import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Package, Tag, Calendar, Info, CheckCircle2, XCircle, Image as ImageIcon } from 'lucide-react';
import AppModal from 'components/common/AppModal';
import { Button, Card, Badge } from 'components/common/ui';
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

    const tabs = [
        { key: 'basic', label: '基本資訊', icon: <Info size={15} /> },
        { key: 'images', label: '產品圖庫', icon: <ImageIcon size={15} /> },
    ];

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
                    <Badge variant={product.is_active ? 'success' : 'error'}>
                        {product.is_active ? '已啟用' : '未啟用'}
                    </Badge>
                </span>
            }
            footer={
                <Button variant="primary" onClick={onClose}>
                    關閉
                </Button>
            }
        >
            {/* 分頁列 */}
            <div role="tablist" className="flex items-center gap-1 mb-5 p-1 bg-base-200/70 rounded-xl">
                {tabs.map((tab) => {
                    const active = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            type="button"
                            role="tab"
                            onClick={() => setActiveTab(tab.key)}
                            className={[
                                'flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all',
                                active
                                    ? 'bg-white text-[#1e3a8a] shadow-sm'
                                    : 'text-base-content/60 hover:text-[#1e3a8a]',
                            ].join(' ')}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* 基本資訊 */}
            {activeTab === 'basic' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-5">
                        {hasImages ? (
                            <Swiper
                                modules={[Pagination]}
                                pagination={{ clickable: true }}
                                className="w-full rounded-2xl overflow-hidden border border-base-300/70 shadow-sm"
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
                                                <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-[#a0781c] px-2.5 py-0.5 text-xs font-semibold text-white shadow">
                                                    主圖
                                                </span>
                                            )}
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="flex items-center justify-center gap-2 bg-base-200 rounded-2xl border border-base-300/70 h-[300px] text-base-content/50">
                                <Info size={26} />
                                <span>無產品圖片</span>
                            </div>
                        )}

                        <Card padding="none" className="overflow-hidden">
                            <div className="flex items-center gap-2 bg-[#0f172a] px-5 py-3 text-white">
                                <Tag size={16} className="text-[#a0781c]" />
                                <span className="font-semibold">產品基本資訊</span>
                            </div>
                            <dl className="divide-y divide-base-200">
                                <div className="grid grid-cols-3 gap-2 px-5 py-3">
                                    <dt className="text-sm font-semibold text-base-content/60">產品編號</dt>
                                    <dd className="col-span-2 text-sm">{product.id}</dd>
                                </div>
                                <div className="grid grid-cols-3 gap-2 px-5 py-3">
                                    <dt className="text-sm font-semibold text-base-content/60">產品名稱</dt>
                                    <dd className="col-span-2 text-sm font-medium">{product.name}</dd>
                                </div>
                                <div className="grid grid-cols-3 gap-2 px-5 py-3">
                                    <dt className="text-sm font-semibold text-base-content/60">產品分類</dt>
                                    <dd className="col-span-2">
                                        <Badge variant="primary">{product.category_name || '未分類'}</Badge>
                                    </dd>
                                </div>
                                <div className="grid grid-cols-3 gap-2 px-5 py-3">
                                    <dt className="text-sm font-semibold text-base-content/60">啟用狀態</dt>
                                    <dd className="col-span-2 text-sm">
                                        {product.is_active ? (
                                            <span className="inline-flex items-center gap-1 text-success font-medium">
                                                <CheckCircle2 size={15} /> 已啟用
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-error font-medium">
                                                <XCircle size={15} /> 未啟用
                                            </span>
                                        )}
                                    </dd>
                                </div>
                                <div className="grid grid-cols-3 gap-2 px-5 py-3">
                                    <dt className="text-sm font-semibold text-base-content/60">建立時間</dt>
                                    <dd className="col-span-2 inline-flex items-center gap-1.5 text-sm">
                                        <Calendar size={15} className="text-base-content/50" />
                                        {formatDate(product.created_at)}
                                    </dd>
                                </div>
                            </dl>
                        </Card>
                    </div>

                    <Card padding="none" className="overflow-hidden h-full">
                        <div className="flex items-center gap-2 bg-[#0f172a] px-5 py-3 text-white">
                            <Info size={16} className="text-[#a0781c]" />
                            <span className="font-semibold">產品詳細描述</span>
                        </div>
                        <div className="p-5">
                            {product.description ? (
                                <div className="text-sm leading-relaxed text-base-content/80">
                                    {product.description.split('\n').map((paragraph, idx) => (
                                        <p key={idx} className="mb-3 last:mb-0">{paragraph}</p>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-base-content/50">
                                    <Info size={30} className="mx-auto mb-2" />
                                    <p>無產品描述</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {/* 產品圖庫 */}
            {activeTab === 'images' && (
                <div>
                    <div className="text-center mb-5">
                        <h5 className="text-lg font-bold text-[#1e3a8a]">
                            產品圖片 ({hasImages ? product.images.length : 0})
                        </h5>
                        <p className="text-sm text-base-content/50">點擊圖片可放大查看</p>
                    </div>

                    {hasImages ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {product.images.map((image, index) => (
                                <Card key={index} padding="none" hover className="overflow-hidden">
                                    <div className="h-[200px] overflow-hidden relative">
                                        <img
                                            src={typeof image === 'string' ? image : process.env.REACT_APP_BASE_URL + image.image}
                                            alt={`產品圖片 ${index + 1}`}
                                            className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                                            onClick={() => window.open(typeof image === 'string' ? image : process.env.REACT_APP_BASE_URL + image.image, '_blank')}
                                        />
                                        {index === 0 && (
                                            <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-[#a0781c] px-2.5 py-0.5 text-xs font-semibold text-white shadow">
                                                主圖
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-center text-xs text-base-content/50 px-4 py-2.5 border-t border-base-200">
                                        圖片 {index + 1}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-base-200/60 rounded-2xl border border-base-300/70">
                            <Info size={40} className="text-base-content/40 mx-auto mb-3" />
                            <h5 className="text-base font-semibold text-base-content/60">此產品尚未添加任何圖片</h5>
                            <p className="text-sm text-base-content/50">可通過編輯產品來添加圖片</p>
                        </div>
                    )}
                </div>
            )}
        </AppModal>
    );
};

export default ProductDetailModal;
