import Axios from "common/Axios";
import React, { useState, useEffect } from "react";
import useRWD from 'hooks/useRWD';
import AppModal from "components/common/AppModal";
import { Button, Spinner, PageHeader, Toolbar, DataTable, Card } from "components/common/ui";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  BsPlusLg,
  BsEye,
  BsPencil,
  BsTrash,
  BsFileEarmarkText,
  BsXLg,
  BsCheck2,
} from "react-icons/bs";
import { ScrollText } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RuleManaPage = () => {
  const rwd = useRWD();
  const [rules, setRules] = useState([]);
  const [viewRule, setViewRule] = useState(null);
  const [currentRule, setCurrentRule] = useState({
    id: null,
    date: "",
    intro: "",
    file: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rulesPerPage = 5;

  useEffect(() => {
    fetchRules();
    return () => cleanupFileUrls();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await Axios().get("/info/constitutions/all/");
      setRules(res.data);
    } catch (error) {
      console.error("載入章程失敗:", error);
      toast.error("無法載入章程資料");
    } finally {
      setLoading(false);
    }
  };

  const cleanupFileUrls = () => {
    rules.forEach((rule) => {
      if (rule.pdf_file) URL.revokeObjectURL(rule.pdf_file);
    });
  };

  const handleShow = (rule = null) => {
    if (rule) {
      setCurrentRule({ ...rule, file: null });
      setIsEditing(true);
    } else {
      setCurrentRule({ id: null, date: "", intro: "", file: null });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentRule({ id: null, date: "", intro: "", file: null });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("請上傳 PDF 檔案");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("檔案大小不得超過 5MB");
        return;
      }
      setCurrentRule((prev) => ({ ...prev, file }));
    }
  };

  const handleSubmit = async () => {
    if (!currentRule.intro) {
      toast.error("請填寫章程簡介");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("description", currentRule.intro);
      if (currentRule.file) formData.append("pdf_file", currentRule.file);

      if (isEditing) {
        const originalRule = rules.find((r) => r.id === currentRule.id);
        const isUpdated =
          originalRule.intro !== currentRule.intro || currentRule.file;
        if (!isUpdated) {
          toast.info("未檢測到任何變更");
          return;
        }
        formData.append("id", currentRule.id);
        await Axios().put(`/info/constitutions/change/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setRules((prev) =>
          prev.map((r) =>
            r.id === currentRule.id
              ? { ...r, intro: currentRule.intro, updated_at: new Date().toISOString() }
              : r
          )
        );
        toast.success("章程更新成功");
      } else {
        const response = await Axios().post("/info/constitutions/new/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setRules((prev) => [
          { ...response.data, updated_at: new Date().toISOString() },
          ...prev,
        ]);
        toast.success("章程新增成功");
      }
      handleClose();
    } catch (error) {
      console.error("提交失敗:", error);
      toast.error("提交失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("確定要刪除此章程嗎？")) {
      try {
        await Axios().delete(`/info/constitutions/remove/`, { data: { id } });
        setRules((prev) => prev.filter((r) => r.id !== id));
        toast.success("章程刪除成功");
      } catch (error) {
        console.error("刪除失敗:", error);
        toast.error("刪除失敗，請稍後再試");
      }
    }
  };

  const handleView = (rule) => {
    setViewRule(rule);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewRule(null);
  };

  const indexOfLastRule = currentPage * rulesPerPage;
  const indexOfFirstRule = indexOfLastRule - rulesPerPage;
  const currentRules = rules.slice(indexOfFirstRule, indexOfLastRule);
  const totalPages = Math.ceil(rules.length / rulesPerPage);

  const columns = [
    {
      key: "id",
      header: "流水號",
      className: "w-28",
      render: (rule) => (
        <span className="font-mono text-sm font-semibold text-base-content/80">
          #{rule.id}
        </span>
      ),
    },
    {
      key: "updated_at",
      header: "更新日期",
      render: (rule) => (
        <span className="text-sm text-base-content/80">
          {new Date(rule.updated_at).toLocaleString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "操作",
      className: "text-right",
      render: (rule) => (
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(rule)}
            style={rwd.getButtonStyle()}
          >
            <BsEye /> 查看
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShow(rule)}
            style={rwd.getButtonStyle()}
          >
            <BsPencil /> 編輯
          </Button>
          <Button
            variant="error"
            size="sm"
            className="btn-outline"
            onClick={() => handleDelete(rule.id)}
            style={rwd.getButtonStyle()}
          >
            <BsTrash /> 刪除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8" style={rwd.getContainerStyle()}>
      <PageHeader
        title="章程管理"
        subtitle="管理章程資料與相關 PDF 文件"
        icon={<ScrollText size={22} />}
      />

      <Toolbar
        right={
          <Button
            variant="primary"
            onClick={() => handleShow()}
            style={rwd.getButtonStyle()}
          >
            <BsPlusLg className="mr-2" /> 新增章程
          </Button>
        }
      />

      <Card padding="md">
        <DataTable
          columns={columns}
          data={currentRules}
          rowKey={(rule) => rule.id}
          loading={loading}
          empty={
            <div className="py-12 text-center text-base-content/50">
              尚無章程資料
            </div>
          }
        />

        {!loading && totalPages > 1 && (
          <div className="join flex justify-center mt-6">
            <button
              className="join-item btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              «
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`join-item btn ${index + 1 === currentPage ? "btn-active btn-primary" : ""}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="join-item btn"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        )}
      </Card>

      <AppModal
        show={showModal}
        onHide={handleClose}
        size="lg"
        variant="admin"
        title={isEditing ? "編輯章程" : "新增章程"}
        icon={<BsFileEarmarkText />}
        footer={
          <>
            <Button variant="ghost" onClick={handleClose} disabled={loading} style={rwd.getButtonStyle()}>
              <BsXLg /> 取消
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading || !currentRule.intro}
              style={rwd.getButtonStyle()}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <BsCheck2 />
              )}{" "}
              {isEditing ? "更新" : "新增"}
            </Button>
          </>
        }
      >
        <div>
          <div className="form-control w-full mb-3">
            <label className="label pb-1">
              <span className="label-text font-medium text-base-content">
                章程簡介 <span className="text-error">*</span>
              </span>
            </label>
            <ReactQuill
              value={currentRule.intro}
              onChange={(value) => setCurrentRule((prev) => ({ ...prev, intro: value }))}
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
                  ["link"],
                  ["clean"],
                ],
              }}
              placeholder="請輸入章程簡介"
              className="shadow-sm"
              style={{ fontSize: rwd.getFontSize('body') }}
            />
          </div>
          <div className="form-control w-full mb-3">
            <label className="label pb-1">
              <span className="label-text font-medium text-base-content">上傳 PDF（上限 5MB）</span>
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={loading}
              className="file-input file-input-bordered w-full"
            />
            {currentRule.file && (
              <span className="badge badge-success mt-2">
                已選擇: {currentRule.file.name}
              </span>
            )}
          </div>
        </div>
      </AppModal>

      <AppModal
        show={showViewModal}
        onHide={handleCloseViewModal}
        size="lg"
        variant="admin"
        title="查看章程"
        icon={<BsEye />}
        footer={
          <Button variant="ghost" onClick={handleCloseViewModal} style={rwd.getButtonStyle()}>
            <BsXLg /> 關閉
          </Button>
        }
      >
        <div
          className="mb-3 p-3 bg-base-200 rounded"
          dangerouslySetInnerHTML={{ __html: viewRule?.intro }}
        />
        {viewRule?.pdf_file && (
          <div>
            <h5 className="text-lg font-semibold mb-2">PDF 文件</h5>
            <embed
              src={`${process.env.REACT_APP_BASE_URL}${viewRule.pdf_file}`}
              type="application/pdf"
              width="100%"
              height="500px"
              className="rounded"
            />
          </div>
        )}
      </AppModal>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default RuleManaPage;
