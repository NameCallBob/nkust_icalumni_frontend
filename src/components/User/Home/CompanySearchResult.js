import React, { useState, useEffect } from "react";
import { Container, Carousel } from "react-bootstrap";
import CompanyCard from "components/User/Home/CompanyCard"; // 假設這個檔案和主元件放在同一資料夾
import 'css/user/homepage/CompanyList.css'; // 引入自訂樣式

const CompanyList = () => {
    // 假資料
    const companies = [
        { name: "公司 A", alumni: "校友 A", description: "描述 A", product: "產品 A", imageUrl: "https://via.placeholder.com/150" },
        { name: "公司 B", alumni: "校友 B", description: "描述 B", product: "產品 B", imageUrl: "https://via.placeholder.com/150" },
        { name: "公司 C", alumni: "校友 C", description: "描述 C", product: "產品 C", imageUrl: "https://via.placeholder.com/150" },
        { name: "公司 D", alumni: "校友 D", description: "描述 D", product: "產品 D", imageUrl: "https://via.placeholder.com/150" },
        { name: "公司 E", alumni: "校友 E", description: "描述 E", product: "產品 E", imageUrl: "https://via.placeholder.com/150" },
        { name: "公司 F", alumni: "校友 F", description: "描述 F", product: "產品 F", imageUrl: "https://via.placeholder.com/150" },
        { name: "公司 G", alumni: "校友 G", description: "描述 G", product: "產品 G", imageUrl: "https://via.placeholder.com/150" },
        { name: "公司 H", alumni: "校友 H", description: "描述 H", product: "產品 H", imageUrl: "https://via.placeholder.com/150" },
        { name: "公司 I", alumni: "校友 I", description: "描述 I", product: "產品 I", imageUrl: "https://via.placeholder.com/150" },
        { name: "公司 J", alumni: "校友 J", description: "描述 J", product: "產品 J", imageUrl: "https://via.placeholder.com/150" }
    ];

    const [chunkSize, setChunkSize] = useState(4); // 預設每次顯示4個公司

    // 檢測螢幕尺寸並根據大小設置每個幻燈片顯示的公司數量
    const updateChunkSize = () => {
        if (window.innerWidth < 768) {
            setChunkSize(1); // 手機顯示1個公司
        } else {
            setChunkSize(4); // 桌面和大螢幕顯示4個公司
        }
    };

    // 在組件掛載和螢幕尺寸變化時進行監聽
    useEffect(() => {
        updateChunkSize(); // 初次渲染時執行
        window.addEventListener("resize", updateChunkSize); // 監聽螢幕尺寸變化

        // 在組件卸載時移除事件監聽
        return () => {
            window.removeEventListener("resize", updateChunkSize);
        };
    }, []);

    // 將公司分成每次顯示 chunkSize 個的組
    const companyChunks = [];
    for (let i = 0; i < companies.length; i += chunkSize) {
        companyChunks.push(companies.slice(i, i + chunkSize));
    }

    return (
        <Container className="carousel-container">
            <Carousel interval={null} prevIcon={<span className="carousel-control-prev-icon custom-prev-icon" />} nextIcon={<span className="carousel-control-next-icon custom-next-icon" />}>
                {companyChunks.map((chunk, idx) => (
                    <Carousel.Item key={idx}>
                        <div className="d-flex justify-content-around flex-wrap">
                            {chunk.map((company, idx) => (
                                <CompanyCard key={idx} company={company} />
                            ))}
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
            <p className="text-center mt-3 slide-text">滑動以查看更多公司資訊</p>
        </Container>
    );
};

export default CompanyList;
