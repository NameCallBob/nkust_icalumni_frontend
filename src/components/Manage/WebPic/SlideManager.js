import React, { useState, useEffect } from "react";
import AppModal from "components/common/AppModal";
import { Button, Field, Spinner } from "components/common/ui";
import Axios from "common/Axios";
import { toast } from "react-toastify";
import { FaImage, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaInfoCircle, FaPlus, FaQuestionCircle, FaEye } from "react-icons/fa";

const SlideManager = () => {
  const [slides, setSlides] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState(null);
  const [showHelp, setShowHelp] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    link_url: "",
    image: "",
    active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true);
      try {
        const response = await Axios().get("picture/slide-images/all/");
        setSlides(response.data);
      } catch (error) {
        toast.error("無法取得資料，請確認網路連線正常");
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "請輸入標題";
    if (!formData.image && !currentSlide) newErrors.image = "請上傳圖片";

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

  const handleShowModal = (slide = null) => {
    setCurrentSlide(slide);
    setFormData(slide || { id: null, title: "", description: "", link_url: "", image: "", active: true });
    setErrors({});
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (formData.id) {
        const payload = {};
        Object.keys(formData).forEach(key => {
          if (formData[key] !== currentSlide[key]) {
            payload[key] = formData[key];
          }
        });

        // The id is required for the backend to identify the record.
        payload.id = formData.id;

        // If no fields have changed, don't send the request.
        if (Object.keys(payload).length > 1) {
            await Axios().patch("picture/slide-images/change/", payload);
            toast.success("圖片已成功更新！");
        } else {
            toast.info("沒有偵測到任何變更");
        }

      } else {
        await Axios().post("picture/slide-images/add/", formData);
        toast.success("已成功新增圖片！");
      }
      setShowModal(false);

      const response = await Axios().get("picture/slide-images/all/");
      setSlides(response.data);
    } catch (error) {
      toast.error("操作失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (slide) => {
    setSlideToDelete(slide);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!slideToDelete) return;

    setLoading(true);
    try {
      await Axios().delete("picture/slide-images/remove/", { data: { id: slideToDelete.id } });
      setSlides(slides.filter((slide) => slide.id !== slideToDelete.id));
      toast.success("圖片已成功刪除");
    } catch (error) {
      toast.error("刪除失敗，請稍後再試");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setSlideToDelete(null);
    }
  };

  const toggleActive = async (id, isActive) => {
    setLoading(true);
    try {
      await Axios().post("picture/slide-images/switch_active/", { id });
      setSlides(
        slides.map((slide) => (slide.id === id ? { ...slide, active: !isActive } : slide))
      );
      toast.success(isActive ? "圖片已停用" : "圖片已啟用");
    } catch (error) {
      toast.error("狀態切換失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const showImagePreview = (slide) => {
    setPreviewImage(slide);
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-center text-2xl font-bold mb-4">網站輪播圖片管理</h1>

      {showHelp && (
        <div className="alert alert-info flex-col items-start">
          <div className="flex w-full justify-between items-start">
            <h2 className="font-bold flex items-center"><FaInfoCircle className="mr-2" />使用說明</h2>
            <button type="button" className="btn btn-ghost btn-xs" onClick={() => setShowHelp(false)} aria-label="關閉">✕</button>
          </div>
          <div>
            <p>這裡可以管理網站首頁的輪播圖片。您可以：</p>
            <ul className="list-disc pl-5">
              <li>點擊「新增輪播圖片」按鈕來上傳新的圖片</li>
              <li>點擊「查看」按鈕預覽已上傳的圖片</li>
              <li>點擊「編輯」按鈕修改現有圖片的資訊</li>
              <li>點擊「啟用/停用」按鈕控制圖片是否顯示在網站上</li>
              <li>點擊「刪除」按鈕移除不需要的圖片</li>
            </ul>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center my-4">
        <Button
          variant="success"
          onClick={() => handleShowModal()}
          className="flex items-center"
        >
          <FaPlus className="mr-2" /> 新增輪播圖片
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
        <div className="text-center py-12">
          <Spinner size="lg" />
          <p className="mt-3">資料載入中，請稍候...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="alert alert-warning">
          <div className="text-center py-12 w-full">
            <FaImage size={48} className="mb-3 text-base-content/60 mx-auto" />
            <h4 className="text-lg font-semibold">目前沒有輪播圖片</h4>
            <p>點擊「新增輪播圖片」按鈕來上傳您的第一張輪播圖片。</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th style={{ width: '5%' }}>#</th>
                <th style={{ width: '12%' }}>縮圖</th>
                <th style={{ width: '18%' }}>標題</th>
                <th style={{ width: '20%' }}>描述</th>
                <th style={{ width: '15%' }}>跳轉連結</th>
                <th style={{ width: '10%' }}>狀態</th>
                <th style={{ width: '20%' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide, index) => (
                <tr key={slide.id} className="hover">
                  <td>{index + 1}</td>
                  <td>
                    <div className="thumbnail-container" style={{ width: '100px', height: '60px', overflow: 'hidden' }}>
                      <img
                        src={process.env.REACT_APP_BASE_URL + slide.image}
                        alt={slide.title}
                        className="rounded"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => showImagePreview(slide)}
                      />
                    </div>
                  </td>
                  <td>{slide.title}</td>
                  <td>
                    <div style={{ maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {slide.description || <span className="text-base-content/60">(無描述)</span>}
                    </div>
                  </td>
                  <td>
                    {slide.link_url ? (
                      <a
                        href={slide.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline link link-primary"
                        style={{ fontSize: '0.9em' }}
                      >
                        {slide.link_url.length > 30 ? `${slide.link_url.substring(0, 30)}...` : slide.link_url}
                      </a>
                    ) : (
                      <span className="text-base-content/60">(無連結)</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${slide.active ? "badge-success" : "badge-error"}`}>
                      {slide.active ? "使用中" : "已停用"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <div className="tooltip tooltip-top" data-tip="查看圖片">
                        <button
                          type="button"
                          className="btn btn-info btn-sm"
                          onClick={() => showImagePreview(slide)}
                        >
                          <FaEye />
                        </button>
                      </div>

                      <div className="tooltip tooltip-top" data-tip="編輯圖片資訊">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleShowModal(slide)}
                        >
                          <FaEdit />
                        </button>
                      </div>

                      <div className="tooltip tooltip-top" data-tip={slide.active ? "停用此圖片" : "啟用此圖片"}>
                        <button
                          type="button"
                          className={`btn btn-sm ${slide.active ? "btn-warning" : "btn-success"}`}
                          onClick={() => toggleActive(slide.id, slide.active)}
                        >
                          {slide.active ? <FaToggleOff /> : <FaToggleOn />}
                        </button>
                      </div>

                      <div className="tooltip tooltip-top" data-tip="刪除此圖片">
                        <button
                          type="button"
                          className="btn btn-error btn-sm"
                          onClick={() => confirmDelete(slide)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 新增/編輯圖片的表單 */}
      <AppModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title={currentSlide ? "編輯輪播圖片" : "新增輪播圖片"}
        icon={<FaImage />}
        size="lg"
        closeOnBackdrop={false}
        footer={
          <div className="w-full flex justify-between">
            <Button
              variant="outline"
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
        <div>
          <div className="mb-3 border-b border-base-300 pb-2">
            <h5 className="text-base-content/60 font-semibold">基本資訊</h5>
          </div>

          <Field
            as="input"
            type="text"
            label="標題"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            help="輸入簡短的標題來描述這張圖片的用途。"
            placeholder="請輸入標題，例如：春季促銷活動"
          />

          <Field
            as="textarea"
            rows={3}
            label="描述（選填）"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            help="添加詳細說明，幫助您日後識別此輪播圖片的用途。"
            placeholder="請輸入詳細描述（非必填）"
          />

          <Field
            as="input"
            type="url"
            label="點擊跳轉連結（選填）"
            value={formData.link_url}
            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
            error={errors.link_url}
            help="當使用者點擊輪播圖片時，將跳轉到此連結。留空則不會有跳轉功能。"
            placeholder="請輸入完整網址，例如：https://www.example.com"
          />

          <div className="mb-3 border-b border-base-300 pb-2">
            <h5 className="text-base-content/60 font-semibold">圖片設定</h5>
          </div>

          <div className="form-control w-full mb-4">
            <label className="label pb-1">
              <span className="label-text font-medium">上傳圖片 {!currentSlide && <span className="text-error">*</span>}</span>
            </label>
            <div className="border border-base-300 rounded p-3 text-center bg-base-200">
              {(formData.image || (currentSlide && currentSlide.image)) ? (
                <div className="relative">
                  <img
                    src={formData.image || (process.env.REACT_APP_BASE_URL + currentSlide.image)}
                    alt="預覽"
                    className="mb-3 rounded mx-auto"
                    style={{ maxHeight: '300px' }}
                  />
                  <div className="absolute top-0 right-0 m-2">
                    <button
                      type="button"
                      className="btn btn-circle btn-sm shadow bg-base-100"
                      onClick={() => setFormData({ ...formData, image: "" })}
                    >
                      <FaTrash color="red" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-3">
                  <FaImage size={36} className="mb-2 text-base-content/60 mx-auto" />
                  <p className="text-base-content/60">點擊下方按鈕選擇圖片</p>
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
              <p className="text-base-content/60 text-sm mt-2">
                建議使用尺寸比例為 16:9 的橫式圖片，檔案大小不超過 2MB。
                <br />
                支援的檔案格式：JPG、PNG、GIF
              </p>
              {errors.image && (
                <div className="alert alert-error mt-2 text-sm">
                  {errors.image}
                </div>
              )}
            </div>
          </div>

          <div className="mb-3 border-b border-base-300 pb-2">
            <h5 className="text-base-content/60 font-semibold">顯示設定</h5>
          </div>

          <div className="form-control w-full mb-4">
            <label className="flex items-center gap-2 cursor-pointer" htmlFor="active-switch">
              <input
                type="checkbox"
                id="active-switch"
                className="toggle toggle-primary"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              <span className="label-text">立即啟用此圖片</span>
            </label>
            <p className="text-base-content/60 text-sm ml-9 mt-1">
              啟用後，此圖片將會出現在網站輪播區域中。您可以隨時更改此設定。
            </p>
          </div>
        </div>
      </AppModal>

      {/* 刪除確認對話框 */}
      <AppModal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        title="確認刪除"
        icon={<FaTrash />}
        size="md"
        closeOnBackdrop={false}
        footer={
          <div className="w-full flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
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
          <h4 className="text-lg font-semibold">您確定要刪除這張圖片嗎？</h4>
          {slideToDelete && (
            <div className="mt-3 text-base-content/60">
              <p><strong>標題：</strong> {slideToDelete.title}</p>
              <img
                src={process.env.REACT_APP_BASE_URL + slideToDelete.image}
                alt={slideToDelete.title}
                className="rounded mt-2 mx-auto"
                style={{ maxHeight: '150px' }}
              />
            </div>
          )}
          <div className="alert alert-warning mt-3">
            <FaInfoCircle className="mr-2" />
            此操作無法復原，刪除後圖片將永久移除。
          </div>
        </div>
      </AppModal>

      {/* 圖片預覽對話框 */}
      <AppModal
        show={!!previewImage}
        onHide={() => setPreviewImage(null)}
        title={previewImage?.title || '圖片預覽'}
        icon={<FaEye />}
        size="lg"
        variant="showcase"
        footer={
          <div className="w-full flex justify-end">
            <Button variant="secondary" onClick={() => setPreviewImage(null)}>
              關閉
            </Button>
          </div>
        }
      >
        <div className="text-center py-4">
          {previewImage && (
            <>
              <img
                src={process.env.REACT_APP_BASE_URL + previewImage.image}
                alt={previewImage.title}
                className="rounded mx-auto"
                style={{ maxHeight: '60vh' }}
              />
              {previewImage.description && (
                <div className="mt-3 text-base-content/60">
                  <p>{previewImage.description}</p>
                </div>
              )}
            </>
          )}
        </div>
      </AppModal>
    </div>
  );
};

export default SlideManager;
