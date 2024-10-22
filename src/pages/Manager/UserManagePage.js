import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Button, Form } from 'react-bootstrap';

import UserFilter from 'components/Manage/UserManage/UserFilter';
import UserTable from 'components/Manage/UserManage/UserTable';
import NewUserModal from 'components/Manage/UserManage/NewUserModal';
import Axios from 'common/Axios';

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

  const handleEdit = (id) => {
    console.log('編輯資料的ID:', id);
    // 進行編輯邏輯
  };

    /**
     * 切換那位使用者的繳費狀態
     * @param {*} id 
     * @param {*} isPaid 
     */
  const handlePaymentStatus = (id, isPaid) => {
    Axios().patch("/member/admin/switch_paid/",{
      member_id:id,
    })
    .then((res) => {

    })
  };

    /**
     * 切換那位使用者的帳號狀態
     * @param {*} id 
     * @param {*} isPaid 
     */
  const handleToggleActive = (id, isActive) => {
    Axios().patch("/member/admin/switch_active/",{
      member_id:id,
    })
    .then((res) => {

    })
  };

  const handleDelete = (id) => {
    console.log('刪除帳號的ID:', id);
    Axios().delete("/member/admin/delete/",{
      member_id:id,
    })
    .then((res) => {
      alert("刪除成功")
    })
  };

  useEffect(() => {
    Axios().get("/member/admin/tableOutput_all/")
    .then((res) => {
      setUsers(res.data)
    })
  }, []);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (complex) => {
    setIsComplex(complex);
    setShowModal(true);
  };

  const handleAddUser = (complex,info) => {
    if (complex){
        Axios().post("member/admin/newUser_email/",info)
        .then((res) => {
            alert("成功")
        })

    }else{
        Axios().post("member/admin/newUser_basic/",info)
        .then((res) => {
          alert("成功")
        })
    }
  }
  

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={3} className="bg-light p-3">
        
        </Col>

        <Col md={9} className="p-3">
        <UserTable
          users={users} 
          handleShowModal={handleShowModal}
          handleEdit={handleEdit}
          handlePaymentStatus={handlePaymentStatus}
          handleToggleActive={handleToggleActive}
          handleDelete={handleDelete}
        />        
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
