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
} from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { useLocation, useSearchParams } from "react-router-dom";

const InfoManager = () => {
  const [activeTab, setActiveTab] = useState("content");
  const [records, setRecords] = useState([]);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formDescription, setFormDescription] = useState("");
  const [showContentModal, setShowContentModal] = useState(false);
  const [formImages, setFormImages] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const pageType = searchParams.get("type") || "rule";

  // 根據頁面類型設置 API 路徑和標題
  const config = {
    'rule': {
      contentAPI: "info/associations/all/",
      imageAPI: "info/association-images/query_all_images/",
      createAPI:"info/associations/new/",
      updateContentAPI: "info/associations/change/",
      toggleImageStatusAPI: "info/association-images/toggle_status/",
      deleteImageAPI: "info/association-images/delete_image/",
      title: "章程管理_修改紀錄",
      img_url:'association-images',
    },
    'structure': {
      contentAPI: "info/structures/all/",
      imageAPI: "info/structure-images/query_all_images/",
      createAPI:"info/structures/new/",
      updateContentAPI: "info/structures/change/",
      toggleImageStatusAPI: "info/structure-images/toggle_status/",
      deleteImageAPI: "info/structure-images/delete_image/",      
      title: "組織管理_修改紀錄",
      img_url:'structure-images',    
    },
    'us': {
      contentAPI: "info/requirement/all/",
      imageAPI: "info/requirement-images/query_all_images/",
      createAPI:"info/requirement/new/",
      updateContentAPI: "info/requirement/change/",
      toggleImageStatusAPI: "info/requirement-images/toggle_status/",
      deleteImageAPI: "info/requirement-images/delete_image/",
      title: "加入我們_修改紀錄",
      img_url:'requirement-images',
    },
  };
  
  const { contentAPI, imageAPI, updateContentAPI, toggleImageStatusAPI, deleteImageAPI, title } = config[pageType] || config["rule"];
  // 請求內容記錄
  const fetchContentRecords = async () => {
    try {
      const response = await Axios().get(contentAPI);
      setRecords(response.data || []);
    } catch (error) {
      console.error("Error fetching content records:", error);
    }
  };

  // 請求照片記錄
  const fetchImageRecords = async () => {
    try {
      const response = await Axios().get(imageAPI);
      setFormImages(response.data || []);
    } catch (error) {
      console.error("Error fetching image records:", error);
    }
  };
  // 初始化資料
  useEffect(() => {
    if (activeTab === "content") fetchContentRecords();
    if (activeTab === "images") fetchImageRecords();
  }, [activeTab]);

  // 請求內容記錄
 // 編輯內容
 const handleEditContent = (record) => {
  setCurrentRecord(record);
  setFormDescription(record.description || "");
  setShowContentModal(true);
};

// 新增處理函數
const handleAddContent = () => {
  setCurrentRecord(null); // 清空當前紀錄，表示新增
  setFormDescription(""); // 初始化表單內容
  setShowContentModal(true); // 打開 Modal
};

// 保存新增或編輯的內容
const handleSaveContent = async () => {
  try {
    const payload = {
      description: formDescription,
      ...(currentRecord ? { id: currentRecord.id } : {}), // 若為編輯則傳遞 ID
    };
    const apiEndpoint = currentRecord ? updateContentAPI : config[pageType].createAPI;
    const method = currentRecord ? "put" : "post";

    await Axios()[method](apiEndpoint, payload);

    setShowContentModal(false);
    fetchContentRecords();
    toast.success(currentRecord ? "內容已保存！" : "新增內容成功！");
  } catch (error) {
    console.error("Error saving content:", error);
    toast.error("操作失敗，請稍後再試！");
  }
};

// 照片狀態切換
const handlePhotoStatus = (id) => {
  Axios()
    .put(toggleImageStatusAPI, { id })
    .then(() => {
      toast.success("照片狀態已更新");
      fetchImageRecords();
    })
    .catch(() => {
      toast.error("照片更新失敗");
    });
};

