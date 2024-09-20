// UserFilter.js
import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function UserFilter({ filters, setFilters, applyFilters, handleAddUser , handleAddAccount}) {
  // 篩選條件變更處理
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container>
      <h5>篩選條件</h5>
      <Form>
        <Form.Group controlId="filterName">
          <Form.Label>姓名</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
          />
        </Form.Group>

        {/* 如有需要，添加其他篩選條件 */}

        <Form.Group controlId="filterPosition">
          <Form.Label>職位</Form.Label>
          <Form.Control
            type="text"
            name="position"
            value={filters.position}
            onChange={handleFilterChange}
          />
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

        <Button variant="primary" onClick={applyFilters} className="mt-2">
          套用篩選
        </Button>
      </Form>

      <hr />

      <h5>新增帳號</h5>
      <Row>
        <Col>
            <Button variant="success" onClick={handleAddUser}>
                添加帳號
            </Button>
        </Col>
        <Col>
            <Button variant="success" onClick={handleAddUser}>
                添加完整帳號
            </Button>
        </Col>
      </Row>
      

      
    </Container>
  );
}

export default UserFilter;
