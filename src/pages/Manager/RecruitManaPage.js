import Axios from 'common/Axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Table, Container, Image } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import LoadingSpinner from 'components/LoadingSpinner';

function RecruitManaPage() {
  const [jobs, setJobs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading 狀態
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    company: '',
    release_date: '',
    deadline: '',
    contactName: '',
    contactEmail: '',
    contactPhone:'',
    intro: '',
  });

  const [isPersonalContact, setIsPersonalContact] = useState(false);
  const [isPersonalCompany, setIsPersonalCompany] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleQuillChange = (value) => {
    setFormData((prevData) => ({ ...prevData, intro: value }));
  };

  useEffect(() => {
    Axios()
      .get('/recruit/data/tableOutput_admin/')
      .then((res) => {
        setJobs(res.data.results);
      })
      .catch(() => {
        toast.error('載入職位資料失敗');
      });
  }, []);

  // 統一的表單提交資料
  const prepareFormData = () => ({
    ...formData,
    isPersonalContact,
    isPersonalCompany,
    contact:{
      name:isPersonalContact ? undefined : formData.contactName,
      email:isPersonalContact ? undefined : formData.contactEmail,
      phone:isPersonalContact ? undefined : formData.contactPhone,
      company_name: isPersonalCompany ? undefined : formData.company,
    },
    images: selectedImages.map((image) => ({
      image: image,            // base64 格式圖片
      image_type: 'small',      // 默認為小圖
    })),
  });

  // 新增職位
  const handleAddJob = (e) => {
    e.preventDefault();
    Axios()
      .post('/recruit/data/new/', prepareFormData())
      .then((res) => {
        setJobs([...jobs, res.data]);
        resetForm();
        setShowAddModal(false);
        toast.success('新增職位成功');
      })
      .catch((err) => {
        toast.error(`新增失敗：${err.response?.status === 404 ? '未找到資源' : '請稍後再試'}`);
      });
  };

  // 編輯職位
  const handleEditJob = (id) => {
    setLoading(true);
    Axios()
      .get(`/recruit/data/getOne/`, { params: { id: id } })
      .then((res) => {
        setFormData(res.data);
        setIsPersonalContact(res.data.isPersonalContact); // 確保布林值狀態正確
        setIsPersonalCompany(res.data.isPersonalCompany); // 確保布林值狀態正確
        setSelectedImages(res.data.images || []);
        setImagePreviews(res.data.images || []);
        setShowEditModal(true);
      })
      .catch(() => {
        toast.error('載入職位詳細資料失敗');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 保存編輯職位
  const handleSaveEditJob = (e) => {
    e.preventDefault();
    let data = prepareFormData() ; data['id'] = formData.id
    Axios()
      .put(`/recruit/data/change/`,data)
      .then((res) => {
        setJobs(jobs.map((job) => (job.id === formData.id ? res.data : job)));
        setShowEditModal(false);
        toast.success('編輯成功');
      })
      .catch((err) => {
        toast.error(`編輯失敗：${err.response?.status === 404 ? '未找到資源' : '請稍後再試'}`);
      });
  };

  // 刪除職位
  const handleDeleteJob = (id) => {
    Axios()
      .delete(`/recruit/data/delete/`,{params:{"id":id}})
      .then(() => {
        setJobs(jobs.filter((job) => job.id !== id));
        toast.success('刪除成功');
      })
      .catch((err) => {
        toast.error(`刪除失敗：${err.response?.status === 404 ? '未找到資源' : '請稍後再試'}`);
      });
  };

  // 照片處理
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = [];
    const base64Images = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        base64Images.push(reader.result);
        previews.push(reader.result);
        if (base64Images.length === files.length) {
          setSelectedImages(base64Images);
          setImagePreviews(previews);
        }
      };
    });
  };

  // 重置表單
  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      company: '',
      release_date: '',
      deadline: '',
      contactName: '',
      contactEmail: '',
      intro: '',
    });
    setIsPersonalContact(false);
    setIsPersonalCompany(false);
    setSelectedImages([]);
    setImagePreviews([]);
  };

  return (
    <Container className="mt-5">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <h1 className="mb-4">徵才管理頁面</h1>
      <Button variant="success" onClick={handleShowAddModal}>
        新增職位
      </Button>

      <Table hover bordered className="mt-4">
        <thead>
          <tr>
            <th>編號</th>
            <th>職位名稱</th>
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
              <td>{job.release_date}</td>
              <td>{job.deadline}</td>
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
      <Modal show={showAddModal} onHide={handleCloseAddModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>新增職位</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddJob}>
            <Form.Group className="mb-3" controlId="formJobTitle">
              <Form.Label>職位名稱</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
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
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                required
                disabled={isPersonalCompany}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPostDate">
              <Form.Label>發布時間</Form.Label>
              <Form.Control
                type="date"
                name="release_date"
                value={formData.release_date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEndDate">
              <Form.Label>截止時間</Form.Label>
              <Form.Control
                type="date"
                name="deadline"
                value={formData.deadline}
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
            <Form.Group className="mb-3" controlId="formContactPhone">
              <Form.Label>聯絡人電話</Form.Label>
              <Form.Control
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                required
                disabled={isPersonalContact}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formJobDescription">
              <Form.Label>詳細資料說明</Form.Label>
              <ReactQuill
                value={formData.intro}
                onChange={handleQuillChange}
                placeholder="輸入詳細說明..."
              />
            </Form.Group>
            <Form.Group controlId="formJobImages" className="mb-3">
              <Form.Label>上傳照片</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="d-flex flex-wrap mt-2">
                {imagePreviews.map((src, index) => (
                  <Image
                    key={index}
                    src={src}
                    alt="預覽照片"
                    thumbnail
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      marginRight: '10px',
                    }}
                  />
                ))}
              </div>
            </Form.Group>
            <Button variant="primary" type="submit">
              新增職位
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Job Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>編輯職位</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <LoadingSpinner />
            </div>
          ) : (
            <Form onSubmit={handleSaveEditJob}>
              <Form.Group className="mb-3" controlId="formJobTitleEdit">
                <Form.Label>職位名稱</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Check
                type="checkbox"
                id="isPersonalContactEdit"
                label="聯絡人為本人"
                checked={isPersonalContact}
                onChange={() => setIsPersonalContact(!isPersonalContact)}
              />
              <Form.Check
                type="checkbox"
                id="isPersonalCompanyEdit"
                label="公司為本人所在公司"
                checked={isPersonalCompany}
                onChange={() => setIsPersonalCompany(!isPersonalCompany)}
              />
              <Form.Group className="mb-3" controlId="formJobCompanyEdit">
                <Form.Label>公司名稱</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  required
                  disabled={isPersonalCompany}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPostDateEdit">
                <Form.Label>發布時間</Form.Label>
                <Form.Control
                  type="date"
                  name="release_date"
                  value={formData.release_date}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEndDateEdit">
                <Form.Label>截止時間</Form.Label>
                <Form.Control
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formContactNameEdit">
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
              <Form.Group className="mb-3" controlId="formContactEmailEdit">
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
              <Form.Group className="mb-3" controlId="formContactPhoneEdit">
                <Form.Label>聯絡人電話</Form.Label>
                <Form.Control
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  required
                  disabled={isPersonalContact}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formJobDescriptionEdit">
                <Form.Label>詳細資料說明</Form.Label>
                <ReactQuill
                  value={formData.intro}
                  onChange={handleQuillChange}
                  placeholder="輸入詳細說明..."
                />
              </Form.Group>
              <Form.Group controlId="formJobImagesEdit" className="mb-3">
                <Form.Label>上傳照片</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="d-flex flex-wrap mt-2">
                  {imagePreviews.map((src, index) => (
                    <Image
                      key={index}
                      src={src}
                      alt="預覽照片"
                      thumbnail
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        marginRight: '10px',
                      }}
                    />
                  ))}
                </div>
              </Form.Group>
              <Button variant="primary" type="submit">
                保存修改
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default RecruitManaPage;
