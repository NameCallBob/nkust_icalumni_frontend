import React, { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { handleImageError, getImageSrc } from '../../../utils/imageDefaults';

const CompanyCard = ({ company }) => {
    // 使用狀態追蹤卡片是否被懸停
    const [isHovered, setIsHovered] = useState(false);
    
    // 基本卡片樣式
    const cardStyle = {
        width: "250px",
        height: "350px",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        transform: isHovered ? "translateY(-10px)" : "translateY(0)",
        boxShadow: isHovered 
            ? "0 12px 20px rgba(0, 0, 0, 0.15)" 
            : "0 4px 8px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        position: "relative",
    };

    // 圖片樣式
    const imageStyle = {
        objectFit: "cover", 
        height: "150px",
        width: "100%",
        transition: "transform 0.5s ease",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
    };

    // 卡片內容樣式
    const cardBodyStyle = {
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        height: "200px", // 固定高度以確保一致性
    };

    // 標題樣式
    const titleStyle = {
        fontSize: "1.2rem",
        fontWeight: "600",
        marginBottom: "0.3rem",
        transition: "color 0.3s ease",
        color: isHovered ? "#0056b3" : "#212529",
    };

    // 描述文字樣式
    const descriptionStyle = {
        fontSize: "0.9rem",
        color: "#6c757d",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: "3",
        WebkitBoxOrient: "vertical",
        marginBottom: "0.5rem",
    };

    // 產品文字樣式
    const productStyle = {
        fontSize: "0.85rem",
        color: "#495057",
        marginBottom: "0.5rem",
    };

    // 按鈕容器樣式
    const buttonContainerStyle = {
        marginTop: "auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    };

    // 按鈕樣式
    const buttonStyle = {
        background: isHovered ? "#0056b3" : "#0275d8",
        borderColor: isHovered ? "#004494" : "#0275d8",
        transition: "all 0.3s ease",
        boxShadow: isHovered ? "0 4px 8px rgba(2, 117, 216, 0.3)" : "none",
        padding: "0.375rem 0.75rem",
        fontSize: "0.9rem",
    };

    // 校友標籤樣式
    const badgeStyle = {
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "rgba(255, 255, 255, 0.9)",
        color: "#0056b3",
        padding: "0.3rem 0.6rem",
        borderRadius: "20px",
        fontSize: "0.75rem",
        fontWeight: "600",
        zIndex: "1",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
    };

    return (
        <Card 
            className="company-card" 
            style={cardStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={`${company.name}公司卡片`}
        >
            {/* 校友標籤 */}
            {company.alumni && (
                <div style={badgeStyle}>
                    <i className="fa fa-user-graduate me-1"></i> {company.alumni}
                </div>
            )}
            
            {/* 公司圖片 */}
            <div style={{ overflow: "hidden" }}>
                <Card.Img
                    variant="top"
                    src={getImageSrc(company.imageUrl, 'company')}
                    style={imageStyle}
                    alt={`${company.name}公司圖片`}
                    onError={(e) => handleImageError(e, 'company')}
                />
            </div>
            
            <Card.Body style={cardBodyStyle}>
                {/* 公司名稱 */}
                <Card.Title style={titleStyle}>
                    {company.name}
                </Card.Title>
                
                {/* 公司描述 */}
                <Card.Text style={descriptionStyle}>
                    {company.description}
                </Card.Text>
                
                {/* 產品信息 */}
                <Card.Text style={productStyle}>
                    <span style={{ fontWeight: "500" }}>產品製作:</span> {company.product}
                </Card.Text>
                
                {/* 按鈕區域 */}
                <div style={buttonContainerStyle}>
                    <Badge 
                        bg={isHovered ? "info" : "light"} 
                        text={isHovered ? "white" : "dark"}
                        style={{ transition: "all 0.3s ease" }}
                    >
                        {company.category || "企業"}
                    </Badge>
                    <Button 
                        variant="primary" 
                        style={buttonStyle}
                        aria-label={`瞭解更多關於${company.name}的信息`}
                    >
                        瞭解更多 {isHovered && <i className="fas fa-arrow-right ms-1"></i>}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CompanyCard;