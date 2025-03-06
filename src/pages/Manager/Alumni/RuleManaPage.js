import Axios from "common/Axios";
import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Spinner,
  Pagination,
  Badge,
} from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RuleManaPage = () => {
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

  return (
    <Container  className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="fw-bold">章程管理-管理章程資料與相關 PDF 文件</h1>
          <p className="text-muted"></p>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => handleShow()}
            className="rounded-pill px-4"
          >
            <i className="bi bi-plus-lg me-2"></i> 新增章程
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">載入中...</p>
        </div>
      ) : (
        <>
          <Table hover responsive className="shadow-sm">
            <thead className="bg-light">
              <tr>
                <th>流水號</th>
                <th>更新日期</th>
                <th className="text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {currentRules.map((rule) => (
                <tr key={rule.id}>
                  <td>{rule.id}</td>
                  <td>{new Date(rule.updated_at).toLocaleString()}</td>
                  <td className="text-center">
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleView(rule)}
                    >
                      <i className="bi bi-eye"></i> 查看
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShow(rule)}
                    >
                      <i className="bi bi-pencil"></i> 編輯
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(rule.id)}
                    >
                      <i className="bi bi-trash"></i> 刪除
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-4">
              <Pagination.Prev
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          )}
        </>
      )}

      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "編輯章程" : "新增章程"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                章程簡介 <span className="text-danger">*</span>
              </Form.Label>
              <ReactQuill
                value={currentRule.intro}
                onChange={(value) => setCurrentRule((prev) => ({ ...prev, intro: value }))}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link"],
                    ["clean"],
                  ],
                }}
                placeholder="請輸入章程簡介"
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>上傳 PDF（上限 5MB）</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={loading}
              />
              {currentRule.file && (
                <Badge bg="success" className="mt-2">
                  已選擇: {currentRule.file.name}
                </Badge>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose} disabled={loading}>
            <i className="bi bi-x-lg"></i> 取消
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !currentRule.intro}
          >
            {loading ? (
              <Spinner size="sm" />
            ) : (
              <i className="bi bi-check2"></i>
            )}{" "}
            {isEditing ? "更新" : "新增"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewModal} onHide={handleCloseViewModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>查看章程</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="mb-3 p-3 bg-light rounded"
            dangerouslySetInnerHTML={{ __html: viewRule?.intro }}
          />
          {viewRule?.pdf_file && (
            <div>
              <h5>PDF 文件</h5>
              <embed
                src={`${process.env.REACT_APP_BASE_URL}${viewRule.pdf_file}`}
                type="application/pdf"
                width="100%"
                height="500px"
                className="rounded"
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCloseViewModal}>
            <i className="bi bi-x-lg"></i> 關閉
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Container>
  );
};

export default RuleManaPage;