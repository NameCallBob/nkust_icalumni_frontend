import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Pagination,
} from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const InfoManager = () => {
  // 狀態管理
  const [records, setRecords] = useState([]);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImages, setFormImages] = useState([]);

  // 分頁狀態
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // 計算分頁
  const totalPages = Math.ceil(records.length / recordsPerPage);
  const displayedRecords = records.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // 打開/關閉 Modal
  const handleShowModal = () => {
    clearForm();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 保存紀錄
  const handleSaveRecord = () => {
    if (currentRecord) {
      // 更新紀錄
      const updatedRecords = records.map((record) =>
        record.id === currentRecord.id
          ? { ...record, name: formName, description: formDescription, images: formImages }
          : record
      );
      setRecords(updatedRecords);
    } else {
      // 添加新紀錄
      const newRecord = {
        id: Date.now(),
        name: formName,
        description: formDescription,
        images: formImages,
      };
      setRecords([...records, newRecord]);
    }
    handleCloseModal();
  };

  // 清空表單
  const clearForm = () => {
    setCurrentRecord(null);
    setFormName("");
    setFormDescription("");
    setFormImages([]);
  };

  // 編輯紀錄
  const handleEditRecord = (record) => {
    setCurrentRecord(record);
    setFormName(record.name);
    setFormDescription(record.description);
    setFormImages(record.images || []);
    setShowModal(true);
  };

  // 刪除紀錄
  const handleDeleteRecord = (id) => {
    const filteredRecords = records.filter((record) => record.id !== id);
    setRecords(filteredRecords);
  };

  // 圖片上傳處理
  const handleImageUpload = (event) => {
    const files = event.target.files;
    const uploadedImages = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        uploadedImages.push({ file: reader.result });
        if (i === files.length - 1) setFormImages([...formImages, ...uploadedImages]);
      };
      reader.readAsDataURL(files[i]);
    }
  };

  // 分頁切換
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <Row className="mt-4 my-3">
        {/* 左側紀錄區 */}
        <Col xs={12} md={12}>
          <h3>系友會介紹編輯紀錄</h3>
          <p style={{fontSize:'18pt'}}>
            官網將呈現最近一次新增紀錄
          </p>
          <Button
            variant="primary"
            className="mb-3"
            onClick={handleShowModal}
          >
            新增介紹
          </Button>

          {/* 紀錄表格 */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>建立時間</th>
                <th>編輯時間</th>
                <th>功能區</th>
              </tr>
            </thead>
            <tbody>
              {displayedRecords.map((record, index) => (
                <tr key={record.id}>
                  <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                  <td>{record.created_at}</td>
                  <td>{record.updated_at}</td>
                  <td>
                  <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => handleEditRecord(record)}
                    >
                      編輯
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteRecord(record.id)}
                    >
                      刪除
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* 分頁功能 */}
          <Pagination>
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>

      {/* 新增/編輯紀錄 Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentRecord ? "編輯介紹" : "新增介紹"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* 描述編輯器 */}
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>介紹</Form.Label>
              <ReactQuill
                value={formDescription}
                onChange={setFormDescription}
              />
            </Form.Group>

            {/* 圖片上傳 */}
            <Form.Group className="mb-3" controlId="formImages">
              <Form.Label>上傳照片</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
           取消
          </Button>
          <Button variant="primary" onClick={handleSaveRecord}>
            保存
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default InfoManager;
