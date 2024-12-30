import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SEO from 'SEO';

const NotFoundPage = () => {
    const navigator = useNavigate()
    const goHome = () => {
        navigator("/")
    }

  return (
    
    <Container className="text-center my-5" style={{ paddingTop: '50px'}}>
      
                  <SEO
      main={false}
      title="404網站"
        description="瀏覽智慧商務系友會的章程與規範，了解我們的運作方式與核心價值。"
        keywords={["智慧商務", "章程", "規範"]}
      />
      <Row>
        <Col>
          <h1 className="display-3">404 網站沒有找到</h1>
        </Col>
      </Row>
      <Row>
        <Col>
        <p className="lead">沒這個頁面ㄋ！</p>
        </Col>
      </Row>
      <Row>
        <Col>
        <Button variant="primary" onClick={goHome}>
            去首頁
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;