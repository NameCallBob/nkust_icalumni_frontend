import React, { useState } from 'react';
import { Nav, Card, Container, Row, Col, Form, Button } from 'react-bootstrap';

const Search = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
    const categories = [
        { name: '3C', description: '電子產品及配件' },
        { name: '家電', description: '家用電器及設備' },
        { name: '美妝個清', description: '美容化妝品及個人清潔' },
        { name: '保健/食品', description: '保健產品及食品' },
        { name: '服飾/內衣', description: '服裝及內衣' },
        { name: '鞋包/精品', description: '鞋包及精品' },
        { name: '母嬰用品', description: '母嬰相關用品' },
        { name: '圖書文具', description: '圖書及文具' },
        { name: '傢寢運動', description: '家居寢具及運動用品' },
      ];
    
      const [active, setActive] = useState(0);
    
      const searchResults = [
        { title: '商品 1', content: '這是商品 1 的描述內容。' },
        { title: '商品 2', content: '這是商品 2 的描述內容。' },
        { title: '商品 3', content: '這是商品 3 的描述內容。' },
      ];
    
      return (
        <Container className='my-4'>
          <Row className="d-flex flex-column flex-md-row">
            <Col md={3} className="mb-3 mb-md-0">
              <Nav
                variant="pills"
                className="flex-md-column justify-content-center"
              >
            {categories.map((category, index) => (
              <Nav.Item key={index}>
                <Nav.Link
                  active={index === activeCategory}
                  onClick={() => setActiveCategory(index)}
                  className="text-center"
                >
                  {category.name}
                </Nav.Link>
              </Nav.Item>
            ))}
              </Nav>
            </Col>
            <Col md={9}>
              <Form className="mb-4">
                <Row>
                  <Col xs={8} md={10}>
                  <Form.Control
                  type="text"
                  placeholder="搜尋..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />                  </Col>
                  <Col xs={4} md={2}>
                    <Button variant="primary" type="submit" className="w-100">
                      搜尋
                    </Button>
                  </Col>
                </Row>
              </Form>
              <Row>
              {searchResults.map((result, index) => (
                  <Col xs={12} md={4} key={index}>
                    <Card className="mb-4">
                      <Card.Img 
                      variant="top" 
                      src={result.imageUrl} 
                      alt={result.title}
                      width={200}
                      height={200} />
                      <Card.Body>
                        <Card.Title>{result.title}</Card.Title>
                        <Card.Text>{result.content}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      );
    };

export default Search;
