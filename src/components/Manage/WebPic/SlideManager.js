import React, { useState, useEffect } from "react";
import AppModal from "components/common/AppModal";
import { Button, Field, PageHeader, Toolbar, DataTable, Card, Badge, EmptyState } from "components/common/ui";
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

  const columns = [
    {
      key: "index",
      header: "#",
      className: "w-12 text-base-content/50",
      hideOnMobile: true,
      render: (slide, index) => index + 1,
    },
    {
      key: "image",
      header: "縮圖",
      render: (slide) => (
        <div className="h-14 w-24 overflow-hidden rounded-lg border border-base-300/70 bg-base-200">
          <img
            src={process.env.REACT_APP_BASE_URL + slide.image}
            alt={slide.title}
            className="h-full w-full cursor-pointer object-cover transition-transform hover:scale-105"
            onClick={() => showImagePreview(slide)}
          />
        </div>
      ),
    },
    {
      key: "title",
      header: "標題",
      render: (slide) => <span className="font-medium text-base-content">{slide.title}</span>,
    },
    {
      key: "description",
      header: "描述",
      hideOnMobile: true,
      render: (slide) => (
        <div className="max-w-xs truncate text-sm text-base-content/70">
          {slide.description || <span className="text-base-content/40">(無描述)</span>}
        </div>
      ),
    },
    {
      key: "link_url",
      header: "跳轉連結",
      hideOnMobile: true,
      render: (slide) =>
        slide.link_url ? (
          <a
            href={slide.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary text-sm no-underline"
          >
            {slide.link_url.length > 30 ? `${slide.link_url.substring(0, 30)}...` : slide.link_url}
          </a>
        ) : (
          <span className="text-base-content/40">(無連結)</span>
        ),
    },
    {
      key: "active",
      header: "狀態",
      render: (slide) => (
        <Badge variant={slide.active ? "success" : "error"}>
          {slide.active ? "使用中" : "已停用"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "操作",
      className: "text-right",
      render: (slide) => (
        <div className="flex flex-wrap justify-end gap-1.5">
          <div className="tooltip tooltip-top" data-tip="查看圖片">
            <Button variant="ghost" size="sm" className="text-info" onClick={() => showImagePreview(slide)}>
              <FaEye />
            </Button>
          </div>
          <div className="tooltip tooltip-top" data-tip="編輯圖片資訊">
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => handleShowModal(slide)}>
              <FaEdit />
            </Button>
          </div>
          <div className="tooltip tooltip-top" data-tip={slide.active ? "停用此圖片" : "啟用此圖片"}>
            <Button
              variant="ghost"
              size="sm"
              className={slide.active ? "text-warning" : "text-success"}
              onClick={() => toggleActive(slide.id, slide.active)}
            >
              {slide.active ? <FaToggleOff /> : <FaToggleOn />}
            </Button>
          </div>
          <div className="tooltip tooltip-top" data-tip="刪除此圖片">
            <Button variant="ghost" size="sm" className="text-error" onClick={() => confirmDelete(slide)}>
              <FaTrash />
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <PageHeader
        title="網站輪播圖片管理"
        subtitle="管理網站首頁輪播區塊顯示的圖片、連結與啟用狀態"
        icon={<FaImage className="h-5 w-5" />}
        actions={
          <Button variant="primary" onClick={() => handleShowModal()}>
            <FaPlus className="mr-2" /> 新增輪播圖片
          </Button>
        }
      />

      {showHelp && (
        <Card padding="md" className="mb-5 border-info/30 bg-info/5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="flex items-center gap-2 font-semibold text-base-content">
              <FaInfoCircle className="text-info" /> 使用說明
            </h2>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => setShowHelp(false)}
              aria-label="關閉"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-sm text-base-content/70">這裡可以管理網站首頁的輪播圖片。您可以：</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-base-content/70">
            <li>點擊「新增輪播圖片」按鈕來上傳新的圖片</li>
            <li>點擊「查看」按鈕預覽已上傳的圖片</li>
            <li>點擊「編輯」按鈕修改現有圖片的資訊</li>
            <li>點擊「啟用/停用」按鈕控制圖片是否顯示在網站上</li>
            <li>點擊「刪除」按鈕移除不需要的圖片</li>
          </ul>
        </Card>
      )}

      <Toolbar
        left={
          <p className="text-sm text-base-content/60">
            共 <span className="font-semibold text-base-content">{slides.length}</span> 張輪播圖片
          </p>
        }
        right={
          <div className="tooltip tooltip-left" data-tip="顯示使用說明">
            <Button variant="outline" size="sm" onClick={() => setShowHelp(true)}>
              <FaQuestionCircle className="mr-1.5" /> 使用說明
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={slides}
        rowKey={(slide) => slide.id}
        loading={loading && !showModal && !showDeleteConfirm}
        empty={
          <Card padding="none">
            <EmptyState
              icon={<FaImage className="h-8 w-8" />}
              title="目前沒有輪播圖片"
              description="點擊「新增輪播圖片」按鈕來上傳您的第一張輪播圖片。"
              action={
                <Button variant="primary" onClick={() => handleShowModal()}>
                  <FaPlus className="mr-2" /> 新增輪播圖片
                </Button>
              }
            />
          </Card>
        }
      />

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
