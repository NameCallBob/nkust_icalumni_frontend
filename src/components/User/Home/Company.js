import Axios from "common/Axios";
import React, { useEffect, useState } from "react";
import { Card, Button, Container,Carousel, Row, Col } from "react-bootstrap";


  
  function Company(){
    const [companies,setCompanies] = useState([])
    useEffect(() => {
      Axios().get("company/data/randomCompanies/")
      .then((res) => {
        setCompanies(res.data)
      })
    },[])
    // 將公司陣列分割成每組4個
    const groupedCompanies = [];
    for (let i = 0; i < companies.length; i += 4) {
      groupedCompanies.push(companies.slice(i, i + 4));
    }
  
    return (
      <Container className="py-2 my-2" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
        <Row>
          <Col>
            <h2 style={{ textAlign: "center" }} className="my-2">系友公司</h2>
          </Col>
        </Row>
        <Carousel interval={3000} pause={false}>
          {groupedCompanies.map((group, index) => (
            <Carousel.Item key={index}>
              <Row>
                {group.map((company, idx) => (
                  <Col key={idx} xs={12} sm={6} md={4} lg={3} className="mb-5 px-3">
                    <Card className="shadow-sm h-100" onClick={() => {}}>
                      <Card.Img
                        variant="top"
                        src={process.env.REACT_APP_BASE_URL+company.photo}
                        style={{ objectFit: "cover", height: "300px" , width:"100%" }}
                        alt={`${company.name} Image`}
                      />
                      <Card.Body>
                        <Card.Title>{company.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{company.alumni}</Card.Subtitle>
                        <Card.Text>{company.description}</Card.Text>
                        <Card.Text>產品製作: {company.products}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
        <Row className="justify-content-center">
          <Col class="text-center">
            <Button>瞭解更多系友公司</Button>
          </Col>
        </Row>
      </Container>
    );
  };

export default Company