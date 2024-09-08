import React, { useState } from 'react';
import { Container, Row, Col, Image, Card, Carousel, Modal } from 'react-bootstrap';

const CompanyIntro = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState('');

    const handleImageClick = (src) => {
        setModalImage(src);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <Container className="mt-5">
            <Row>
                <Col md={6}>
                    <Image 
                        src="https://via.placeholder.com/500x300" 
                        rounded 
                        fluid 
                        alt="Company Building" 
                    />
                </Col>
                <Col md={6} className="d-flex flex-column justify-content-center">
                    <Card>
                        <Card.Body>
                            <Card.Title>公司名稱</Card.Title>
                            <Card.Text>
                                <strong>地址：</strong> 1234 公司街, 台北市, 台灣<br />
                                <strong>電話：</strong> +886 2 1234 5678<br />
                                <strong>電子郵件：</strong> info@company.com
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>公司介紹</Card.Title>
                            <Card.Text>
                                我們公司是一家專注於科技創新的公司，提供各種尖端產品和服務，致力於提升客戶的體驗和滿意度。我們的團隊擁有豐富的行業經驗，並且擅長在市場上推出創新的解決方案。
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>我們的產品</Card.Title>
                            <Card.Text>
                                我們擅長開發各類科技產品，包括人工智能解決方案、物聯網設備和先進的軟體應用程式。我們的產品不僅受到本地市場的歡迎，也在國際市場上取得了很好的成績。
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>商品展示</Card.Title>
                            <Carousel>
                                {['https://via.placeholder.com/600x400', 'https://via.placeholder.com/600x400', 'https://via.placeholder.com/600x400'].map((src, index) => (
                                    <Carousel.Item key={index}>
                                        <img
                                            className="d-block w-100"
                                            src={src}
                                            alt={`Product ${index + 1}`}
                                            width="40%"
                                            height="auto"
                                            onClick={() => handleImageClick(src)}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>我們的位置</Card.Title>
                            <iframe
                                title="Company Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.279918731!2d-74.25986787997422!3d40.69767006475848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c250b0af35c23b%3A0x8892a2e0b62d9f5f!2sNew+York%2C+NY%2C+USA!5e0!3m2!1sen!2stw!4v1620221820219!5m2!1sen!2stw"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Body>
                    <Image src={modalImage} fluid />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default CompanyIntro;
