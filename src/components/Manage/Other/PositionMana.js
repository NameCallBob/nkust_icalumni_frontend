import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppModal from 'components/common/AppModal';
import { Button, Field, Spinner } from 'components/common/ui';

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
    let badgeVariant = "badge-neutral";
    let tooltip = "一般成員職稱";

    if (priority <= 3) {
      badgeVariant = "badge-error";
      tooltip = "管理者權限";
    }

    return (
      <span className="tooltip" data-tip={tooltip}>
        <span className={`badge ${badgeVariant} px-2`}>
          {priority}
        </span>
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="card card-bordered shadow-sm border-0 mb-4 bg-base-100">
        <div className="px-5 py-3 text-white text-lg font-semibold rounded-t-xl" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #3a75c4 100%)' }}>
          <i className="fas fa-user-tag mr-2"></i>系友會職稱管理
        </div>

        <div className="card-body">
          <div className="alert alert-info flex items-center mb-4">
            <i className="fas fa-info-circle mr-3 fa-lg"></i>
            <div>
              <strong>職稱管理功能說明：</strong>
              <p className="mb-0 mt-1">此功能用於管理系友會內部職稱及設定其優先度。職稱用於區分系友會成員的角色與權限。</p>
            </div>
          </div>

          <div className="alert alert-warning flex items-center mb-4">
            <i className="fas fa-exclamation-triangle mr-3 fa-lg"></i>
            <div>
              <strong>權限說明重要提醒：</strong>
              <p className="mb-0 mt-1">系統僅設有兩種基本角色，由職稱優先度決定：</p>
              <ul className="mt-2 mb-1">
                <li><span className="badge badge-error mr-1">1-3</span> 管理者權限 - 可使用系統管理功能</li>
                <li><span className="badge badge-neutral mr-1">4-10</span> 一般成員 - 僅可使用一般功能</li>
              </ul>
              <p className="mb-0 text-error font-bold">請注意：優先度為 3 以上的職稱將擁有管理者權限，能夠操作管理頁面，請謹慎設定！</p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 mb-3 items-center">
            <div className="col-span-12 md:col-span-6">
              <Button
                variant="primary"
                onClick={handleAddNew}
                className="flex items-center"
                style={{ backgroundColor: '#3a75c4', borderColor: '#3a75c4' }}
              >
                <i className="fas fa-plus-circle mr-1"></i> 新增職稱
              </Button>
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className="join w-full">
                <span className="join-item btn btn-disabled no-animation flex items-center">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  className="input input-bordered join-item w-full"
                  placeholder="搜尋職稱或優先度..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {searchTerm && (
                  <Button
                    variant="outline"
                    className="join-item"
                    onClick={() => {
                      setSearchTerm('');
                      setFilteredPositions(positions);
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner center label="正在載入職稱資料..." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table align-middle" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead className="bg-base-200">
                  <tr>
                    <th style={{ width: '5%' }}>#</th>
                    <th
                      style={{ width: '45%', cursor: 'pointer' }}
                      onClick={() => handleSort('title')}
                      className="flex items-center"
                    >
                      職稱名稱
                      <i className={`fas fa-sort ml-1 text-base-content/60 small ${sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'}`}></i>
                    </th>
                    <th
                      style={{ width: '20%', cursor: 'pointer' }}
                      onClick={() => handleSort('priority')}
                      className="flex items-center"
                    >
                      優先度
                      <i className={`fas fa-sort ml-1 text-base-content/60 small ${sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'}`}></i>
                      <span className="tooltip ml-2" data-tip="優先度影響系統權限，3以上擁有管理權限">
                        <i className="fas fa-info-circle text-error"></i>
                      </span>
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
                            <i className="fas fa-search fa-2x text-base-content/60 mb-2"></i>
                            <p className="mb-0">找不到符合 "{searchTerm}" 的職稱資料</p>
                          </div>
                        ) : (
                          <div>
                            <i className="fas fa-users fa-2x text-base-content/60 mb-2"></i>
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
                      <tr key={position.id} className={position.priority <= 3 ? 'border-l-4 border-error' : ''}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="flex items-center">
                            <span className="ml-2">{position.title}</span>
                            {position.priority <= 3 && (
                              <span className="badge badge-error rounded-full ml-2 px-2 py-1">
                                <i className="fas fa-shield-alt mr-1"></i> 管理者
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          {renderPriorityBadge(position.priority)}
                        </td>
                        <td>
                          <Button
                            variant="outline"
                            onClick={() => handleEdit(position)}
                            className="mr-2 mb-1 btn-warning"
                            size="sm"
                          >
                            <i className="fas fa-edit mr-1"></i> 修改
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleDelete(position.id, position.title, position.priority)}
                            size="sm"
                            className="mb-1 btn-error"
                          >
                            <i className="fas fa-trash-alt mr-1"></i> 刪除
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-base-content/60 mt-3 flex justify-between items-center">
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
        </div>
      </div>

      <AppModal
        show={showModal}
        onHide={() => setShowModal(false)}
        closeOnBackdrop={false}
        title={isEdit ? '修改職稱' : '新增職稱'}
        icon={isEdit ? <i className="fas fa-edit"></i> : <i className="fas fa-plus-circle"></i>}
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
                <><i className="fas fa-save mr-1"></i>儲存修改</>
              ) : (
                <><i className="fas fa-plus mr-1"></i>新增職稱</>
              )}
            </Button>
          </>
        }
      >
        <p className="text-base-content/60 mb-3">
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
                  <i className="fas fa-info-circle text-error"></i>
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
            <div className="mt-2 p-2 border border-warning bg-base-200 rounded">
              <p className="mb-1 font-bold small"><i className="fas fa-exclamation-triangle text-warning mr-1"></i> 優先度權限對照表：</p>
              <div className="flex flex-wrap gap-2 small">
                <span className="badge badge-error">4-10: 一般使用者</span>
                <span className="badge badge-neutral">1-3: 管理者</span>
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
