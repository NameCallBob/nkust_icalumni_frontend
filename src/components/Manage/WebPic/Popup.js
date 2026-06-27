import React, { useState, useEffect } from "react";
import Axios from "common/Axios";
import { toast } from "react-toastify";
import { FaImage, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaInfoCircle, FaPlus, FaQuestionCircle, FaEye } from "react-icons/fa";
import AppModal from "components/common/AppModal";
import { Button, Spinner } from "components/common/ui";

const PopupAdManager = () => {
  const [ads, setAds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [showHelp, setShowHelp] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    image: "",
    active: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const response = await Axios().get("picture/popup-ads/");
      setAds(response.data.results);
    } catch (error) {
      toast.error("無法取得資料，請確認網路連線正常");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.image && !currentAd) newErrors.image = "請上傳圖片";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 檢查檔案大小 (限制為 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors({...errors, image: "圖片檔案過大，請上傳 2MB 以下的圖片"});
      return;
    }

    // 檢查檔案類型
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setErrors({...errors, image: "只能上傳 JPG、PNG 或 GIF 格式的圖片"});
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
      setErrors({...errors, image: null});
    };
    reader.readAsDataURL(file);
  };

  const handleShowModal = (ad = null) => {
    setCurrentAd(ad);
    setFormData(ad || { id: null, image: "", active: true });
    setErrors({});
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (formData.id) {
        await Axios().put(`picture/popup-ads/${formData.id}/`, formData);
        toast.success("廣告已成功更新！");
      } else {
        await Axios().post("picture/popup-ads/", formData);
        toast.success("已成功新增廣告！");
      }
      setShowModal(false);
      fetchAds();
    } catch (error) {
      toast.error("操作失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (ad) => {
    setAdToDelete(ad);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!adToDelete) return;

    setLoading(true);
    try {
      await Axios().delete(`picture/popup-ads/${adToDelete.id}/`);
      setAds(ads.filter((ad) => ad.id !== adToDelete.id));
      toast.success("廣告已成功刪除");
    } catch (error) {
      toast.error("刪除失敗，請稍後再試");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setAdToDelete(null);
    }
  };

  const toggleActive = async (id, isActive) => {
    setLoading(true);
    try {
      await Axios().patch(`picture/popup-ads/${id}/toggle_active/`);
      setAds(
        ads.map((ad) => (ad.id === id ? { ...ad, active: !isActive } : ad))
      );
      toast.success(isActive ? "廣告已停用" : "廣告已啟用");
    } catch (error) {
      toast.error("狀態切換失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const showImagePreview = (ad) => {
    setPreviewImage(ad);
  };

  return (
    <div className="container mx-auto py-4 px-4">
      <h1 className="text-center mb-4 text-2xl font-bold">網站彈出廣告管理</h1>

      {showHelp && (
        <div className="alert alert-info flex-col items-start relative">
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-circle absolute top-2 right-2"
            aria-label="關閉"
            onClick={() => setShowHelp(false)}
          >
            ✕
          </button>
          <h4 className="font-bold flex items-center"><FaInfoCircle className="mr-2" />使用說明</h4>
          <p>這裡可以管理網站的彈出廣告。您可以：</p>
          <ul className="list-disc ml-6">
            <li>點擊「新增廣告」按鈕來上傳新的廣告圖片</li>
            <li>點擊「查看」按鈕預覽已上傳的廣告圖片</li>
            <li>點擊「編輯」按鈕修改現有廣告的圖片</li>
            <li>點擊「啟用/停用」按鈕控制廣告是否顯示在網站上</li>
            <li>點擊「刪除」按鈕移除不需要的廣告</li>
          </ul>
          <p>啟用的廣告會在網站訪客瀏覽時彈出顯示，請確保您上傳的圖片符合海報比例以獲得最佳顯示效果。</p>
        </div>
      )}

      <div className="flex justify-between items-center my-4">
        <Button
          variant="success"
          onClick={() => handleShowModal()}
          className="flex items-center"
        >
          <FaPlus className="mr-2" /> 新增廣告
        </Button>

        <div className="tooltip tooltip-left" data-tip="顯示使用說明">
          <button
            type="button"
            className="btn btn-outline btn-info btn-circle"
            onClick={() => setShowHelp(true)}
          >
            <FaQuestionCircle />
          </button>
        </div>
      </div>

      {loading && !showModal && !showDeleteConfirm ? (
        <div className="text-center py-5">
          <Spinner size="lg" />
          <p className="mt-3">資料載入中，請稍候...</p>
        </div>
      ) : ads.length === 0 ? (
        <div className="alert alert-warning">
          <div className="text-center py-5 w-full">
            <FaImage size={48} className="mb-3 mx-auto opacity-60" />
            <h4 className="text-lg font-semibold">目前沒有彈出廣告</h4>
            <p>點擊「新增廣告」按鈕來上傳您的第一張廣告圖片。</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th style={{ width: '5%' }}>#</th>
                <th style={{ width: '30%' }}>廣告預覽</th>
                <th style={{ width: '15%' }}>狀態</th>
                <th style={{ width: '15%' }}>上傳日期</th>
                <th style={{ width: '35%' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad, index) => (
                <tr key={ad.id} className="hover">
                  <td>{index + 1}</td>
                  <td>
                    <div className="thumbnail-container" style={{ width: '200px', height: '120px', overflow: 'hidden' }}>
                      <img
                        src={ad.image || "https://via.placeholder.com/300x150.png?text=No+Image+Available"}
                        alt="廣告圖片"
                        className="rounded"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => showImagePreview(ad)}
                      />
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${ad.active ? "badge-success" : "badge-error"}`}>
                      {ad.active ? "使用中" : "已停用"}
                    </span>
                  </td>
                  <td>
                    {ad.created_at ? new Date(ad.created_at).toLocaleDateString('zh-TW') : '未知日期'}
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <div className="tooltip tooltip-top" data-tip="查看廣告圖片">
                        <Button
                          variant="accent"
                          size="sm"
                          onClick={() => showImagePreview(ad)}
                        >
                          <FaEye />
                        </Button>
                      </div>

                      <div className="tooltip tooltip-top" data-tip="編輯廣告圖片">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleShowModal(ad)}
                        >
                          <FaEdit />
                        </Button>
                      </div>

                      <div className="tooltip tooltip-top" data-tip={ad.active ? "停用此廣告" : "啟用此廣告"}>
                        <Button
                          variant={ad.active ? "secondary" : "success"}
                          size="sm"
                          onClick={() => toggleActive(ad.id, ad.active)}
                        >
                          {ad.active ? <FaToggleOff /> : <FaToggleOn />}
                        </Button>
                      </div>

                      <div className="tooltip tooltip-top" data-tip="刪除此廣告">
                        <Button
                          variant="error"
                          size="sm"
                          onClick={() => confirmDelete(ad)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 新增/編輯廣告的表單 */}
      <AppModal
        show={showModal}
        onHide={() => setShowModal(false)}
        closeOnBackdrop={false}
        size="lg"
        variant="admin"
        title={currentAd ? "編輯彈出廣告" : "新增彈出廣告"}
        icon={<FaImage size={18} />}
        footer={
          <div className="w-full flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              loading={loading}
              disabled={loading}
            >
              {loading ? "處理中..." : "儲存"}
            </Button>
          </div>
        }
      >
        <form>
          <div className="form-control mb-4">
            <label className="label pb-1">
              <span className="label-text font-medium">上傳廣告圖片 <span className="text-error">*</span></span>
            </label>
            <div className="border rounded p-3 text-center bg-base-200">
              {(formData.image) ? (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="預覽"
                    className="mb-3 rounded mx-auto"
                    style={{ maxHeight: '300px' }}
                  />
                  <div className="absolute top-0 right-0 m-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-circle bg-base-100 shadow"
                      onClick={() => setFormData({ ...formData, image: "" })}
                    >
                      <FaTrash color="red" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  <FaImage size={36} className="mb-2 mx-auto opacity-60" />
                  <p className="opacity-60">點擊下方按鈕選擇圖片</p>
                </div>
              )}

              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('image-upload').click()}
                  className="flex items-center mx-auto"
                >
                  <FaImage className="mr-2" /> 選擇圖片檔案
                </Button>
              </div>
              <p className="text-sm opacity-60 mt-2">
                建議使用<strong>海報比例</strong>的圖片，檔案大小不超過 2MB。
                <br />
                支援的檔案格式：JPG、PNG、GIF
              </p>
              {errors.image && (
                <div className="alert alert-error mt-2 text-sm py-2">
                  {errors.image}
                </div>
              )}
            </div>
          </div>

          <div className="form-control mb-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active-switch"
                className="toggle toggle-primary"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              <label htmlFor="active-switch" className="cursor-pointer">立即啟用此廣告</label>
            </div>
            <p className="text-sm opacity-60 ml-12">
              啟用後，此廣告將會在訪客瀏覽網站時彈出顯示。您可以隨時更改此設定。
            </p>
          </div>
        </form>
      </AppModal>

      {/* 刪除確認對話框 */}
      <AppModal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        closeOnBackdrop={false}
        title="確認刪除"
        icon={<FaTrash size={18} />}
        footer={
          <div className="w-full flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
              取消
            </Button>
            <Button
              variant="error"
              onClick={handleDelete}
              loading={loading}
              disabled={loading}
            >
              {loading ? "處理中..." : "確認刪除"}
            </Button>
          </div>
        }
      >
        <div className="text-center py-3">
          <FaTrash size={36} className="text-error mb-3 mx-auto" />
          <h4 className="text-lg font-semibold">您確定要刪除這張廣告圖片嗎？</h4>
          {adToDelete && (
            <div className="mt-3">
              <img
                src={adToDelete.image || "https://via.placeholder.com/300x150.png?text=No+Image+Available"}
                alt="廣告圖片"
                className="rounded mt-2 mx-auto"
                style={{ maxHeight: '150px' }}
              />
            </div>
          )}
          <div className="alert alert-warning mt-3">
            <FaInfoCircle className="mr-2" />
            此操作無法復原，刪除後廣告將永久移除。
          </div>
        </div>
      </AppModal>

      {/* 圖片預覽對話框 */}
      <AppModal
        show={!!previewImage}
        onHide={() => setPreviewImage(null)}
        size="lg"
        title="廣告圖片預覽"
        icon={<FaEye size={18} />}
        footer={
          <div className="w-full flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setPreviewImage(null)}>
              關閉
            </Button>
            {previewImage && (
              <Button
                variant="primary"
                onClick={() => {
                  setPreviewImage(null);
                  handleShowModal(previewImage);
                }}
              >
                編輯此廣告
              </Button>
            )}
          </div>
        }
      >
        <div className="text-center py-4">
          {previewImage && (
            <img
              src={previewImage.image || "https://via.placeholder.com/800x600.png?text=No+Image+Available"}
              alt="廣告圖片"
              className="rounded mx-auto"
              style={{ maxHeight: '70vh' }}
            />
          )}
        </div>
      </AppModal>
    </div>
  );
};

export default PopupAdManager;
