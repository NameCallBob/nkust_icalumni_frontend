import { Container,  Pagination } from "react-bootstrap";
import { useState } from "react";
import 'css/user/homepage/News.css'; // 自訂義 CSS 檔案

const NewsItem = ({ time, title, onClick }) => {
  return (
    <div className="news-card animate" onClick={onClick}>
      <div className="time-box">
        <span className="time-text">{time}</span>
      </div>
      <div className="activity-box">
        <span className="activity-title">{title}</span>
      </div>
    </div>
  );
};

function News() {
  const allMeetingsData = [
    { time: "2024-09-25", title: "系友聯誼會" },
    { time: "2024-09-24", title: "技術交流會議" },
    { time: "2024-09-23", title: "校友捐贈儀式" },
    { time: "2024-09-22", title: "系友創業成功故事" },
    { time: "2024-09-21", title: "AI與未來科技講座" },
    { time: "2024-09-20", title: "參訪創新科技企業" },
    { time: "2024-09-19", title: "學術委員會會議" },
    { time: "2024-09-18", title: "校友會理事會議" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 每頁顯示5個項目
  const totalPages = Math.ceil(allMeetingsData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemClick = (title) => {
    alert(`你點擊了活動: ${title}`);
    // 可以改成頁面導航，或其他事件處理，如：navigate(`/event/${eventId}`);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = allMeetingsData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Container className="my-4">
      <h3>最新消息</h3>
      {currentData.map((item, index) => (
        <NewsItem
          key={index}
          time={item.time}
          title={item.title}
          onClick={() => handleItemClick(item.title)}
        />
      ))}
      <Pagination>
        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </Container>
  );
}

export default News;