import React, { useEffect, useState } from 'react';
import { 
  Container, Row, Col, Card, Button, Table, Badge, 
  Pagination, Form, InputGroup, Spinner, Modal, Alert,
  Dropdown
} from 'react-bootstrap';
import { 
  PlusCircle, Search, Info, Calendar, CheckCircle, 
  XCircle, AlertTriangle, FileText, Edit, Trash2, Eye,
  Filter, User, Building, RefreshCw
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'common/Axios';
import LoadingSpinner from 'components/LoadingSpinner';
import RecruitFormModal from 'components/Manage/recruitModalForAll';
import useRWD from 'hooks/useRWD';

function AllRecruitManaPage() {
  const rwd = useRWD();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [users, setUsers] = useState([]);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // 表單數據和輔助狀態
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    release_date: '',
    deadline: '',
    contact: {
      name: '',
      phone: '',
      email: '',
    },
    intro: '',
    company_name: '',
    user: ''
  });
  const [originalData, setOriginalData] = useState(null);
  const [isPersonalContact, setIsPersonalContact] = useState(false);
  const [isPersonalCompany, setIsPersonalCompany] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagesModified, setImagesModified] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);

  // 載入職位數據
  useEffect(() => {
    loadJobs();
    loadFilterOptions();
  }, []);

  // 當搜索詞或過濾器改變時，過濾職位
  useEffect(() => {
    filterJobs();
  }, [searchTerm, userFilter, jobs, sortField, sortDirection]);

  // 載入職位數據的函數
  const loadJobs = () => {
    setLoading(true);
    Axios()
      .get('/recruit/admin/admin/all_recruits/')
      .then((res) => {
        setJobs(res.data.results);
      })
      .catch((error) => {
        console.error('載入失敗:', error);
        toast.error('載入職位資料失敗，請檢查網路連接或稍後再試');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 載入篩選選項
  const loadFilterOptions = () => {
    // 載入用戶列表
    Axios()
      .get('/recruit/admin/admin/users/')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.error('載入用戶列表失敗:', error);
      });
  };

  // 過濾職位的函數
  const filterJobs = () => {
    let filtered = jobs;
    
    // 根據搜索詞過濾
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 根據用戶過濾
    if (userFilter) {
      const trimmedUserFilter = userFilter.trim();
      filtered = filtered.filter(job => job.user_id === parseInt(trimmedUserFilter, 10));
    }

    // 排序
    filtered = [...filtered].sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      // 處理日期字段
      if (sortField === 'release_date' || sortField === 'deadline') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      // 處理字符串
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredJobs(filtered);
  };

  // 重置表單
  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      release_date: '',
      deadline: '',
      contact: {
        name: '',
        phone: '',
        email: '',
      },
      intro: '',
      company_name: '',
      user: ''
    });
    setOriginalData(null);
    setIsPersonalContact(false);
    setIsPersonalCompany(false);
    setSelectedImages([]);
    setImagePreviews([]);
    setImagesModified(false);
  };

  // 處理圖片變更
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setImagesModified(true);
    
    const previews = [];
    const base64Images = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        base64Images.push(reader.result);
        previews.push(reader.result);
        if (base64Images.length === files.length) {
          setSelectedImages(base64Images);
          setImagePreviews(previews);
        }
      };
    });
  };

  // 處理富文本編輯器變更
  const handleQuillChange = (value) => {
    setFormData((prevData) => ({ ...prevData, intro: value }));
  };

  // 統一的表單提交資料
  const prepareFormData = () => {
    const preparedData = {
      ...formData,
      isPersonalContact,
      isPersonalCompany,
      company_name: isPersonalCompany ? undefined : formData.company_name,
      contact: {
        name: isPersonalContact ? undefined : formData.contact?.name,
        email: isPersonalContact ? undefined : formData.contact?.email,
        phone: isPersonalContact ? undefined : formData.contact?.phone,
      }
    };
    
    if (formData.id === '' || imagesModified) {
      preparedData.images = selectedImages.map((image) => ({
        image: image,
        image_type: 'small',
      }));
    }
    
    return preparedData;
  };

  // 編輯職位
  const handleEditJob = (id) => {
    setLoading(true);
    setSelectedJobId(id);
    
    Axios()
      .get(`/recruit/admin/admin/getOne/`, { params: { id: id } })
      .then((res) => {
        setFormData(res.data);
        setOriginalData(JSON.parse(JSON.stringify(res.data)));
        setIsPersonalContact(res.data.isPersonalContact);
        setIsPersonalCompany(res.data.isPersonalCompany);
        setSelectedImages(res.data.images || []);
        setImagePreviews(res.data.images || []);
        setImagesModified(false);
        setShowEditModal(true);
      })
      .catch((err) => {
        toast.error('載入職缺資料失敗，請稍後再試');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 查看職位詳情
  const handleViewJob = (id) => {
    setLoading(true);
    
    Axios()
      .get(`/recruit/admin/admin/getOne/`, { params: { id: id } })
      .then((res) => {
        setViewingJob(res.data);
        setShowDetailModal(true);
      })
      .catch((err) => {
        toast.error('載入職缺詳情失敗，請稍後再試');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 比對對象差異，返回修改過的欄位
  const compareChanges = (original, updated) => {
    if (!original) return updated;

    const changes = { id: updated.id };

    Object.keys(updated).forEach(key => {
      if (key === 'id') return;
      
      if (key === 'contact') {
        if (original.contact && updated.contact) {
          const contactChanges = {};
          let hasChanges = false;
          
          Object.keys(updated.contact).forEach(contactKey => {
            if (updated.contact[contactKey] !== undefined && 
                original.contact[contactKey] !== updated.contact[contactKey]) {
              contactChanges[contactKey] = updated.contact[contactKey];
              hasChanges = true;
            }
          });
          
          if (hasChanges) {
            changes.contact = contactChanges;
          }
        } else if (updated.contact) {
          changes.contact = updated.contact;
        }
        return;
      }
      
      if (key === 'images') {
        if (imagesModified) {
          changes.images = updated.images;
        }
        return;
      }
      
      if (updated[key] !== undefined && original[key] !== updated[key]) {
        changes[key] = updated[key];
      }
    });

    if (original.isPersonalContact !== updated.isPersonalContact) {
      changes.isPersonalContact = updated.isPersonalContact;
    }
    
    if (original.isPersonalCompany !== updated.isPersonalCompany) {
      changes.isPersonalCompany = updated.isPersonalCompany;
    }

    return changes;
  };

  // 保存編輯職位
  const handleSaveEditJob = (e) => {
    e.preventDefault();
    setLoading(true);
    
    let updatedData = prepareFormData();
    const changedFields = compareChanges(originalData, updatedData);
    
    Axios()
      .patch(`/recruit/admin/admin/update/`, changedFields)
      .then((res) => {
        setJobs(jobs.map((job) => (job.id === formData.id ? res.data : job)));
        setShowEditModal(false);
        toast.success('編輯成功！職缺資料已更新');
      })
      .catch((err) => {
        const errorMsg = err.response?.data 
          ? (typeof err.response.data === 'object' 
            ? Object.values(err.response.data).flat().join(', ') 
            : err.response.data) 
          : '發生未知錯誤';
        toast.error(`編輯失敗：${errorMsg}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 打開刪除確認模態框
  const confirmDeleteJob = (id) => {
    setSelectedJobId(id);
    setShowDeleteModal(true);
  };

  // 刪除職位
  const handleDeleteJob = () => {
    setLoading(true);
    
    Axios()
      .delete(`/recruit/admin/admin/delete/`, { params: { id: selectedJobId } })
      .then(() => {
        setJobs(jobs.filter((job) => job.id !== selectedJobId));
        setShowDeleteModal(false);
        toast.success('下架成功！職缺已從系統移除');
      })
      .catch((err) => {
        toast.error(`下架失敗：${err.response?.status === 404 ? '找不到此職缺' : '請稍後再試'}`);
      })
      .finally(() => {
        setLoading(false);
        setSelectedJobId(null);
      });
  };

  // 計算職位狀態
  const getJobStatus = (job) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const releaseDate = new Date(job.release_date);
    releaseDate.setHours(0, 0, 0, 0);
    
    const deadlineDate = new Date(job.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    if (releaseDate > today) {
      return { status: 'upcoming', text: '即將發布', variant: 'info' };
    } else if (deadlineDate < today) {
      return { status: 'expired', text: '已截止', variant: 'secondary' };
    } else {
      return { status: 'active', text: '招募中', variant: 'success' };
    }
  };

  // 分頁邏輯
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // 生成分頁項
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    let pages = [];
    const maxVisiblePages = 5;
    
    // 顯示有限的頁碼
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // 調整起始頁，確保顯示足夠多的頁碼
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // 添加首頁
    if (startPage > 1) {
      pages.push(
        <Pagination.Item 
          key={1} 
          onClick={() => setCurrentPage(1)}
        >
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        pages.push(<Pagination.Ellipsis key="ellipsis1" />);
      }
    }
    
    // 添加頁碼
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Pagination.Item 
          key={i} 
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    
    // 添加尾頁
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<Pagination.Ellipsis key="ellipsis2" />);
      }
      pages.push(
        <Pagination.Item 
          key={totalPages} 
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    
    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.First 
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        {pages}
        <Pagination.Next 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last 
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  // 格式化日期顯示
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('zh-TW', options);
  };

  // 處理排序
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 渲染排序箭頭
  const renderSortArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // 處理新增職位
  const handleAddJob = () => {
    resetForm();
    
    // 設置預設日期為今天和30天後
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    setFormData(prev => ({
      ...prev,
      release_date: today.toISOString().split('T')[0],
      deadline: thirtyDaysLater.toISOString().split('T')[0]
    }));
    
    setShowAddModal(true);
  };

  // 保存新增職位
  const handleSaveAddJob = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const newJobData = prepareFormData();
    
    Axios()
      .post(`/recruit/admin/admin/create/`, newJobData)
      .then((res) => {
        setJobs([res.data, ...jobs]);
        setShowAddModal(false);
        toast.success('新增成功！職缺已發布');
      })
      .catch((err) => {
        const errorMsg = err.response?.data 
          ? (typeof err.response.data === 'object' 
            ? Object.values(err.response.data).flat().join(', ') 
            : err.response.data) 
          : '發生未知錯誤';
        toast.error(`新增失敗：${errorMsg}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 渲染卡片式佈局（移動設備）
  const renderMobileCard = (job) => {
    const jobStatus = getJobStatus(job);

    return (
      <Card key={job.id} className="mb-3 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h6 className="fw-bold mb-1">{job.title}</h6>
            <Badge bg={jobStatus.variant} pill>
              {jobStatus.text}
            </Badge>
          </div>

          <p className="text-muted mb-1">
            <Building size={14} className="me-1" />
            {job._company_name || '個人公司'}
          </p>

          <p className="text-muted mb-1">
            <User size={14} className="me-1" />
            {job.user_name || '未知用戶'}
          </p>

          <div className="row small text-muted mb-3">
            <div className="col-6">
              <Calendar size={12} className="me-1" />
              發布: {formatDate(job.release_date)}
            </div>
            <div className="col-6">
              <Calendar size={12} className="me-1" />
              截止: {formatDate(job.deadline)}
            </div>
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="outline-info"
              size="sm"
              onClick={() => handleViewJob(job.id)}
              className="flex-fill"
            >
              <Eye size={16} className="me-1" />
              查看
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEditJob(job.id)}
              className="flex-fill"
            >
              <Edit size={16} className="me-1" />
              編輯
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => confirmDeleteJob(job.id)}
              className="flex-fill"
            >
              <Trash2 size={16} className="me-1" />
              下架
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container fluid className="admin-container py-4" style={rwd.getContainerStyle()}>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} />
      
      {/* 頁面標題和說明 */}
      <Row className="mb-4">
        <Col>
          <h1 className="mb-2">招募職位管理</h1>
          <p className="text-muted">
            在此管理所有用戶發布的職缺，包括查看、編輯和下架操作。
          </p>
        </Col>
      </Row>
      
      {/* 功能區塊 */}
      <Row className="mb-4">
        <Col xs={12} lg={8} className="mb-3 mb-lg-0">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
                <div className="mb-3 mb-md-0">
                  <h5 className="mb-0">職缺總覽</h5>
                  <small className="text-muted">總共 {jobs.length} 個職缺，目前顯示 {filteredJobs.length} 個</small>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <Button 
                    variant="primary" 
                    className="d-flex align-items-center"
                    onClick={handleAddJob}
                  >
                    <PlusCircle size={16} className="me-1" />
                    新增職缺
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    className="d-flex align-items-center"
                    onClick={() => loadJobs()}
                  >
                    <RefreshCw size={16} className="me-1" />
                    刷新數據
                  </Button>
                </div>
              </div>
              
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="搜尋職位名稱、公司名稱或發布者..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h5 className="mb-3">篩選條件</h5>
              
              <Form.Group className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <User size={16} className="me-1" />
                  發布者
                </Form.Label>
                <Form.Select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value.trim())}
                >
                  <option value="">所有發布者</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <div className="d-grid">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => {
                    setUserFilter('');
                    setSearchTerm('');
                  }}
                >
                  重置篩選
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* 職位列表 */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          {loading && jobs.length === 0 ? (
            <div className="text-center py-5">
              <LoadingSpinner />
              <p className="mt-3">載入職位資料中...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-5">
              <AlertTriangle size={48} className="text-muted mb-3" />
              <h5>找不到符合的職缺</h5>
              <p className="text-muted">
                {jobs.length === 0 
                  ? '目前尚未有任何職缺資料' 
                  : '嘗試調整搜尋條件或篩選選項'}
              </p>
            </div>
          ) : (
            <>
              {rwd.isMobile ? (
                // 移動設備卡片佈局
                <div className="mobile-card-container">
                  {currentJobs.map((job) => renderMobileCard(job))}
                </div>
              ) : (
                // 桌面設備表格佈局
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle" style={rwd.getTableStyle()}>
                  <thead>
                    <tr>
                      <th className="text-nowrap" style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>
                        ID {renderSortArrow('id')}
                      </th>
                      <th className="text-nowrap" style={{ cursor: 'pointer' }} onClick={() => handleSort('title')}>
                        職位名稱 {renderSortArrow('title')}
                      </th>
                      <th className="text-nowrap" style={{ cursor: 'pointer' }} onClick={() => handleSort('company_name')}>
                        公司 {renderSortArrow('company_name')}
                      </th>
                      <th className="text-nowrap" style={{ cursor: 'pointer' }} onClick={() => handleSort('user_name')}>
                        發布者 {renderSortArrow('user_name')}
                      </th>
                      <th className="text-nowrap" style={{ cursor: 'pointer' }} onClick={() => handleSort('release_date')}>
                        發布日期 {renderSortArrow('release_date')}
                      </th>
                      <th className="text-nowrap" style={{ cursor: 'pointer' }} onClick={() => handleSort('deadline')}>
                        截止日期 {renderSortArrow('deadline')}
                      </th>
                      <th className="text-nowrap">狀態</th>
                      <th className="text-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentJobs.map((job) => {
                      const jobStatus = getJobStatus(job);
                      
                      return (
                        <tr key={job.id}>
                          <td>{job.id}</td>
                          <td>
                            <div className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>
                              {job.title}
                            </div>
                          </td>
                          <td className="text-truncate" style={{ maxWidth: '150px' }}>
                            {job._company_name || '個人公司'}
                          </td>
                          <td className="text-truncate" style={{ maxWidth: '120px' }}>
                            {job.user_name || '未知用戶'}
                          </td>
                          <td className="text-nowrap">
                            <div className="d-flex align-items-center">
                              <Calendar size={14} className="me-1 text-muted" />
                              {formatDate(job.release_date)}
                            </div>
                          </td>
                          <td className="text-nowrap">
                            <div className="d-flex align-items-center">
                              <Calendar size={14} className="me-1 text-muted" />
                              {formatDate(job.deadline)}
                            </div>
                          </td>
                          <td>
                            <Badge bg={jobStatus.variant} pill>
                              {jobStatus.text}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button 
                                variant="outline-info" 
                                size="sm" 
                                onClick={() => handleViewJob(job.id)}
                                title="查看詳情"
                              >
                                <Eye size={16} />
                              </Button>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                onClick={() => handleEditJob(job.id)}
                                title="編輯"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => confirmDeleteJob(job.id)}
                                title="下架"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  </Table>
                </div>
              )}

              {/* 分頁 */}
              {renderPagination()}
            </>
          )}
        </Card.Body>
      </Card>
      
      {/* 新增職位模態框 */}
      <RecruitFormModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        formData={formData}
        setFormData={setFormData}
        isPersonalContact={isPersonalContact}
        setIsPersonalContact={setIsPersonalContact}
        isPersonalCompany={isPersonalCompany}
        setIsPersonalCompany={setIsPersonalCompany}
        handleQuillChange={handleQuillChange}
        imagePreviews={imagePreviews}
        handleImageChange={handleImageChange}
        handleSubmit={handleSaveAddJob}
        isEdit={false}
      />
      
      {/* 編輯職位模態框 */}
      <RecruitFormModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        formData={formData}
        setFormData={setFormData}
        isPersonalContact={isPersonalContact}
        setIsPersonalContact={setIsPersonalContact}
        isPersonalCompany={isPersonalCompany}
        setIsPersonalCompany={setIsPersonalCompany}
        handleQuillChange={handleQuillChange}
        imagePreviews={imagePreviews}
        handleImageChange={handleImageChange}
        handleSubmit={handleSaveEditJob}
        isEdit={true}
      />
      
      {/* 查看詳情模態框 */}
      <Modal 
        show={showDetailModal} 
        onHide={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>職缺詳情</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewingJob && (
            <div>
              <Row className="mb-4">
                <Col>
                  <h3>{viewingJob.title}</h3>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <Badge bg="secondary">{viewingJob.company_name || '個人公司'}</Badge>
                    <Badge bg={getJobStatus(viewingJob).variant}>{getJobStatus(viewingJob).text}</Badge>
                  </div>
                  <p className="text-muted mb-1">
                    <strong>發布者:</strong> {viewingJob.user_name || '未知用戶'}
                  </p>
                  <p className="text-muted mb-1">
                    <strong>發布日期:</strong> {formatDate(viewingJob.release_date)}
                  </p>
                  <p className="text-muted mb-1">
                    <strong>截止日期:</strong> {formatDate(viewingJob.deadline)}
                  </p>
                </Col>
              </Row>
              
              <hr />
              
              <Row className="mb-4">
                <Col>
                  <h5>聯絡資訊</h5>
                  {viewingJob.isPersonalContact ? (
                    <Alert variant="info">使用發布者的聯絡資訊</Alert>
                  ) : (
                    <div>
                      <p className="mb-1"><strong>姓名:</strong> {viewingJob.contact?.name}</p>
                      <p className="mb-1"><strong>電話:</strong> {viewingJob.contact?.phone}</p>
                      <p className="mb-1"><strong>Email:</strong> {viewingJob.contact?.email}</p>
                    </div>
                  )}
                </Col>
              </Row>
              
              <hr />
              
              <Row className="mb-4">
                <Col>
                  <h5>職缺說明</h5>
                  <div 
                    className="border p-3 rounded"
                    dangerouslySetInnerHTML={{ __html: viewingJob.intro }}
                  />
                </Col>
              </Row>
              
              {viewingJob.images && viewingJob.images.length > 0 && (
                <>
                  <hr />
                  <Row>
                    <Col>
                      <h5>相關圖片</h5>
                      <div className="d-flex flex-wrap gap-3 mt-3">
                        {viewingJob.images.map((img, index) => (
                          <img
                            key={index}
                            src={typeof img === 'string' ? img : (img.image ? process.env.REACT_APP_BASE_URL + img.image : img)}
                            alt={`職缺圖片 ${index + 1}`}
                            className="img-thumbnail"
                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                          />
                        ))}
                      </div>
                    </Col>
                  </Row>
                </>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDetailModal(false)}
          >
            關閉
          </Button>
          {viewingJob && (
            <>
              <Button 
                variant="primary" 
                onClick={() => {
                  setShowDetailModal(false);
                  handleEditJob(viewingJob.id);
                }}
              >
                <Edit size={16} className="me-1" />
                編輯此職缺
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      
      {/* 下架確認模態框 */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>確認下架</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <AlertTriangle className="me-2" size={20} />
            您確定要下架此職缺嗎？此操作將從前台移除職缺。
          </Alert>
          <p>下架後，此職缺將不再顯示於網站上，但資料仍會保留在系統中。</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            取消
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteJob}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
                處理中...
              </>
            ) : (
              '確認下架'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AllRecruitManaPage;
