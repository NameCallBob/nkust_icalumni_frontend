import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Button, Alert, Spinner } from 'react-bootstrap';
import { FaUser, FaBuilding } from 'react-icons/fa';
import PhotoItem from 'components/Manage/PicManage/PhotoItem';
import PhotoUploadModal from 'components/Manage/PicManage/PhotoUploadModal';
import 'css/manage/photo.css';
import LoadingSpinner from 'components/LoadingSpinner';
import Axios from 'common/Axios';

const PhotoManager = () => {
  const [selectedCategory, setSelectedCategory] = useState('自身照片');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);
      let apiname = ""
      try {
        if(selectedCategory === "自身照片"){
          apiname="picture/self-images/selfInfo/"
        }else if (selectedCategory === "公司照片"){
          apiname="picture/company-images/selfInfo/"
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
  }, [selectedCategory]);

  return (
    <Container fluid className="photo-manager">
      <Row>
        <Col md={3} className="sidebar">
          <div className="category-container">
            <Button
              variant={selectedCategory === '自身照片' ? 'primary' : 'secondary'}
              className="category-button"
              onClick={() => setSelectedCategory('自身照片')}
            >
              <FaUser size={40} className="category-icon" />
              自身照片
            </Button>
            <Button
              variant={selectedCategory === '公司照片' ? 'primary' : 'secondary'}
              className="category-button mt-4"
              onClick={() => setSelectedCategory('公司照片')}
            >
              <FaBuilding size={40} className="category-icon" />
              公司照片
            </Button>
          </div>
        </Col>

        <Col md={9} className="main-panel">
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={() => setShowUploadModal(true)}>
              新增照片
            </Button>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" role="status">
                <LoadingSpinner></LoadingSpinner>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="warning" className="text-center">
              {error}
            </Alert>
          ) : (
            <Row>
              {photos.map((photo) => (
                <Col md={4} key={photo.id} className="photo-item">
                  <PhotoItem photo={photo} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
      <PhotoUploadModal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        onUpload={() => {}}
      />
      <footer className="footer">© 2024 Photo Manager</footer>
    </Container>
  );
};

export default PhotoManager;