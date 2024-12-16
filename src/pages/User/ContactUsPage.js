import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaLine, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import Axios from "common/Axios";
import { toast } from "react-toastify";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ContactUsPage = () => {

    const handleSubmit = async (event) => {
      event.preventDefault();
    
      const formData = {
        name: event.target.formName.value,
        email: event.target.formEmail.value,
        phone: event.target.formPhone.value,
        message: event.target.formMessage.value,
      };
    
      try {
        const response = await Axios().post("record/contact/" , formData)
    
        if (response) {
          toast.success("提交成功，講有專員為您服務～")
        } else {
          toast.warn("提交失敗，請注意資訊是否填寫正確")
        }
      } catch (error) {
        toast.error("伺服器忙碌中，請稍後再試！")
      }
    };

  return (
    <Container className="py-5">
      {/* Google Map */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <Row className="mb-4">
          <Col>
            <div style={{ width: "100%", height: "300px", overflow: "hidden", borderRadius: "10px" }}>
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.0610532783326!2d120.32608597615351!3d22.651512179435628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e04d91d096a91%3A0x75ce7e7f7c793c56!2z5ZyL56uL6auY6ZuE56eR5oqA5aSn5a24IOW7uuW3peagoeWNgA!5e0!3m2!1szh-TW!2stw!4v1731937467206!5m2!1szh-TW!2stw"
                style={{ border: 0, width: "100%", height: "100%" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </Col>
        </Row>
      </motion.div>

      {/* 聯絡資訊 */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <Row className="justify-content-center mb-5">
          <Col lg={8}>
            <Card className="p-4 shadow-sm">
              <Card.Body>
                <h2 className="text-center mb-4">聯絡資訊</h2>
                <Row className="mb-4 align-items-center">
                  <Col xs={12} md={6} className="d-flex align-items-center gap-2">
                    <FaPhoneAlt className="text-primary" style={{ fontSize: "1.5rem" }} />
                    <div>
                      <strong>電話：</strong>
                      <p className="mb-0">07-3814526 轉 17501</p>
                    </div>
                  </Col>
                  <Col xs={12} md={6} className="d-flex align-items-center gap-2">
                    <FaEnvelope className="text-primary" style={{ fontSize: "1.5rem" }} />
                    <div>
                      <strong>信箱：</strong>
                      <p className="mb-0">
                        <a href="mailto:icdaa2019@nkust.edu.tw">icdaa2019@nkust.edu.tw</a>
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row className="mb-4 align-items-center">
                  <Col xs={12} md={6} className="d-flex align-items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" style={{ fontSize: "1.5rem" }} />
                    <div>
                      <strong>地址：</strong>
                      <p className="mb-0">807高雄市三民區建工路415號</p>
                    </div>
                  </Col>
                  <Col xs={12} md={6} className="d-flex align-items-center gap-2">
                    <FaClock className="text-primary" style={{ fontSize: "1.5rem" }} />
                    <div>
                      <strong>營業時間：</strong>
                      <p className="mb-0">
                        週一～五 上午 09:00 - 17:00 <br /> 休息時間為12:00～13:30
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row className="align-items-center text-center">
                  <Col>
                    <a href="https://www.facebook.com/ic.nkust/?locale=zh_TW" target="_blank" rel="noopener noreferrer">
                      <FaFacebook className="text-primary me-3" style={{ fontSize: "1.5rem", transition: "0.3s", cursor: "pointer" }} />
                    </a>
                    <a href="https://line.me/R/ti/p/@261cygls" target="_blank" rel="noopener noreferrer">
                      <FaLine className="text-success me-3" style={{ fontSize: "1.5rem", transition: "0.3s", cursor: "pointer" }} />
                    </a>
                    <a href="https://www.instagram.com/ic.nkust/" target="_blank" rel="noopener noreferrer">
                      <FaInstagram className="text-danger" style={{ fontSize: "1.5rem", transition: "0.3s", cursor: "pointer" }} />
                    </a>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* 聯絡我們表單 */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <h2 className="text-center mb-4">聯絡我們</h2>
            <p className="text-center text-muted mb-4">
              如果您有任何問題或建議，請填寫以下表單，我們將盡快與您聯繫！
            </p>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>姓名</Form.Label>
                <Form.Control type="text" placeholder="請輸入您的姓名" required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>電子郵件</Form.Label>
                <Form.Control type="email" placeholder="請輸入您的電子郵件" required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPhone">
                <Form.Label>聯絡電話</Form.Label>
                <Form.Control type="text" placeholder="請輸入您的聯絡電話" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formMessage">
                <Form.Label>訊息內容</Form.Label>
                <Form.Control as="textarea" rows={5} placeholder="請輸入您的訊息內容" required />
              </Form.Group>

              <div className="text-center">
                <Button variant="primary" type="submit">
                  送出
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default ContactUsPage;
