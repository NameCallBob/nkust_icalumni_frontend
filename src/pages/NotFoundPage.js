import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigator = useNavigate()
    const goHome = () => {
        navigator("/")
    }

  return (
    <Container className="text-center my-5" style={{ paddingTop: '50px' }}>
      <Row>
        <Col>
          <h1 className="display-3">404 網站沒有找到</h1>
          <p className="lead">沒這個頁面ㄋ！</p>
          <Button variant="primary" onClick={goHome}>
            去首頁
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;