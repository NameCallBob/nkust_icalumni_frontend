import Axios from "common/Axios";
import UploadImageModal from "components/Manage/Info/InfoPicModal";
import React, { useState, useEffect } from "react";
import useRWD from 'hooks/useRWD';
import AppModal from "components/common/AppModal";
import { Button, Spinner } from "components/common/ui";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BsPlusLg, BsPencil, BsPause, BsPlay, BsTrash, BsXLg, BsSave } from "react-icons/bs";
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

  // 共用分頁列（join + join-item btn 取代 react-bootstrap Pagination）
  const renderPagination = (totalPages) =>
    totalPages > 1 && (
      <div className="flex justify-center mt-4">
        <div className="join">
          <button
            type="button"
            className="join-item btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            «
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              type="button"
              className={`join-item btn ${index + 1 === currentPage ? "btn-primary" : ""}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            type="button"
            className="join-item btn"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
    );

  return (
    <div className="admin-container container mx-auto px-4 py-4" style={rwd.getContainerStyle()}>
      <div className="flex items-center mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-xl">{title}管理內容與相關照片</h3>
        </div>
        <div className="text-right">
          <Button
            variant="primary"
            className="rounded-full px-4"
            style={rwd.getButtonStyle()}
            onClick={activeTab === "content" ? handleAddContent : handleAddPhoto}
          >
            <BsPlusLg className="mr-2" />
            {activeTab === "content" ? "新增紀錄" : "新增照片"}
          </Button>
        </div>
      </div>

      {/* Tabs（DaisyUI tabs-bordered 取代 react-bootstrap Tabs） */}
      <div className="tabs tabs-bordered mb-4">
        <button
          type="button"
          className={`tab ${activeTab === "content" ? "tab-active" : ""}`}
          onClick={() => {
            setActiveTab("content");
            setCurrentPage(1); // 切換 Tab 時重置頁碼
          }}
        >
          內容管理
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "images" ? "tab-active" : ""}`}
          onClick={() => {
            setActiveTab("images");
            setCurrentPage(1); // 切換 Tab 時重置頁碼
          }}
        >
          照片管理
        </button>
      </div>

      {activeTab === "content" && (
        <>
          {loading ? (
            <div className="text-center my-5">
              <Spinner center label="載入中..." />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table shadow-sm" style={rwd.getTableStyle()}>
                  <thead className="bg-base-200">
                    <tr>
                      <th>#</th>
                      <th>建立時間</th>
                      <th className="text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginateItems(records).map((record, index) => (
                      <tr key={record.id} className="hover">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>
                          {new Date(record.created_at).toLocaleString("zh-TW", {
                            timeZone: "Asia/Taipei",
                          })}
                        </td>
                        <td className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditContent(record)}
                          >
                            <BsPencil /> 編輯
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination(totalContentPages)}
            </>
          )}
        </>
      )}

      {activeTab === "images" && (
        <>
          {loading ? (
            <div className="text-center my-5">
              <Spinner center label="載入中..." />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table shadow-sm" style={rwd.getTableStyle()}>
                  <thead className="bg-base-200">
                    <tr>
                      <th>#</th>
                      <th>照片預覽</th>
                      <th>狀態</th>
                      <th className="text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginateItems(formImages).map((image, index) => (
                      <tr key={image.id} className="hover">
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>
                          <img
                            src={`${image.file}`} // 假設後端返回完整 URL
                            alt="preview"
                            style={{ maxWidth: "100px", borderRadius: "5px" }}
                          />
                        </td>
                        <td>
                          <span className={`badge ${image.is_active ? "badge-success" : "badge-ghost"}`}>
                            {image.is_active ? "啟用" : "停用"}
                          </span>
                        </td>
                        <td className="text-center">
                          <Button
                            variant={image.is_active ? "outline" : "success"}
                            size="sm"
                            className="mr-2"
                            onClick={() => handlePhotoStatus(image.id)}
                          >
                            {image.is_active ? <BsPause /> : <BsPlay />}{" "}
                            {image.is_active ? "停用" : "啟用"}
                          </Button>
                          <Button
                            variant="error"
                            size="sm"
                            onClick={() => handlePhotoDelete(image.id)}
                          >
                            <BsTrash /> 刪除
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination(totalImagePages)}
            </>
          )}
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
        <div className="form-control w-full mb-3">
          <label className="label pb-1">
            <span className="label-text font-medium text-base-content">
              介紹內容 <span className="text-error">*</span>
            </span>
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
