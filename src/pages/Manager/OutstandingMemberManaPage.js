import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Table,
  Form,
  Row,
  Col,
  Pagination,
  Spinner,
  Badge,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Axios from "common/Axios";
import AddOutstandingAlumniModal from "components/Manage/OutstandingMana/OutstandingModal";
import EditOutstandingAlumniModal from "components/Manage/OutstandingMana/EditOutstandingModal";

const OutstandingAlumniPage = () => {
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const alumniPerPage = 5;

  useEffect(() => {
    fetchAlumniList();
  }, []);

  const fetchAlumniList = async () => {
    setLoading(true);
    try {
      const res = await Axios().get("member/outstanding-alumni/");
      setAlumniList(res.data.results);
    } catch (err) {
      toast.error("無法載入資料，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlumni = async (data) => {
    try {
      await Axios().post("member/outstanding-alumni/", data);
      toast.success("新增成功");
      setShowAddModal(false);
      fetchAlumniList();
    } catch (err) {
      console.error("Error adding alumni:", err);
      toast.error("新增失敗，請稍後再試");
    }
  };

  const handleEditAlumni = async (data) => {
    try {
      await Axios().patch(`member/outstanding-alumni/${data.id}/`, data);
      toast.success("更新成功");
      setShowEditModal(false);
      fetchAlumniList();
    } catch (err) {
      console.error("Error editing alumni:", err);
      toast.error("更新失敗，請稍後再試");
    }
  };

  const toggleFeatured = async (alumni) => {
    try {
      await Axios().patch(`/member/outstanding-alumni/${alumni.id}/`, {
        is_featured: !alumni.is_featured,
      });
      toast.success(`已${alumni.is_featured ? "取消" : "設置"}展示於官網`);
      fetchAlumniList();
    } catch (err) {
      console.error("Error toggling featured status:", err);
      toast.error("無法更新展示狀態");
    }
  };

  const handleDeleteAlumni = (id) => {
    if (window.confirm("確定要刪除此傑出系友嗎？")) {
      Axios()
        .delete(`/member/outstanding-alumni/${id}/`)
        .then(() => {
          toast.success("刪除成功");
          fetchAlumniList();
        })
        .catch((err) => {
          console.error("Error deleting alumni:", err);
          toast.error("刪除失敗，請稍後再試");
        });
    }
  };

  const indexOfLastAlumni = currentPage * alumniPerPage;
  const indexOfFirstAlumni = indexOfLastAlumni - alumniPerPage;
  const currentAlumni = alumniList.slice(indexOfFirstAlumni, indexOfLastAlumni);
  const totalPages = Math.ceil(alumniList.length / alumniPerPage);

  return (
    <Container  className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="fw-bold">傑出系友管理-管理傑出系友資料並設置展示狀態</h1>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="rounded-pill px-4"
          >
            <i className="bi bi-plus-lg me-2"></i> 新增傑出系友
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
                <th>名稱</th>
                <th>摘要</th>
                <th className="text-center">展示於官網</th>
                <th className="text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {currentAlumni.map((alumni) => (
                <tr key={alumni.id}>
                  <td>{alumni.name}</td>
                  <td className="text-truncate" style={{ maxWidth: "300px" }}>
                    {alumni.highlight}
                  </td>
                  <td className="text-center">
                    <Form.Check
                      type="switch"
                      checked={alumni.is_featured}
                      onChange={() => toggleFeatured(alumni)}
                      label={
                        <Badge bg={alumni.is_featured ? "success" : "secondary"}>
                          {alumni.is_featured ? "展示中" : "未展示"}
                        </Badge>
                      }
                    />
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setEditData(alumni);
                        setShowEditModal(true);
                      }}
                    >
                      <i className="bi bi-pencil"></i> 編輯
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteAlumni(alumni.id)}
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

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <AddOutstandingAlumniModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddAlumni}
      />

      {editData && (
        <EditOutstandingAlumniModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          data={editData}
          onSubmit={handleEditAlumni}
        />
      )}
    </Container>
  );
};

export default OutstandingAlumniPage;