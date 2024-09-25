import React, { useState, useEffect } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import PhotoTable from "components/Manage/PicManage/photoTable";






const PhotoManagementPage = () => {
// 先註解
//   const [promotionAds, setPromotionAds] = useState([]);
//   const [continuousAds, setContinuousAds] = useState([]);
//   const [otherImages, setOtherImages] = useState([]);
//   const [slideImages, setSlideImages] = useState([]);

// 假資料
const promotionAds = [
    {
      id: 1,
      image: "https://via.placeholder.com/150",
      title: "促銷廣告 1",
      description: "這是促銷廣告的說明。",
      created_at: "2023-09-25T12:34:56",
      is_active: true,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/150",
      title: "促銷廣告 2",
      description: "這是促銷廣告的說明。",
      created_at: "2023-09-20T10:22:33",
      is_active: false,
    },
  ];

  const continuousAds = [
    {
      id: 1,
      image: "https://via.placeholder.com/150",
      title: "連續廣告 1",
      description: "這是連續廣告的說明。",
      created_at: "2023-09-18T08:15:22",
      is_active: true,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/150",
      title: "連續廣告 2",
      description: "這是連續廣告的說明。",
      created_at: "2023-09-10T14:45:11",
      is_active: false,
    },
  ];

  const otherImages = [
    {
      id: 1,
      image: "https://via.placeholder.com/150",
      title: "其他圖片 1",
      description: "這是其他圖片的說明。",
      created_at: "2023-09-14T16:22:30",
      is_active: true,
    },
  ];

  const slideImages = [
    {
      id: 1,
      image: "https://via.placeholder.com/150",
      title: "輪播圖片 1",
      description: "這是輪播圖片的說明。",
      created_at: "2023-09-12T18:33:44",
      is_active: true,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/150",
      title: "輪播圖片 2",
      description: "這是輪播圖片的說明。",
      created_at: "2023-09-05T12:10:20",
      is_active: false,
    },
  ];


//   useEffect(() => {
//     axios.get("/api/promotion-ads/").then((res) => setPromotionAds(res.data));
//     axios.get("/api/continuous-ads/").then((res) => setContinuousAds(res.data));
//     axios.get("/api/other-images/").then((res) => setOtherImages(res.data));
//     axios.get("/api/slide-images/").then((res) => setSlideImages(res.data));
//   }, []);

  const handleDelete = (id) => {
    // Implement delete logic, e.g., call API to delete and update state
  };

  const handleEdit = (id, updatedData) => {
    // Implement edit logic, e.g., call API to update and modify state
  };

  const handleToggleStatus = (id) => {
    // Implement toggle status logic, e.g., call API to toggle active/inactive
  };

  return (
    <Container>
      <h1 className="my-4">照片管理頁面</h1>
            {/* 使用 Tabs 來顯示不同分類的照片管理 */}
            <Tabs defaultActiveKey="promotionAds" id="photo-management-tabs" className="mb-3">
        <Tab eventKey="promotionAds" title="Promotion Ads">
          <PhotoTable
            title="Promotion Ads"
            photos={promotionAds}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
          />
        </Tab>
        <Tab eventKey="continuousAds" title="Continuous Ads">
          <PhotoTable
            title="Continuous Ads"
            photos={continuousAds}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
          />
        </Tab>
        <Tab eventKey="otherImages" title="Other Images">
          <PhotoTable
            title="Other Images"
            photos={otherImages}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
          />
        </Tab>
        <Tab eventKey="slideImages" title="Slide Images">
          <PhotoTable
            title="Slide Images"
            photos={slideImages}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
          />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default PhotoManagementPage;
