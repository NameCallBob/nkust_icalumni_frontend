import React, { useState } from "react";
import { Table, Button, Image, Form, Row, Col } from "react-bootstrap";
import ActionModal from "components/Manage/PicManage/ActionModal";

const PhotoTable = ({ title, photos, onDelete, onEdit, onToggleStatus }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [actionType, setActionType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive

  const handleActionClick = (photo, action) => {
    setSelectedPhoto(photo);
    setActionType(action);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // 根據查詢條件和篩選條件過濾照片
  const filteredPhotos = photos.filter((photo) => {
    const matchesSearchTerm = photo.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && photo.is_active) ||
      (filterStatus === "inactive" && !photo.is_active);
    return matchesSearchTerm && matchesStatus;
  });

  return (
    <>
      <h2>{title}</h2>

      {/* 搜尋和篩選 */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="搜尋照片標題..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
        <Col md={6}>
          <Form.Select value={filterStatus} onChange={handleStatusFilterChange}>
            <option value="all">所有照片</option>
            <option value="active">已上架</option>
            <option value="inactive">未上架</option>
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>照片縮圖</th>
            <th>照片標題</th>
            <th>照片說明</th>
            <th>上傳時間</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredPhotos.map((photo, index) => (
            <tr key={photo.id}>
              <td>{index + 1}</td>
              <td>
                <Image src={photo.image} thumbnail width={100} />
              </td>
              <td>{photo.title}</td>
              <td>{photo.description}</td>
              <td>{new Date(photo.created_at).toLocaleString()}</td>
              <td>
                <Button
                  variant={photo.is_active ? "secondary" : "success"}
                  onClick={() => handleActionClick(photo, "toggleStatus")}
                >
                  {photo.is_active ? "下架" : "上架"}
                </Button>{" "}
                <Button variant="warning" onClick={() => handleActionClick(photo, "edit")}>
                  編輯
                </Button>{" "}
                <Button variant="danger" onClick={() => handleActionClick(photo, "delete")}>
                  刪除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedPhoto && (
        <ActionModal
          actionType={actionType}
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
        />
      )}
    </>
  );
};

export default PhotoTable;