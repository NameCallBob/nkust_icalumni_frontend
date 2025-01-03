import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Alert, Spinner, Button } from 'react-bootstrap';
import { FaUser, FaBuilding, FaPlus } from 'react-icons/fa';
import PhotoItem from 'components/Manage/PicManage/PhotoItem';
import PhotoUploadModal from 'components/Manage/PicManage/PhotoUploadModal';
import 'css/manage/photo.css';
import LoadingSpinner from 'components/LoadingSpinner';
import Axios from 'common/Axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PhotoManager = () => {
  const [selectedCategory, setSelectedCategory] = useState('自身照片');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isFresh, setIsFresh] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);
      let apiname = "";
      try {
        if (selectedCategory === "自身照片") {
          apiname = "picture/self-images/selfInfo/";
        } else if (selectedCategory === "公司照片") {
          apiname = "picture/company-images/selfInfo/";
        }
        const response = await Axios().get(apiname);
        if (response.data.length === 0) {
          setPhotos([]);
          setError('未找到任何資料');
        } else {
          setPhotos(response.data);
        }
      } catch (err) {
        setError('無法取得資料，請稍後再試');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [selectedCategory, isFresh]);

  const refreshPhotos = () => setIsFresh((prev) => !prev);

  return (
    <Container fluid className="photo-manager">
      <ToastContainer />
      <Row>
        <Col md={3} className="sidebar">
          <ListGroup as="div" className="category-container">
            <ListGroup.Item
              action
              active={selectedCategory === '自身照片'}
              onClick={() => setSelectedCategory('自身照片')}
              className="d-flex align-items-center justify-content-center"
            >
              <FaUser size={30} className="me-2" />
              自身照片
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={selectedCategory === '公司照片'}
              onClick={() => setSelectedCategory('公司照片')}
              className="d-flex align-items-center justify-content-center mt-3"
            >
              <FaBuilding size={30} className="me-2" />
              公司照片
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={9} className="main-panel">
          <div className="d-flex justify-content-end mb-3">
            <Button
              variant="success"
              onClick={() => setShowUploadModal(true)}
              className="d-flex align-items-center"
              style={{ maxWidth: '150px' }}  // 限制寬度
            >
              <FaPlus className="me-2" />
              新增照片
            </Button>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center">
                <LoadingSpinner />
            </div>
          ) : error ? (
            <Alert variant="warning" className="text-center">
              {error}
            </Alert>
          ) : (
            <Row>
              {photos.map((photo) => (
                <Col md={4} key={photo.id} className="photo-item">
                  <PhotoItem photo={photo} type={selectedCategory} refresh={refreshPhotos} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
      <PhotoUploadModal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        onUpload={refreshPhotos}
        type={selectedCategory}
      />
    </Container>
  );
};

export default PhotoManager;
