import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function UserFilter({ filters, setFilters, applyFilters, handleAddUser_easy, handleAddUser_complex }) {
  const [positions, setPositions] = useState([]);

  // 篩選條件變更處理
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    Axios().get("member/position/get-all/")
      .then((res) => {
        setPositions(res.data);
      })
      .catch((error) => {
        console.error("Error fetching positions:", error);
      });
  }, []);

  return (
    <Container>
      <h5>新增帳號</h5>
      <Row>
        <Col>
          <Button variant="success" onClick={handleAddUser_easy}>
            添加簡單帳號
          </Button>
        </Col>
        <Col>
          <Button variant="success" onClick={handleAddUser_complex}>
            添加完整帳號
          </Button>
        </Col>
      </Row>

      <h5 className="my-3">篩選條件</h5>
      <Form className="my-1">
        <Form.Group controlId="filterSearch">
          <Form.Label>搜尋</Form.Label>
          <Form.Control
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="輸入關鍵字搜尋，如:姓名、地點"
          />
        </Form.Group>

        <Form.Group controlId="filterGender">
          <Form.Label>性別</Form.Label>
          <Form.Control
            as="select"
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
          >
            <option value="">全部</option>
            <option value="M">男</option>
            <option value="F">女</option>
            <option value="O">其他</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="filterPosition">
          <Form.Label>職位</Form.Label>
          <Form.Control
            as="select"
            name="position"
            value={filters.position}
            onChange={handleFilterChange}
          >
            <option value="">全部</option>
            {positions.map((position) => (
              <option key={position.id} value={position.title}>
                {position.title}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="filterIsPaid">
          <Form.Label>是否繳費</Form.Label>
          <Form.Control
            as="select"
            name="is_paid"
            value={filters.is_paid}
            onChange={handleFilterChange}
          >
            <option value="">全部</option>
            <option value="true">已繳費</option>
            <option value="false">未繳費</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="filterIsActive">
          <Form.Label>是否啟用</Form.Label>
          <Form.Control
            as="select"
            name="is_active"
            value={filters.is_active}
            onChange={handleFilterChange}
          >
            <option value="">全部</option>
            <option value="true">已啟用</option>
            <option value="false">未啟用</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" onClick={applyFilters} className="mt-2">
          套用篩選
        </Button>
      </Form>
    </Container>
  );
}

export default UserFilter;
