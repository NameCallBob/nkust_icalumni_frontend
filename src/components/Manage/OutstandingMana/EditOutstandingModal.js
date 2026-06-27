import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Axios from 'common/Axios';

const EditOutstandingAlumniModal = ({ show, onClose, data, onSubmit }) => {
    const [alumniData, setAlumniData] = useState({
        highlight: '',
        achievements: '',
        is_featured: false,
        sort_order: 0,
    });

    useEffect(() => {
        if (data) {
            setAlumniData({
                ...data,
                sort_order: data.sort_order ?? 0,
            });
        }
    }, [data]);

    const handleChange = (field, value) => {
        setAlumniData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!alumniData.highlight) {
            alert("請填寫摘要");
            return;
        }
        onSubmit(alumniData);
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>編輯傑出系友資料</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            摘要 <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="輸入摘要"
                            value={alumniData.highlight}
                            onChange={(e) => handleChange('highlight', e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>詳細成就</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="輸入詳細成就"
                            value={alumniData.achievements}
                            onChange={(e) => handleChange('achievements', e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>顯示順序</Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            placeholder="輸入顯示順序（數字越小越前面）"
                            value={alumniData.sort_order}
                            onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
                        />
                        <Form.Text className="text-muted">
                            順序數字越小，在列表中顯示越前面
                        </Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Check
                            type="switch"
                            label="展示於官網"
                            checked={alumniData.is_featured}
                            onChange={(e) => handleChange('is_featured', e.target.checked)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onClose}>
                    <i className="bi bi-x-lg"></i> 取消
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!alumniData.highlight}
                >
                    <i className="bi bi-check2"></i> 儲存
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditOutstandingAlumniModal;
