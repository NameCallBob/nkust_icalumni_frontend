import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AlumniPositionCRUD = () => {
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ id: null, title: '', priority: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // asc for ascending, desc for descending

  useEffect(() => {
    // 取得所有職稱資料
    Axios()
      .get('/member/position/get-all/')
      .then((res) => {
        setPositions(res.data);
        setFilteredPositions(res.data); // 初始化篩選結果
      })
      .catch((err) => {
        toast.error('取得職稱資料失敗');
        console.error(err);
      });
  }, []);

  const handleSave = () => {
    if (isEdit) {
      // 修改職稱 API 呼叫
      Axios()
        .put(`/member/position/replace/`, currentPosition)
        .then(() => {
          setPositions(
            positions.map((position) =>
              position.id === currentPosition.id ? currentPosition : position
            )
          );
          setFilteredPositions(
            filteredPositions.map((position) =>
              position.id === currentPosition.id ? currentPosition : position
            )
          );
          toast.success('職稱修改成功');
        })
        .catch((err) => {
          toast.error('職稱修改失敗');
          console.error(err);
        });
    } else {
      // 新增職稱 API 呼叫
      Axios()
        .post('/member/position/create-new/', currentPosition)
        .then((res) => {
          setPositions([...positions, res.data]);
          setFilteredPositions([...filteredPositions, res.data]); // 更新篩選後的列表
          toast.success('職稱新增成功');
        })
        .catch((err) => {
          toast.error('職稱新增失敗');
          console.error(err);
        });
    }
    setShowModal(false);
    setCurrentPosition({ id: null, title: '', priority: '' });
    setIsEdit(false);
  };

  const handleEdit = (position) => {
    setCurrentPosition(position);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setCurrentPosition({ id: null, title: '', priority: '' }); // 重置表單為初始狀態
    setIsEdit(false); // 設定為新增模式
    setShowModal(true); // 顯示 modal
  };

  const handleDelete = (positionId) => {
    // 刪除職稱 API 呼叫
    Axios()
      .post(`/member/position/remove/`, { id: positionId })
      .then(() => {
        setPositions(positions.filter((position) => position.id !== positionId));
        setFilteredPositions(filteredPositions.filter((position) => position.id !== positionId));
        toast.success('職稱刪除成功');
      })
      .catch((err) => {
        toast.error('職稱刪除失敗');
        console.error(err);
      });
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredPositions(
      positions.filter(
        (position) =>
          position.title.toLowerCase().includes(value) ||
          position.priority.toString().includes(value)
      )
    );
  };

  const handleSort = (column) => {
    let sortedPositions = [...filteredPositions];
    if (sortOrder === 'asc') {
      sortedPositions.sort((a, b) => (a[column] > b[column] ? 1 : -1));
      setSortOrder('desc');
    } else {
      sortedPositions.sort((a, b) => (a[column] < b[column] ? 1 : -1));
      setSortOrder('asc');
    }
    setFilteredPositions(sortedPositions);
  };

  return (
    <div>
      <h2>系友會職稱管理</h2>

      {/* 搜尋欄 */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="搜尋職稱或優先度"
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>

      <Button variant="primary" onClick={handleAddNew}>
        新增職稱
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th onClick={() => handleSort('title')}>職稱名稱</th>
            <th onClick={() => handleSort('priority')}>優先度</th> {/* 新增優先度欄位 */}
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredPositions.map((position, index) => (
            <tr key={position.id}>
              <td>{index + 1}</td>
              <td>{position.title}</td>
              <td>{position.priority}</td> {/* 顯示優先度 */}
              <td>
                <Button variant="warning" onClick={() => handleEdit(position)}>
                  修改
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(position.id)}>
                  刪除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? '修改職稱' : '新增職稱'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  <Form>
    {/* 職稱名稱 */}
    <Form.Group controlId="positionTitle">
      <Form.Label>職稱名稱</Form.Label>
      <Form.Control
        type="text"
        value={currentPosition.title}
        onChange={(e) =>
          setCurrentPosition({ ...currentPosition, title: e.target.value })
        }
        required // 必填
        placeholder="請輸入職稱名稱"
        maxLength={50} // 限制最多 50 字元
        isInvalid={!currentPosition.title} // 若為空則顯示錯誤樣式
      />
      <Form.Control.Feedback type="invalid">
        職稱名稱為必填項目。
      </Form.Control.Feedback>
    </Form.Group>

        {/* 優先度 */}
        <Form.Group controlId="positionPriority">
          <Form.Label>優先度</Form.Label>
          <Form.Control
            type="number"
            value={currentPosition.priority}
            onChange={(e) => {
              const value = e.target.value;
              if (value >= 1 && value <= 10) { // 驗證範圍
                setCurrentPosition({ ...currentPosition, priority: value });
              }
            }}
            required // 必填
            min={1} // 最小值
            max={10} // 最大值
            isInvalid={!currentPosition.priority || currentPosition.priority < 1 || currentPosition.priority > 10} // 驗證
          />
          <Form.Control.Feedback type="invalid">
            請輸入 1 到 10 的優先度數值。
          </Form.Control.Feedback>
        </Form.Group>
      </Form>
    </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isEdit ? '儲存修改' : '新增'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toastify container */}
      <ToastContainer />
    </div>
  );
};

export default AlumniPositionCRUD;
