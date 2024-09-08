import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table,
  Modal,
  Alert,
  Image,
  Pagination,
} from 'react-bootstrap';

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
    // 假設有更多的系友資料...
  ]);
  const [positions] = useState([
    { id: 1, title: '會長' },
    { id: 2, title: '副會長' },
  ]);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [isPaidFilter, setIsPaidFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleFilterChange = () => {
    setSelectedPosition('');
    setIsPaidFilter('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMember = {
      id: members.length + 1,
      ...formData,
      position: positions.find((p) => p.id === parseInt(formData.position)),
      photo: URL.createObjectURL(formData.photo),
    };

    setMembers([...members, newMember]);
    setShowModal(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const filteredMembers = members.filter((member) => {
    return (
      (selectedPosition === '' || member.position.id === parseInt(selectedPosition)) &&
      (isPaidFilter === '' || member.is_paid.toString() === isPaidFilter)
    );
  });

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <Container className="mt-5">
      {showSuccess && <Alert variant="success">新增成功！</Alert>}
      <Row>
        <Col md={4}>
          <Button variant="success" className="mb-3" onClick={() => setShowModal(true)}>
            新增會員
          </Button>
          <Card className="shadow-sm mb-4">
            <Card.Header as="h5">篩選條件</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>職位</Form.Label>
                  <Form.Select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                  >
                    <option value="">所有職位</option>
                    {positions.map((position) => (
                      <option key={position.id} value={position.id}>
                        {position.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>是否繳費</Form.Label>
                  <Form.Select
                    value={isPaidFilter}
                    onChange={(e) => setIsPaidFilter(e.target.value)}
                  >
                    <option value="">全部</option>
                    <option value="true">已繳費</option>
                    <option value="false">未繳費</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="primary" onClick={handleFilterChange}>
                  清除篩選
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header as="h5">系友列表</Card.Header>
            <Table striped bordered hover responsive className="text-center">
              <thead>
                <tr>
                  <th>照片</th>
                  <th>姓名</th>
                  <th>職位</th>
                  <th>畢業學校</th>
                  <th>繳費狀態</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {currentMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <Image src={member.photo} rounded fluid style={{ width: '50px', height: '50px' }} />
                    </td>
                    <td>{member.name}</td>
                    <td>{member.position.title}</td>
                    <td>{member.graduate.school} - {member.graduate.grade}</td>
                    <td>{member.is_paid ? '已繳費' : '未繳費'}</td>
                    <td>
                      <Button variant="outline-primary" size="sm">
                        編輯
                      </Button>
                      <Button variant="outline-danger" size="sm" className="ms-2">
                        刪除
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination className="justify-content-center">
              <Pagination.Prev onClick={handlePrevPage} disabled={currentPage === 1} />
              <Pagination.Item active>{currentPage}</Pagination.Item>
              <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
            </Pagination>
          </Card>
        </Col>
      </Row>

      {/* 新增會員的 Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>新增會員</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>姓名</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>市內電話</Form.Label>
              <Form.Control
                type="text"
                name="home_phone"
                value={formData.home_phone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>行動電話</Form.Label>
              <Form.Control
                type="text"
                name="mobile_phone"
                value={formData.mobile_phone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>性別</Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="M">男</option>
                <option value="F">女</option>
                <option value="O">其他</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>住址</Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="是否繳費"
                name="is_paid"
                checked={formData.is_paid}
                onChange={(e) => setFormData({ ...formData, is_paid: e.target.checked })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>自我介紹</Form.Label>
              <Form.Control
                as="textarea"
                name="intro"
                value={formData.intro}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>生日</Form.Label>
              <Form.Control
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>照片</Form.Label>
              <Form.Control
                type="file"
                name="photo"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>職位</Form.Label>
              <Form.Select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
              >
                <option value="">選擇職位</option>
                {positions.map((position) => (
                  <option key={position.id} value={position.id}>
                    {position.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>畢業學校</Form.Label>
              <Form.Control
                type="text"
                name="graduate"
                value={formData.graduate}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              新增
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default MemberManagement;
    