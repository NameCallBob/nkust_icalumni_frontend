import React, { useEffect, useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

function FilterForm({
  positions,
  selectedPosition,
  setSelectedPosition,
  isPaidFilter,
  setIsPaidFilter,
  searchQuery,
  setSearchQuery,
  handleFilterChange,
}) {
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // 當使用者停止輸入後 500ms 更新搜索查詢
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(debouncedSearch);
    }, 500);

    // 清除計時器，如果使用者在 500 毫秒內繼續輸入
    return () => {
      clearTimeout(handler);
    };
  }, [debouncedSearch, setSearchQuery]);

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header as="h5">篩選條件</Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>搜尋姓名</Form.Label>
            <Form.Control
              type="text"
              placeholder="輸入姓名進行搜尋"
              value={debouncedSearch}
              onChange={(e) => setDebouncedSearch(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>職位</Form.Label>
            <Form.Select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
            >
              <option value="">所有職位</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>是否繳費</Form.Label>
            <Form.Select
              value={isPaidFilter}
              onChange={(e) => setIsPaidFilter(e.target.value)}
            >
              <option value="">全部</option>
              <option value="true">已繳費</option>
              <option value="false">未繳費</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" onClick={handleFilterChange}>
            清除篩選
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default FilterForm;