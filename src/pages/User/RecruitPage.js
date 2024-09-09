import React, { useState } from 'react';
import { Table, Modal, Button, Container } from 'react-bootstrap';
import 'css/recruit.css';

const jobs = [
  {
    id: 1,
    title: '後端工程師',
    postDate: '2023-09-01',
    endDate: '2023-09-30',
    company: 'XYZ 科技公司',
    description: '需要熟悉 Django 和 REST API 開發，具備至少兩年經驗。',
    contactName: '張三',
    contactEmail: 'zhangsan@example.com',
  },
  {
    id: 2,
    title: '前端工程師',
    postDate: '2023-08-15',
    endDate: '2023-09-15',
    company: 'ABC 網路公司',
    description: '熟悉 React 和前端最佳實踐，具備至少一年的專業經驗。',
    contactName: '李四',
    contactEmail: 'lisi@example.com',
  },
  {
    id: 3,
    title: 'AI模型訓練專家',
    postDate: '2023-08-25',
    endDate: '2023-09-25',
    company: 'ML 智能科技公司',
    description: '具備深度學習模型訓練經驗，能夠使用 TensorFlow 或 PyTorch。',
    contactName: '王五',
    contactEmail: 'wangwu@example.com',
  },
  // 其他資料...
];

function RecruitPage() {
  const [show, setShow] = useState(false);
  const [selectedJob, setSelectedJob] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = (job) => {
    setSelectedJob(job);
    setShow(true);
  };

  return (
    <Container className="mt-5">
      <h1 className="mb-4">系友公司徵才資訊</h1>
      <Table responsive hover className="job-table">
        <thead className="table-dark">
          <tr>
            <th>編號</th>
            <th>發布時間</th>
            <th>截止時間</th>
            <th>公司</th>
            <th>職位</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr key={job.id} onClick={() => handleShow(job)} className="job-row">
              <td>{index + 1}</td>
              <td>{job.postDate}</td>
              <td>{job.endDate}</td>
              <td>{job.company}</td>
              <td>{job.title}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for job details */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>職位詳情</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>職位名稱:</strong> {selectedJob.title}
          </p>
          <p>
            <strong>發布時間:</strong> {selectedJob.postDate}
          </p>
          <p>
            <strong>截止時間:</strong> {selectedJob.endDate}
          </p>
          <p>
            <strong>公司:</strong> {selectedJob.company}
          </p>
          <p>
            <strong>聯絡人姓名:</strong> {selectedJob.contactName}
          </p>
          <p>
            <strong>聯絡人 Email:</strong> {selectedJob.contactEmail}
          </p>
          <p>
            <strong>詳細資訊:</strong> {selectedJob.description}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            關閉
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default RecruitPage;
