import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Button, Form } from 'react-bootstrap';

import UserFilter from 'components/Manage/UserManage/UserFilter';
import UserTable from 'components/Manage/UserManage/UserTable';
import NewUserModal from 'components/Manage/UserManage/NewUserModal';

/**
 * 
 * @returns 
 */
function UserManagement() {

  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    gender: '',
    school: '',
    position: '',
    is_paid: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [isComplex, setIsComplex] = useState(false);

  // 假資料
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

  useEffect(() => {
    setUsers(fakeUsers);
  }, []);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (complex) => {
    setIsComplex(complex);
    setShowModal(true);
  };

  const handleAddUser = (newUser) => {
    setUsers([...users, { id: users.length + 1, ...newUser }]);
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={3} className="bg-light p-3">
          <UserFilter
            filters={filters}
            setFilters={setFilters}
            applyFilters={() => {}}
            handleAddUser_easy={() => handleShowModal(false)}
            handleAddUser_complex={() => handleShowModal(true)}
          />
        </Col>

        <Col md={9} className="p-3">
          <UserTable users={users} handleShowModal={handleShowModal} />
        </Col>
      </Row>

      <NewUserModal
        showModal={showModal}
        handleClose={handleCloseModal}
        isComplex={isComplex}
        handleAddUser={handleAddUser}
      />

    </Container>
  );
}

export default UserManagement;
