// components/LatestNews.jsx
import React, { useState } from 'react';
import { Tabs, Tab, Container, Table } from "react-bootstrap";

import 'css/News.css'; // 确保导入了自定义样式

function News() {
  // 因假資料所以news、itemsPerPage，要在之後撰寫進去。

  const news = [
    { time: "2024-09-25", title: "AI與大數據應用講座" },
    { time: "2024-09-24", title: "知名企業參訪：探索未來的科技發展" },
    { time: "2024-09-23", title: "校園創新創業工作坊" },
    { time: "2024-09-22", title: "智慧城市論壇：城市管理的未來趨勢" },
    { time: "2024-09-21", title: "資安威脅與防禦策略專題講座" },
    { time: "2024-09-20", title: "企業領袖見面會：商業領袖分享成功經驗" },
    { time: "2024-09-19", title: "實境參訪：全球領先的AI實驗室" },
    { time: "2024-09-18", title: "自駕車技術論壇：未來交通的趨勢與挑戰" },
    { time: "2024-09-17", title: "設計思維工作坊：從創意到實踐" },
    { time: "2024-09-16", title: "新創企業參訪：創新與挑戰的旅程" },
  ];
  let itemsPerPage = 5

const [currentPage, setCurrentPage] = useState(1);

const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentNews = news.slice(indexOfFirstItem, indexOfLastItem);

const totalPages = Math.ceil(news.length / itemsPerPage);

const handlePreviousPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

const handleNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

return (
  <Container>
    <h3 className="my-4">最新活動消息</h3>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>時間</th>
          <th>標題</th>
        </tr>
      </thead>
      <tbody>
        {currentNews.map((item, index) => (
          <tr key={index}>
            <td>{item.time}</td>
            <td>{item.title}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    <Row className="my-3">
      <Col>
        <Button
          variant="primary"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          上一頁
        </Button>
      </Col>
      <Col className="text-end">
        <Button
          variant="primary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          下一頁
        </Button>
      </Col>
    </Row>
  </Container>
);
}

export default News;
