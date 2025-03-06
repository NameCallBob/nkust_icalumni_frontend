import Axios from "common/Axios";
import UploadImageModal from "components/Manage/Info/InfoPicModal";
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Tabs,
  Tab,
  Pagination,
  Spinner,
  Badge,
} from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const InfoManager = () => {
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

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h3 className="fw-bold">{title}管理內容與相關照片</h3>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            className="rounded-pill px-4"
            onClick={activeTab === "content" ? handleAddContent : handleAddPhoto}
          >
            <i className="bi bi-plus-lg me-2"></i>
            {activeTab === "content" ? "新增紀錄" : "新增照片"}
          </Button>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => {
          setActiveTab(k);
          setCurrentPage(1); // 切換 Tab 時重置頁碼
        }}
        className="mb-4"
      >
        <Tab eventKey="content" title="內容管理">
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
                    <th>#</th>
                    <th>建立時間</th>
                    <th className="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginateItems(records).map((record, index) => (
                    <tr key={record.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        {new Date(record.created_at).toLocaleString("zh-TW", {
                          timeZone: "Asia/Taipei",
                        })}
                      </td>
                      <td className="text-center">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditContent(record)}
                        >
                          <i className="bi bi-pencil"></i> 編輯
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {totalContentPages > 1 && (
                <Pagination className="justify-content-center mt-4">
                  <Pagination.Prev
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalContentPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalContentPages))
                    }
                    disabled={currentPage === totalContentPages}
                  />
                </Pagination>
              )}
            </>
          )}
        </Tab>

        <Tab eventKey="images" title="照片管理">
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
                    <th>#</th>
                    <th>照片預覽</th>
                    <th>狀態</th>
                    <th className="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginateItems(formImages).map((image, index) => (
                    <tr key={image.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        <img
                          src={`${image.file}`} // 假設後端返回完整 URL
                          alt="preview"
                          style={{ maxWidth: "100px", borderRadius: "5px" }}
                        />
                      </td>
                      <td>
                        <Badge bg={image.is_active ? "success" : "secondary"}>
                          {image.is_active ? "啟用" : "停用"}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Button
                          variant={image.is_active ? "outline-warning" : "outline-success"}
                          size="sm"
                          className="me-2"
                          onClick={() => handlePhotoStatus(image.id)}
                        >
                          <i
                            className={`bi ${image.is_active ? "bi-pause" : "bi-play"}`}
                          ></i>{" "}
                          {image.is_active ? "停用" : "啟用"}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handlePhotoDelete(image.id)}
                        >
                          <i className="bi bi-trash"></i> 刪除
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {totalImagePages > 1 && (
                <Pagination className="justify-content-center mt-4">
                  <Pagination.Prev
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalImagePages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalImagePages))
                    }
                    disabled={currentPage === totalImagePages}
                  />
                </Pagination>
              )}
            </>
          )}
        </Tab>
      </Tabs>

      <Modal show={showContentModal} onHide={() => setShowContentModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentRecord ? "編輯內容" : "新增內容"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label>
                介紹內容 <span className="text-danger">*</span>
              </Form.Label>
              <ReactQuill
                value={formDescription}
                onChange={setFormDescription}
                placeholder="輸入內容描述..."
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
                className="shadow-sm"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowContentModal(false)}
            disabled={loading}
          >
            <i className="bi bi-x-lg"></i> 取消
          </Button>
          <Button variant="primary" onClick={handleSaveContent} disabled={loading}>
            {loading ? (
              <Spinner size="sm" />
            ) : (
              <i className="bi bi-save"></i>
            )}{" "}
            {currentRecord ? "保存" : "新增"}
          </Button>
        </Modal.Footer>
      </Modal>

      <UploadImageModal
        show={showImageModal}
        onClose={() => setShowImageModal(false)}
        onUploadSuccess={handleUploadSuccess}
        page_type={img_url}
      />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Container>
  );
};

export default InfoManager;