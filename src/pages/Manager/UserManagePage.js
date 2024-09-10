import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Alert, Pagination } from 'react-bootstrap';
import FilterForm from 'components/Manage/UserManage/filterForm';
import MemberTable from 'components/Manage/UserManage/MemberTable';
import MemberModal from 'components/Manage/UserManage/MemberModal';
import PaginationControls from 'components/Manage/UserManage/PaginationControls';

function MemberManagement() {
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'John Doe',
      home_phone: '02-12345678',
      mobile_phone: '0912345678',
      gender: 'M',
      address: '台北市中正區',
      is_paid: true,
      intro: '我是John，喜歡參加校友活動。',
      birth_date: '1985-05-15',
      photo: 'https://via.placeholder.com/150',
      position: { id: 1, title: '會長' },
      graduate: { id: 1, school: '國立高雄科技大學', grade: '109' },
    },
  ]);

  const [positions] = useState([
    { id: 1, title: '會長' },
    { id: 2, title: '副會長' },
  ]);

  const [selectedPosition, setSelectedPosition] = useState('');
  const [isPaidFilter, setIsPaidFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null); // 保存當前編輯的會員資料
  const [formData, setFormData] = useState({
    name: '',
    home_phone: '',
    mobile_phone: '',
    gender: 'M',
    address: '',
    is_paid: false,
    intro: '',
    birth_date: '',
    photo: null,
    position: '',
    graduate: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 5;

  // 新增或編輯提交
  const handleSubmit = (newMember) => {
    if (editingMember) {
      // 編輯模式，更新現有會員
      setMembers(
        members.map((member) =>
          member.id === editingMember.id ? { ...newMember, id: editingMember.id } : member
        )
      );
    } else {
      // 新增模式
      setMembers([...members, newMember]);
    }
    setShowModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    setEditingMember(null);
  };

  // 切換繳費狀態
  const togglePaymentStatus = (id) => {
    setMembers(
      members.map((member) =>
        member.id === id ? { ...member, is_paid: !member.is_paid } : member
      )
    );
  };

  // 編輯會員
  const handleEditMember = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      home_phone: member.home_phone,
      mobile_phone: member.mobile_phone,
      gender: member.gender,
      address: member.address,
      is_paid: member.is_paid,
      intro: member.intro,
      birth_date: member.birth_date,
      photo: null, // 編輯時不會直接顯示已上傳的照片，使用者需要重新選擇照片
      position: member.position.id.toString(),
      graduate: member.graduate.school,
    });
    setShowModal(true);
  };

  const handleFilterChange = () => {
    setSelectedPosition('');
    setIsPaidFilter('');
    setSearchQuery('');
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch = searchQuery
      ? member.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesPosition =
      selectedPosition === '' || member.position.id === parseInt(selectedPosition);
    const matchesIsPaid = isPaidFilter === '' || member.is_paid.toString() === isPaidFilter;

    return matchesSearch && matchesPosition && matchesIsPaid;
  });

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  return (
    <Container className="mt-5">
      {showSuccess && <Alert variant="success">{editingMember ? '更新成功！' : '新增成功！'}</Alert>}
      <Row>
        <Col md={4}>
          <Button
            variant="success"
            className="mb-3"
            onClick={() => {
              setFormData({
                name: '',
                home_phone: '',
                mobile_phone: '',
                gender: 'M',
                address: '',
                is_paid: false,
                intro: '',
                birth_date: '',
                photo: null,
                position: '',
                graduate: '',
              });
              setShowModal(true);
            }}
          >
            新增會員
          </Button>
          <FilterForm
            positions={positions}
            selectedPosition={selectedPosition}
            setSelectedPosition={setSelectedPosition}
            isPaidFilter={isPaidFilter}
            setIsPaidFilter={setIsPaidFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleFilterChange={handleFilterChange}
          />
        </Col>
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header as="h5">系友列表</Card.Header>
            <MemberTable
              members={currentMembers}
              togglePaymentStatus={togglePaymentStatus}
              onEditMember={handleEditMember}
            />
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </Card>
        </Col>
      </Row>

      <MemberModal
        show={showModal}
        onHide={() => setShowModal(false)}
        positions={positions}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editingMember={editingMember}
      />
    </Container>
  );
}

export default MemberManagement;