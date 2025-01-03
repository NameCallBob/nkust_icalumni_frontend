import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import { toast } from 'react-toastify';

const CategoryManagement = ({ categories, fetchCategories, saveCategory, updateCategory, deleteCategory, show, onClose }) => {
    const [newCategory, setNewCategory] = useState('');

    const handleAddCategory = async () => {
        if (newCategory.trim() === '') return;
        try {
            await saveCategory(newCategory.trim());
            await fetchCategories();
            setNewCategory('');
            toast.success('新增分類成功！');
        } catch (error) {
            console.error('新增分類失敗', error);
            toast.error('新增分類失敗，請稍後再試！');
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 防止表單提交
            handleAddCategory(); // 呼叫新增分類函數
        }
    };


    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>管理分類</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>新增分類名稱</Form.Label>
                        <InputGroup>
                            <FormControl
                                placeholder="輸入分類名稱..."
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <Button variant="primary" onClick={handleAddCategory}>
                                新增
                            </Button>
                        </InputGroup>
                    </Form.Group>
                    <h5>已存在的分類</h5>
                    <ul className="list-unstyled">
                        {categories.map((category) => (
                            <li key={category.id} className="d-flex justify-content-between align-items-center mb-2">
                                <span>{category.name}</span>
                                <div>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => {
                                            const newName = prompt(
                                                `修改分類名稱（目前: ${category.name}）:`,
                                                category.name
                                            );
                                            if (newName && newName.trim()) {
                                                updateCategory(category.id, newName.trim());
                                            }
                                        }}
                                    >
                                        編輯
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => {
                                            if (window.confirm(`確定要刪除分類 "${category.name}" 嗎？`)) {
                                                deleteCategory(category.id);
                                            }
                                        }}
                                    >
                                        刪除
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    關閉
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CategoryManagement;