import React, { useEffect, useState } from 'react';
import {
  PlusCircle, Search, Calendar, AlertTriangle,
  FileText, Edit, Trash2, Eye, User, Building, RefreshCw,
  ArrowUp, ArrowDown, ListChecks,
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'common/Axios';
import RecruitFormModal from 'components/Manage/recruitModalForAll';
import AppModal from 'components/common/AppModal';
import {
  Button, Field, PageHeader, Toolbar, Card, DataTable,
  StatCard, Badge, EmptyState,
} from 'components/common/ui';

// getJobStatus 的 variant -> Badge variant 對照
const statusBadgeVariant = (variant) => {
  const map = {
    info: 'info',
    secondary: 'neutral',
    success: 'success',
    warning: 'warning',
    danger: 'error',
    primary: 'primary',
  };
  return map[variant] || 'neutral';
};

function AllRecruitManaPage() {
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
        <button
          type="button"
          key={1}
          className="join-item btn"
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<button type="button" key="ellipsis1" className="join-item btn btn-disabled">…</button>);
      }
    }

    // 添加頁碼
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          type="button"
          key={i}
          className={`join-item btn ${i === currentPage ? 'btn-active btn-primary' : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    // 添加尾頁
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<button type="button" key="ellipsis2" className="join-item btn btn-disabled">…</button>);
      }
      pages.push(
        <button
          type="button"
          key={totalPages}
          className="join-item btn"
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="flex justify-center mt-6">
        <div className="join">
          <button
            type="button"
            className="join-item btn"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            «
          </button>
          <button
            type="button"
            className="join-item btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          {pages}
          <button
            type="button"
            className="join-item btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
          <button
            type="button"
            className="join-item btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
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

  // 可排序的表頭
  const SortHeader = ({ field, children }) => (
    <button
      type="button"
      className="inline-flex items-center gap-1 font-semibold hover:text-primary transition-colors"
      onClick={() => handleSort(field)}
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc'
          ? <ArrowUp size={13} className="text-primary" />
          : <ArrowDown size={13} className="text-primary" />
      )}
    </button>
  );

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

  // 狀態徽章
  const StatusBadge = ({ job }) => {
    const s = getJobStatus(job);
    return <Badge variant={statusBadgeVariant(s.variant)}>{s.text}</Badge>;
  };

  // 操作按鈕組
  const RowActions = ({ job }) => (
    <div className="flex gap-1.5">
      <Button variant="ghost" size="sm" onClick={() => handleViewJob(job.id)} title="查看詳情" className="px-2">
        <Eye size={16} />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleEditJob(job.id)} title="編輯" className="px-2">
        <Edit size={16} />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => confirmDeleteJob(job.id)} title="下架" className="px-2 text-error">
        <Trash2 size={16} />
      </Button>
    </div>
  );

  // DataTable 欄位定義
  const columns = [
    {
      key: 'id',
      header: <SortHeader field="id">ID</SortHeader>,
      render: (job) => <span className="text-base-content/60">{job.id}</span>,
    },
    {
      key: 'title',
      header: <SortHeader field="title">職位名稱</SortHeader>,
      render: (job) => (
        <span className="font-semibold text-base-content line-clamp-2 max-w-[220px]">{job.title}</span>
      ),
    },
    {
      key: 'company',
      header: <SortHeader field="company_name">公司</SortHeader>,
      render: (job) => (
        <span className="inline-flex items-center gap-1 text-base-content/80">
          <Building size={14} className="text-base-content/40 shrink-0" />
          <span className="truncate max-w-[150px]">{job._company_name || '個人公司'}</span>
        </span>
      ),
    },
    {
      key: 'user',
      header: <SortHeader field="user_name">發布者</SortHeader>,
      render: (job) => (
        <span className="inline-flex items-center gap-1 text-base-content/80">
          <User size={14} className="text-base-content/40 shrink-0" />
          <span className="truncate max-w-[120px]">{job.user_name || '未知用戶'}</span>
        </span>
      ),
    },
    {
      key: 'release_date',
      header: <SortHeader field="release_date">發布日期</SortHeader>,
      render: (job) => (
        <span className="inline-flex items-center gap-1 whitespace-nowrap text-base-content/70">
          <Calendar size={14} className="text-base-content/40" />
          {formatDate(job.release_date)}
        </span>
      ),
    },
    {
      key: 'deadline',
      header: <SortHeader field="deadline">截止日期</SortHeader>,
      render: (job) => (
        <span className="inline-flex items-center gap-1 whitespace-nowrap text-base-content/70">
          <Calendar size={14} className="text-base-content/40" />
          {formatDate(job.deadline)}
        </span>
      ),
    },
    {
      key: 'status',
      header: '狀態',
      render: (job) => <StatusBadge job={job} />,
    },
    {
      key: 'actions',
      header: '操作',
      render: (job) => <RowActions job={job} />,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} />

      {/* 頁首 */}
      <PageHeader
        title="招募職位管理"
        subtitle="在此管理所有用戶發布的職缺，包括查看、編輯和下架操作。"
        icon={<FileText size={22} />}
        actions={
          <>
            <Button variant="outline" onClick={() => loadJobs()}>
              <RefreshCw size={16} className="mr-1.5" />
              刷新數據
            </Button>
            <Button variant="primary" onClick={handleAddJob}>
              <PlusCircle size={16} className="mr-1.5" />
              新增職缺
            </Button>
          </>
        }
      />

      {/* 統計卡 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard label="職缺總數" value={jobs.length} icon={<ListChecks size={22} />} accent="primary" />
        <StatCard label="符合篩選顯示" value={filteredJobs.length} icon={<Search size={22} />} accent="secondary" />
      </div>

      {/* 搜尋 / 篩選列 */}
      <Toolbar
        left={
          <>
            <div className="relative w-full sm:w-72">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none">
                <Search size={16} />
              </span>
              <input
                className="input input-bordered w-full pl-10"
                placeholder="搜尋職位名稱、公司名稱或發布者..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="select select-bordered w-full sm:w-52"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value.trim())}
            >
              <option value="">所有發布者</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </>
        }
        right={
          <Button
            variant="ghost"
            onClick={() => {
              setUserFilter('');
              setSearchTerm('');
            }}
          >
            重置篩選
          </Button>
        }
      />

      {/* 職位列表 */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 sm:p-5">
          <DataTable
            columns={columns}
            data={currentJobs}
            rowKey={(job) => job.id}
            loading={loading && jobs.length === 0}
            empty={
              <EmptyState
                icon={<AlertTriangle className="h-8 w-8" />}
                title="找不到符合的職缺"
                description={
                  jobs.length === 0
                    ? '目前尚未有任何職缺資料'
                    : '嘗試調整搜尋條件或篩選選項'
                }
              />
            }
          />

          {/* 分頁 */}
          {renderPagination()}
        </div>
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
      <AppModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        title="職缺詳情"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowDetailModal(false)}
            >
              關閉
            </Button>
            {viewingJob && (
              <Button
                variant="primary"
                onClick={() => {
                  setShowDetailModal(false);
                  handleEditJob(viewingJob.id);
                }}
              >
                <Edit size={16} className="mr-1" />
                編輯此職缺
              </Button>
            )}
          </>
        }
      >
        {viewingJob && (
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-base-content">{viewingJob.title}</h3>
              <div className="flex flex-wrap gap-2 mb-3 mt-2">
                <Badge variant="neutral">{viewingJob.company_name || '個人公司'}</Badge>
                <Badge variant={statusBadgeVariant(getJobStatus(viewingJob).variant)}>
                  {getJobStatus(viewingJob).text}
                </Badge>
              </div>
              <p className="text-base-content/60 mb-1">
                <strong>發布者:</strong> {viewingJob.user_name || '未知用戶'}
              </p>
              <p className="text-base-content/60 mb-1">
                <strong>發布日期:</strong> {formatDate(viewingJob.release_date)}
              </p>
              <p className="text-base-content/60 mb-1">
                <strong>截止日期:</strong> {formatDate(viewingJob.deadline)}
              </p>
            </div>

            <div className="divider my-2" />

            <div className="mb-4">
              <h5 className="text-lg font-semibold mb-2">聯絡資訊</h5>
              {viewingJob.isPersonalContact ? (
                <div className="alert alert-info">使用發布者的聯絡資訊</div>
              ) : (
                <div>
                  <p className="mb-1"><strong>姓名:</strong> {viewingJob.contact?.name}</p>
                  <p className="mb-1"><strong>電話:</strong> {viewingJob.contact?.phone}</p>
                  <p className="mb-1"><strong>Email:</strong> {viewingJob.contact?.email}</p>
                </div>
              )}
            </div>

            <div className="divider my-2" />

            <div className="mb-4">
              <h5 className="text-lg font-semibold mb-2">職缺說明</h5>
              <div
                className="border border-base-300 p-3 rounded-xl"
                dangerouslySetInnerHTML={{ __html: viewingJob.intro }}
              />
            </div>

            {viewingJob.images && viewingJob.images.length > 0 && (
              <>
                <div className="divider my-2" />
                <div>
                  <h5 className="text-lg font-semibold mb-2">相關圖片</h5>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {viewingJob.images.map((img, index) => (
                      <img
                        key={index}
                        src={typeof img === 'string' ? img : (img.image ? process.env.REACT_APP_BASE_URL + img.image : img)}
                        alt={`職缺圖片 ${index + 1}`}
                        className="rounded-xl border border-base-300 bg-base-100 p-1"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </AppModal>

      {/* 下架確認模態框 */}
      <AppModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        title="確認下架"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              取消
            </Button>
            <Button
              variant="error"
              onClick={handleDeleteJob}
              loading={loading}
              disabled={loading}
            >
              {loading ? '處理中...' : '確認下架'}
            </Button>
          </>
        }
      >
        <div className="alert alert-warning mb-3">
          <AlertTriangle size={20} />
          您確定要下架此職缺嗎？此操作將從前台移除職缺。
        </div>
        <p>下架後，此職缺將不再顯示於網站上，但資料仍會保留在系統中。</p>
      </AppModal>
    </div>
  );
}

export default AllRecruitManaPage;
