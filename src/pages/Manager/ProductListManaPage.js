import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaTags, FaInfoCircle } from 'react-icons/fa';
import { Box, X } from 'lucide-react';
import useRWD from 'hooks/useRWD';
import Axios from 'common/Axios';
import { Button, Field, Card, PageHeader, Toolbar } from 'components/common/ui';
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

    // 產品內容區塊（三個標籤頁顯示相同的篩選結果，篩選由 API 處理）
    const productPanel = rwd.renderForDevice(
        // 移動設備：卡片式佈局
        <div className="grid grid-cols-12 gap-3">
            {Array.isArray(filteredProducts) &&
                filteredProducts
                    .slice(
                        (currentPage - 1) * productsPerPage,
                        currentPage * productsPerPage
                    )
                    .map((product) => (
                        <div key={product.id} className="col-span-12">
                            <div className="card card-bordered bg-base-100 h-full shadow-sm" style={{ fontSize: rwd.getFontSize('body') }}>
                                <div className="card-body" style={{ padding: rwd.getSpacing('medium') }}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h6 className="card-title mb-1" style={{ fontSize: rwd.getFontSize('h3') }}>
                                            {product.name}
                                        </h6>
                                        <span className={`badge ${product.is_active ? 'badge-success' : 'badge-ghost'}`}>
                                            {product.is_active ? '已啟用' : '未啟用'}
                                        </span>
                                    </div>
                                    <p className="text-base-content/60 text-sm mb-2" style={{ fontSize: rwd.getFontSize('small') }}>
                                        {product.description}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => setSelectedProduct(product)}
                                            style={rwd.getButtonStyle('block')}
                                        >
                                            查看詳情
                                        </Button>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setProductFormData(product);
                                                    setShowProductModal(true);
                                                }}
                                                className="flex-1"
                                            >
                                                編輯
                                            </Button>
                                            <Button
                                                variant="error"
                                                size="sm"
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="btn-outline flex-1"
                                            >
                                                刪除
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
    );

    return (
        <div
            className="container mx-auto px-4 py-6 max-w-7xl"
            style={rwd.getContainerStyle()}
        >
            <PageHeader
                title="產品管理中心"
                subtitle="管理公司所有產品，包括新增、編輯、刪除及分類"
                icon={<Box size={22} />}
                actions={(
                    <>
                        <Tippy content="管理產品分類">
                            <Button
                                variant="outline"
                                onClick={() => setShowCategoryModal(true)}
                            >
                                <FaTags className="mr-1" /> 管理分類
                            </Button>
                        </Tippy>

                        <Tippy content="新增產品到系統">
                            <Button
                                variant="success"
                                onClick={() => {
                                    resetProductFormData();
                                    setShowProductModal(true);
                                }}
                            >
                                <FaPlus className="mr-1" /> 新增商品
                            </Button>
                        </Tippy>
                    </>
                )}
            />

            {isFirstVisit && (
                <Card padding="none" className="mb-6 overflow-hidden border-l-4 border-l-info">
                    <div className="flex items-start gap-3 p-5">
                        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-info/10 text-info">
                            <FaInfoCircle />
                        </span>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base-content">歡迎使用產品管理系統</h3>
                            <p className="mt-1 text-sm text-base-content/70">
                                這是您的產品管理中心，在這裡您可以管理所有公司產品。
                            </p>
                            <ul className="list-disc pl-5 mt-2 text-sm text-base-content/70 space-y-1">
                                <li>使用<strong>搜尋欄</strong>快速尋找特定產品</li>
                                <li>點擊<strong>新增商品</strong>按鈕來創建新產品</li>
                                <li>使用<strong>管理分類</strong>功能組織您的產品</li>
                                <li>點擊產品卡片查看詳細資訊，或使用編輯和刪除功能</li>
                            </ul>
                        </div>
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm btn-circle"
                            onClick={() => setIsFirstVisit(false)}
                            aria-label="關閉"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </Card>
            )}

            <Card padding="md" className="mb-6">
                <Toolbar
                    left={(
                        <>
                            <div className="w-full sm:w-56">
                                <Field
                                    as="select"
                                    label={(
                                        <span className="text-base-content/60 text-sm flex items-center">
                                            <FaTags className="mr-1" />
                                            依分類篩選
                                        </span>
                                    )}
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
                                >
                                    <option value="">所有分類</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Field>
                            </div>
                            <div className="w-full sm:w-80 md:w-96">
                                <label className="label pb-1">
                                    <span className="text-base-content/60 text-sm flex items-center">
                                        <FaSearch className="mr-1" />
                                        搜尋產品
                                    </span>
                                </label>
                                <div className="join w-full">
                                    <input
                                        type="text"
                                        placeholder="輸入產品名稱關鍵字..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch();
                                            }
                                        }}
                                        className="input input-bordered join-item w-full"
                                    />
                                    <Button
                                        variant="primary"
                                        onClick={handleSearch}
                                        className="join-item"
                                    >
                                        <FaSearch /> 搜尋
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                />

                {/* 標籤頁導覽（分段式 pill），切換邏輯維持 handleTabChange */}
                <div className="mb-4 inline-flex flex-wrap gap-1 rounded-xl bg-base-200/70 p-1">
                    <button
                        type="button"
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-primary text-primary-content shadow-sm' : 'text-base-content/60 hover:text-base-content'}`}
                        onClick={() => handleTabChange('all')}
                    >
                        所有產品
                    </button>
                    <button
                        type="button"
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'active' ? 'bg-primary text-primary-content shadow-sm' : 'text-base-content/60 hover:text-base-content'}`}
                        onClick={() => handleTabChange('active')}
                    >
                        已啟用產品
                    </button>
                    <button
                        type="button"
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'inactive' ? 'bg-primary text-primary-content shadow-sm' : 'text-base-content/60 hover:text-base-content'}`}
                        onClick={() => handleTabChange('inactive')}
                    >
                        未啟用產品
                    </button>
                </div>

                {productPanel}
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
        </div>
    );
};

export default ProductManagement;
