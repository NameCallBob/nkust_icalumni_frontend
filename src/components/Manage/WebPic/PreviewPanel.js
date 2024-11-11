import React from "react";
import { Row, Col, Card, Button, Carousel } from "react-bootstrap";

const PreviewPanel = ({ slides, category, onDeleteSlide }) => {
  return category === "主頁輪播" ? (
    <Carousel>
      {slides.map((slide) => (
        <Carousel.Item key={slide.id}>
          <img className="d-block w-100" src={slide.image} alt={slide.title} />
          <Carousel.Caption>
            <h5>{slide.title}</h5>
            <p>{slide.description}</p>
          </Carousel.Caption>
          <div className="text-end p-2">
            <Button variant="warning" className="me-2">
              編輯
            </Button>
            <Button variant="danger" onClick={() => onDeleteSlide(slide.id)}>
              刪除
            </Button>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  ) : (
    <Row>
      {slides.map((slide) => (
        <Col key={slide.id} md={4} className="mb-3">
          <Card>
            <Card.Img
              variant="top"
              src={slide.image}
              style={{ height: "300px", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title>{slide.title}</Card.Title>
              <Card.Text>{slide.description}</Card.Text>
              <div className="d-flex justify-content-   between">
                <Button variant="warning">狀態修改</Button>
                <Button variant="warning">編輯</Button>
                <Button variant="danger" onClick={() => onDeleteSlide(slide.id)}>
                  刪除
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default PreviewPanel;
