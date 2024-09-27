import React from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const companies = [
  {
    id: 1,
    name: '公司A',
    product: '生產產品A',
    image: 'https://via.placeholder.com/300x300',
  },
  {
    id: 2,
    name: '公司B',
    product: '生產產品B',
    image: 'https://via.placeholder.com/300x300',
  },
  {
    id: 3,
    name: '公司C',
    product: '生產產品C',
    image: 'https://via.placeholder.com/300x300',
  },
  {
    id: 4,
    name: '公司D',
    product: '生產產品D',
    image: 'https://via.placeholder.com/300x300',
  },
  {
    id: 5,
    name: '公司E',
    product: '生產產品E',
    image: 'https://via.placeholder.com/300x300',
  },
  {
    id: 6,
    name: '公司F',
    product: '生產產品F',
    image: 'https://via.placeholder.com/300x300',
  },
];

const VerticalCarousel = ({title}) => {
  const navigate = useNavigate();

  const handleItemClick = (id) => {
    navigate(`/company/${id}`);
  };

  return (
    <>
      
    <Row>
      <Col>
        <h4>{title}</h4>
      </Col>
    </Row>

    <Row>
      <Col>
      <Carousel
      variant="dark"
      indicators={false}
      controls={true}
      interval={3000}
      touch={true}
      slide={true}
      style={{ maxHeight: '600px' }} // 確保足夠空間容納項目
    >
      {companies.map((company, index) => (
        <Carousel.Item key={index}>
          <Row className="d-none d-md-flex">
            <Col md={6}>
              <div
                className="text-center p-3 border"
                style={{ cursor: 'pointer' }}
                onClick={() => handleItemClick(companies[index % companies.length].id)}
              >
                <img
                  src={companies[index % companies.length].image}
                  alt={companies[index % companies.length].name}
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                />
                <h4>{companies[index % companies.length].name}</h4>
                <p><strong>產品：</strong>{companies[index % companies.length].product}</p>
              </div>
            </Col>
            <Col md={6}>
              <div
                className="text-center p-3 border"
                style={{ cursor: 'pointer' }}
                onClick={() => handleItemClick(companies[(index + 1) % companies.length].id)}
              >
                <img
                  src={companies[(index + 1) % companies.length].image}
                  alt={companies[(index + 1) % companies.length].name}
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                />
                <h4>{companies[(index + 1) % companies.length].name}</h4>
                <p><strong>產品：</strong>{companies[(index + 1) % companies.length].product}</p>
              </div>
            </Col>
          </Row>

          <Row className="d-flex d-md-none">
            <Col xs={12}>
              <div
                className="text-center p-3 border"
                style={{ cursor: 'pointer' }}
                onClick={() => handleItemClick(company.id)}
              >
                <img
                  src={company.image}
                  alt={company.name}
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                />
                <h4>{company.name}</h4>
                <p><strong>產品：</strong>{company.product}</p>
              </div>
            </Col>
          </Row>
        </Carousel.Item>
      ))}
    </Carousel>

      </Col>
    </Row>
    </>
  );
};

export default VerticalCarousel;
