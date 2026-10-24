import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Tags, Plus, Pencil, Trash2, Info, Check, X } from 'lucide-react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import AppModal from 'components/common/AppModal';
import { Button, DataTable, EmptyState, Badge } from 'components/common/ui';

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

    const columns = [
        {
            key: 'name',
            header: '分類名稱',
            render: (category) =>
                editingCategory === category.id ? (
                    <input
                        className="w-full rounded-lg border border-[#1e3a8a]/30 bg-white px-3 py-2 text-sm text-[#0f172a] outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditedCategory();
                            if (e.key === 'Escape') cancelEditing();
                        }}
                        autoFocus
                    />
                ) : (
                    <span className="font-medium text-[#0f172a]">{category.name}</span>
                ),
        },
        {
            key: 'actions',
            header: '操作',
            className: 'text-right whitespace-nowrap',
            render: (category) =>
                editingCategory === category.id ? (
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="primary" size="sm" onClick={saveEditedCategory}>
                            <Check size={16} className="mr-1" /> 保存
                        </Button>
                        <Button variant="ghost" size="sm" onClick={cancelEditing}>
                            <X size={16} className="mr-1" /> 取消
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-end gap-2">
                        <Tippy content="編輯此分類">
                            <span>
                                <Button variant="outline" size="sm" onClick={() => startEditing(category)}>
                                    <Pencil size={16} className="mr-1" /> 編輯
                                </Button>
                            </span>
                        </Tippy>
                        <Tippy content="刪除此分類">
                            <span>
                                <Button
                                    variant="error"
                                    size="sm"
                                    onClick={() => {
                                        if (window.confirm(`確定要刪除分類「${category.name}」嗎？此操作不可恢復！`)) {
                                            handleDeleteCategory(category.id, category.name);
                                        }
                                    }}
                                >
                                    <Trash2 size={16} className="mr-1" /> 刪除
                                </Button>
                            </span>
                        </Tippy>
                    </div>
                ),
        },
    ];

    return (
        <AppModal
            show={show}
            onHide={onClose}
            size="lg"
            variant="admin"
            title="分類管理"
            icon={<Tags />}
            closeOnBackdrop={false}
            footer={(
                <Button variant="primary" onClick={onClose}>
                    完成
                </Button>
            )}
        >
            {/* 說明區塊 */}
            <div className="mb-6 flex gap-3 rounded-xl border border-[#1e3a8a]/15 bg-[#1e3a8a]/5 p-4">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1e3a8a] text-white">
                    <Info size={18} />
                </span>
                <div className="text-sm leading-relaxed text-[#0f172a]/80">
                    <strong className="text-[#0f172a]">分類管理說明：</strong>
                    <p className="mt-1 mb-0">
                        產品分類可以幫助您更好地組織和管理產品。您可以在此頁面新增、編輯或刪除分類。
                        請注意，刪除已有產品關聯的分類可能會影響產品顯示。
                    </p>
                </div>
            </div>

            {/* 新增分類 */}
            <div className="mb-6">
                <label className="mb-1.5 block text-sm font-semibold text-[#0f172a]">新增分類</label>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                        className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#0f172a] outline-none transition focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20"
                        placeholder="輸入新分類名稱..."
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <Tippy content="新增產品分類">
                        <span>
                            <Button variant="primary" onClick={handleAddCategory} className="w-full sm:w-auto">
                                <Plus size={16} className="mr-1" /> 新增
                            </Button>
                        </span>
                    </Tippy>
                </div>
                <p className="mt-1.5 text-xs text-[#0f172a]/50">
                    分類名稱應簡短明確，例如「電子產品」、「家居用品」等。
                </p>
            </div>

            {/* 已建立分類 */}
            <div className="mb-2 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Tags size={18} className="text-[#1e3a8a]" />
                <h5 className="text-base font-semibold text-[#0f172a]">已建立分類</h5>
                <Badge variant="primary">{categories.length}</Badge>
            </div>

            <DataTable
                columns={columns}
                data={categories}
                rowKey={(category) => category.id}
                empty={(
                    <EmptyState
                        icon={<Tags className="h-8 w-8" />}
                        title="尚未建立任何分類"
                        description="請使用上方表單新增您的第一個產品分類。"
                    />
                )}
            />
        </AppModal>
    );
};

export default CategoryManagement;
