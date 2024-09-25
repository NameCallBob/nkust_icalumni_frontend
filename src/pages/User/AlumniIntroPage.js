import React from "react";
import { Container, Row, Col, Image, Card, Carousel } from "react-bootstrap";
import 'css/user/aliumni/ProfilePage.css'; // 建議使用外部CSS來進一步自定義樣式

const ProfilePage = () => {
  return (
    <Container>
      {/* 個人資訊區塊 */}
      <Row className="my-4">
        <Col xs={12} md={4} className="text-center mb-3">
          <Image
            src="https://via.placeholder.com/300"
            rounded
            style={{ width: "300px", height: "300px" }}
            alt="個人照片"
          />
        </Col>
        <Col xs={12} md={8} className="personal-info">
          <h2 className="section-title">個人資料</h2>
          <p><strong>姓名:</strong> 王小明</p>
          <p><strong>職位:</strong> 資深工程師</p>
          <p><strong>專長:</strong> 後端開發、AI 模型訓練</p>
          <p><strong>系級:</strong> 資訊工程學系 2020 級</p>
          <p><strong>聯絡信箱:</strong> example@email.com</p>
          <hr />
          <h3 className="section-title">個人簡介</h3>
          <p>
            我是王小明，專業於後端開發，特別是使用 Django 及 Python 進行系統設計與開發。
            我同時具備 AI 模型訓練的經驗，對於大數據及機器學習有深入了解。
          </p>
        </Col>
      </Row>
        <Row>
            <Col>
            <h2 className="section-title">系友照片集錦</h2>
            </Col>
        </Row>
      {/* 系友照片區塊 */}
      <Row className="my-4">
        <Col>
          <Carousel className="mb-4" indicators={false} controls={true} interval={3000}>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://via.placeholder.com/800x400"
                alt="First slide"
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
              <Carousel.Caption>
                <h5>系友聚會 2023</h5>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://via.placeholder.com/800x400"
                alt="Second slide"
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
              <Carousel.Caption>
                <h5>畢業典禮</h5>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>

      {/* 公司資訊區塊 */}
      <Row className="my-4">
        <Col xs={12} md={6} className="mb-4">
          <Carousel indicators={false} controls={true} interval={3000}>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://via.placeholder.com/800x400"
                alt="Company slide"
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
              <Carousel.Caption>
                <h5>公司產品 1</h5>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://via.placeholder.com/800x400"
                alt="Company slide"
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
              <Carousel.Caption>
                <h5>公司產品 2</h5>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
        <Col xs={12} md={6} className="company-info">
          <Card>
            <Card.Body>
              <h2 className="section-title">公司資訊</h2>
              <div className="company-info__section">
                <strong>公司名稱:</strong> XYZ 科技有限公司
                <hr />
              </div>
              <div className="company-info__section">
                <strong>地址:</strong> 台北市中山區南京東路三段 123 號
                <hr />
              </div>
              <div className="company-info__section">
                <strong>聯絡方式:</strong> 02-1234-5678
                <hr />
              </div>
              <div className="company-info__section">
                <strong>簡介:</strong> XYZ 科技有限公司專注於人工智慧與機器學習技術，提供企業全方位的解決方案，涵蓋金融、零售、製造等行業。
                <hr />
              </div>
              <div className="company-info__section">
                <strong>公司網址:</strong>{" "}
                <a href="http://www.xyztech.com" target="_blank" rel="noopener noreferrer">
                  www.xyztech.com
                </a>
                <hr />
              </div>
              <div className="company-info__section">
                <strong>產品製作:</strong> AI 系統、智慧機器人、雲端平台
                <hr />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
