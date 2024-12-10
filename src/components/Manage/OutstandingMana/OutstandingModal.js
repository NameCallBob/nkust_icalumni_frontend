import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form, InputGroup } from 'react-bootstrap';

const AddOutstandingAlumniModal = ({ show, onClose, onSubmit }) => {
    const [step, setStep] = useState(1); // 當前步驟，1: 選擇系友, 2: 填寫資訊
    const [members, setMembers] = useState([]); // 可選系友列表
    const [searchQuery, setSearchQuery] = useState(''); // 查詢條件
    const [page, setPage] = useState(1); // 當前頁
    const [pageSize] = useState(10); // 每頁顯示數量
    const [totalResults, setTotalResults] = useState(0); // 總資料數量
    const [selectedMember, setSelectedMember] = useState(null); // 選擇的系友
    const [alumniData, setAlumniData] = useState({
        highlight: '',
        achievements: '',
        is_featured: false,
    }); // 傑出系友資料

    useEffect(() => {
        if (step === 1) fetchMembers();
    }, [step, page, searchQuery]);

    // 獲取會員資料
    const fetchMembers = () => {
        Axios().get('member/admin/tableOutput_all/', {
            params: { page, search: searchQuery, page_size: pageSize },
        })
            .then((res) => {
                setMembers(res.data || []); // 確保 results 是一個陣列
                setTotalResults(res.data.total_count || 0); // 設置總資料數量
            })
            .catch((err) => {
                console.error('Error fetching members:', err);
                setMembers([]); // 在出錯時設置為空陣列，防止渲染錯誤
                setTotalResults(0); // 設置總資料數量為 0
            });
    };

    const handleNextStep = () => {
        if (step === 1 && selectedMember) {
            setAlumniData((prev) => ({ ...prev, member: selectedMember.id }));
            setStep(2);
        }
    };

    const handleSubmit = () => {
        onSubmit(alumniData);
        onClose();
    };

    const totalPages = Math.ceil(totalResults / pageSize); // 計算總頁數

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{step === 1 ? '選擇系友' : '填寫傑出系友資料'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {step === 1 && (
                    <>
                        {/* 查詢框 */}
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="輸入名稱查詢"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button variant="primary" onClick={() => setPage(1)}>
                                查詢
                            </Button>
                        </InputGroup>

                        {/* 系友列表 */}
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>名稱</th>
                                    <th>電話</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.length > 0 ? (
                                    members.map((member) => (
                                        <tr key={member.id}>
                                            <td>{member.name}</td>
                                            <td>{member.email || '無'}</td>
                                            <td>
                                                <Button
                                                    variant="success"
                                                    onClick={() => setSelectedMember(member)}
                                                >
                                                    選擇
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center">
                                            無資料
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        {/* 分頁控制 */}
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <Button
                                variant="secondary"
                                disabled={page <= 1}
                                onClick={() => setPage((prev) => prev - 1)}
                            >
                                上一頁
                            </Button>
                            <span>
                                第 {page} 頁 / 共 {totalPages} 頁
                            </span>
                            <Button
                                variant="secondary"
                                disabled={page >= totalPages}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                下一頁
                            </Button>
                        </div>
                    </>
                )}
                {step === 2 && (
                    <>
                        {/* 選擇後的表單 */}
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>摘要</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="輸入摘要"
                                    value={alumniData.highlight}
                                    onChange={(e) =>
                                        setAlumniData({ ...alumniData, highlight: e.target.value })
                                    }
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
                                    onChange={(e) =>
                                        setAlumniData({ ...alumniData, achievements: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Check
                                    type="checkbox"
                                    label="展示於官網"
                                    checked={alumniData.is_featured}
                                    onChange={(e) =>
                                        setAlumniData({ ...alumniData, is_featured: e.target.checked })
                                    }
                                />
                            </Form.Group>
                        </Form>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    取消
                </Button>
                {step === 1 && (
                    <Button variant="primary" disabled={!selectedMember} onClick={handleNextStep}>
                        下一步
                    </Button>
                )}
                {step === 2 && (
                    <Button variant="primary" onClick={handleSubmit}>
                        新增
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default AddOutstandingAlumniModal;
