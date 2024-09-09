import React, { useState } from 'react';
import { Modal, Button, Form, Table, Container } from 'react-bootstrap';


/**
 * 招募管理頁面
 */
function RecruitManaPage() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: '後端工程師',
      company: 'XYZ 科技公司',
      postDate: '2023-09-01',
      endDate: '2023-09-30',
      contactName: '張三',
      contactEmail: 'zhangsan@example.com',
      description: '需要具備 Django 開發經驗',
    },
    {
      id: 2,
      title: '前端工程師',
      company: 'ABC 網路公司',
      postDate: '2023-08-15',
      endDate: '2023-09-15',
      contactName: '李四',
      contactEmail: 'lisi@example.com',
      description: '熟悉 React 和 JavaScript',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    company: '',
    postDate: '',
    endDate: '',
    contactName: '',
    contactEmail: '',
    description: '',
  });

  const [isPersonalContact, setIsPersonalContact] = useState(false);
  const [isPersonalCompany, setIsPersonalCompany] = useState(false);

  // Toggle Modals
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);

  // Handle Form Data Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle Add Job
  const handleAddJob = (e) => {
    e.preventDefault();
    const newJob = {
      ...formData,
      id: jobs.length + 1,
      contactName: isPersonalContact ? '本人' : formData.contactName,
      company: isPersonalCompany ? '本人所在公司' : formData.company,
    };
    setJobs([...jobs, newJob]);
    setFormData({
      id: '',
      title: '',
      company: '',
      postDate: '',
      endDate: '',
      contactName: '',
      contactEmail: '',
      description: '',
    });
    setIsPersonalContact(false);
    setIsPersonalCompany(false);
    setShowAddModal(false);
  };

  // Handle Edit Job
  const handleEditJob = (id) => {
    const job = jobs.find((job) => job.id === id);
    setFormData(job);
    setShowEditModal(true);
  };

  const handleSaveEditJob = (e) => {
    e.preventDefault();
    setJobs(
      jobs.map((job) => (job.id === formData.id ? { ...formData } : job))
    );
    setShowEditModal(false);
  };

  // Handle Delete Job
  const handleDeleteJob = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  return (
    <Container className="mt-5">
      <h1 className="mb-4">徵才管理頁面</h1>
      <Button variant="success" onClick={handleShowAddModal}>
        新增職位
      </Button>

      <Table hover bordered className="mt-4">
        <thead>
          <tr>
            <th>編號</th>
            <th>職位名稱</th>
            <th>公司</th>
            <th>發布時間</th>
            <th>截止時間</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.title}</td>
              <td>{job.company}</td>
              <td>{job.postDate}</td>
              <td>{job.endDate}</td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEditJob(job.id)}
                >
                  編輯
                </Button>
                <Button variant="danger" onClick={() => handleDeleteJob(job.id)}>
                  刪除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Job Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>新增職位</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddJob}>
            <Form.Group className="mb-3" controlId="formJobDescription">
              <Form.Label>詳細資料說明</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              id="isPersonalContact"
              label="聯絡人為本人"
              checked={isPersonalContact}
              onChange={() => setIsPersonalContact(!isPersonalContact)}
            />
            <Form.Check
              type="checkbox"
              id="isPersonalCompany"
              label="公司為本人所在公司"
              checked={isPersonalCompany}
              onChange={() => setIsPersonalCompany(!isPersonalCompany)}
            />

            <Form.Group className="mb-3" controlId="formJobCompany">
              <Form.Label>公司名稱</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                disabled={isPersonalCompany}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPostDate">
              <Form.Label>發布時間</Form.Label>
              <Form.Control
                type="date"
                name="postDate"
                value={formData.postDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEndDate">
              <Form.Label>截止時間</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formContactName">
              <Form.Label>聯絡人姓名</Form.Label>
              <Form.Control
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                required
                disabled={isPersonalContact}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formContactEmail">
              <Form.Label>聯絡人 Email</Form.Label>
              <Form.Control
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
                disabled={isPersonalContact}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              新增職位
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Job Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>編輯職位</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveEditJob}>
            <Form.Group className="mb-3" controlId="formJobDescription">
              <Form.Label>詳細資料說明</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formJobCompany">
              <Form.Label>公司名稱</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPostDate">
              <Form.Label>發布時間</Form.Label>
              <Form.Control
                type="date"
                name="postDate"
                value={formData.postDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEndDate">
              <Form.Label>截止時間</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formContactName">
              <Form.Label>聯絡人姓名</Form.Label>
              <Form.Control
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formContactEmail">
              <Form.Label>聯絡人 Email</Form.Label>
              <Form.Control
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              保存修改
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default RecruitManaPage;
