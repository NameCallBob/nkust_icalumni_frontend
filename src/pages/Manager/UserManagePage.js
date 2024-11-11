import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import UserFilter from 'components/Manage/UserManage/UserFilter';
import UserTable from 'components/Manage/UserManage/UserTable';
import NewUserModal from 'components/Manage/UserManage/NewUserModal';
import ChangePasswordModal from 'components/Manage/UserManage/PasswordUpdateModal';
import Axios from 'common/Axios';
import LoadingSpinner from 'components/LoadingSpinner';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
/**
 * 使用者管理元件
 * @returns
 */
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    gender: '',
    search: '',
    position: '',
    is_paid: '',
    is_active: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isComplex, setIsComplex] = useState(false);
  const [userId, setUserId] = useState(null); 
  const [loading, setLoading] = useState(false);

  const handleEdit = (id) => {
    setUserId(id);
    handleShowModal(true);
  };
  const handlePassword = (id) => {
    setUserId(id);
    setShowPasswordModal(true);
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => value !== '')
      );
      const res = await Axios().get("/member/search/", { params: cleanFilters });
      setUsers(res.data.results);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAxiosError = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      let errorDetails = "";
  
      // 計算錯誤訊息數量
      const countErrors = (obj) =>
        Object.values(obj).reduce((sum, val) => {
          if (Array.isArray(val)) return sum + val.length; // 如果是陣列，累加長度
          if (typeof val === "object" && val !== null) return sum + countErrors(val); // 如果是物件，遞迴計算
          if (typeof val === "string") return sum + 1; // 如果是字串，計算為 1 條錯誤
          return sum;
        }, 0);
  
      // 提取錯誤訊息（新增對字串型別的支援）
      const extractErrors = (obj) =>
        Object.entries(obj)
          .flatMap(([key, val]) => {
            if (Array.isArray(val)) return val.map((message) => `${key}: ${message}`);
            if (typeof val === "object" && val !== null) return extractErrors(val);
            if (typeof val === "string") return `${key}: ${val}`;
            return [];
          })
          .join("\n");
  
      // 計算錯誤訊息數量
      const errorCount = data && typeof data === "object" ? countErrors(data) : 0;
  
      // 提取少量錯誤詳細資訊
      if (errorCount > 0 && errorCount <= 3) {
        errorDetails = extractErrors(data);
      }
  
      // 根據 HTTP 狀態碼處理
      switch (status) {
        case 400:
          toast.error(
            errorDetails || "請求錯誤，請檢查輸入的資料"
          );
          break;
        case 401:
          toast.error("未授權，請重新登入");
          break;
        case 403:
          toast.error("無權限執行此操作");
          break;
        default:
          toast.error(
            errorDetails || "發生未知錯誤，請稍後再試"
          );
      }
    } else {
      toast.error("伺服器無回應，請稍後再試");
    }
  };
  
  
  const handlePaymentStatus = async (id, isPaid) => {
    setLoading(true);
    try {
      await Axios().patch("/member/admin/switch_paid/", { member_id: id });
      toast.success("繳費狀態切換成功");
      fetchUsers();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleActive = async (id, isActive) => {
    setLoading(true);
    try {
      await Axios().patch("/member/admin/switch_active/", { member_id: id });
      toast.success("帳號狀態切換成功");
      fetchUsers();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await Axios().delete("/member/admin/delete/", { data: { member_id: id } });
      toast.success("刪除成功");
      fetchUsers();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChangePassword = async (password) => {
    setLoading(true);
    try {
      await Axios().patch("/member/admin/update_password/", { member_id: userId, password: password });
      toast.success("密碼修改成功");
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
      setShowPasswordModal(false);
      setUserId(null);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await Axios().get("/member/admin/tableOutput_all/");
      setUsers(res.data);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (id) => {
    setLoading(true);
    try {
      const res = await Axios().get(`/member/admin/getOne/`, {
        params: { "member_id": id }
      });
      return res.data;
    } catch (error) {
      handleAxiosError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setUserId(null);
  };

  const handleShowModal = (complex) => {
    setIsComplex(complex);
    setShowModal(true);
  };

  const handleAddUser = async (complex, info) => {
    setLoading(true);
    try {
      if (complex) {
        if (userId) {
          let tmp_info = info;
          tmp_info['member_id'] = userId;
          await Axios().patch(`/member/admin/partial_change/`, tmp_info);
          toast.success("帳號編輯成功");
        } else {
          await Axios().post("/member/admin/newUser_basic/", info);
          toast.success("複雜帳號新增成功");
        }
      } else {
        await Axios().post("/member/admin/newUser_email/", info);
        toast.success("簡單帳號新增成功");
      }
      fetchUsers();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={3} className="bg-light p-3">
          <UserFilter
            filters={filters}
            setFilters={setFilters}
            applyFilters={applyFilters}
            handleAddUser_easy={() => handleShowModal(false)}
            handleAddUser_complex={() => handleShowModal(true)}
          />
        </Col>

        <Col md={9} className="p-3">
          {loading ? (
            <div className="text-center">
              <LoadingSpinner></LoadingSpinner>
            </div>
          ) : (
            <UserTable
              users={users}
              handleShowModal={handleShowModal}
              handleEdit={handleEdit}
              handlePaymentStatus={handlePaymentStatus}
              handleToggleActive={handleToggleActive}
              handleDelete={handleDelete}
              handlePassword={handlePassword}
            />
          )}
        </Col>
      </Row>

      <NewUserModal
        showModal={showModal}
        handleClose={handleCloseModal}
        isComplex={isComplex}
        userId={userId}
        handleAddUser={handleAddUser}
        fetchUserData={fetchUserData}
      />

      <ChangePasswordModal
        showModal={showPasswordModal}
        handleClose={() => {
          setShowPasswordModal(false); setUserId(null);
        }}
        handleChangePassword={handleChangePassword}
      />
    </Container>
  );
}

export default UserManagement;
