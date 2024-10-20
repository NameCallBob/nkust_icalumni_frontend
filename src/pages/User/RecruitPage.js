import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Container, Carousel } from 'react-bootstrap'; // 引入 Carousel 組件
import 'css/recruit.css';
import Axios from 'common/Axios';
import LoadingSpinner from 'components/LoadingSpinner';
// 預防 XSS 攻擊
import DOMPurify from 'dompurify';

function RecruitPage() {
  const [show, setShow] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState({});
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (job) => {
    setShow(true);
    setLoading(true);
    Axios()
      .get('/recruit/data/getOne/', {
        params: { id: job.id },
      })
      .then((res) => {
        setSelectedJob(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    Axios()
      .get('/recruit/data/tableOutput/')
      .then((res) => {
        setJobs(res.data.results);
      })
      .catch((err) => {
        alert('伺服器異常，請稍後再試');
      });
  }, []);

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
              <td>{job.release_date}</td>
              <td>{job.deadline}</td>
              <td>{job.company_name}</td>
              <td>{job.title}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 模態框顯示職位詳情 */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>職位詳情</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <p>
                <strong>職位名稱:</strong> {selectedJob.title}
              </p>
              <p>
                <strong>發布時間:</strong> {selectedJob.release_date}
              </p>
              <p>
                <strong>截止時間:</strong> {selectedJob.deadline}
              </p>
              <p>
                <strong>公司:</strong> {selectedJob.company_name}
              </p>
              <p>
                <strong>聯絡人姓名:</strong>{' '}
                {selectedJob.contact && selectedJob.contact.name
                  ? selectedJob.contact.name
                  : '未提供'}
              </p>
              <p>
                <strong>聯絡人 Email:</strong>{' '}
                {selectedJob.contact && selectedJob.contact.email
                  ? selectedJob.contact.email
                  : '未提供'}
              </p>
              <p>
                <strong>聯絡人電話:</strong>{' '}
                {selectedJob.contact && selectedJob.contact.phone
                  ? selectedJob.contact.phone
                  : '未提供'}
              </p>
              <p>
                <strong>詳細資訊:</strong>
              </p>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(selectedJob.intro),
                }}
              />

              {/* 照片幻燈片展示 */}
              {selectedJob.images && selectedJob.images.length > 0 && (
                <div className="photos-section mt-4">
                  <h5>照片展示：</h5>
                  <Carousel>
                    {selectedJob.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img
                          className="d-block w-100"
                          src={process.env.REACT_APP_BASE_URL+image.image}
                          alt={`照片 ${index + 1}`}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
              )}
            </>
          )}
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
