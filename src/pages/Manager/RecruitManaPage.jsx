import React, { useEffect, useState, useCallback } from 'react';
import {
  PlusCircle, Search, Info, Calendar, CheckCircle,
  AlertTriangle, Edit, Trash2, Briefcase,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Axios from 'common/Axios';
import RecruitFormModal from 'components/Manage/recruitModal';
import {
  AdminPage, Button, Card, CardContent, Badge, EmptyState, Spinner, Pagination,
  Input,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
  ConfirmDialog,
} from '@/components/ui';
import { recruitService } from '@/services';
import { useIsMobile } from '@/hooks/useMediaQuery';

function RecruitManaPage() {
  const isMobile = useIsMobile();

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
    contact: { name: '', phone: '', email: '' },
    intro: '',
    company_name: '',
  });
  const [originalData, setOriginalData] = useState(null);
  const [isPersonalContact, setIsPersonalContact] = useState(false);
  const [isPersonalCompany, setIsPersonalCompany] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagesModified, setImagesModified] = useState(false);

  // 載入職位數據（端點：GET /recruit/data/tableOutput_admin/）
  const loadJobs = () => {
    setLoading(true);
    recruitService.myTableAdmin()
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

  const filterJobs = useCallback(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (statusFilter !== 'all') {
      filtered = filtered.filter((job) => {
        const deadlineDate = new Date(job.deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        const releaseDate = new Date(job.release_date);
        releaseDate.setHours(0, 0, 0, 0);

        if (statusFilter === 'active') return deadlineDate >= today && releaseDate <= today;
        if (statusFilter === 'upcoming') return releaseDate > today;
        if (statusFilter === 'expired') return deadlineDate < today;
        return true;
      });
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, statusFilter]);

  // 查詢是否為新用戶，顯示幫助模態框
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem('hasSeenRecruiterHelp');
    if (!hasSeenHelp) setShowHelpModal(true);
  }, []);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [filterJobs]);

  // 篩選改變時回到第一頁
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      release_date: '',
      deadline: '',
      contact: { name: '', phone: '', email: '' },
      intro: '',
      company_name: '',
    });
    setOriginalData(null);
    setIsPersonalContact(false);
    setIsPersonalCompany(false);
    setSelectedImages([]);
    setImagePreviews([]);
    setImagesModified(false);
  };

  const handleShowAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

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

  const handleQuillChange = (value) => {
    setFormData((prevData) => ({ ...prevData, intro: value }));
  };

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
      },
    };

    if (formData.id === '' || imagesModified) {
      preparedData.images = selectedImages.map((image) => ({
        image,
        image_type: 'small',
      }));
    }

    return preparedData;
  };

  // 新增職位（端點：POST /recruit/data/new/）
  const handleAddJob = (e) => {
    e.preventDefault();
    if (loading) return;
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

  // 編輯職位（端點：GET /recruit/data/getOne/?id=）
  const handleEditJob = (id) => {
    setLoading(true);
    setSelectedJobId(id);

    Axios()
      .get(`/recruit/data/getOne/`, { params: { id: id } })
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
      .catch(() => {
        toast.error('載入職缺資料失敗，請稍後再試');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 比對對象差異，返回修改過的欄位
  const compareChanges = (original, updated) => {
    if (!original) return updated;

    const changes = { id: updated.id };

    Object.keys(updated).forEach((key) => {
      if (key === 'id') return;

      if (key === 'contact') {
        if (original.contact && updated.contact) {
          const contactChanges = {};
          let hasChanges = false;

          Object.keys(updated.contact).forEach((contactKey) => {
            if (updated.contact[contactKey] !== undefined &&
                original.contact[contactKey] !== updated.contact[contactKey]) {
              contactChanges[contactKey] = updated.contact[contactKey];
              hasChanges = true;
            }
          });

          if (hasChanges) changes.contact = contactChanges;
        } else if (updated.contact) {
          changes.contact = updated.contact;
        }
        return;
      }

      if (key === 'images') {
        if (imagesModified) changes.images = updated.images;
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

  // 保存編輯職位（端點：PATCH /recruit/data/patch_recruit/）
  const handleSaveEditJob = (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    let updatedData = prepareFormData();
    const changedFields = compareChanges(originalData, updatedData);

    Axios()
      .patch(`/recruit/data/patch_recruit/`, changedFields)
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

  const confirmDeleteJob = (id) => {
    setSelectedJobId(id);
    setShowDeleteModal(true);
  };

  // 刪除職位（端點：DELETE /recruit/data/delete/?id= ；保留原 query 傳法）
  const handleDeleteJob = () => {
    setDeleting(true);

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
        setDeleting(false);
        setSelectedJobId(null);
      });
  };

  const handleCloseHelpModal = () => {
    setShowHelpModal(false);
    localStorage.setItem('hasSeenRecruiterHelp', 'true');
  };

  // 計算職位狀態 → 固定 Badge variant
  const getJobStatus = (job) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const releaseDate = new Date(job.release_date);
    releaseDate.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(job.deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    if (releaseDate > today) return { text: '即將發布', variant: 'info' };
    if (deadlineDate < today) return { text: '已截止', variant: 'soft-muted' };
    return { text: '招募中', variant: 'soft-success' };
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('zh-TW', options);
  };

  // 分頁邏輯
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const isInitialLoading = loading && jobs.length === 0;

  return (
    <AdminPage
      title="徵才管理"
      description="在此管理您的所有職缺，新增、編輯或刪除招聘資訊。"
      icon={Briefcase}
      actions={
        <>
          <Button variant="ghost" onClick={() => setShowHelpModal(true)}>
            <Info className="h-4 w-4" />
            使用幫助
          </Button>
          <Button variant="default" onClick={handleShowAddModal}>
            <PlusCircle className="h-4 w-4" />
            新增職位
          </Button>
        </>
      }
    >
      {/* 搜尋 / 篩選列 */}
      <Card className="mb-4">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="搜尋職位名稱或公司"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44" aria-label="狀態篩選">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部狀態</SelectItem>
                <SelectItem value="active">招募中</SelectItem>
                <SelectItem value="upcoming">即將發布</SelectItem>
                <SelectItem value="expired">已截止</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-sm text-muted-foreground">
            共 <span className="font-semibold text-foreground">{filteredJobs.length}</span> 個職缺
          </span>
        </CardContent>
      </Card>

      {/* 職位列表 */}
      <Card>
        {isInitialLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        ) : filteredJobs.length === 0 ? (
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
                <Button variant="default" onClick={handleShowAddModal}>
                  <PlusCircle className="h-4 w-4" />
                  新增您的第一個職缺
                </Button>
              ) : null
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  {!isMobile && <TableHead className="w-16">ID</TableHead>}
                  <TableHead>職位名稱</TableHead>
                  {!isMobile && <TableHead>公司</TableHead>}
                  {!isMobile && <TableHead>發布日期</TableHead>}
                  <TableHead>截止日期</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentJobs.map((job) => {
                  const jobStatus = getJobStatus(job);
                  return (
                    <TableRow key={job.id}>
                      {!isMobile && (
                        <TableCell className="text-muted-foreground">#{job.id}</TableCell>
                      )}
                      <TableCell className="font-semibold text-foreground">{job.title}</TableCell>
                      {!isMobile && (
                        <TableCell>{job.company_name || '個人公司'}</TableCell>
                      )}
                      {!isMobile && (
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(job.release_date)}
                          </span>
                        </TableCell>
                      )}
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(job.deadline)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={jobStatus.variant}>{jobStatus.text}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditJob(job.id)}
                            title="編輯"
                          >
                            <Edit className="h-4 w-4" />
                            編輯
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDeleteJob(job.id)}
                            title="刪除"
                          >
                            <Trash2 className="h-4 w-4" />
                            刪除
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="border-t px-4 py-3">
                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
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

      {/* 刪除確認 */}
      <ConfirmDialog
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="確認刪除此職缺？"
        description="刪除後，此職缺將不再顯示於網站上，且相關資料將被永久移除，此操作無法復原。"
        confirmText="確認刪除"
        cancelText="取消"
        destructive
        loading={deleting}
        onConfirm={handleDeleteJob}
      />

      {/* 使用指南 */}
      <Dialog open={showHelpModal} onOpenChange={(v) => { if (!v) handleCloseHelpModal(); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              徵才管理使用指南
            </DialogTitle>
            <DialogDescription>
              本系統協助您輕鬆管理所有招聘職缺，以下是使用的基本步驟。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="space-y-2 p-4">
                  <h4 className="flex items-center gap-2 font-semibold text-foreground">
                    <PlusCircle className="h-4 w-4 text-success" />
                    新增職缺
                  </h4>
                  <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                    <li>點擊「新增職位」按鈕</li>
                    <li>依照步驟填寫職缺資訊</li>
                    <li>完成所有欄位後發布職缺</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-2 p-4">
                  <h4 className="flex items-center gap-2 font-semibold text-foreground">
                    <Edit className="h-4 w-4 text-primary" />
                    管理職缺
                  </h4>
                  <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                    <li>在職缺列表中找到您要操作的職缺</li>
                    <li>點擊「編輯」可修改職缺資訊</li>
                    <li>點擊「刪除」可移除職缺</li>
                  </ol>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="space-y-2 p-4">
                <h4 className="flex items-center gap-2 font-semibold text-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  填寫技巧
                </h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li><span className="font-medium text-foreground">職位名稱</span>：使用清晰、具體的名稱，如「資深前端工程師」而非「工程師」</li>
                  <li><span className="font-medium text-foreground">詳細資料</span>：包含工作職責、要求技能、福利與工作環境</li>
                  <li><span className="font-medium text-foreground">聯絡資訊</span>：確保提供準確的聯絡方式，方便求職者詢問</li>
                  <li><span className="font-medium text-foreground">圖片</span>：上傳公司環境、團隊活動等相關照片，增加吸引力</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="default" onClick={handleCloseHelpModal}>
              我了解了
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}

export default RecruitManaPage;
