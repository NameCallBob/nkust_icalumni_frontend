import React, { useState , useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, ListGroupItem, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MemberModal from 'components/Manage/Center/EditModal';
import Axios from 'common/Axios';

function MemberCenter() {
    const navigator = useNavigate();
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

    const handleSave = (formData,changedData) => {
        setLoading(true)
        if (changedData == {}){
            return;
        }
        Axios().patch("/member/logined/partial_change/",changedData )
        .then((res) => {
            alert("修改成功")
            setUserData(formData)
        })
        setLoading(false)
        setShowModal(false);
        Location.reload()
    };

    useEffect(() => {
        Axios().get("member/logined/selfInfo/")
        .then((res) => {
            // 假設從回應中獲取的資料格式為 { name: "使用者名稱", email: "使用者電子郵件", photo: "使用者照片連結" }
            setUserData(res.data);
            setLoading(false);

        })
        .catch((err) => {
            setError(true);
            setLoading(false);
            // 錯誤時使用預設圖片
            setUserData(prevState => ({ ...prevState, photo: 'https://via.placeholder.com/150' }));
        });
    }, []);

    useEffect(() => {
        if (showModal) {
            // Modal 開啟時，獲取最新的 userData
            console.log("最新的 userData:", userData);
        }
    }, [showModal, userData]);

    return (
        <Container className="mt-5 my-5">
            <Row>
                {/* 左邊的個人資料 */}
                <Col md={4}>
                    <Card className="text-center shadow-sm">
                        <Card.Img variant="top" src={loading || error ? 'https://via.placeholder.com/150' : process.env.REACT_APP_BASE_URL+userData.photo} alt="使用者照片" />
                        <Card.Body>
                            <Card.Title>{loading || error ? '使用者名稱' : userData.name}</Card.Title>
                            <Card.Text>{loading || error ? '使用者電子郵件' : userData.email}</Card.Text>
                            <Button
                                variant="primary"
                                onClick={handleShowModal}
                                disabled={error || loading} // 如果資料載入中或錯誤，禁用按鈕
                            >
                                編輯個人資料
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* 右邊的會員資訊 */}
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
                setLoading = {setLoading}
            />
        </Container>
    );
}

export default MemberCenter;
