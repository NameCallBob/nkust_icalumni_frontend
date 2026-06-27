import Axios from "common/Axios";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form, Modal, Spinner, Pagination } from "react-bootstrap";
import { toast } from "react-toastify";
import 'css/manage/private_modal.css'

const AccountManageModal = ({ show, handleClose }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    isActive: false,
    createdAt: "",
    lastLogin: "",
  });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // null, 'save', 'delete', 'toggle', 'password'
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc"); // 排序順序
  const [searchEmail, setSearchEmail] = useState("");

  const isEditMode = Boolean(selectedUserId);

  const fetchUsers = async (url = `basic/private_search/?order_by=${sortOrder === "desc" ? "-last_login" : "last_login"}&search=${searchEmail}`) => {
    setIsLoading(true);
    try {
      // 修正 HTTP 為 HTTPS
      const fixedUrl = url.startsWith("http://") ? url.replace("http://", "https://") : url;
      
      const res = await Axios().get(fixedUrl);
      setUsers(res.data.results || []);
      setNextPageUrl(res.data.next);
      setPrevPageUrl(res.data.previous);
    } catch (error) {
      toast.error("無法取得資料，請稍後再試或確認帳號身分");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async (id) => {
    try {
      const res = await Axios().get(`basic/private/query/` ,{params:{id:id}});
      return res.data;
    } catch (error) {
        toast.error("無法取得資料，請稍後再試或確認帳號身分");
      return null;
    }
  };

  useEffect(() => {
    if (show) fetchUsers();
  }, [show, sortOrder]);

  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        setIsLoading(true);
        const data = await fetchUserData(selectedUserId);
        if (data) {
          setFormData({
            email: data.email,
            isActive: data.is_active,
            createdAt: data.date_joined,
            lastLogin: data.last_login || "尚未登入",
          });
        }
        setIsLoading(false);
      };
      fetchData();
    } else {
      setFormData({
        email: "",
        isActive: false,
        createdAt: new Date().toISOString().split("T")[0],
        lastLogin: "尚未登入",
      });
    }
  }, [selectedUserId, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async () => {
    setActionLoading("save");
    try {
      if (isEditMode) {
        await Axios().put(`basic/private/update/`, {
          id:selectedUserId,
          email: formData.email,
          is_active: formData.isActive,
        });
      } else {
        alert("如要創建帳號，請到使用者管理頁面用簡單創建")
      }
      toast.success("儲存成功");
      fetchUsers(currentPage, sortOrder);
      handleCloseModal();
    } catch (error) {
      toast.error("儲存失敗");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("確定要刪除嗎？")) return;
    setActionLoading("delete");
    try {
      await Axios().delete(`basic/private/delete/`,{data:{id:id}});
      toast.success("刪除成功")
      fetchUsers(currentPage, sortOrder);
      if (id === selectedUserId) handleCloseModal();
    } catch (error) {
      toast.error("刪除失敗");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePasswordChange = async () => {
    const newPassword = prompt("請輸入新密碼：");
    if (!newPassword) return;
    setActionLoading("password");
    try {
      await Axios().patch(`basic/private/update_password/`, {
        id:selectedUserId,
        password: newPassword,
      });
      toast.success("密碼修改成功");
    } catch (error) {
      toast.error("密碼修改失敗");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    setActionLoading("toggle");
    try {
      await Axios().patch(`basic/private/toggle-active/` ,{id:id});
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, is_active: !isActive } : user
        )
      );
      toast.success("狀態切換成功");
    } catch (error) {
        toast.error("狀態切換失敗");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
    handleClose();
  };

  const handleSortChange = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const formatDate = (isoString) => {
    if (!isoString) return "未知日期";
    const date = new Date(isoString);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal show={show} onHide={handleCloseModal} size="xl" dialogClassName="modal-dialog-scrollable">
      <Modal.Header closeButton>
        <Modal.Title>使用者管理</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form className="d-flex mb-3">
              <Form.Control
                type="text"
                placeholder="輸入 Email 進行搜尋"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
              <Button variant="primary" className="ms-2" onClick={handleSearch}>搜尋</Button>
            </Form>
        <Row>
          {/* 左側表格 */}
          <Col md={7} className="mb-3">
            {isLoading ? (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <>
                <Button variant="link" className="mb-2" onClick={handleSortChange}>
                排列最近登入時間
                {sortOrder === "desc" ? (
                    <i className="bi bi-arrow-down"></i>
                ) : (
                    <i className="bi bi-arrow-up"></i>
                )}
                </Button>
                <Table striped bordered hover responsive="sm">
            <thead>
              <tr>
                <th>Email</th>
                <th>啟用狀態</th>
                <th>創立時間</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className={user.is_active ? "email-active" : "email-inactive"}>
                    {user.email}
                  </td>
                  <td>{user.is_active ? "啟用" : "停用"}</td>
                  <td>{formatDate(user.date_joined)}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      編輯
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      刪除
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
              <div className="d-flex justify-content-between">
                  <Button variant="secondary" disabled={!prevPageUrl} onClick={() => fetchUsers(prevPageUrl)}>
                    上一頁
                  </Button>
                  <Button variant="secondary" disabled={!nextPageUrl} onClick={() => fetchUsers(nextPageUrl)}>
                    下一頁
                  </Button>
                </div>
              </>
            )}
          </Col>

          {/* 右側功能區 */}
          <Col md={5} className="mb-3">
            <Form>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="輸入 Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="isActive">
                <Form.Check
                  type="checkbox"
                  label="啟用"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="createdAt">
                <Form.Label>創立時間</Form.Label>
                <Form.Control
                  type="text"
                  value={formatDate(formData.createdAt)}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="lastLogin">
                <Form.Label>最近登入</Form.Label>
                <Form.Control
                  type="text"
                  value={formatDate(formData.lastLogin)}
                  disabled
                  readOnly
                />
              </Form.Group>
              <div className="d-flex justify-content-between">
                {isEditMode && (
                  <>
                    <Button
                      variant="warning"
                      onClick={handlePasswordChange}
                      disabled={actionLoading === "password"}
                    >
                      {actionLoading === "password" ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "更改密碼"
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleToggleActive(selectedUserId, formData.isActive)}
                      disabled={actionLoading === "toggle"}
                    >
                      {actionLoading === "toggle" ? (
                        <Spinner animation="border" size="sm" />
                      ) : formData.isActive ? (
                        "停用"
                      ) : (
                        "啟用"
                      )}
                    </Button>
                  </>
                )}
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={actionLoading === "save"}
                >
                  {actionLoading === "save" ? (
                    <Spinner animation="border" size="sm" />
                  ) : isEditMode ? (
                    "儲存變更"
                  ) : (
                    "新增"
                  )}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default AccountManageModal;
