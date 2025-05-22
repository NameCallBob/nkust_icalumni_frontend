import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup, FormControl, ListGroup, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTags, FaInfoCircle } from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

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
        <Modal 
            show={show} 
            onHide={onClose}
            size="lg"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title><FaTags className="me-2" />分類管理</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-4">
                    <div className="alert alert-info">
                        <FaInfoCircle className="me-2" />
                        <strong>分類管理說明：</strong>
                        <p className="mb-0 mt-1">
                            產品分類可以幫助您更好地組織和管理產品。您可以在此頁面新增、編輯或刪除分類。
                            請注意，刪除已有產品關聯的分類可能會影響產品顯示。
                        </p>
                    </div>
                </div>
                
                <Form className="mb-4">
                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">新增分類</Form.Label>
                        <InputGroup className="shadow-sm">
                            <FormControl
                                placeholder="輸入新分類名稱..."
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <Tippy content="新增產品分類">
                                <Button variant="success" onClick={handleAddCategory}>
                                    <FaPlus className="me-1" /> 新增
                                </Button>
                            </Tippy>
                        </InputGroup>
                        <Form.Text className="text-muted">
                            分類名稱應簡短明確，例如「電子產品」、「家居用品」等。
                        </Form.Text>
                    </Form.Group>
                    
                    <h5 className="mb-3 mt-4 border-bottom pb-2">
                        <FaTags className="me-2" />
                        已建立分類 
                        <Badge bg="primary" className="ms-2">{categories.length}</Badge>
                    </h5>
                    
                    {categories.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            <FaInfoCircle size={30} className="mb-2" />
                            <p>尚未建立任何分類，請使用上方表單新增。</p>
                        </div>
                    ) : (
                        <ListGroup className="shadow-sm">
                            {categories.map((category) => (
                                <ListGroup.Item 
                                    key={category.id} 
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    {editingCategory === category.id ? (
                                        <InputGroup>
                                            <FormControl
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') saveEditedCategory();
                                                    if (e.key === 'Escape') cancelEditing();
                                                }}
                                                autoFocus
                                            />
                                            <Button variant="success" onClick={saveEditedCategory}>
                                                保存
                                            </Button>
                                            <Button variant="secondary" onClick={cancelEditing}>
                                                取消
                                            </Button>
                                        </InputGroup>
                                    ) : (
                                        <>
                                            <span className="fw-medium">{category.name}</span>
                                            <div>
                                                <Tippy content="編輯此分類">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => startEditing(category)}
                                                    >
                                                        <FaEdit /> 編輯
                                                    </Button>
                                                </Tippy>
                                                <Tippy content="刪除此分類">
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (window.confirm(`確定要刪除分類「${category.name}」嗎？此操作不可恢復！`)) {
                                                                handleDeleteCategory(category.id, category.name);
                                                            }
                                                        }}
                                                    >
                                                        <FaTrash /> 刪除
                                                    </Button>
                                                </Tippy>
                                            </div>
                                        </>
                                    )}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onClose}>
                    完成
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CategoryManagement;