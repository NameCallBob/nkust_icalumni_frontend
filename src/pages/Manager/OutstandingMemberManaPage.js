import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Form } from 'react-bootstrap';
import Axios from 'common/Axios';
import AddOutstandingAlumniModal from 'components/Manage/OutstandingMana/OutstandingModal';
import EditOutstandingAlumniModal from 'components/Manage/OutstandingMana/EditOutstandingModal';



const OutstandingAlumniPage = () => {
    const [alumniList, setAlumniList] = useState([]); // 傑出系友列表
    const [showAddModal, setShowAddModal] = useState(false); // 控制新增彈窗
    const [showEditModal, setShowEditModal] = useState(false); // 控制編輯彈窗
    const [editData, setEditData] = useState(null); // 編輯的目標資料

    useEffect(() => {
        fetchAlumniList();
    }, []);

    // 獲取傑出系友資料
    const fetchAlumniList = () => {
        Axios().get('member/outstanding-alumni/')
            .then((res) => setAlumniList(res.data))
            .catch((err) => console.error('Error fetching alumni list:', err));
    };

    // 新增傑出系友
    const handleAddAlumni = (data) => {
        Axios().post('member/outstanding-alumni/', data)
            .then(() => {
                alert('新增成功');
                setShowAddModal(false);
                fetchAlumniList();
            })
            .catch((err) => console.error('Error adding alumni:', err));
    };

    // 更新傑出系友
    const handleEditAlumni = (data) => {
        Axios().patch(`member/outstanding-alumni/${data.id}/`, data)
            .then(() => {
                alert('更新成功');
                setShowEditModal(false);
                fetchAlumniList();
            })
            .catch((err) => console.error('Error editing alumni:', err));
    };

    return (
        <Container>
            <h1 className="text-center my-4">傑出系友管理</h1>

            <Button
                variant="success"
                className="mb-4"
                onClick={() => setShowAddModal(true)}
            >
                新增傑出系友
            </Button>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>名稱</th>
                        <th>摘要</th>
                        <th>展示於官網</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {alumniList.map((alumni) => (
                        <tr key={alumni.id}>
                            <td>{alumni.member_name}</td>
                            <td>{alumni.highlight}</td>
                            <td>
                                <Form.Check
                                    type="switch"
                                    checked={alumni.is_featured}
                                    onChange={() =>
                                        Axios.patch(`/api/outstanding-alumni/${alumni.id}/`, {
                                            is_featured: !alumni.is_featured,
                                        }).then(fetchAlumniList)
                                    }
                                />
                            </td>
                            <td>
                                <Button
                                    variant="info"
                                    className="me-2"
                                    onClick={() => {
                                        setEditData(alumni);
                                        setShowEditModal(true);
                                    }}
                                >
                                    編輯
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() =>
                                        Axios.delete(`/api/outstanding-alumni/${alumni.id}/`).then(
                                            fetchAlumniList
                                        )
                                    }
                                >
                                    刪除
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* 新增彈窗 */}
            <AddOutstandingAlumniModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddAlumni}
            />

            {/* 編輯彈窗 */}
            {editData && (
                <EditOutstandingAlumniModal
                    show={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    data={editData}
                    onSubmit={handleEditAlumni}
                />
            )}
        </Container>
    );
};

export default OutstandingAlumniPage;
