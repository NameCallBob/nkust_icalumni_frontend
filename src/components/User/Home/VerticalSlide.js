import React, { useEffect, useState } from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Axios from 'common/Axios';

const VerticalCarousel = ({title}) => {
  const [companies , setCompanies] = useState([])
  const navigate = useNavigate();
  const apilist = {
    "最多點閱":"company/data/mostView/",
    "最新上架":"company/data/newUpload/"
  }
  const handleItemClick = (id) => {
    navigate(`/alumni/${id}`);
  };
  useEffect(() => {
    Axios().get(apilist[title])
    .then((res) => {
      setCompanies(res.data)
    })

  },[])
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
      <Col md={12}>
        <div
          className="text-center p-3 border"
          style={{ cursor: 'pointer' }}
          onClick={() => handleItemClick(company.member)}
        >
          <img
            src={process.env.REACT_APP_BASE_URL + company.photo}
            alt={company.name}
            style={{ width: '90%', height: '200px', objectFit: 'cover' }}
          />
          <h4>{company.name}</h4>
          <p><strong>系友：</strong>{company.member_name}</p>
          <p><strong>產品：</strong>{company.products}</p>
        </div>
      </Col>

      {/* 只有當 companies.length > 1 時才顯示第二個 Col */}
      {companies.length > 1 && (
        <Col md={12}>
          <div
            className="text-center p-3 border"
            style={{ cursor: 'pointer' }}
            onClick={() => handleItemClick(companies[(index + 1) % companies.length].id)}
          >
            <img
              src={process.env.REACT_APP_BASE_URL + companies[(index + 1) % companies.length].photo}
              alt={companies[(index + 1) % companies.length].name}
              style={{ width: '90%', height: '200px', objectFit: 'cover' }}
            />
            <h4>{companies[(index + 1) % companies.length].name}</h4>
            <p><strong>系友：</strong>{companies[(index + 1) % companies.length].member_name}</p>
            <p><strong>產品：</strong>{companies[(index + 1) % companies.length].products}</p>
          </div>
        </Col>
      )}
    </Row>

    {/* 畫面只能出現單一東西 */}
    <Row className="d-flex d-md-none">
      <Col xs={12}>
        <div
          className="text-center p-3 border"
          style={{ cursor: 'pointer' }}
          onClick={() => handleItemClick(company.id)}
        >
          <img
            src={process.env.REACT_APP_BASE_URL + company.photo}
            alt={company.name}
            style={{ width: '90%', height: '200px', objectFit: 'cover' }}
          />
          <h4>{company.name}</h4>
          <p><strong>系友：</strong>{company.member_name}</p>
          <p><strong>產品：</strong>{company.products}</p>
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
