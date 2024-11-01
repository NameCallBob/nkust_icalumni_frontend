import Axios from "common/Axios";
import React, { useEffect, useState } from "react";
import { Card, Button, Container,Carousel, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import 'css/user/homepage/CompanyList.css'; // 添加樣式


  function Company(){
    const navigate = useNavigate()
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

    const handleItemClick = (id) => {
      navigate(`/alumni/${id}`);
    };
    const handleNavi = () => {
      navigate("/search")
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
                  <div
                    className="text-center p-3 border"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleItemClick(companies[(index + 1) % companies.length].member)}
                  >
                    <img
                      src={process.env.REACT_APP_BASE_URL+companies[(index + 1) % companies.length].photo}
                      alt={companies[(index + 1) % companies.length].name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                    <h4>{companies[(index + 1) % companies.length].name}</h4>
                    <p><strong>系級：</strong>{companies[(index + 1) % companies.length].graduate_grade}級</p>
                    <p><strong>系友：</strong>{companies[(index + 1) % companies.length].member_name}</p>
                    <p><strong>產品：</strong>{companies[(index + 1) % companies.length].products}</p>
                  </div>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
        <Row className="justify-content-center">
          <Col class="text-center">
            <Button onClick={handleNavi}>瞭解更多系友公司</Button>
          </Col>
        </Row>
      </Container>
    );
  };

export default Company