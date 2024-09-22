import React from "react";
import { Card, Button } from "react-bootstrap";

const CompanyCard = ({ company }) => {
    const cardStyle = {
        width: "250px", // 固定卡片寬度
        height: "350px" // 固定卡片高度
    };

    return (
        <Card className="shadow-sm h-100 company-card" style={cardStyle}>
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
    );
};

export default CompanyCard;
