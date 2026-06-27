import React, { useEffect, useState } from 'react';
import {
  PlusCircle, Search, Info, Calendar, CheckCircle,
  AlertTriangle, Edit, Trash2, Briefcase
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'common/Axios';
import RecruitFormModal from 'components/Manage/recruitModal'; // 引入剛才優化的表單元件
import AppModal from 'components/common/AppModal';
import {
  Button, Card, PageHeader, Toolbar, DataTable, Badge, EmptyState, Field,
} from 'components/common/ui';

function RecruitManaPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const [selectedJobId, setSelectedJobId] = useState(null);

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
    company_name: ''
  });
  // 新增：保存原始資料，用於比對
  const [originalData, setOriginalData] = useState(null);
  const [isPersonalContact, setIsPersonalContact] = useState(false);
  const [isPersonalCompany, setIsPersonalCompany] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  // 新增：標記圖片是否被修改
  const [imagesModified, setImagesModified] = useState(false);

  // 查詢是否為新用戶，顯示幫助模態框
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem('hasSeenRecruiterHelp');
    if (!hasSeenHelp) {
      setShowHelpModal(true);
    }
  }, []);

  // 載入職位數據
  useEffect(() => {
    loadJobs();
  }, []);

  // 當搜索詞或狀態過濾器改變時，過濾職位
  useEffect(() => {
    filterJobs();
  }, [searchTerm, statusFilter, jobs]);

  // 載入職位數據的函數
  const loadJobs = () => {
    setLoading(true);
    Axios()
      .get('/recruit/data/tableOutput_admin/')
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

  // 過濾職位的函數
  const filterJobs = () => {
    let filtered = jobs;

    // 根據搜索詞過濾
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 根據狀態過濾
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => {
        const deadlineDate = new Date(job.deadline);
        deadlineDate.setHours(0, 0, 0, 0);

        const releaseDate = new Date(job.release_date);
        releaseDate.setHours(0, 0, 0, 0);

        if (statusFilter === 'active') {
          return deadlineDate >= today && releaseDate <= today;
        } else if (statusFilter === 'upcoming') {
          return releaseDate > today;
        } else if (statusFilter === 'expired') {
          return deadlineDate < today;
        }
        return true;
      });
    }

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
      company_name: ''
    });
    setOriginalData(null); // 同時重置原始資料
    setIsPersonalContact(false);
    setIsPersonalCompany(false);
    setSelectedImages([]);
    setImagePreviews([]);
    setImagesModified(false); // 重置圖片修改標記
  };

  // 打開新增模態框
  const handleShowAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  // 處理圖片變更
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImagesModified(true); // 標記圖片已被修改

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

    // 只有在新增模式或圖片被修改時才添加圖片
    if (formData.id === '' || imagesModified) {
      preparedData.images = selectedImages.map((image) => ({
        image: image,
        image_type: 'small',
      }));
    }

    return preparedData;
  };

  // 新增職位
  const handleAddJob = (e) => {
    e.preventDefault();
    setLoading(true);

    let tmp_data = prepareFormData();
    if (isPersonalContact) {
      delete tmp_data['contact'];
    }

    Axios()
      .post('/recruit/data/new/', tmp_data)
      .then((res) => {
        setJobs([...jobs, res.data]);
        resetForm();
        setShowAddModal(false);
        toast.success('新增職位成功！您的職缺已發布');
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

  // 編輯職位
  const handleEditJob = (id) => {
    setLoading(true);
    setSelectedJobId(id);

    Axios()
      .get(`/recruit/data/getOne/`, { params: { id: id } })
      .then((res) => {
        setFormData(res.data);
        // 保存原始資料的深拷貝，用於後續比對
        setOriginalData(JSON.parse(JSON.stringify(res.data)));
        setIsPersonalContact(res.data.isPersonalContact);
        setIsPersonalCompany(res.data.isPersonalCompany);
        setSelectedImages(res.data.images || []);
        setImagePreviews(res.data.images || []);
        setImagesModified(false); // 重置圖片修改標記
        setShowEditModal(true);
      })
      .catch((err) => {
        toast.error('載入職缺資料失敗，請稍後再試');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 比對對象差異，返回修改過的欄位
  const compareChanges = (original, updated) => {
    if (!original) return updated;

    const changes = { id: updated.id }; // 確保 ID 欄位存在

    // 比較頂層欄位
    Object.keys(updated).forEach(key => {
      // 忽略 ID 欄位，這已經添加
      if (key === 'id') return;

      // 特殊處理 contact 物件
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

      // 特殊處理 images 數組 - 只有在標記為修改時才包含
      if (key === 'images') {
        if (imagesModified) {
          changes.images = updated.images;
        }
        return;
      }

      // 比較標準欄位 - 只包含變動的欄位
      if (updated[key] !== undefined && original[key] !== updated[key]) {
        changes[key] = updated[key];
      }
    });

    // 確保 isPersonalContact 和 isPersonalCompany 欄位如有變更也被包含
    if (original.isPersonalContact !== updated.isPersonalContact) {
      changes.isPersonalContact = updated.isPersonalContact;
    }

    if (original.isPersonalCompany !== updated.isPersonalCompany) {
      changes.isPersonalCompany = updated.isPersonalCompany;
    }

    return changes;
  };

  // 保存編輯職位 - 改為使用 PATCH API
  const handleSaveEditJob = (e) => {
    e.preventDefault();
    setLoading(true);

    let updatedData = prepareFormData();

    // 比對前後差異，只送出修改的欄位
    const changedFields = compareChanges(originalData, updatedData);

    // 記錄欄位變更資訊（可選）
    console.log('變更的欄位:', Object.keys(changedFields).filter(key => key !== 'id'));
    console.log('圖片是否被修改:', imagesModified);

    Axios()
      .patch(`/recruit/data/patch_recruit/`, changedFields)
      .then((res) => {
        // 更新本地資料
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
      .delete(`/recruit/data/delete/`, { params: { id: selectedJobId } })
      .then(() => {
        setJobs(jobs.filter((job) => job.id !== selectedJobId));
        setShowDeleteModal(false);
        toast.success('刪除成功！職缺已移除');
      })
      .catch((err) => {
        toast.error(`刪除失敗：${err.response?.status === 404 ? '找不到此職缺' : '請稍後再試'}`);
      })
      .finally(() => {
        setLoading(false);
        setSelectedJobId(null);
      });
  };

  // 關閉幫助模態框並設置localStorage
  const handleCloseHelpModal = () => {
    setShowHelpModal(false);
    localStorage.setItem('hasSeenRecruiterHelp', 'true');
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
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          type="button"
          className={`join-item btn btn-sm ${i === currentPage ? 'btn-primary' : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center mt-4">
        <div className="join">
          <button
            type="button"
            className="join-item btn btn-sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            «
          </button>
          {pages}
          <button
            type="button"
            className="join-item btn btn-sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

  // 表格欄位定義（純展示，資料來源仍為既有 state）
  const columns = [
    {
      key: 'id',
      header: 'ID',
      hideOnMobile: true,
      className: 'w-16 text-base-content/50',
      render: (job) => `#${job.id}`,
    },
    {
      key: 'title',
      header: '職位名稱',
      render: (job) => (
        <span className="font-semibold text-base-content">{job.title}</span>
      ),
    },
    {
      key: 'company_name',
      header: '公司',
      render: (job) => job.company_name || '個人公司',
    },
    {
      key: 'release_date',
      header: '發布日期',
      render: (job) => (
        <span className="inline-flex items-center gap-1.5 text-base-content/80">
          <Calendar size={14} className="text-base-content/40" />
          {formatDate(job.release_date)}
        </span>
      ),
    },
    {
      key: 'deadline',
      header: '截止日期',
      render: (job) => (
        <span className="inline-flex items-center gap-1.5 text-base-content/80">
          <Calendar size={14} className="text-base-content/40" />
          {formatDate(job.deadline)}
        </span>
      ),
    },
    {
      key: 'status',
      header: '狀態',
      render: (job) => {
        const jobStatus = getJobStatus(job);
        return <Badge variant={jobStatus.variant}>{jobStatus.text}</Badge>;
      },
    },
    {
      key: 'actions',
      header: '操作',
      className: 'text-right',
      render: (job) => (
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditJob(job.id)}
            title="編輯"
          >
            <Edit size={15} className="mr-1" />
            編輯
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => confirmDeleteJob(job.id)}
            title="刪除"
          >
            <Trash2 size={15} className="mr-1" />
            刪除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} />

      {/* 頁面標題 */}
      <PageHeader
        title="徵才管理"
        subtitle="在此管理您的所有職缺，新增、編輯或刪除招聘資訊。"
        icon={<Briefcase size={22} />}
        actions={
          <>
            <Button variant="ghost" onClick={() => setShowHelpModal(true)}>
              <Info size={18} className="mr-1" />
              使用幫助
            </Button>
            <Button variant="primary" onClick={handleShowAddModal}>
              <PlusCircle size={18} className="mr-1" />
              新增職位
            </Button>
          </>
        }
      />

      {/* 搜尋 / 篩選列 */}
      <Toolbar
        left={
          <>
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
              />
              <Field
                className="pl-9 mb-0"
                placeholder="搜尋職位名稱或公司"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Field
              as="select"
              className="mb-0 w-full sm:w-44"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">全部狀態</option>
              <option value="active">招募中</option>
              <option value="upcoming">即將發布</option>
              <option value="expired">已截止</option>
            </Field>
          </>
        }
        right={
          <span className="text-sm text-base-content/60">
            共 <span className="font-semibold text-base-content">{filteredJobs.length}</span> 個職缺
          </span>
        }
      />

      {/* 職位列表 */}
      <Card padding="none">
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
                  ? '您尚未新增任何職缺，點擊「新增職位」開始建立'
                  : '嘗試調整搜尋條件或篩選選項'
              }
              action={
                jobs.length === 0 ? (
                  <Button variant="primary" onClick={handleShowAddModal}>
                    <PlusCircle size={18} className="mr-1" />
                    新增您的第一個職缺
                  </Button>
                ) : null
              }
            />
          }
        />

        {/* 分頁 */}
        {filteredJobs.length > 0 && totalPages > 1 && (
          <div className="border-t border-base-300/70 px-4 py-3">
            {renderPagination()}
          </div>
        )}
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
        handleSubmit={handleAddJob}
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

      {/* 刪除確認模態框 */}
      <AppModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        title="確認刪除"
        icon={<AlertTriangle size={20} />}
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              取消
            </Button>
            <Button
              variant="error"
              onClick={handleDeleteJob}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-1" />
                  處理中...
                </>
              ) : (
                '確認刪除'
              )}
            </Button>
          </>
        }
      >
        <div className="alert alert-warning">
          <AlertTriangle className="mr-2" size={20} />
          您確定要刪除此職缺嗎？此操作無法復原。
        </div>
        <p className="mt-3">刪除後，此職缺將不再顯示於網站上，且相關資料將被永久移除。</p>
      </AppModal>

      {/* 使用指南模態框 */}
      <AppModal
        show={showHelpModal}
        onHide={handleCloseHelpModal}
        title="徵才管理使用指南"
        icon={<Info size={20} />}
        size="lg"
        footer={
          <Button
            variant="primary"
            onClick={handleCloseHelpModal}
          >
            我了解了
          </Button>
        }
      >
        <h5 className="font-semibold text-lg">歡迎使用徵才管理！</h5>
        <p>本系統協助您輕鬆管理所有招聘職缺。以下是使用本系統的基本步驟：</p>

        <div className="alert alert-info mb-4 flex-col items-start">
          <h6 className="alert-heading flex items-center font-semibold">
            <Info size={18} className="mr-2" />
            新手小提示
          </h6>
          <p className="mb-0">
            您可以隨時點擊頁面頂部的「使用幫助」來查看此指南。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <div className="card card-bordered bg-base-100">
              <div className="card-body">
                <h6 className="flex items-center font-semibold">
                  <PlusCircle size={18} className="mr-2 text-success" />
                  新增職缺
                </h6>
                <ol className="list-decimal list-inside">
                  <li>點擊「新增職位」按鈕</li>
                  <li>依照步驟填寫職缺資訊</li>
                  <li>完成所有欄位後發布職缺</li>
                </ol>
              </div>
            </div>
          </div>

          <div>
            <div className="card card-bordered bg-base-100">
              <div className="card-body">
                <h6 className="flex items-center font-semibold">
                  <Edit size={18} className="mr-2 text-primary" />
                  管理職缺
                </h6>
                <ol className="list-decimal list-inside">
                  <li>在職缺列表中找到您要操作的職缺</li>
                  <li>點擊「編輯」可修改職缺資訊</li>
                  <li>點擊「刪除」可移除職缺</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="card card-bordered bg-base-100 mb-3">
          <div className="card-body">
            <h6 className="flex items-center font-semibold">
              <CheckCircle size={18} className="mr-2 text-success" />
              填寫技巧
            </h6>
            <ul className="list-disc list-inside">
              <li><strong>職位名稱</strong>：使用清晰、具體的名稱，如「資深前端工程師」而非「工程師」</li>
              <li><strong>詳細資料</strong>：包含工作職責、要求技能、福利與工作環境</li>
              <li><strong>聯絡資訊</strong>：確保提供準確的聯絡方式，方便求職者詢問</li>
              <li><strong>圖片</strong>：上傳公司環境、團隊活動等相關照片，增加吸引力</li>
            </ul>
          </div>
        </div>
      </AppModal>
    </div>
  );
}

export default RecruitManaPage;
