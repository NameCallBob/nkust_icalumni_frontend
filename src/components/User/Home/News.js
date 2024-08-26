import React, { useState, useEffect } from 'react';
     
import { Container, ListGroup, Pagination} from 'react-bootstrap';

function News(){
    const [activities, setActivities] = useState([]); // 活動資料
    const [currentPage, setCurrentPage] = useState(1); // 當前頁面
    const [activitiesPerPage] = useState(5); // 每頁顯示的活動數量
  
    useEffect(() => {
      // 假設這裡從後端獲取最新的活動資料
      const fetchActivities = async () => {
        const data = [
          { name: 'Activity 1', date: '2024-08-20' },
          { name: 'Activity 2', date: '2024-08-21' },
          { name: 'Activity 3', date: '2024-08-22' },
          { name: 'Activity 4', date: '2024-08-23' },
          { name: 'Activity 5', date: '2024-08-24' },
          { name: 'Activity 6', date: '2024-08-25' },
          { name: 'Activity 7', date: '2024-08-26' },
          { name: 'Activity 8', date: '2024-08-27' },
          { name: 'Activity 9', date: '2024-08-28' },
          { name: 'Activity 10', date: '2024-08-29' },
          { name: 'Activity 1', date: '2024-08-20' },
          { name: 'Activity 2', date: '2024-08-21' },
          { name: 'Activity 3', date: '2024-08-22' },
          { name: 'Activity 4', date: '2024-08-23' },
          { name: 'Activity 5', date: '2024-08-24' },
          { name: 'Activity 6', date: '2024-08-25' },
          { name: 'Activity 7', date: '2024-08-26' },
          { name: 'Activity 8', date: '2024-08-27' },
          { name: 'Activity 9', date: '2024-08-28' },
          { name: 'Activity 10', date: '2024-08-29' },
          { name: 'Activity 1', date: '2024-08-20' },
          { name: 'Activity 2', date: '2024-08-21' },
          { name: 'Activity 3', date: '2024-08-22' },
          { name: 'Activity 4', date: '2024-08-23' },
          { name: 'Activity 5', date: '2024-08-24' },
          { name: 'Activity 6', date: '2024-08-25' },
          { name: 'Activity 7', date: '2024-08-26' },
          { name: 'Activity 8', date: '2024-08-27' },
          { name: 'Activity 9', date: '2024-08-28' },
          { name: 'Activity 10', date: '2024-08-29' },
        ]; // 模擬的活動數據
        setActivities(data);
      };
      fetchActivities();
    }, []);
  
    // 計算顯示的活動
    const indexOfLastActivity = currentPage * activitiesPerPage;
    const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
    const currentActivities = activities.slice(indexOfFirstActivity, indexOfLastActivity);
  
    // 處理分頁切換
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    return (
      <Container className='my-3' style={{width:"80%"}}>
        <h2 style={{textAlign:"center"}}>最新消息</h2>

        <br></br>

        <ListGroup>

        {currentActivities.map((activity, index) => (
          <ListGroup.Item key={index} >
            <div className="d-flex justify-content-between ">
              <span>{activity.name}</span>
              <span>{activity.date}</span>
            </div>
          </ListGroup.Item>
        ))}

        </ListGroup>

        <br></br>

        <Pagination>
          <Pagination.Prev 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1} 
          />

          {[...Array(Math.ceil(activities.length / activitiesPerPage)).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === currentPage}
              onClick={() => paginate(page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
          
          <Pagination.Next
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(activities.length / activitiesPerPage)}
          />
        </Pagination>

      </Container>
    );
}

export default News