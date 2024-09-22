import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

/**
 * 頁尾
 * @returns html
 */
const Footer = () => {
  return (
    <footer
      className="bg-dark text-white py-4" >
      <Container style={{ flex: 1 }}>
        <Row>
          <Col md={6}>
            <h5>聯絡資訊</h5>
            <p>
              地址: 82444 高雄市燕巢區深中路58號 管一大樓 MA301B室
              <br />
              電話:  07-3814526 轉 17501
              <br />
              Email: vhoffice01@nkust.edu.tw
            </p>
          </Col>

          <Col md={6} className="text-md-end">
            <h5>社群媒體</h5>
            <a href="https://www.facebook.com/ic.nkust/?locale=zh_TW" className="text-white me-3">
              <i className="bi bi-facebook" style={{ fontSize: '1.5rem' }}></i>
            </a>
            <a href="https://line.me/R/ti/p/@261cygls" className="text-white me-3">
              <i className="bi bi-line" style={{ fontSize: '1.5rem' }}></i>
            </a>
            <a href="https://www.instagram.com/ic.nkust/" className="text-white me-3">
              <i className="bi bi-instagram" style={{ fontSize: '1.5rem' }}></i>
            </a>
            <a href="mailto:vhoffice01@nkust.edu.tw" className="text-white">
              <i className="bi bi-envelope-arrow-up-fill" style={{ fontSize: '1.5rem' }}></i>
            </a>

            <h5 className="my-3">相關連結</h5>
            <a className="text-white me-3" href="https://www.nkust.edu.tw/">
                國立高雄科技大學_官網
            </a>
            <a className="text-white me-3" href="https://ic.nkust.edu.tw/">
                智慧商務系_官網
            </a>
            <a className="text-white me-3" href="https://bis.nkust.edu.tw/index.php">
                商業智慧學院
            </a>
          </Col>
        </Row>
        <Row className="my-5">
            <Col>
            <p>Copyright © 2024 國立高雄科技大學 智慧商務系 系友會</p>
            </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
