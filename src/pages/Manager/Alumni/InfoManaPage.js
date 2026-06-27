import Axios from "common/Axios";
import UploadImageModal from "components/Manage/Info/InfoPicModal";
import React, { useState, useEffect } from "react";
import useRWD from 'hooks/useRWD';
import AppModal from "components/common/AppModal";
import { Button, PageHeader, DataTable, Badge, EmptyState } from "components/common/ui";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BsPlusLg, BsPencil, BsPause, BsPlay, BsTrash, BsXLg, BsSave } from "react-icons/bs";
import { FileText, FileEdit, Image as ImageIcon } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const InfoManager = () => {
  const rwd = useRWD();
  const [activeTab, setActiveTab] = useState("content");
  const [records, setRecords] = useState([]);
  const [formImages, setFormImages] = useState([]);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formDescription, setFormDescription] = useState("");
  const [showContentModal, setShowContentModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [searchParams] = useSearchParams();
  const pageType = searchParams.get("type") || "rule";

  const config = {
    rule: {
      contentAPI: "info/associations/all/",
      imageAPI: "info/association-images/query_all_images/",
      createAPI: "info/associations/new/",
      updateContentAPI: "info/associations/change/",
      toggleImageStatusAPI: "info/association-images/toggle_status/",
      deleteImageAPI: "info/association-images/delete_image/",
      title: "介紹管理 - 修改紀錄",
      img_url: "association-images",
    },
    structure: {
      contentAPI: "info/structures/all/",
      imageAPI: "info/structure-images/query_all_images/",
      createAPI: "info/structures/new/",
      updateContentAPI: "info/structures/change/",
      toggleImageStatusAPI: "info/structure-images/toggle_status/",
      deleteImageAPI: "info/structure-images/delete_image/",
      title: "組織管理 - 修改紀錄",
      img_url: "structure-images",
    },
    us: {
      contentAPI: "info/requirement/all/",
      imageAPI: "info/requirement-images/query_all_images/",
      createAPI: "info/requirement/new/",
      updateContentAPI: "info/requirement/change/",
      toggleImageStatusAPI: "info/requirement-images/toggle_status/",
      deleteImageAPI: "info/requirement-images/delete_image/",
      title: "加入我們 - 修改紀錄",
      img_url: "requirement-images",
    },
  };

  const { contentAPI, imageAPI, createAPI, updateContentAPI, toggleImageStatusAPI, deleteImageAPI, title, img_url } =
    config[pageType] || config["rule"];

  const fetchContentRecords = async () => {
    setLoading(true);
    try {
      const response = await Axios().get(contentAPI);
      setRecords(response.data || []);
    } catch (error) {
      console.error("Error fetching content records:", error);
      toast.error("無法載入內容記錄");
    } finally {
      setLoading(false);
    }
  };

  const fetchImageRecords = async () => {
    setLoading(true);
    try {
      const response = await Axios().get(imageAPI);
      setFormImages(response.data || []);
    } catch (error) {
      console.error("Error fetching image records:", error);
      toast.error("無法載入照片記錄");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "content") fetchContentRecords();
    if (activeTab === "images") fetchImageRecords();
  }, [activeTab, pageType]);

  const handleEditContent = (record) => {
    setCurrentRecord(record);
    setFormDescription(record.description || "");
    setShowContentModal(true);
  };

  const handleAddContent = () => {
    setCurrentRecord(null);
    setFormDescription("");
    setShowContentModal(true);
  };

  const handleSaveContent = async () => {
    if (!formDescription) {
      toast.error("請填寫介紹內容");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        description: formDescription,
        ...(currentRecord ? { id: currentRecord.id } : {}),
      };
      const apiEndpoint = currentRecord ? updateContentAPI : createAPI;
      const method = currentRecord ? "put" : "post";

      await Axios()[method](apiEndpoint, payload);
      setShowContentModal(false);
      fetchContentRecords();
      toast.success(currentRecord ? "內容已更新" : "內容已新增");
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("操作失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoStatus = async (id) => {
    try {
      await Axios().put(toggleImageStatusAPI, { id });
      toast.success("照片狀態已更新");
      fetchImageRecords();
    } catch (error) {
      toast.error("照片狀態更新失敗");
    }
  };

  const handlePhotoDelete = async (id) => {
    if (window.confirm("確定要刪除此照片嗎？")) {
      try {
        await Axios().delete(deleteImageAPI, { data: { id } });
        toast.success("照片已刪除");
        fetchImageRecords();
      } catch (error) {
        toast.error("照片刪除失敗");
      }
    }
  };

  const handleAddPhoto = () => {
    setShowImageModal(true);
  };

  const handleUploadSuccess = (newImage) => {
    setFormImages((prev) => [...prev, newImage]);
  };

  const paginateItems = (items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  const totalContentPages = Math.ceil(records.length / itemsPerPage);
  const totalImagePages = Math.ceil(formImages.length / itemsPerPage);

  // 共用分頁列（深藍 admin 風格分頁）
  const renderPagination = (totalPages) =>
    totalPages > 1 && (
      <div className="flex justify-center mt-6">
        <div className="join shadow-sm">
          <button
            type="button"
            className="join-item btn btn-sm sm:btn-md bg-base-100 border-base-300"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            «
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              type="button"
              className={`join-item btn btn-sm sm:btn-md border-base-300 ${
                index + 1 === currentPage ? "btn-primary" : "bg-base-100"
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            type="button"
            className="join-item btn btn-sm sm:btn-md bg-base-100 border-base-300"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
    );

  // 內容管理表格欄位
  const contentColumns = [
    {
      key: "index",
      header: "#",
      className: "w-16 text-base-content/50",
      render: (_row, i) => (currentPage - 1) * itemsPerPage + i + 1,
    },
    {
      key: "created_at",
      header: "建立時間",
      render: (row) =>
        new Date(row.created_at).toLocaleString("zh-TW", {
          timeZone: "Asia/Taipei",
        }),
    },
    {
      key: "actions",
      header: "操作",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => handleEditContent(row)}>
            <BsPencil className="mr-1" /> 編輯
          </Button>
        </div>
      ),
    },
  ];

  // 照片管理表格欄位
  const imageColumns = [
    {
      key: "index",
      header: "#",
      className: "w-16 text-base-content/50",
      hideOnMobile: true,
      render: (_row, i) => (currentPage - 1) * itemsPerPage + i + 1,
    },
    {
      key: "file",
      header: "照片預覽",
      render: (row) => (
        <img
          src={`${row.file}`}
          alt="preview"
          className="h-16 w-24 rounded-lg border border-base-300 object-cover"
        />
      ),
    },
    {
      key: "is_active",
      header: "狀態",
      render: (row) => (
        <Badge variant={row.is_active ? "success" : "neutral"}>
          {row.is_active ? "啟用" : "停用"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "操作",
      className: "text-right",
      render: (row) => (
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant={row.is_active ? "outline" : "success"}
            size="sm"
            onClick={() => handlePhotoStatus(row.id)}
          >
            {row.is_active ? <BsPause className="mr-1" /> : <BsPlay className="mr-1" />}
            {row.is_active ? "停用" : "啟用"}
          </Button>
          <Button variant="error" size="sm" onClick={() => handlePhotoDelete(row.id)}>
            <BsTrash className="mr-1" /> 刪除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title={`${title}管理`}
        subtitle="管理介紹內容與相關照片"
        icon={<FileText size={22} />}
        actions={
          <Button
            variant="primary"
            onClick={activeTab === "content" ? handleAddContent : handleAddPhoto}
          >
            <BsPlusLg className="mr-2" />
            {activeTab === "content" ? "新增紀錄" : "新增照片"}
          </Button>
        }
      />

      {/* 分頁切換（segmented 風格） */}
      <div className="mb-5 inline-flex w-full gap-1 rounded-xl bg-base-200/70 p-1 sm:w-auto">
        <button
          type="button"
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:flex-none ${
            activeTab === "content"
              ? "bg-base-100 text-primary shadow-sm"
              : "text-base-content/60 hover:text-base-content"
          }`}
          onClick={() => {
            setActiveTab("content");
            setCurrentPage(1); // 切換 Tab 時重置頁碼
          }}
        >
          <FileEdit size={16} />
          內容管理
        </button>
        <button
          type="button"
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:flex-none ${
            activeTab === "images"
              ? "bg-base-100 text-primary shadow-sm"
              : "text-base-content/60 hover:text-base-content"
          }`}
          onClick={() => {
            setActiveTab("images");
            setCurrentPage(1); // 切換 Tab 時重置頁碼
          }}
        >
          <ImageIcon size={16} />
          照片管理
        </button>
      </div>

      {activeTab === "content" && (
        <>
          <DataTable
            columns={contentColumns}
            data={paginateItems(records)}
            rowKey={(row) => row.id}
            loading={loading}
            empty={<EmptyState title="尚無內容紀錄" description="點擊右上角「新增紀錄」開始建立。" />}
          />
          {!loading && renderPagination(totalContentPages)}
        </>
      )}

      {activeTab === "images" && (
        <>
          <DataTable
            columns={imageColumns}
            data={paginateItems(formImages)}
            rowKey={(row) => row.id}
            loading={loading}
            empty={<EmptyState title="尚無照片" description="點擊右上角「新增照片」上傳。" />}
          />
          {!loading && renderPagination(totalImagePages)}
        </>
      )}

      <AppModal
        show={showContentModal}
        onHide={() => setShowContentModal(false)}
        title={currentRecord ? "編輯內容" : "新增內容"}
        size="lg"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setShowContentModal(false)}
              disabled={loading}
              style={rwd.getButtonStyle()}
            >
              <BsXLg /> 取消
            </Button>
            <Button variant="primary" onClick={handleSaveContent} loading={loading} disabled={loading} style={rwd.getButtonStyle()}>
              <BsSave />{" "}
              {currentRecord ? "保存" : "新增"}
            </Button>
          </>
        }
      >
        <div className="w-full">
          <label className="mb-2 block text-sm font-medium text-base-content">
            介紹內容 <span className="text-error">*</span>
          </label>
          <ReactQuill
            value={formDescription}
            onChange={setFormDescription}
            placeholder="輸入內容描述..."
            modules={{
              toolbar: rwd.isMobile ? [
                [{ header: [1, 2, false] }],
                ["bold", "italic"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["clean"],
              ] : [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
            }}
            className="shadow-sm"
            style={rwd.isMobile ? { height: '200px' } : {}}
          />
        </div>
      </AppModal>

      <UploadImageModal
        show={showImageModal}
        onClose={() => setShowImageModal(false)}
        onUploadSuccess={handleUploadSuccess}
        page_type={img_url}
      />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default InfoManager;
