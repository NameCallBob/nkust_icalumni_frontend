import React from "react";
import { Row, Col, Card, Button, Carousel } from "react-bootstrap";

const PreviewPanel = ({ slides, category, onDeleteSlide }) => {

  if (category === "官網輪播"){
    return(
      <Row>
      {
      slides.map((slide) => (
        <Col key={slide.id} md={4} className="mb-3">
          <Card>
            <Card.Img
              variant="top"
              src={`${process.env.REACT_APP_BASE_URL}${slide.image}`}
              style={{ width: "300px", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title>{slide.title}</Card.Title>
              <Card.Text>{slide.description}</Card.Text>
              <div className="d-flex justify-content-   between">
                <Button variant="warning" onClick={() => {

                }}>狀態修改</Button>
                <Button variant="warning">編輯</Button>
                <Button variant="danger" onClick={() => onDeleteSlide(slide.id)}>
                  刪除
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))
      }
    </Row>
    )
  }
  
  else if (category === "廣告設置"){
    return(
    <Carousel>
      {slides.map((slide) => (
        <Carousel.Item key={slide.id}>
          <img className="d-block w-100" src={`${process.env.REACT_APP_BASE_URL}${slide.image}`} alt={slide.title} height={500} style={{objectFit:'cover'}}/>
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
    )
  }

};

export default PreviewPanel;
