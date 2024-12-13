import React from "react";
import { Row, Col, Card, Button, Carousel } from "react-bootstrap";

const PreviewPanel = ({ slides, category, onDeleteSlide, onEditSlide, onToggleActive }) => {
  if (category === "主頁輪播") {
    return (
      <Carousel>
        {slides.map((slide) => (
          <Carousel.Item key={slide.id}>
            <img
              className="d-block w-100"
              src={process.env.REACT_APP_BASE_URL + slide.image}
              alt={slide.name}
              height={500}
              style={{ objectFit: "cover" }}
            />
            <Carousel.Caption>
              <h5>{slide.name}</h5>
              <p>{slide.description}</p>
            </Carousel.Caption>
            {/* <div className="text-end p-2">
              <Button variant="warning" className="me-2" onClick={() => onEditSlide(slide)}>
                編輯
              </Button>
              <Button variant={slide.is_active ? "secondary" : "success"} className="me-2" onClick={() => onToggleActive(slide.id)}>
                {slide.is_active ? "停用" : "啟用"}
              </Button>
              <Button variant="danger" onClick={() => onDeleteSlide(slide.id)}>
                刪除
              </Button>
            </div> */}
          </Carousel.Item>
        ))}
      </Carousel>
    );
  }

  return (
    <Row>
      {slides.map((slide) => (
        <Col key={slide.id} md={4} className="mb-3">
          <Card>
            <Card.Img
              variant="top"
              src={process.env.REACT_APP_BASE_URL + slide.image}
              style={{ width: "300px", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title>{slide.title}</Card.Title>
              <Card.Text>{slide.description}</Card.Text>
              <div className="d-flex justify-content-between">
                <Button variant="warning" className="me-2" onClick={() => onEditSlide(slide)}>
                  編輯
                </Button>
                <Button variant={slide.active ? "secondary" : "success"} className="me-2" onClick={() => onToggleActive(slide.id)}>
                  {slide.active ? "停用" : "啟用"}
                </Button>
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