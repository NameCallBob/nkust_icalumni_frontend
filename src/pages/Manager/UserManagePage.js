import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import UserFilter from 'components/Manage/UserManage/UserFilter';
import UserTable from 'components/Manage/UserManage/UserTable';
import NewUserModal from 'components/Manage/UserManage/NewUserModal';
import Axios from 'common/Axios';

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
  const [isComplex, setIsComplex] = useState(false);
  const [userId, setUserId] = useState(null); // 用來識別編輯的使用者ID
  const [loading, setLoading] = useState(false); // loading狀態

  const handleEdit = (id) => {
    setUserId(id);
    handleShowModal(true); // 打開複雜帳號的編輯模式
  };

  const applyFilters = async () => {
    setLoading(true); // 開始loading
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => value !== '')
      );
      const res = await Axios().get("/member/search/", { params: cleanFilters });
      setUsers(res.data.results);
    } catch (error) {
      alert("篩選失敗，請稍後再試");
    } finally {
      setLoading(false); // 結束loading
    }
  };

  /**
   * 切換繳費狀態
   * @param {*} id
   * @param {*} isPaid
   */
  const handlePaymentStatus = async (id, isPaid) => {
    setLoading(true);
    try {
      await Axios().patch("/member/admin/switch_paid/", { member_id: id });
      alert("繳費狀態切換成功");
      fetchUsers(); // 重新載入使用者
    } catch (error) {
      alert("切換繳費狀態失敗");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 切換帳號啟用狀態
   * @param {*} id
   * @param {*} isActive
   */
  const handleToggleActive = async (id, isActive) => {
    setLoading(true);
    try {
      await Axios().patch("/member/admin/switch_active/", { member_id: id });
      alert("帳號狀態切換成功");
      fetchUsers(); // 重新載入使用者
    } catch (error) {
      alert("切換帳號狀態失敗");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 刪除使用者
   * @param {*} id
   */
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await Axios().delete("/member/admin/delete/", { data: { member_id: id } });
      alert("刪除成功");
      fetchUsers(); // 重新載入使用者
    } catch (error) {
      alert("刪除失敗");
    } finally {
      setLoading(false);
    }
  };

  // 從後端獲取所有使用者
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await Axios().get("/member/admin/tableOutput_all/");
      setUsers(res.data);
    } catch (error) {
      alert("載入使用者失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  // 從後端獲取單個使用者的資料，用於編輯模式
  const fetchUserData = async (id) => {
    setLoading(true);
    try {
      const res = await Axios().get(`/member/admin/getOne/`,{
        params:{"member_id":id}});
      return res.data;
    } catch (error) {
      alert("載入使用者資料失敗");
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
    setUserId(null); // 清空編輯狀態
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
          await Axios().patch(`/member/admin/${userId}/`, info);
          alert("帳號編輯成功");
        } else {
          await Axios().post("/member/admin/newUser_basic/", info);
          alert("複雜帳號新增成功");
        }
      } else {
        await Axios().post("/member/admin/newUser_email/", info);
        alert("簡單帳號新增成功");
      }
      fetchUsers(); // 新增或編輯後重新載入使用者
    } catch (error) {
      alert("操作失敗，請檢查輸入資訊");
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
              <p>資料載入中...</p>
              {/* 你可以在這裡加上動畫 */}
            </div>
          ) : (
            <UserTable
              users={users}
              handleShowModal={handleShowModal}
              handleEdit={handleEdit}
              handlePaymentStatus={handlePaymentStatus}
              handleToggleActive={handleToggleActive}
              handleDelete={handleDelete}
            />
          )}
        </Col>
      </Row>

      <NewUserModal
        showModal={showModal}
        handleClose={handleCloseModal}
        isComplex={isComplex}
        userId={userId} // 傳遞 userId 來處理編輯模式
        handleAddUser={handleAddUser}
        fetchUserData={fetchUserData} // 用於取得使用者資料
      />
    </Container>
  );
}

export default UserManagement;
