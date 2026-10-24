import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import AppModal from 'components/common/AppModal';
import { Button, Field, ModalSection } from 'components/common/ui';

function ProductFormModal({ product, show, handleClose }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        photos: [], // 使用陣列來儲存多張圖片
    });

    const [previews, setPreviews] = useState([]); // 用來儲存圖片預覽

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                photos: [],
            });
            setPreviews([]); // 清除預覽
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); // 取得選擇的多張圖片
        setFormData({ ...formData, photos: files });

        // 產生圖片預覽
        const filePreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews(filePreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 假設新增/編輯成功，呼叫 handleClose 並將新的產品資料回傳
        handleClose({
            name: formData.name,
            description: formData.description,
            photos: formData.photos,
        });

        // 清除預覽 URL 以避免記憶體洩漏
        previews.forEach((preview) => URL.revokeObjectURL(preview));
    };

    return (
        <AppModal
            show={show}
            onHide={() => handleClose(null)}
            title={product ? '編輯產品' : '新增產品'}
            icon={<Package size={18} />}
            variant="admin"
            footer={
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" type="button" onClick={() => handleClose(null)}>
                        取消
                    </Button>
                    <Button variant="primary" type="submit" form="productForm">
                        {product ? '更新產品' : '新增產品'}
                    </Button>
                </div>
            }
        >
            <form id="productForm" onSubmit={handleSubmit}>
                <ModalSection title="產品資訊" icon={<Package size={18} />}>
                    <Field
                        as="input"
                        type="text"
                        label="產品名稱"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Field
                        as="textarea"
                        label="產品簡介"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </ModalSection>

                <ModalSection title="產品照片">
                    <Field
                        as="input"
                        type="file"
                        label="產品照片"
                        onChange={handleFileChange}
                        multiple // 允許多張圖片上傳
                    />

                    {/* 圖片預覽區塊 */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {previews.map((preview, index) => (
                            <img
                                key={index}
                                src={preview}
                                alt={`preview ${index}`}
                                className="w-24 h-24 rounded-lg border border-base-300 object-cover"
                            />
                        ))}
                    </div>
                </ModalSection>
            </form>
        </AppModal>
    );
}

export default ProductFormModal;
