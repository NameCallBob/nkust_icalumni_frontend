// CompanyCard.jsx
import React from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';
import { BsBuilding, BsPerson, BsBriefcase, BsGeo } from "react-icons/bs";

const CompanyCard = ({ company, onClick }) => {
  return (
    <Card 
      className="company-card mb-4 h-100 shadow-sm" 
      onClick={onClick}
      style={{ 
        cursor: 'pointer', 
        borderRadius: '12px', 
        transition: 'transform 0.3s, box-shadow 0.3s',
        overflow: 'hidden'
      }}
    >
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={company.photo}
          alt={company.name}
          style={{ 
            height: '160px', 
            objectFit: 'cover'
          }}
        />
        {company.industry_title && (
          <Badge 
            className="position-absolute" 
            bg="primary" 
            style={{ top: '10px', right: '10px', fontSize: '0.8rem' }}
          >
            {company.industry_title}
          </Badge>
        )}
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title 
          className="mb-3 fw-bold text-primary" 
          style={{ fontSize: '1.25rem' }}
        >
          <BsBuilding className="me-2" />{company.name}
        </Card.Title>
        
        <Row className="mb-2">
          <Col xs={12}>
            <div className="text-muted small mb-2" style={{ display: 'flex', alignItems: 'center' }}>
              <BsGeo className="me-1" />
              <span>{company.address || '未提供地點'}</span>
            </div>
          </Col>
          <Col xs={12}>
            <div className="company-description mb-3" style={{ fontSize: '0.9rem', height: '40px', overflow: 'hidden' }}>
              {company.description || company.products || '暫無公司描述'}
            </div>
          </Col>
        </Row>

        <div className="mt-auto pt-2 border-top">
          <div className="d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
            <BsPerson className="me-1 text-secondary" />
            <span className="text-secondary">系友：</span>
            <span className="ms-1 fw-medium">{company.member_name}</span>
          </div>
          {company.position && (
            <div className="d-flex align-items-center mt-1" style={{ fontSize: '0.9rem' }}>
              <BsBriefcase className="me-1 text-secondary" />
              <span className="text-secondary">職位：</span>
              <span className="ms-1">{company.position}</span>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CompanyCard;