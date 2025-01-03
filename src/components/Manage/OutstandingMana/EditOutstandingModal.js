import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Axios from 'common/Axios';

const EditOutstandingAlumniModal = ({ show, onClose, data, onSubmit }) => {
    const [alumniData, setAlumniData] = useState(data);

    const handleChange = (field, value) => {
        setAlumniData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
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
                        <Form.Label>摘要</Form.Label>
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
                    <Form.Group>
                        <Form.Check
                            type="checkbox"
                            label="展示於官網"
                            checked={alumniData.is_featured}
                            onChange={(e) => handleChange('is_featured', e.target.checked)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    取消
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    儲存
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditOutstandingAlumniModal;
