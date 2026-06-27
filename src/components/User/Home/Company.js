import Axios from "common/Axios";
import React, { useEffect, useState } from "react";
import { Card, Button, Container, Carousel, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "css/user/homepage/CompanyList.css"; // 添加樣式
import { handleImageError, getImageSrc } from "../../../utils/imageDefaults";

function Company() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    Axios()
      .get("company/data/randomCompanies/")
      .then((res) => {
        setCompanies(res.data);
      });
  }, []);
  // 將公司陣列分割成每組4個
  const groupedCompanies = [];
  for (let i = 0; i < companies.length; i += 4) {
    groupedCompanies.push(companies.slice(i, i + 4));
  }

  const handleItemClick = (id) => {
    navigate(`/alumni/${id}`);
  };
  const handleNavi = () => {
    navigate("/search");
  };

  return (
    <Container
      className="py-3 my-2"
      style={{ backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}
    >
      <Row>
        <Col>
          <h2 style={{ textAlign: "left", color: "#1e3a8a", fontWeight: "700", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.75rem" }} className="my-2">
            系友公司
          </h2>
        </Col>
      </Row>
      <Carousel interval={3000} pause={false}>
        {groupedCompanies.map((group, index) => (
          <Carousel.Item key={index}>
            <Row>
              {group.map((company, idx) => (
                <Col
                  key={idx}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className="mb-5 px-3"
                >
                  <div
                    className="text-center p-3 border"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleItemClick(company.member)}
                  >
                    <img
                      loading="lazy"
                      src={getImageSrc(
                        company.photo
                          ? process.env.REACT_APP_BASE_URL + company.photo
                          : null,
                        "company",
                      )}
                      alt={company.name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                      onError={(e) => handleImageError(e, "company")}
                    />
                    <h4>{company.name}</h4>
                    <p>
                      <strong>系級：</strong>
                      {company.graduate_grade}級
                    </p>
                    <p>
                      <strong>系友：</strong>
                      {company.member_name}
                    </p>
                    <p>
                      <strong>產品：</strong>
                      {company.products}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
      <Row className="justify-content-center">
        <Col className="text-center">
          <button
            onClick={handleNavi}
            aria-label="探索更多系友企業資訊"
            style={{
              backgroundColor: '#1e3a8a',
              color: '#ffffff',
              border: '1px solid #1e3a8a',
              borderRadius: '6px',
              padding: '0.625rem 2rem',
              fontSize: '0.9375rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#16307a';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,58,138,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1e3a8a';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            探索系友企業
          </button>
        </Col>
      </Row>
    </Container>
  );
}

export default Company;
