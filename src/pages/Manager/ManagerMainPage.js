import React, { useState } from 'react';

import { Container, Row, Col, Card, Button, ListGroup, ListGroupItem, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MemberModal from 'components/Manage/Center/EditModal';

function MemberCenter() {
    const navigator = useNavigate()
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
      };

      const handleCloseModal = () => {
        setShowModal(false);
      };

      const handleSave = (formData) => {
        console.log('儲存的資料: ', formData);
        setShowModal(false);
      };


    return (
        <Container className="mt-5 my-5">
            <Row>
                {/* 左邊的個人資料 */}
                <Col md={4}>
                    <Card className="text-center shadow-sm">
                        <Card.Img variant="top" src="https://via.placeholder.com/150" />
                        <Card.Body>
                            <Card.Title>使用者名稱</Card.Title>
                            <Card.Text>使用者電子郵件</Card.Text>
                            <Button variant="primary" onClick={() => handleShowModal()}>編輯個人資料</Button>
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
                            <ListGroupItem>8月25日：年度系友聚會通知</ListGroupItem>
                            <ListGroupItem>7月18日：新校友企業合作方案啟動</ListGroupItem>
                            <ListGroupItem>6月30日：系友專屬職業發展研討會報名開始</ListGroupItem>
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
            />
        </Container>
    );
}

export default MemberCenter;