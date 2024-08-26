import React from "react";
import { Card, Button, Container,Carousel, Row, Col } from "react-bootstrap";

const companies = [
    {
      name: "公司A",
      alumni: "系友A",
      description: "這是公司A的簡要介紹。",
      product: "公司A的產品簡介。",
      imageUrl: "https://via.placeholder.com/300x200"
    },
    {
      name: "公司B",
      alumni: "系友B",
      description: "這是公司B的簡要介紹。",
      product: "公司B的產品簡介。",
      imageUrl: "https://via.placeholder.com/300x200"
    },
    {
      name: "公司C",
      alumni: "系友C",
      description: "這是公司C的簡要介紹。",
      product: "公司C的產品簡介。",
      imageUrl: "https://via.placeholder.com/300x200"
    },
    {
      name: "公司D",
      alumni: "系友D",
      description: "這是公司D的簡要介紹。",
      product: "公司D的產品簡介。",
      imageUrl: "https://via.placeholder.com/300x200"
    },
    {
      name: "公司E",
      alumni: "系友E",
      description: "這是公司E的簡要介紹。",
      product: "公司E的產品簡介。",
      imageUrl: "https://via.placeholder.com/300x200"
    },
    {
      name: "公司F",
      alumni: "系友F",
      description: "這是公司F的簡要介紹。",
      product: "公司F的產品簡介。",
      imageUrl: "https://via.placeholder.com/300x200"
    },
    {
      name: "公司G",
      alumni: "系友G",
      description: "這是公司G的簡要介紹。",
      product: "公司G的產品簡介。",
      imageUrl: "https://via.placeholder.com/300x200"
    },
    {
      name: "公司H",
      alumni: "系友H",
      description: "這是公司H的簡要介紹。",
      product: "公司H的產品簡介。",
      imageUrl: "https://via.placeholder.com/300x200"
    },

  ];
  
  function Company(){
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
                    <Card className="shadow-sm h-100">
                      <Card.Img
                        variant="top"
                        src={company.imageUrl}
                        style={{ objectFit: "cover", height: "150px" }}
                        alt={`${company.name} Image`}
                      />
                      <Card.Body>
                        <Card.Title>{company.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{company.alumni}</Card.Subtitle>
                        <Card.Text>{company.description}</Card.Text>
                        <Card.Text>產品製作: {company.product}</Card.Text>
                        <div className="d-flex justify-content-end">
                          <Button variant="primary">瞭解更多</Button>
                        </div>
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