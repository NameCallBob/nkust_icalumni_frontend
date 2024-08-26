import React from "react";
import { Card, Button, Container, Row, Col ,Carousel } from "react-bootstrap";

const products = [
    {
      productName: "產品A",
      company: "生產公司A",
      description: "這是產品A的簡要介紹。",
      imageUrl: "https://via.placeholder.com/300x200",
      alumni: "系友A",
    },
    {
      productName: "產品B",
      company: "生產公司B",
      description: "這是產品B的簡要介紹。",
      imageUrl: "https://via.placeholder.com/300x200",
      alumni: "系友B",
    },
    {
      productName: "產品C",
      company: "生產公司C",
      description: "這是產品C的簡要介紹。",
      imageUrl: "https://via.placeholder.com/300x200",
      alumni: "系友C",
    },
    {
      productName: "產品D",
      company: "生產公司D",
      description: "這是產品D的簡要介紹。",
      imageUrl: "https://via.placeholder.com/300x200",
      alumni: "系友D",
    },
    {
      productName: "產品E",
      company: "生產公司E",
      description: "這是產品E的簡要介紹。",
      imageUrl: "https://via.placeholder.com/300x200",
      alumni: "系友E",
    },
    {
      productName: "產品F",
      company: "生產公司F",
      description: "這是產品F的簡要介紹。",
      imageUrl: "https://via.placeholder.com/300x200",
      alumni: "系友F",
    },
    {
      productName: "產品G",
      company: "生產公司G",
      description: "這是產品G的簡要介紹。",
      imageUrl: "https://via.placeholder.com/300x200",
      alumni: "系友G",
    },
    {
      productName: "產品H",
      company: "生產公司H",
      description: "這是產品H的簡要介紹。",
      imageUrl: "https://via.placeholder.com/300x200",
      alumni: "系友H",
    },
  ];
  
  const Product = () => {
    // 將產品陣列分割成每組4個
    const groupedProducts = [];
    for (let i = 0; i < products.length; i += 4) {
      groupedProducts.push(products.slice(i, i + 4));
    }
  
    return (
      <Container className="py-2 my-2 " style={{ backgroundColor: "#f8f9fa" }}>
        <Row>
            <Col>
            <h2 style={{ textAlign: "center" }} className="my-2">系友產品推廣</h2>
            </Col>
        </Row>

        <Carousel interval={3000} pause={false}>
          {groupedProducts.map((group, index) => (
            <Carousel.Item key={index}>
              <Row>
                {group.map((product, idx) => (
                  <Col key={idx} xs={12} sm={6} md={3} className="mb-5 px-3">
                    <Card className="shadow-sm h-100">
                      <Card.Img
                        variant="top"
                        src={product.imageUrl}
                        style={{ objectFit: "cover", height: "150px" }}
                        alt={`${product.productName} Image`}
                      />
                      <Card.Body>
                        <Card.Title>{product.productName}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          {product.company}
                        </Card.Subtitle>
                        <Card.Text>{product.description}</Card.Text>
                        <Card.Text className="text-muted">
                          系友: {product.alumni}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>

        <Row >
          <Col class="text-center">
            <Button>瞭解更多系友產品</Button>
          </Col>
        </Row>
      </Container>
    );
  };
  
export default Product;
