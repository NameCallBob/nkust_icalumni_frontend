import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppModal from 'components/common/AppModal';
import { Button, Spinner } from 'components/common/ui';
import { Pencil, PlusCircle } from 'lucide-react';

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
    <div className="container mx-auto px-4 py-4">
      <div className="card card-bordered bg-base-100 shadow-sm mb-4">
        {/* 卡片標題：深藍漸層 */}
        <div className="px-4 py-3 text-white text-lg font-semibold rounded-t-2xl bg-gradient-to-r from-[#1e3a5f] to-[#3a75c4]">
          <i className="fas fa-industry mr-2"></i>公司產業別管理
        </div>
        <div className="card-body">
          <div className="alert alert-info flex items-center mb-4">
            <i className="fas fa-info-circle mr-3 fa-lg"></i>
            <div>
              <strong>產業別管理功能說明：</strong>
              <p className="mb-0 mt-1">此功能用於管理系統中的產業分類，這些分類將用於系友公司資料的分類。您可以新增、修改和刪除產業別，並提供相關說明以幫助使用者了解每個產業的範圍。</p>
              <p className="mb-0 mt-2">
                <span className="badge badge-primary mr-1">新增產業別</span> 可增加新的產業分類
                <span className="badge badge-warning mx-1">修改</span> 可編輯現有產業資料
                <span className="badge badge-error mx-1">刪除</span> 可移除不需要的產業分類
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 items-center">
            <div>
              <Button
                variant="primary"
                onClick={handleAddNew}
                className="flex items-center gap-1"
              >
                <i className="fas fa-plus-circle mr-1"></i> 新增產業別
              </Button>
            </div>
            <div>
              <div className="join w-full">
                <span className="join-item flex items-center px-3 bg-base-200 border border-base-300">
                  <i className="fas fa-search"></i>
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
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center my-5">
              <Spinner center label="正在載入產業資料..." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table align-middle" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead className="bg-base-200">
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
                            <i className="fas fa-search fa-2x text-base-content/60 mb-2"></i>
                            <p className="mb-0">找不到符合 "{searchTerm}" 的產業資料</p>
                          </div> :
                          <div>
                            <i className="fas fa-database fa-2x text-base-content/60 mb-2"></i>
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
                      <tr key={industry.id} className="border-b border-base-200">
                        <td>{index + 1}</td>
                        <td>
                          <span
                            className="badge badge-lg badge-ghost px-3 py-2"
                            style={{ fontSize: '0.9rem', fontWeight: '500' }}
                          >
                            {industry.title}
                          </span>
                        </td>
                        <td>
                          <div style={{ maxHeight: '80px', overflow: 'auto' }}>
                            {industry.intro}
                          </div>
                        </td>
                        <td>
                          <Button
                            variant="outline"
                            onClick={() => handleEdit(industry)}
                            className="btn-warning mr-2 mb-1"
                            size="sm"
                          >
                            <i className="fas fa-edit mr-1"></i> 修改
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleDelete(industry.id)}
                            size="sm"
                            className="btn-error mb-1"
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
            <small>共 {filteredIndustries.length} 筆資料{searchTerm ? `（搜尋結果）` : ''}</small>
            {searchTerm && (
              <Button variant="link" size="sm" onClick={() => setSearchTerm('')}>
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
              {isEdit ?
                <><i className="fas fa-save mr-1"></i>儲存修改</> :
                <><i className="fas fa-plus mr-1"></i>新增產業</>
              }
            </Button>
          </>
        }
      >
        <p className="text-base-content/60 mb-3">
          {isEdit ?
            '請編輯以下產業資料，欄位標示 * 為必填項目。' :
            '請填寫產業資料，新增後將可用於系友公司資料分類。'
          }
        </p>
        <form>
          {/* 產業名稱 */}
          <div className="form-control w-full mb-3">
            <label className="label pb-1" htmlFor="industryName">
              <span className="label-text font-medium text-base-content">
                <span className="text-error">*</span> 產業名稱
              </span>
            </label>
            <input
              id="industryName"
              type="text"
              className={`input input-bordered w-full ${currentIndustry.title === '' ? 'border-error' : ''}`}
              value={currentIndustry.title}
              onChange={(e) =>
                setCurrentIndustry({ ...currentIndustry, title: e.target.value })
              }
              required
              placeholder="請輸入產業名稱"
              maxLength={50}
            />
            <span className="label-text-alt text-base-content/60 mt-1">
              最多 50 字，目前已輸入 {currentIndustry.title.length} 字
            </span>
            {currentIndustry.title === '' && (
              <span className="label-text-alt text-error mt-1">
                產業名稱為必填項目
              </span>
            )}
          </div>

          {/* 產業簡介 */}
          <div className="form-control w-full">
            <label className="label pb-1" htmlFor="industryDescription">
              <span className="label-text font-medium text-base-content">
                <span className="text-error">*</span> 產業簡介
              </span>
            </label>
            <textarea
              id="industryDescription"
              rows={4}
              className={`textarea textarea-bordered w-full ${currentIndustry.intro === '' ? 'border-error' : ''}`}
              value={currentIndustry.intro}
              onChange={(e) =>
                setCurrentIndustry({ ...currentIndustry, intro: e.target.value })
              }
              required
              placeholder="請輸入產業簡介，說明此產業的範圍與特點"
              maxLength={200}
              style={{ resize: 'none' }}
            />
            <span className="label-text-alt text-base-content/60 mt-1 flex justify-between">
              <span>有助於使用者了解此產業分類</span>
              <span>{currentIndustry.intro.length}/200 字</span>
            </span>
            {currentIndustry.intro === '' && (
              <span className="label-text-alt text-error mt-1">
                產業簡介為必填項目
              </span>
            )}
          </div>
        </form>
      </AppModal>

      {/* Toastify container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default IndustryCRUD;
