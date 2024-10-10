import { Container,  Pagination } from "react-bootstrap";
import { useState , useEffect } from "react";
import 'css/user/homepage/News.css'; // 自訂義 CSS 檔案
import Axios from "common/Axios";

/**
 * 呈現的樣子
 */
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

  const [article,setArticle] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 每頁顯示5個項目
  const totalPages = Math.ceil(article.length / itemsPerPage);

  useEffect(() => {
    Axios().get("/article/all/tableOutput/")
    .then((res) => {
      setArticle(res.data)
    })
  },[])


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemClick = (title) => {
    alert(`你點擊了活動: ${title}`);
    // 可以改成頁面導航，或其他事件處理，如：navigate(`/event/${eventId}`);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = article.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Container className="my-4">
      <h3>最新消息</h3>
      {currentData.map((item, index) => (
        <NewsItem
          key={index}
          time={item.publish_at.split("T")[0]}
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