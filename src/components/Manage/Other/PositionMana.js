import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppModal from 'components/common/AppModal';
import { Button, Field, PageHeader, Toolbar, DataTable, Badge, EmptyState } from 'components/common/ui';
import {
  UserCog,
  Plus,
  Search,
  X,
  Pencil,
  Trash2,
  ArrowUpDown,
  Info,
  AlertTriangle,
  ShieldCheck,
  Save,
} from 'lucide-react';

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
    const isAdmin = priority <= 3;
    const tooltip = isAdmin ? '管理者權限' : '一般成員職稱';

    return (
      <span className="tooltip" data-tip={tooltip}>
        <Badge variant={isAdmin ? 'error' : 'neutral'} soft={false} className="px-2.5">
          {priority}
        </Badge>
      </span>
    );
  };

  // 可點擊排序的表頭
  const SortableHeader = ({ column, children }) => (
    <button
      type="button"
      onClick={() => handleSort(column)}
      className="inline-flex items-center gap-1 font-medium text-base-content/70 hover:text-primary transition-colors"
    >
      {children}
      <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
    </button>
  );

  const columns = [
    {
      key: 'index',
      header: '#',
      className: 'w-12 text-base-content/50',
      hideOnMobile: true,
      render: (_row, i) => i + 1,
    },
    {
      key: 'title',
      header: <SortableHeader column="title">職稱名稱</SortableHeader>,
      render: (position) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-base-content">{position.title}</span>
          {position.priority <= 3 && (
            <Badge variant="error" soft={false} className="gap-1">
              <ShieldCheck className="h-3 w-3" /> 管理者
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'priority',
      header: (
        <span className="inline-flex items-center gap-1.5">
          <SortableHeader column="priority">優先度</SortableHeader>
          <span className="tooltip" data-tip="優先度影響系統權限，3以上擁有管理權限">
            <Info className="h-3.5 w-3.5 text-error" />
          </span>
        </span>
      ),
      render: (position) => renderPriorityBadge(position.priority),
    },
    {
      key: 'actions',
      header: '操作',
      className: 'w-48',
      render: (position) => (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(position)}>
            <Pencil className="h-3.5 w-3.5 mr-1" /> 修改
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => handleDelete(position.id, position.title, position.priority)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" /> 刪除
          </Button>
        </div>
      ),
    },
  ];

  const emptyNode = searchTerm ? (
    <EmptyState
      icon={<Search className="h-8 w-8" />}
      title={`找不到符合 "${searchTerm}" 的職稱資料`}
      description="請嘗試其他關鍵字，或清除搜尋條件。"
    />
  ) : (
    <EmptyState
      icon={<UserCog className="h-8 w-8" />}
      title="尚未新增任何職稱資料"
      description="建立系友會內部職稱，並設定其權限優先度。"
      action={
        <Button variant="primary" onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-1" /> 立即新增第一筆職稱
        </Button>
      }
    />
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title="系友會職稱管理"
        subtitle="管理系友會內部職稱及其優先度，優先度決定成員的角色與系統權限。"
        icon={<UserCog className="h-5 w-5" />}
        actions={
          <Button variant="primary" onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-1" /> 新增職稱
          </Button>
        }
      />

      {/* 功能說明 */}
      <div className="mb-4 flex items-start gap-3 rounded-2xl border border-info/30 bg-info/5 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-info" />
        <div className="text-sm">
          <p className="font-semibold text-base-content">職稱管理功能說明</p>
          <p className="mt-1 text-base-content/70">
            此功能用於管理系友會內部職稱及設定其優先度。職稱用於區分系友會成員的角色與權限。
          </p>
        </div>
      </div>

      {/* 權限提醒 */}
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning/5 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
        <div className="text-sm">
          <p className="font-semibold text-base-content">權限說明重要提醒</p>
          <p className="mt-1 text-base-content/70">系統僅設有兩種基本角色，由職稱優先度決定：</p>
          <ul className="mt-2 space-y-1.5">
            <li className="flex items-center gap-2">
              <Badge variant="error" soft={false}>1-3</Badge>
              <span className="text-base-content/70">管理者權限 - 可使用系統管理功能</span>
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="neutral" soft={false}>4-10</Badge>
              <span className="text-base-content/70">一般成員 - 僅可使用一般功能</span>
            </li>
          </ul>
          <p className="mt-2 font-bold text-error">
            請注意：優先度為 3 以上的職稱將擁有管理者權限，能夠操作管理頁面，請謹慎設定！
          </p>
        </div>
      </div>

      {/* 搜尋列 */}
      <Toolbar
        left={
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" />
            <input
              className="input input-bordered w-full pl-9 pr-9"
              placeholder="搜尋職稱或優先度..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFilteredPositions(positions);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={filteredPositions}
        rowKey={(row) => row.id}
        loading={loading}
        empty={emptyNode}
      />

      {/* 統計列 */}
      <div className="mt-3 flex items-center justify-between text-sm text-base-content/60">
        <span>共 {filteredPositions.length} 筆資料{searchTerm ? `（搜尋結果）` : ''}</span>
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setFilteredPositions(positions);
            }}
          >
            清除搜尋並顯示全部
          </Button>
        )}
      </div>

      <AppModal
        show={showModal}
        onHide={() => setShowModal(false)}
        closeOnBackdrop={false}
        title={isEdit ? '修改職稱' : '新增職稱'}
        icon={isEdit ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              取消
            </Button>
            <Button
              variant={isEdit ? "accent" : "primary"}
              onClick={handleSave}
            >
              {isEdit ? (
                <><Save className="h-4 w-4 mr-1" />儲存修改</>
              ) : (
                <><Plus className="h-4 w-4 mr-1" />新增職稱</>
              )}
            </Button>
          </>
        }
      >
        <p className="mb-4 text-sm text-base-content/60">
          {isEdit ?
            '請編輯以下職稱資料，欄位標示 * 為必填項目。' :
            '請填寫職稱資料，設定系友會內部職務名稱與優先度。'
          }
        </p>

        <form>
          {/* 職稱名稱 */}
          <Field
            as="input"
            label="職稱名稱"
            required
            type="text"
            value={currentPosition.title}
            onChange={(e) =>
              setCurrentPosition({ ...currentPosition, title: e.target.value })
            }
            placeholder="請輸入職稱名稱"
            maxLength={50}
            error={!currentPosition.title ? '職稱名稱為必填項目' : ''}
            help="最多 50 字，例如：會長、副會長、總幹事等"
          />

          {/* 優先度 */}
          <div className="form-control w-full mb-4">
            <label className="label pb-1">
              <span className="label-text font-medium text-base-content">
                優先度<span className="text-error ml-0.5">*</span>
                <span className="tooltip ml-2" data-tip="優先度影響系統權限，3以上擁有管理權限">
                  <Info className="inline h-3.5 w-3.5 text-error" />
                </span>
              </span>
            </label>
            <input
              className={`input input-bordered w-full ${(!currentPosition.priority || currentPosition.priority < 1 || currentPosition.priority > 10) ? 'border-error' : ''}`}
              type="number"
              value={currentPosition.priority}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setCurrentPosition({ ...currentPosition, priority: value });
              }}
              min={1}
              max={10}
            />
            <span className={`label-text-alt mt-1 ${currentPosition.priority >= 3 ? "text-error font-bold" : "text-base-content/60"}`}>
              {currentPosition.priority >= 3
                ? `警告：優先度${currentPosition.priority}將擁有系統管理者權限！`
                : "範圍：1-10，優先度3以上擁有管理權限"}
            </span>
            {(!currentPosition.priority || currentPosition.priority < 1 || currentPosition.priority > 10) && (
              <span className="label-text-alt text-error mt-1">優先度必須介於 1 至 10 之間</span>
            )}
            <div className="mt-3 rounded-xl border border-warning/40 bg-warning/5 p-3">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-base-content">
                <AlertTriangle className="h-4 w-4 text-warning" /> 優先度權限對照表：
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="error" soft={false}>4-10: 一般使用者</Badge>
                <Badge variant="neutral" soft={false}>1-3: 管理者</Badge>
              </div>
            </div>
          </div>
        </form>
      </AppModal>

      {/* Toastify container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AlumniPositionCRUD;
