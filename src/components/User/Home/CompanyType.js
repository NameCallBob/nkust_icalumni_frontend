import React, { useState } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import "css/user/homepage/icongrid.css";
import { useNavigate } from 'react-router-dom';

// icon照片
import baby_icon from "assets/home-icons/baby.png";
import clothes_icon from "assets/home-icons/clothes-rack.png";
import food_icon from "assets/home-icons/diet.png";
import makeup_icon from "assets/home-icons/cosmetics.png";
import book_icon from "assets/home-icons/idea.png";
import phone_icon from "assets/home-icons/smartphone.png";
import tv_icon from "assets/home-icons/smart-tv.png";
import luxrary_icon from "assets/home-icons/shopping-bag.png";
import sports_icon from "assets/home-icons/sports.png";
import all_icon from "assets/home-icons/all.png";
import CompanyList from './CompanySearchResult';

const IconGrid = () => {
  const navigate = useNavigate();
  const [selectedIcon, setSelectedIcon] = useState(null); // 用來存儲選擇的icon id

  const icons = [
    { id: 1, src: phone_icon, title: '3C' },
    { id: 2, src: tv_icon, title: '家電' },
    { id: 3, src: makeup_icon, title: '美妝個清' },
    { id: 4, src: food_icon, title: '保健/食品' },
    { id: 5, src: clothes_icon, title: '服飾/內衣' },
    { id: 6, src: luxrary_icon, title: '鞋包/精品' },
    { id: 7, src: baby_icon, title: '母嬰用品' },
    { id: 8, src: book_icon, title: '圖書文具' },
    { id: 9, src: sports_icon, title: '傢寢運動' },
    { id: 10, src: all_icon, title: '所有公司' },
  ];

  const handleOnClick = (id) => {
    setSelectedIcon(id); // 設置選中的 icon id
    // navigate("/search");
  };

  return (
    <Container className="icon-grid-container">
      <Row>
        <Col>
          <h2>系友公司類別</h2>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        {icons.slice(0, 5).map((icon) => (
          <Col
            key={icon.id}
            className="text-center icon-col"
            xs={12} sm={6} md={4} lg={2}
            onClick={() => handleOnClick(icon.id)} // 點擊傳遞 icon id
          >
            <Image src={icon.src} width={100} height={100} alt={icon.title} rounded /> {/* 縮小icon */}
            <h5 className="icon-title">{icon.title}</h5>
          </Col>
        ))}
      </Row>
      <Row className='justify-content-center'>
        {icons.slice(5, 10).map((icon) => (
          <Col
            key={icon.id}
            className="text-center icon-col"
            xs={12} sm={6} md={4} lg={2}
            onClick={() => handleOnClick(icon.id)} // 點擊傳遞 icon id
          >
            <Image src={icon.src} width={100} height={100} alt={icon.title} rounded /> {/* 縮小icon */}
            <h5 className="icon-title">{icon.title}</h5>
          </Col>
        ))}
      </Row>
      {/* 查詢結果區域 */}
        <CompanyList></CompanyList>
    </Container>
  );
};

export default IconGrid;