// 刪除照片
const handlePhotoDelete = (id) => {
  Axios()
    .delete(deleteImageAPI, { data: { id } })
    .then(() => {
      toast.success("照片刪除成功");
      fetchImageRecords();
    })
    .catch(() => {
      toast.error("照片刪除失敗，請洽管理員");
    });
};

// 開啟新增照片 Modal
const handleAddPhoto = () => {
  setShowImageModal(true);
};

// 新增照片成功後回調
const handleUploadSuccess = (newImage) => {
  setFormImages((prevImages) => [...prevImages, newImage]);
};
  return (
    <Container>
      <Row className="mt-4 my-3">
        <Col xs={12}>
          <h3>{title}</h3>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            {/* 內容管理 */}
            <Tab eventKey="content" title="內容管理">

            <Button
                variant="primary"
                className="mb-3"
                onClick={handleAddContent}
              >
                新增紀錄
            </Button>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>名稱</th>
                    <th>建立時間</th>
                    <th>功能</th>
                  </tr>
                </thead>
                <tbody>
                {records.map((record, index) => {
                // 使用 JavaScript 的 Date 進行格式化
                const createdAt = new Date(record.created_at).toLocaleString("zh-TW", {
                  timeZone: "Asia/Taipei", // 設定為台北時區
                  year: "numeric",        // 顯示完整年份
                  month: "2-digit",       // 兩位數的月份
                  day: "2-digit",         // 兩位數的日期
                  hour: "2-digit",        // 兩位數的小時
                  minute: "2-digit",      // 兩位數的分鐘
                  second: "2-digit",      // 兩位數的秒數
                });

                return (
                  <tr key={record.id}>
                    <td>{index + 1}</td>
                    <td>{record.name}</td>
                    <td>{createdAt}</td> {/* 顯示格式化的時間 */}
                    <td>
                      <Button
                        variant="warning"
                        className="me-2"
                        onClick={() => handleEditContent(record)}
                      >
                        編輯
                      </Button>
                    </td>
                  </tr>
                );
              })}
                </tbody>
              </Table>

              {/* 編輯或新增內容 Modal */}
              <Modal
                show={showContentModal}
                onHide={() => setShowContentModal(false)}
                size="lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title>{currentRecord ? "編輯內容" : "新增內容"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group controlId="formDescription">
                    <Form.Label>介紹內容</Form.Label>
                    <ReactQuill
                      value={formDescription}
                      onChange={setFormDescription}
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowContentModal(false)}
                  >
                    取消
                  </Button>
                  <Button variant="primary" onClick={handleSaveContent}>
                    {currentRecord ? "保存內容" : "新增內容"}
                  </Button>
                </Modal.Footer>
              </Modal>
            </Tab>

            {/* 照片管理 */}
            <Tab eventKey="images" title="照片管理">
              <Button
                variant="primary"
                className="mb-3"
                onClick={handleAddPhoto}
              >
                新增照片
              </Button>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>照片預覽</th>
                    <th>狀態</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {formImages.map((image, index) => (
                    <tr key={image.id}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={image.file}
                          alt="uploaded"
                          style={{ width: "100px" }}
                        />
                      </td>
                      <td>{image.is_active ? "啟用" : "停用"}</td>
                      <td>
                        <Button
                          variant="info"
                          className="me-2"
                          // 預留切換狀態的串接
                          onClick={() => handlePhotoStatus(image.id)}
                        >
                          {image.is_active ? "停用" : "啟用"}
                        </Button>
                        <Button
                          variant="danger"
                          // 預留刪除功能串接
                          onClick={() => handlePhotoDelete(image.id)}
                        >
                          刪除
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

                  {/* 新增照片 Modal */}
                <UploadImageModal
                  show={showImageModal}
                  onClose={() => setShowImageModal(false)}
                  onUploadSuccess={handleUploadSuccess}
                  page_type={config[pageType]['img_url']}
                />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default InfoManager;
