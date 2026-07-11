import React, { useState, useEffect, useCallback } from 'react';
import { Users } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AdminPage, Card, Spinner } from '@/components/ui';
import { memberService } from '@/services';

import UserFilter from 'components/Manage/UserManage/UserFilter';
import UserTable from 'components/Manage/UserManage/UserTable';
import NewUserModal from 'components/Manage/UserManage/NewUserModal';
import ChangePasswordModal from 'components/Manage/UserManage/PasswordUpdateModal';
import AccountManageModal from 'components/Manage/UserManage/AccountModal';
import UploadExcelModal from 'components/Manage/UserManage/MemberExcelModal';

/**
 * 使用者管理頁面
 * 端點（皆透過 memberService，路徑/method/payload 與原本一致）：
 *  - GET    /member/search/                    memberService.search
 *  - GET    /member/admin/tableOutput_all/     memberService.adminTableAll
 *  - GET    /member/admin/getOne/              memberService.adminGetOne
 *  - POST   /member/admin/newUser_basic/       memberService.adminNewBasic
 *  - POST   /member/admin/newUser_email/       memberService.adminNewEmail
 *  - PATCH  /member/admin/partial_change/      memberService.adminPartialChange
 *  - PATCH  /member/admin/switch_active/       memberService.adminSwitchActive
 *  - PATCH  /member/admin/switch_paid/         memberService.adminSwitchPaid
 *  - PATCH  /member/admin/update_password/     memberService.adminUpdatePassword
 *  - DELETE /member/admin/delete/              memberService.adminDelete
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
  const [showExcelModal, setExcelModal] = useState(false);
  const [showAcModal, setAcModal] = useState(false);
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

  const handleAxiosError = useCallback((error) => {
    if (error.response) {
      const { status, data } = error.response;
      let errorDetails = '';

      // 計算錯誤訊息數量
      const countErrors = (obj) =>
        Object.values(obj).reduce((sum, val) => {
          if (Array.isArray(val)) return sum + val.length;
          if (typeof val === 'object' && val !== null) return sum + countErrors(val);
          if (typeof val === 'string') return sum + 1;
          return sum;
        }, 0);

      // 提取錯誤訊息
      const extractErrors = (obj) =>
        Object.entries(obj)
          .flatMap(([key, val]) => {
            if (Array.isArray(val)) return val.map((message) => `${key}: ${message}`);
            if (typeof val === 'object' && val !== null) return extractErrors(val);
            if (typeof val === 'string') return `${key}: ${val}`;
            return [];
          })
          .join('\n');

      const errorCount = data && typeof data === 'object' ? countErrors(data) : 0;
      if (errorCount > 0 && errorCount <= 3) {
        errorDetails = extractErrors(data);
      }

      switch (status) {
        case 400:
          toast.error(errorDetails || '請求錯誤，請檢查輸入的資料');
          break;
        case 401:
          toast.error('未授權，請重新登入');
          break;
        case 403:
          toast.error('無權限執行此操作');
          break;
        default:
          toast.error(errorDetails || '發生未知錯誤，請稍後再試');
      }
    } else {
      toast.error('伺服器無回應，請稍後再試');
    }
  }, []);

  const applyFilters = async () => {
    setLoading(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '')
      );
      const res = await memberService.search(cleanFilters);
      setUsers(res.data.results);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentStatus = async (id) => {
    setLoading(true);
    try {
      await memberService.adminSwitchPaid({ member_id: id });
      toast.success('繳費狀態切換成功');
      fetchUsers();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    setLoading(true);
    try {
      await memberService.adminSwitchActive({ member_id: id });
      toast.success('帳號狀態切換成功');
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
      await memberService.adminDelete({ member_id: id });
      toast.success('刪除成功');
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
      await memberService.adminUpdatePassword({ member_id: userId, password });
      toast.success('密碼修改成功');
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
      setShowPasswordModal(false);
      setUserId(null);
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await memberService.adminTableAll();
      setUsers(res.data);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  }, [handleAxiosError]);

  const fetchUserData = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await memberService.adminGetOne({ member_id: id });
      return res.data;
    } catch (error) {
      handleAxiosError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleAxiosError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
          const tmp_info = { ...info, member_id: userId };
          await memberService.adminPartialChange(tmp_info);
          toast.success('帳號編輯成功');
        } else {
          await memberService.adminNewBasic(info);
          toast.success('複雜帳號新增成功');
        }
      } else {
        await memberService.adminNewEmail(info);
        toast.success('簡單帳號新增成功');
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
    <AdminPage
      title="使用者管理"
      description="管理校友會帳號、繳費與啟用狀態，並可批次匯入系友資料"
      icon={Users}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-6">
            <UserFilter
              filters={filters}
              setFilters={setFilters}
              applyFilters={applyFilters}
              handleAddUser_easy={() => handleShowModal(false)}
              handleAddUser_complex={() => handleShowModal(true)}
              handleAccountModal={() => setAcModal(true)}
              handleExcelModal={() => setExcelModal(true)}
            />
          </div>
        </aside>

        <section className="lg:col-span-8 xl:col-span-9">
          <Card className="p-4 sm:p-6">
            {loading ? (
              <Spinner center label="載入使用者中" />
            ) : (
              <UserTable
                users={users}
                handleEdit={handleEdit}
                handlePaymentStatus={handlePaymentStatus}
                handleToggleActive={handleToggleActive}
                handleDelete={handleDelete}
                handlePassword={handlePassword}
              />
            )}
          </Card>
        </section>
      </div>

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
          setShowPasswordModal(false);
          setUserId(null);
        }}
        handleChangePassword={handleChangePassword}
      />

      <AccountManageModal show={showAcModal} handleClose={() => setAcModal(false)} />

      <UploadExcelModal show={showExcelModal} handleClose={() => setExcelModal(false)} />
    </AdminPage>
  );
}

export default UserManagement;
