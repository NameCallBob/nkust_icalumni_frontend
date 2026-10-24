import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppModal from 'components/common/AppModal';
import {
  Button,
  Field,
  Badge,
  Card,
  PageHeader,
  Toolbar,
  DataTable,
  EmptyState,
} from 'components/common/ui';
import {
  Pencil,
  PlusCircle,
  Factory,
  Search,
  X,
  Trash2,
  Info,
  Database,
} from 'lucide-react';

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

  const columns = [
    {
      key: 'index',
      header: '#',
      className: 'w-12 text-base-content/50',
      render: (row, i) => i + 1,
    },
    {
      key: 'title',
      header: '產業名稱',
      render: (row) => (
        <Badge variant="primary" className="text-sm">
          {row.title}
        </Badge>
      ),
    },
    {
      key: 'intro',
      header: '簡介',
      render: (row) => (
        <div className="max-h-20 overflow-auto text-sm text-base-content/80 whitespace-pre-wrap">
          {row.intro}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '操作',
      className: 'w-44',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => handleEdit(row)}
            className="btn-warning"
            size="sm"
          >
            <Pencil size={15} className="mr-1" /> 修改
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDelete(row.id)}
            size="sm"
            className="btn-error"
          >
            <Trash2 size={15} className="mr-1" /> 刪除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title="公司產業別管理"
        subtitle="管理系友公司資料所使用的產業分類"
        icon={<Factory size={22} />}
        actions={
          <Button
            variant="primary"
            onClick={handleAddNew}
            className="flex items-center gap-1"
          >
            <PlusCircle size={18} /> 新增產業別
          </Button>
        }
      />

      {/* 功能說明 */}
      <Card padding="md" className="mb-5 border-l-4 border-primary/60">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Info size={18} />
          </span>
          <div className="min-w-0 text-sm text-base-content/70">
            <strong className="text-base-content">產業別管理功能說明</strong>
            <p className="mt-1">
              此功能用於管理系統中的產業分類，這些分類將用於系友公司資料的分類。您可以新增、修改和刪除產業別，並提供相關說明以幫助使用者了解每個產業的範圍。
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge variant="primary">新增產業別</Badge> 可增加新的產業分類
              <Badge variant="warning">修改</Badge> 可編輯現有產業資料
              <Badge variant="error">刪除</Badge> 可移除不需要的產業分類
            </p>
          </div>
        </div>
      </Card>

      <Card padding="md">
        <Toolbar
          left={
            <div className="join w-full sm:w-80">
              <span className="join-item flex items-center px-3 bg-base-200 border border-base-300">
                <Search size={16} />
              </span>
              <input
                className="join-item input input-bordered w-full"
                placeholder="搜尋產業名稱或簡介..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="join-item btn btn-outline"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          }
        />

        <DataTable
          columns={columns}
          data={filteredIndustries}
          rowKey={(row) => row.id}
          loading={loading}
          empty={
            searchTerm ? (
              <EmptyState
                icon={<Search size={28} />}
                title={`找不到符合 "${searchTerm}" 的產業資料`}
                description="請嘗試其他關鍵字，或清除搜尋條件。"
                action={
                  <Button variant="outline" size="sm" onClick={() => setSearchTerm('')}>
                    清除搜尋
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={<Database size={28} />}
                title="尚未新增任何產業資料"
                description="建立第一筆產業分類，開始管理系友公司資料。"
                action={
                  <Button variant="primary" size="sm" onClick={handleAddNew}>
                    立即新增第一筆資料
                  </Button>
                }
              />
            )
          }
        />

        <div className="mt-4 flex items-center justify-between text-sm text-base-content/60">
          <span>
            共 {filteredIndustries.length} 筆資料{searchTerm ? `（搜尋結果）` : ''}
          </span>
          {searchTerm && (
            <Button variant="link" size="sm" onClick={() => setSearchTerm('')}>
              清除搜尋並顯示全部
            </Button>
          )}
        </div>
      </Card>

      <AppModal
        show={showModal}
        onHide={() => setShowModal(false)}
        closeOnBackdrop={false}
        title={isEdit ? '修改產業別' : '新增產業別'}
        icon={isEdit ? <Pencil size={20} /> : <PlusCircle size={20} />}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              取消
            </Button>
            <Button
              variant={isEdit ? 'accent' : 'primary'}
              className={isEdit ? 'btn-warning' : ''}
              onClick={() => {
                if (validateFields()) {
                  handleSave();
                }
              }}
            >
              {isEdit ? '儲存修改' : '新增產業'}
            </Button>
          </>
        }
      >
        <p className="text-base-content/60 mb-4">
          {isEdit ?
            '請編輯以下產業資料，欄位標示 * 為必填項目。' :
            '請填寫產業資料，新增後將可用於系友公司資料分類。'
          }
        </p>
        <form>
          {/* 產業名稱 */}
          <Field
            label="產業名稱"
            required
            id="industryName"
            type="text"
            value={currentIndustry.title}
            onChange={(e) =>
              setCurrentIndustry({ ...currentIndustry, title: e.target.value })
            }
            placeholder="請輸入產業名稱"
            maxLength={50}
            error={currentIndustry.title === '' ? '產業名稱為必填項目' : undefined}
            help={`最多 50 字，目前已輸入 ${currentIndustry.title.length} 字`}
          />

          {/* 產業簡介 */}
          <Field
            as="textarea"
            label="產業簡介"
            required
            id="industryDescription"
            rows={4}
            value={currentIndustry.intro}
            onChange={(e) =>
              setCurrentIndustry({ ...currentIndustry, intro: e.target.value })
            }
            placeholder="請輸入產業簡介，說明此產業的範圍與特點"
            maxLength={200}
            style={{ resize: 'none' }}
            error={currentIndustry.intro === '' ? '產業簡介為必填項目' : undefined}
            help={`有助於使用者了解此產業分類 · ${currentIndustry.intro.length}/200 字`}
          />
        </form>
      </AppModal>

      {/* Toastify container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default IndustryCRUD;
