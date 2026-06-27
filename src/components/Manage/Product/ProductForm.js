import React, { useState, useRef, useEffect } from 'react';
import AppModal from 'components/common/AppModal';
import { Button, Field, Card, Badge } from 'components/common/ui';
import { FaCamera, FaTrash, FaStar, FaRegStar, FaInfoCircle, FaCheck, FaTimes } from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { toast } from 'react-toastify';

const ProductForm = ({
    show,
    onClose,
    onSave,
    categories,
    productData,
    setProductData,
}) => {
    const [imagePreviews, setImagePreviews] = useState(productData.images || []);
    const [isDragging, setIsDragging] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [showHelp, setShowHelp] = useState(false);
    const fileInputRef = useRef(null);

    // 重置表單狀態
    useEffect(() => {
        if (show) {
            setImagePreviews(productData.images || []);
            setValidationErrors({});
        }
    }, [show, productData]);

    // 處理圖片上傳
    const handleImageUpload = (e) => {
        processFiles(e.target.files);
    };

    // 處理拖放文件上傳
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    };

    // 處理文件讀取
    const processFiles = (files) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        const validImageFiles = fileArray.filter(file => file.type.startsWith('image/'));

        if (validImageFiles.length !== fileArray.length) {
            toast.warning('請只上傳圖片檔案');
        }

        if (validImageFiles.length === 0) return;

        // 檢查文件大小
        const oversizedFiles = validImageFiles.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.warning('部分圖片超過5MB，已被跳過');
        }

        const validFiles = validImageFiles.filter(file => file.size <= 5 * 1024 * 1024);

        const promises = validFiles.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises)
            .then((base64Images) => {
                setProductData((prev) => ({
                    ...prev,
                    images: [...prev.images, ...base64Images],
                }));
                setImagePreviews((prev) => [...prev, ...base64Images]);
            })
            .catch((error) => toast.error('圖片處理失敗'));
    };

    // 設置主圖
    const handleSetMainImage = (index) => {
        const updatedImages = [...imagePreviews];
        const [mainImage] = updatedImages.splice(index, 1);
        setProductData((prev) => ({
            ...prev,
            images: [mainImage, ...updatedImages],
        }));
        setImagePreviews([mainImage, ...updatedImages]);
    };

    // 刪除圖片
    const handleDeleteImage = (index) => {
        const updatedImages = [...imagePreviews];
        updatedImages.splice(index, 1);
        setProductData((prev) => ({
            ...prev,
            images: updatedImages,
        }));
        setImagePreviews(updatedImages);
    };

    // 表單欄位變更
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // 清除對應欄位的驗證錯誤
        if (validationErrors[name]) {
            setValidationErrors({
                ...validationErrors,
                [name]: null
            });
        }
    };

    // 表單提交前驗證
    const validateForm = () => {
        const errors = {};

        if (!productData.name.trim()) {
            errors.name = '請輸入產品名稱';
        }

        if (!productData.description.trim()) {
            errors.description = '請輸入產品描述';
        }

        if (!productData.category) {
            errors.category = '請選擇產品分類';
        }

        if (imagePreviews.length === 0) {
            errors.images = '請至少上傳一張產品圖片';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // 保存產品
    const handleSaveProduct = () => {
        if (validateForm()) {
            onSave(productData);
            onClose();
        } else {
            // 滾動到第一個錯誤
            const firstError = document.querySelector('.is-invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    // 底部按鈕區
    const footer = (
        <>
            <Button variant="secondary" onClick={onClose}>
                取消
            </Button>
            <Button
                variant="primary"
                onClick={handleSaveProduct}
            >
                {productData.id ? '更新產品' : '建立產品'}
            </Button>
        </>
    );

    return (
        <AppModal
            show={show}
            onHide={onClose}
            title={productData.id ? '編輯產品' : '新增產品'}
            size="lg"
            variant="admin"
            closeOnBackdrop={false}
            footer={footer}
        >
            <div className="flex justify-end mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-[#1e3a8a] hover:bg-[#1e3a8a]/5"
                    onClick={() => setShowHelp(!showHelp)}
                >
                    <FaInfoCircle />
                    {showHelp ? '隱藏填寫說明' : '顯示填寫說明'}
                </Button>
            </div>

            {showHelp && (
                <div className="mb-6 rounded-xl border border-[#1e3a8a]/15 bg-[#1e3a8a]/5 p-4">
                    <h5 className="mb-3 flex items-center gap-2 font-bold text-[#1e3a8a]">
                        <FaInfoCircle /> 產品資料填寫說明
                    </h5>
                    <ul className="m-0 list-disc space-y-1.5 pl-5 text-sm text-base-content/80">
                        <li><strong>產品名稱</strong>：應簡潔明確，避免過長或難以理解的名稱，建議在30字以內。</li>
                        <li><strong>產品簡介</strong>：詳細描述產品特點與用途，可包含規格、特性等重要資訊。</li>
                        <li><strong>分類</strong>：選擇最符合產品的分類，以便客戶快速尋找。</li>
                        <li><strong>圖片</strong>：上傳清晰的產品圖片，首張圖片將作為主圖展示。支援拖放上傳。</li>
                        <li><strong>啟用狀態</strong>：勾選「啟用」表示產品會在前台顯示，取消勾選則不會顯示。</li>
                    </ul>
                </div>
            )}

            <form>
                <Card padding="md" className="mb-5">
                    <h6 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#1e3a8a]">
                        <span className="h-4 w-1 rounded-full bg-[#a0781c]" />
                        基本資料
                    </h6>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-1 md:grid-cols-2">
                        <div>
                            <Field
                                label="產品名稱"
                                required
                                type="text"
                                name="name"
                                value={productData.name}
                                onChange={handleChange}
                                placeholder="輸入產品名稱..."
                                className={validationErrors.name ? 'is-invalid' : ''}
                                maxLength={100}
                                error={validationErrors.name}
                                help={`建議30字以內，目前已輸入 ${productData.name.length} 字`}
                            />

                            <Field
                                as="select"
                                label="分類"
                                required
                                name="category"
                                value={productData.category}
                                onChange={handleChange}
                                className={validationErrors.category ? 'is-invalid' : ''}
                                error={validationErrors.category}
                            >
                                <option value="">-- 選擇分類 --</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Field>

                            <div className="form-control mb-4 w-full">
                                <label className="label pb-1">
                                    <span className="label-text font-medium text-base-content">狀態</span>
                                </label>
                                <div className="flex items-center gap-3 rounded-lg border border-base-300 bg-base-100 p-3">
                                    <input
                                        type="checkbox"
                                        id="product-status-switch"
                                        name="is_active"
                                        checked={productData.is_active}
                                        onChange={handleChange}
                                        className="toggle toggle-primary"
                                    />
                                    {productData.is_active ? (
                                        <Badge variant="success">
                                            <FaCheck className="mr-1 inline" /> 產品已啟用
                                        </Badge>
                                    ) : (
                                        <Badge variant="error">
                                            <FaTimes className="mr-1 inline" /> 產品未啟用
                                        </Badge>
                                    )}
                                </div>
                                <span className="label-text-alt mt-1 text-base-content/60">
                                    啟用的產品將顯示在前台，未啟用則不會顯示。
                                </span>
                            </div>
                        </div>

                        <div>
                            <Field
                                as="textarea"
                                label="產品簡介"
                                required
                                name="description"
                                value={productData.description}
                                onChange={handleChange}
                                placeholder="詳細描述產品的特點、用途、規格等..."
                                className={validationErrors.description ? 'is-invalid' : ''}
                                style={{ height: '172px' }}
                                error={validationErrors.description}
                            />
                        </div>
                    </div>
                </Card>

                <Card padding="md">
                    <div className="mb-4 flex items-center justify-between">
                        <h6 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#1e3a8a]">
                            <span className="h-4 w-1 rounded-full bg-[#a0781c]" />
                            產品圖片<span className="text-error">*</span>
                        </h6>
                        {imagePreviews.length > 0 && (
                            <Badge variant="primary">已上傳 {imagePreviews.length} 張</Badge>
                        )}
                    </div>

                    <div
                        className={`mb-3 cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${isDragging ? 'border-[#1e3a8a] bg-[#1e3a8a]/5' : 'border-base-300 hover:border-[#1e3a8a]/50 hover:bg-base-200/50'} ${validationErrors.images ? 'border-error' : ''}`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <FaCamera size={40} className="mx-auto mb-3 text-[#1e3a8a]" />
                        <h6 className="font-semibold text-base-content">點擊或拖放圖片至此處上傳</h6>
                        <p className="m-0 text-sm text-base-content/60">支援 JPG、PNG 格式，每張圖片最大 5MB</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>

                    {validationErrors.images && (
                        <div className="mb-3 text-sm text-error">{validationErrors.images}</div>
                    )}

                    {imagePreviews.length > 0 && (
                        <div className="rounded-xl border border-base-300 bg-base-100">
                            <div className="flex items-center justify-between border-b border-base-300 bg-base-200/60 px-4 py-3">
                                <span className="font-bold text-base-content">已上傳圖片 ({imagePreviews.length})</span>
                                <Tippy content="第一張圖片將作為主圖顯示">
                                    <span className="flex items-center gap-1 text-sm text-base-content/60">
                                        <FaInfoCircle /> 主圖標示為 <FaStar className="text-warning" />
                                    </span>
                                </Tippy>
                            </div>
                            <div className="flex flex-wrap gap-3 p-4">
                                {imagePreviews.map((image, index) => (
                                    <div key={index} className="relative">
                                        <div className="overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-sm" style={{ width: '150px' }}>
                                            <div style={{ height: '150px', overflow: 'hidden' }}>
                                                <img
                                                    src={image}
                                                    alt={`預覽圖片 ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex justify-between border-t border-base-300 p-2">
                                                <Tippy content={index === 0 ? "目前為主圖" : "設為主圖"}>
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${index === 0 ? 'btn-warning' : 'btn-outline btn-warning'}`}
                                                        onClick={() => index !== 0 && handleSetMainImage(index)}
                                                        disabled={index === 0}
                                                    >
                                                        {index === 0 ? <FaStar /> : <FaRegStar />}
                                                    </button>
                                                </Tippy>
                                                <Tippy content="刪除圖片">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline btn-error"
                                                        onClick={() => handleDeleteImage(index)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </Tippy>
                                            </div>
                                        </div>
                                        {index === 0 && (
                                            <span className="absolute left-1 top-1 badge badge-warning gap-1">
                                                <FaStar size={10} /> 主圖
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </form>
        </AppModal>
    );
};

export default ProductForm;
