import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Container, Row, Col, Badge, Alert, InputGroup } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IndustryCRUD = () => {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentIndustry, setCurrentIndustry] = useState({
    id: null,
    title: '',
    intro: '',
  });
  
  const validateFields = () => {
    const isValid = currentIndustry.title && currentIndustry.intro;
    if (!currentIndustry.title) {
      toast.error("產業名稱為必填項目！");
    }
    if (!currentIndustry.intro) {
      toast.error("產業簡介為必填項目！");
    }
    return isValid;
  };
  
  useEffect(() => {
    fetchIndustries();
  }, []);
  
  const fetchIndustries = () => {
    setLoading(true);
    Axios()
      .get('/company/industry/all/')
      .then((res) => {
        setIndustries(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error('取得產業資料失敗');
        console.error('取得產業資料失敗', err);
        setLoading(false);
      });
  };

  const handleSave = () => {
    if (isEdit) {
      // 更新資料
      Axios()
        .put(`/company/industry/change/`, currentIndustry)
        .then(() => {
          setIndustries(
            industries.map((industry) =>
              industry.id === currentIndustry.id ? currentIndustry : industry
            )
          );
          toast.success('產業資料修改成功');
        })
        .catch((err) => {
          toast.error('產業資料修改失敗');
          console.error('更新失敗', err);
        });
    } else {
      // 新增資料
      Axios()
        .post('/company/industry/new/', currentIndustry)
        .then((res) => {
          setIndustries([...industries, res.data]);
          toast.success('產業資料新增成功');
        })
        .catch((err) => {
          toast.error('產業資料新增失敗');
          console.error('新增失敗', err);
        });
    }
    setShowModal(false);
    setCurrentIndustry({ id: null, title: '', intro: '' });
    setIsEdit(false);
  };

  const handleEdit = (industry) => {
    setCurrentIndustry(industry);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setCurrentIndustry({ id: null, title: '', intro: '' }); // 重置表單
    setIsEdit(false); // 設定為新增模式
    setShowModal(true); // 顯示 modal
  };

  const handleDelete = (id) => {
    if (window.confirm('確定要刪除此產業別嗎？此操作無法復原。')) {
      Axios()
        .post(`/company/industry/delete/`,{'id':id})
        .then(() => {
          setIndustries(industries.filter((industry) => industry.id !== id));
          toast.success('產業資料刪除成功');
        })
        .catch((err) => {
          toast.error('產業資料刪除失敗');
          console.error('刪除失敗', err);
        });
    }
  };

  // 過濾產業資料
  const filteredIndustries = industries.filter(industry => 
    industry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    industry.intro.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-4">
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header as="h5" className="bg-gradient text-white" style={{ backgroundColor: '#3a75c4' }}>
          <i className="fas fa-industry me-2"></i>公司產業別管理
        </Card.Header>
        <Card.Body>
          <Alert variant="info" className="d-flex align-items-center mb-4">
            <i className="fas fa-info-circle me-3 fa-lg"></i>
            <div>
              <strong>產業別管理功能說明：</strong>
              <p className="mb-0 mt-1">此功能用於管理系統中的產業分類，這些分類將用於系友公司資料的分類。您可以新增、修改和刪除產業別，並提供相關說明以幫助使用者了解每個產業的範圍。</p>
              <p className="mb-0 mt-2">
                <Badge bg="primary" className="me-1">新增產業別</Badge> 可增加新的產業分類
                <Badge bg="warning" text="dark" className="mx-1">修改</Badge> 可編輯現有產業資料
                <Badge bg="danger" className="mx-1">刪除</Badge> 可移除不需要的產業分類
              </p>
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
                <i className="fas fa-plus-circle me-1"></i> 新增產業別
              </Button>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="搜尋產業名稱或簡介..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                )}
              </InputGroup>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">載入中...</span>
              </div>
              <p className="mt-2">正在載入產業資料...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '5%' }}>#</th>
                    <th style={{ width: '20%' }}>產業名稱</th>
                    <th style={{ width: '55%' }}>簡介</th>
                    <th style={{ width: '20%' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIndustries.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        {searchTerm ? 
                          <div>
                            <i className="fas fa-search fa-2x text-muted mb-2"></i>
                            <p className="mb-0">找不到符合 "{searchTerm}" 的產業資料</p>
                          </div> :
                          <div>
                            <i className="fas fa-database fa-2x text-muted mb-2"></i>
                            <p className="mb-0">尚未新增任何產業資料</p>
                            <Button 
                              variant="link" 
                              onClick={handleAddNew}
                              className="mt-2"
                            >
                              立即新增第一筆資料
                            </Button>
                          </div>
                        }
                      </td>
                    </tr>
                  ) : (
                    filteredIndustries.map((industry, index) => (
                      <tr key={industry.id} className="border-bottom">
                        <td>{index + 1}</td>
                        <td>
                          <Badge 
                            pill 
                            bg="light" 
                            text="dark" 
                            className="px-3 py-2"
                            style={{ fontSize: '0.9rem', fontWeight: '500' }}
                          >
                            {industry.title}
                          </Badge>
                        </td>
                        <td>
                          <div style={{ maxHeight: '80px', overflow: 'auto' }}>
                            {industry.intro}
                          </div>
                        </td>
                        <td>
                          <Button 
                            variant="outline-warning" 
                            onClick={() => handleEdit(industry)} 
                            className="me-2 mb-1"
                            size="sm"
                          >
                            <i className="fas fa-edit me-1"></i> 修改
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            onClick={() => handleDelete(industry.id)} 
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
            <small>共 {filteredIndustries.length} 筆資料{searchTerm ? `（搜尋結果）` : ''}</small>
            {searchTerm && (
              <Button variant="link" size="sm" onClick={() => setSearchTerm('')}>
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
            {isEdit ? 
              <><i className="fas fa-edit me-2 text-warning"></i>修改產業別</> : 
              <><i className="fas fa-plus-circle me-2 text-primary"></i>新增產業別</>
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <p className="text-muted mb-3">
            {isEdit ? 
              '請編輯以下產業資料，欄位標示 * 為必填項目。' : 
              '請填寫產業資料，新增後將可用於系友公司資料分類。'
            }
          </p>
          <Form>
            {/* 產業名稱 */}
            <Form.Group controlId="industryName" className="mb-3">
              <Form.Label>
                <span className="text-danger">*</span> 產業名稱
              </Form.Label>
              <Form.Control
                type="text"
                value={currentIndustry.title}
                onChange={(e) =>
                  setCurrentIndustry({ ...currentIndustry, title: e.target.value })
                }
                required
                placeholder="請輸入產業名稱"
                maxLength={50}
                isInvalid={currentIndustry.title === ''}
              />
              <Form.Text className="text-muted">
                最多 50 字，目前已輸入 {currentIndustry.title.length} 字
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                產業名稱為必填項目
              </Form.Control.Feedback>
            </Form.Group>

            {/* 產業簡介 */}
            <Form.Group controlId="industryDescription">
              <Form.Label>
                <span className="text-danger">*</span> 產業簡介
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={currentIndustry.intro}
                onChange={(e) =>
                  setCurrentIndustry({ ...currentIndustry, intro: e.target.value })
                }
                required
                placeholder="請輸入產業簡介，說明此產業的範圍與特點"
                maxLength={200}
                isInvalid={currentIndustry.intro === ''}
                style={{ resize: 'none' }}
              />
              <Form.Text className="text-muted d-flex justify-content-between">
                <span>有助於使用者了解此產業分類</span>
                <span>{currentIndustry.intro.length}/200 字</span>
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                產業簡介為必填項目
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
            onClick={() => {
              if (validateFields()) {
                handleSave();
              }
            }}
          >
            {isEdit ? 
              <><i className="fas fa-save me-1"></i>儲存修改</> : 
              <><i className="fas fa-plus me-1"></i>新增產業</>
            }
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toastify container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default IndustryCRUD;
