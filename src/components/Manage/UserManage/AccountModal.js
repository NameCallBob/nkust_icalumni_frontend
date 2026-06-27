import Axios from "common/Axios";
import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { toast } from "react-toastify";
import AppModal from "components/common/AppModal";
import { Button, Field, Spinner } from "components/common/ui";
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
    <AppModal
      show={show}
      onHide={handleCloseModal}
      size="xl"
      variant="admin"
      title="使用者管理"
      icon={<Users size={18} />}
    >
      {/* 搜尋列 */}
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="輸入 Email 進行搜尋"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <Button variant="primary" onClick={handleSearch}>搜尋</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* 左側表格 */}
        <div className="md:col-span-7 mb-4">
          {isLoading ? (
            <div className="text-center">
              <Spinner center label="Loading..." />
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="mb-2" onClick={handleSortChange}>
                排列最近登入時間
                {sortOrder === "desc" ? (
                    <i className="bi bi-arrow-down"></i>
                ) : (
                    <i className="bi bi-arrow-up"></i>
                )}
              </Button>
              <div className="overflow-x-auto">
                <table className="table table-zebra table-sm">
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
                          <button
                            type="button"
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => setSelectedUserId(user.id)}
                          >
                            編輯
                          </button>
                          <Button
                            variant="error"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            刪除
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between">
                <Button variant="secondary" disabled={!prevPageUrl} onClick={() => fetchUsers(prevPageUrl)}>
                  上一頁
                </Button>
                <Button variant="secondary" disabled={!nextPageUrl} onClick={() => fetchUsers(nextPageUrl)}>
                  下一頁
                </Button>
              </div>
            </>
          )}
        </div>

        {/* 右側功能區 */}
        <div className="md:col-span-5 mb-4">
          <div>
            <Field
              as="input"
              label="Email"
              type="email"
              placeholder="輸入 Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {/* 啟用 checkbox */}
            <div className="form-control mb-4">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span className="label-text">啟用</span>
              </label>
            </div>
            <Field
              as="input"
              label="創立時間"
              type="text"
              value={formatDate(formData.createdAt)}
              disabled
              readOnly
            />
            <Field
              as="input"
              label="最近登入"
              type="text"
              value={formatDate(formData.lastLogin)}
              disabled
              readOnly
            />
            <div className="flex justify-between">
              {isEditMode && (
                <>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={handlePasswordChange}
                    disabled={actionLoading === "password"}
                  >
                    {actionLoading === "password" ? (
                      <Spinner size="sm" />
                    ) : (
                      "更改密碼"
                    )}
                  </button>
                  <Button
                    variant="secondary"
                    onClick={() => handleToggleActive(selectedUserId, formData.isActive)}
                    disabled={actionLoading === "toggle"}
                  >
                    {actionLoading === "toggle" ? (
                      <Spinner size="sm" />
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
                  <Spinner size="sm" />
                ) : isEditMode ? (
                  "儲存變更"
                ) : (
                  "新增"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppModal>
  );
};

export default AccountManageModal;
