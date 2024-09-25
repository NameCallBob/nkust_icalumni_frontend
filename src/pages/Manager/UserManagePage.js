// UserManagement.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import UserFilter from 'components/Manage/UserManage/UserFilter';
import UserTable from 'components/Manage/UserManage/UserTable';
import EditUserModal from 'components/Manage/UserManage/EditUserModal';

// import axios from 'axios'; // 如果要串接後端，取消註解

function UserManagement() {
  // 狀態管理
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    gender: '',
    school: '',
    position: '',
    is_paid: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // 模擬假資料
// 假資料的完整版本
const fakeUsers = [
  {
    id: 1,
    name: '張三',
    gender: 'M',
    mobile_phone: '0912345678',
    home_phone: '072345678',
    address: '台灣高雄市',
    position: { title: '會長' },
    graduate: { school: '國立高雄科技大學' },
    email: 'zhangsan@gmail.com',
    is_paid: true,
    date_joined: '2020-01-15',
  },
  {
    id: 2,
    name: '李四',
    gender: 'F',
    mobile_phone: '0922345678',
    home_phone: '073345678',
    address: '台灣台北市',
    position: { title: '副會長' },
    graduate: { school: '國立台灣大學' },
    email: 'lisi@gmail.com',
    is_paid: false,
    date_joined: '2021-03-22',
  },
  {
    id: 3,
    name: '王五',
    gender: 'M',
    mobile_phone: '0932345678',
    home_phone: '074345678',
    address: '台灣新竹市',
    position: { title: '秘書' },
    graduate: { school: '國立清華大學' },
    email: 'wangwu@gmail.com',
    is_paid: true,
    date_joined: '2019-06-12',
  },
];

  // 在組件掛載時設定假資料
  useEffect(() => {
    setUsers(fakeUsers);
  }, []);

  // 顯示修改資料的 Modal
  const handleShowModal = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  // 關閉 Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  // 更新使用者資料
  const handleUpdateUser = () => {
    const updatedUsers = users.map((user) =>
      user.id === currentUser.id ? currentUser : user
    );
    setUsers(updatedUsers);
    handleCloseModal();
  };

  // 新增帳號功能
  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      name: '新用戶',
      position: { title: '會員' },
      gmail: 'newuser@gmail.com',
      is_paid: false,
    };
    setUsers([...users, newUser]);
  };

  return (
    <Container className='my-5'>
      <Row className="justify-content-center">
        {/* 左側篩選與新增帳號 */}
        <Col md={3} className="bg-light p-3">
          <UserFilter
            filters={filters}
            setFilters={setFilters}
            applyFilters={() => {}}
            handleAddUser={handleAddUser}
          />
        </Col>

        {/* 右側使用者資料表格 */}
        <Col md={9} className="p-3">
          <UserTable users={users} handleShowModal={handleShowModal} />
        </Col>
      </Row>

      {/* 修改資料的 Modal */}
      {currentUser && (
        <EditUserModal
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          handleUpdateUser={handleUpdateUser}
        />
      )}
    </Container>
  );
}

export default UserManagement;
