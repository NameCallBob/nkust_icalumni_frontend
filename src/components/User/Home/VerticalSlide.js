import React, { useEffect, useState } from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Axios from 'common/Axios';

const VerticalCarousel = ({ title }) => {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();
  const apilist = {
    "最多點閱": "company/data/mostView/",
    "最新上架": "company/data/newUpload/"
  };

  const handleItemClick = (id) => {
    navigate(`/alumni/${id}`);
  };

  useEffect(() => {
    Axios().get(apilist[title])
      .then((res) => {
        setCompanies(res.data);
      });
  }, []);

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
            style={{ maxHeight: '500px', maxWidth: '600px', margin: '0 auto' }}
          >
            {companies.map((company, index) => (
              <Carousel.Item key={index}>
                {/* 桌面版雙欄顯示 */}
                <Row className="d-none d-md-flex justify-content-center">
                  <Col md={6} className="text-center p-2" onClick={() => handleItemClick(company.member)}>
                    <img
                      src={process.env.REACT_APP_BASE_URL + company.photo}
                      alt={company.name}
                      style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                    />
                    <h5>{company.name}</h5>
                    <p><strong>系友：</strong>{company.member_name}</p>
                    <p><strong>產品：</strong>{company.products}</p>
                  </Col>

                  {companies.length > 1 && (
                    <Col md={6} className="text-center p-2" onClick={() => handleItemClick(companies[(index + 1) % companies.length].id)}>
                      <img
                        src={process.env.REACT_APP_BASE_URL + companies[(index + 1) % companies.length].photo}
                        alt={companies[(index + 1) % companies.length].name}
                        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                      />
                      <h5>{companies[(index + 1) % companies.length].name}</h5>
                      <p><strong>系友：</strong>{companies[(index + 1) % companies.length].member_name}</p>
                      <p><strong>產品：</strong>{companies[(index + 1) % companies.length].products}</p>
                    </Col>
                  )}
                </Row>

                {/* 行動裝置單欄顯示 */}
                <Row className="d-flex d-md-none">
                  <Col xs={12} className="text-center p-2" onClick={() => handleItemClick(company.member)}>
                    <img
                      src={process.env.REACT_APP_BASE_URL + company.photo}
                      alt={company.name}
                      style={{ width: '90%', height: '200px', objectFit: 'cover' }}
                    />
                    <h5>{company.name}</h5>
                    <p><strong>系友：</strong>{company.member_name}</p>
                    <p><strong>產品：</strong>{company.products}</p>
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
