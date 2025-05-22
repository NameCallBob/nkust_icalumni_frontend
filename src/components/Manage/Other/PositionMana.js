import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Container, Row, Col, Badge, Alert, InputGroup, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPositions();
  }, []);
  
  const fetchPositions = () => {
    setLoading(true);
    // 取得所有職稱資料
    Axios()
      .get('/member/position/get-all/')
      .then((res) => {
        setPositions(res.data);
        setFilteredPositions(res.data); // 初始化篩選結果
        setLoading(false);
      })
      .catch((err) => {
        toast.error('取得職稱資料失敗');
        console.error(err);
        setLoading(false);
      });
  };

  const handleSave = () => {
    // 確認表單資料是否有效
    if (!validateForm()) {
      return;
    }

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

  const validateForm = () => {
    if (!currentPosition.title) {
      toast.error('職稱名稱為必填項目');
      return false;
    }
    
    if (!currentPosition.priority || currentPosition.priority < 1 || currentPosition.priority > 10) {
      toast.error('優先度必須介於1至10之間');
      return false;
    }
    
    // 如果優先度大於等於3，提示用戶確認
    if (currentPosition.priority >= 3) {
      if (!window.confirm(`您設定的優先度為 ${currentPosition.priority}，優先度為3以上的職稱將擁有管理者權限。是否確定繼續？`)) {
        return false;
      }
    }
    
    return true;
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

  const handleDelete = (positionId, title, priority) => {
    let confirmMessage = `確定要刪除「${title}」職稱嗎？此操作無法復原。`;
    
    // 若優先度大於等於3，特別警告
    if (priority >= 3) {
      confirmMessage = `警告：「${title}」具有管理者權限（優先度${priority}）！刪除此職稱可能影響系統權限設定，確定刪除嗎？`;
    }
    
    if (window.confirm(confirmMessage)) {
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
    }
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

  // 渲染優先度徽章
  const renderPriorityBadge = (priority) => {
    let badgeVariant = "secondary";
    let tooltip = "一般成員職稱";
    
    if (priority <= 3) {
      badgeVariant = "danger";
      tooltip = "管理者權限";
    }
    
    return (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>{tooltip}</Tooltip>}
      >
        <Badge bg={badgeVariant} className="px-2">
          {priority}
        </Badge>
      </OverlayTrigger>
    );
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header as="h5" className="bg-gradient text-white" style={{ backgroundColor: '#3a75c4' }}>
          <i className="fas fa-user-tag me-2"></i>系友會職稱管理
        </Card.Header>
        
        <Card.Body>
          <Alert variant="info" className="d-flex align-items-center mb-4">
            <i className="fas fa-info-circle me-3 fa-lg"></i>
            <div>
              <strong>職稱管理功能說明：</strong>
              <p className="mb-0 mt-1">此功能用於管理系友會內部職稱及設定其優先度。職稱用於區分系友會成員的角色與權限。</p>
            </div>
          </Alert>

          <Alert variant="warning" className="d-flex align-items-center mb-4">
            <i className="fas fa-exclamation-triangle me-3 fa-lg"></i>
            <div>
              <strong>權限說明重要提醒：</strong>
              <p className="mb-0 mt-1">系統僅設有兩種基本角色，由職稱優先度決定：</p>
              <ul className="mt-2 mb-1">
                <li><Badge bg="danger" className="me-1">1-3</Badge> 管理者權限 - 可使用系統管理功能</li>
                <li><Badge bg="secondary" className="me-1">4-10</Badge> 一般成員 - 僅可使用一般功能</li>
              </ul>
              <p className="mb-0 text-danger fw-bold">請注意：優先度為 3 以上的職稱將擁有管理者權限，能夠操作管理頁面，請謹慎設定！</p>
            </div>
          </Alert>

          <Row className="mb-3 align-items-center">
            <Col md={6}>
              <Button
                variant="primary"
                onClick={handleAddNew}
                className="d-flex align-items-center"
                style={{ backgroundColor: '#3a75c4', borderColor: '#3a75c4' }}
              >
                <i className="fas fa-plus-circle me-1"></i> 新增職稱
              </Button>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="搜尋職稱或優先度..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {searchTerm && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => { 
                      setSearchTerm('');
                      setFilteredPositions(positions);
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                )}
              </InputGroup>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">正在載入職稱資料...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '5%' }}>#</th>
                    <th 
                      style={{ width: '45%', cursor: 'pointer' }} 
                      onClick={() => handleSort('title')}
                      className="d-flex align-items-center"
                    >
                      職稱名稱 
                      <i className={`fas fa-sort ms-1 text-muted small ${sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'}`}></i>
                    </th>
                    <th 
                      style={{ width: '20%', cursor: 'pointer' }} 
                      onClick={() => handleSort('priority')}
                      className="d-flex align-items-center"
                    >
                      優先度
                      <i className={`fas fa-sort ms-1 text-muted small ${sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'}`}></i>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>優先度影響系統權限，3以上擁有管理權限</Tooltip>}
                      >
                        <i className="fas fa-info-circle ms-2 text-danger"></i>
                      </OverlayTrigger>
                    </th>
                    <th style={{ width: '30%' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPositions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        {searchTerm ? (
                          <div>
                            <i className="fas fa-search fa-2x text-muted mb-2"></i>
                            <p className="mb-0">找不到符合 "{searchTerm}" 的職稱資料</p>
                          </div>
                        ) : (
                          <div>
                            <i className="fas fa-users fa-2x text-muted mb-2"></i>
                            <p className="mb-0">尚未新增任何職稱資料</p>
                            <Button variant="link" onClick={handleAddNew} className="mt-2">
                              立即新增第一筆職稱
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredPositions.map((position, index) => (
                      <tr key={position.id} className={position.priority <= 3 ? 'border-start border-3 border-danger' : ''}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="ms-2">{position.title}</span>
                            {position.priority <= 3 && (
                              <Badge pill bg="danger" className="ms-2 px-2 py-1">
                                <i className="fas fa-shield-alt me-1"></i> 管理者
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td>
                          {renderPriorityBadge(position.priority)}
                        </td>
                        <td>
                          <Button 
                            variant="outline-warning" 
                            onClick={() => handleEdit(position)}
                            className="me-2 mb-1"
                            size="sm"
                          >
                            <i className="fas fa-edit me-1"></i> 修改
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            onClick={() => handleDelete(position.id, position.title, position.priority)}
                            size="sm"
                            className="mb-1"
                          >
                            <i className="fas fa-trash-alt me-1"></i> 刪除
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          )}
          
          <div className="text-muted mt-3 d-flex justify-content-between align-items-center">
            <small>共 {filteredPositions.length} 筆資料{searchTerm ? `（搜尋結果）` : ''}</small>
            {searchTerm && (
              <Button variant="link" size="sm" onClick={() => {
                setSearchTerm('');
                setFilteredPositions(positions);
              }}>
                清除搜尋並顯示全部
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-bold">
            {isEdit ? (
              <><i className="fas fa-edit me-2 text-warning"></i>修改職稱</>
            ) : (
              <><i className="fas fa-plus-circle me-2 text-primary"></i>新增職稱</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <p className="text-muted mb-3">
            {isEdit ? 
              '請編輯以下職稱資料，欄位標示 * 為必填項目。' : 
              '請填寫職稱資料，設定系友會內部職務名稱與優先度。'
            }
          </p>
          
          <Form>
            {/* 職稱名稱 */}
            <Form.Group controlId="positionTitle" className="mb-3">
              <Form.Label>
                <span className="text-danger">*</span> 職稱名稱
              </Form.Label>
              <Form.Control
                type="text"
                value={currentPosition.title}
                onChange={(e) =>
                  setCurrentPosition({ ...currentPosition, title: e.target.value })
                }
                required
                placeholder="請輸入職稱名稱"
                maxLength={50}
                isInvalid={!currentPosition.title}
              />
              <Form.Text className="text-muted">
                最多 50 字，例如：會長、副會長、總幹事等
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                職稱名稱為必填項目
              </Form.Control.Feedback>
            </Form.Group>

            {/* 優先度 */}
            <Form.Group controlId="positionPriority">
              <Form.Label>
                <span className="text-danger">*</span> 優先度
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>優先度影響系統權限，3以上擁有管理權限</Tooltip>}
                >
                  <i className="fas fa-info-circle ms-2 text-danger"></i>
                </OverlayTrigger>
              </Form.Label>
              <Form.Control
                type="number"
                value={currentPosition.priority}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setCurrentPosition({ ...currentPosition, priority: value });
                }}
                required
                min={1}
                max={10}
                isInvalid={!currentPosition.priority || currentPosition.priority < 1 || currentPosition.priority > 10}
              />
              <Form.Text className={currentPosition.priority >= 3 ? "text-danger fw-bold" : "text-muted"}>
                {currentPosition.priority >= 3 
                  ? `警告：優先度${currentPosition.priority}將擁有系統管理者權限！` 
                  : "範圍：1-10，優先度3以上擁有管理權限"}
              </Form.Text>
              <div className="mt-2 p-2 border border-warning bg-light rounded">
                <p className="mb-1 fw-bold small"><i className="fas fa-exclamation-triangle text-warning me-1"></i> 優先度權限對照表：</p>
                <div className="d-flex flex-wrap gap-2 small">
                  <Badge bg="danger">4-10: 一般使用者</Badge>
                  <Badge bg="secondary">1-3: 管理者</Badge>
                </div>
              </div>
              <Form.Control.Feedback type="invalid">
                優先度必須介於 1 至 10 之間
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            取消
          </Button>
          <Button
            variant={isEdit ? "warning" : "primary"}
            onClick={handleSave}
          >
            {isEdit ? (
              <><i className="fas fa-save me-1"></i>儲存修改</>
            ) : (
              <><i className="fas fa-plus me-1"></i>新增職稱</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toastify container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default AlumniPositionCRUD;
