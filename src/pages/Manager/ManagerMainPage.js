import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, ListGroupItem, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MemberModal from 'components/Manage/Center/EditModal';
import Axios from 'common/Axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // 引入react-toastify的樣式
import PwdUpdateModal from 'components/Manage/Center/PwdUpdateModal';

function MemberCenter() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState({ name: '使用者名稱', email: '使用者電子郵件', photo: 'https://via.placeholder.com/150' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSave = (formData, changedData) => {
        setLoading(true);
        if (Object.keys(changedData).length === 0) {
            return;
        }
        Axios().patch("/member/logined/partial_change/", changedData)
            .then((res) => {
                toast.success("修改成功!", { position: 'top-right' });
                setUserData(formData);
            })
            .catch((err) => {
                handleAxiosError(err);
            })
            .finally(() => {
                setLoading(false);
                setShowModal(false);
            });
    };

    const handleAxiosError = (err) => {
        if (err.response) {
            const status = err.response.status;
            const errorMessage = err.response.data?.detail || ''; // assuming the backend sends token error in 'detail'
            if (status === 401 && errorMessage.includes('token')) {
                toast.error("Token 已失效，請重新登入", { position: toast.POSITION.TOP_RIGHT });
                navigate('/login'); // 重定向到登入頁
            } else {
                switch (status) {
                    case 400:
                        toast.error("請求錯誤，請檢查您的輸入", { position: 'top-right' });
                        break;
                    case 401:
                        toast.error("未授權，請重新登入", { position: 'top-right' });
                        navigate('/login'); // 重定向到登入頁
                        break;
                    case 403:
                        toast.error("禁止訪問，您沒有權限執行此操作", { position: 'top-right' });
                        break;
                    default:
                        toast.error("發生錯誤，請稍後再試", { position: 'top-right' });
                }
            }
        } else {
            toast.error("無法連接到伺服器，請稍後再試", { position: 'top-right' });
        }
    };

    useEffect(() => {
        Axios().get("/member/logined/selfInfo/")
            .then((res) => {
                setUserData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                handleAxiosError(err);
                setLoading(false);
                setUserData(prevState => ({ ...prevState, photo: 'https://via.placeholder.com/150' }));
            });
    }, []);

    return (
        <Container className="mt-5 my-5">
            <Row>
                <Col md={4}>
                    <Card className="text-center shadow-sm">
                        <Card.Img variant="top" src={loading || error ? 'https://via.placeholder.com/150' : process.env.REACT_APP_BASE_URL + userData.photo} alt="使用者照片" />
                        <Card.Body>
                            <Card.Title>{loading || error ? '使用者名稱' : userData.name}</Card.Title>
                            <Card.Text>{loading || error ? '使用者電子郵件' : userData.email}</Card.Text>
                            <Button
                                variant="primary"
                                onClick={handleShowModal}
                                disabled={error || loading}
                            >
                                編輯個人資料
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8} className="d-flex flex-column">
                    <Card className="shadow-sm mb-4 flex-grow-1">
                        <Card.Header as="h5">歡迎系友</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                歡迎來到系友專區！我們很高興能夠與您保持聯繫，隨時掌握學院最新動態、活動和專屬優惠。
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="shadow-sm mb-4 flex-grow-1">
                        <Card.Header as="h5">系友最新消息</Card.Header>
                        <ListGroup variant="flush">
                            <ListGroupItem>功能暫無開放</ListGroupItem>
                        </ListGroup>
                    </Card>
                    <Card className="shadow-sm flex-grow-1">
                        <Card.Header as="h5">通知設定</Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Check
                                    type="switch"
                                    id="email-notifications"
                                    label="登入通知"
                                />
                                <Form.Check
                                    type="switch"
                                    id="sms-notifications"
                                    label="系友最新消息"
                                />
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <MemberModal
                show={showModal}
                handleClose={handleCloseModal}
                handleSave={handleSave}
                parentData={userData}
                loading={loading}
                setLoading={setLoading}
            />
            <PwdUpdateModal>
                show={showModal}
                handleClose={handleCloseModal}
            </PwdUpdateModal>
            <ToastContainer />
        </Container>
    );
}

export default MemberCenter;
