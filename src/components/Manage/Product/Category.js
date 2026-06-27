import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTags, FaInfoCircle } from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import AppModal from 'components/common/AppModal';
import { Button } from 'components/common/ui';

const CategoryManagement = ({ categories, fetchCategories, saveCategory, updateCategory, deleteCategory, show, onClose }) => {
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [editedName, setEditedName] = useState('');

    // 新增分類
    const handleAddCategory = async () => {
        if (newCategory.trim() === '') {
            toast.warning('請輸入分類名稱');
            return;
        }
        try {
            await saveCategory(newCategory.trim());
            await fetchCategories();
            setNewCategory('');
            toast.success('分類已成功建立！');
        } catch (error) {
            toast.error('無法建立分類，請確認名稱是否已存在');
        }
    };

    // 開始編輯分類
    const startEditing = (category) => {
        setEditingCategory(category.id);
        setEditedName(category.name);
    };

    // 保存編輯分類
    const saveEditedCategory = async () => {
        if (editedName.trim() === '') {
            toast.warning('分類名稱不能為空');
            return;
        }
        try {
            await updateCategory(editingCategory, editedName.trim());
            await fetchCategories();
            setEditingCategory(null);
            toast.success('分類已成功更新！');
        } catch (error) {
            toast.error('更新分類失敗，請確保名稱不重複');
        }
    };

    // 取消編輯
    const cancelEditing = () => {
        setEditingCategory(null);
    };

    // 處理刪除分類
    const handleDeleteCategory = async (id, name) => {
        try {
            await deleteCategory(id);
            await fetchCategories();
            toast.success(`已刪除分類「${name}」`);
        } catch (error) {
            toast.error('無法刪除分類，請確認該分類沒有關聯產品');
        }
    };

    // 按 Enter 鍵保存
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 防止表單提交
            handleAddCategory(); // 呼叫新增分類函數
        }
    };

    return (
        <AppModal
            show={show}
            onHide={onClose}
            size="lg"
            variant="admin"
            title="分類管理"
            icon={<FaTags />}
            closeOnBackdrop={false}
            footer={(
                <Button variant="primary" onClick={onClose}>
                    完成
                </Button>
            )}
        >
            <div className="mb-4">
                <div className="alert alert-info">
                    <FaInfoCircle className="mr-2" />
                    <div>
                        <strong>分類管理說明：</strong>
                        <p className="mb-0 mt-1">
                            產品分類可以幫助您更好地組織和管理產品。您可以在此頁面新增、編輯或刪除分類。
                            請注意，刪除已有產品關聯的分類可能會影響產品顯示。
                        </p>
                    </div>
                </div>
            </div>

            <form className="mb-4">
                <div className="form-control mb-4">
                    <label className="label pb-1">
                        <span className="label-text font-bold">新增分類</span>
                    </label>
                    <div className="join shadow-sm w-full">
                        <input
                            className="input input-bordered join-item flex-1"
                            placeholder="輸入新分類名稱..."
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <Tippy content="新增產品分類">
                            <button type="button" className="btn btn-success join-item" onClick={handleAddCategory}>
                                <FaPlus className="mr-1" /> 新增
                            </button>
                        </Tippy>
                    </div>
                    <span className="label-text-alt text-base-content/60 mt-1">
                        分類名稱應簡短明確，例如「電子產品」、「家居用品」等。
                    </span>
                </div>

                <h5 className="text-lg font-semibold mb-3 mt-4 border-b border-base-300 pb-2 flex items-center">
                    <FaTags className="mr-2" />
                    已建立分類
                    <span className="badge badge-primary ml-2">{categories.length}</span>
                </h5>

                {categories.length === 0 ? (
                    <div className="text-center py-4 text-base-content/60">
                        <FaInfoCircle size={30} className="mb-2 mx-auto" />
                        <p>尚未建立任何分類，請使用上方表單新增。</p>
                    </div>
                ) : (
                    <ul className="menu bg-base-100 rounded-box shadow-sm w-full p-0 [&>li]:border-b [&>li]:border-base-200 last:[&>li]:border-b-0">
                        {categories.map((category) => (
                            <li
                                key={category.id}
                                className="flex flex-row justify-between items-center px-4 py-2"
                            >
                                {editingCategory === category.id ? (
                                    <div className="join w-full">
                                        <input
                                            className="input input-bordered join-item flex-1"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveEditedCategory();
                                                if (e.key === 'Escape') cancelEditing();
                                            }}
                                            autoFocus
                                        />
                                        <button type="button" className="btn btn-success join-item" onClick={saveEditedCategory}>
                                            保存
                                        </button>
                                        <button type="button" className="btn btn-secondary join-item" onClick={cancelEditing}>
                                            取消
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="font-medium">{category.name}</span>
                                        <div className="flex items-center">
                                            <Tippy content="編輯此分類">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline btn-primary btn-sm mr-2"
                                                    onClick={() => startEditing(category)}
                                                >
                                                    <FaEdit /> 編輯
                                                </button>
                                            </Tippy>
                                            <Tippy content="刪除此分類">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline btn-error btn-sm"
                                                    onClick={() => {
                                                        if (window.confirm(`確定要刪除分類「${category.name}」嗎？此操作不可恢復！`)) {
                                                            handleDeleteCategory(category.id, category.name);
                                                        }
                                                    }}
                                                >
                                                    <FaTrash /> 刪除
                                                </button>
                                            </Tippy>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </form>
        </AppModal>
    );
};

export default CategoryManagement;
