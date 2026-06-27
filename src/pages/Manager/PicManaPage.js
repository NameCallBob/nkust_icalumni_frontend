import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Alert, Button, Card } from 'react-bootstrap';
import { FaUser, FaBuilding, FaPlus, FaImages } from 'react-icons/fa';
import PhotoItem from 'components/Manage/PicManage/PhotoItem';
import PhotoUploadModal from 'components/Manage/PicManage/PhotoUploadModal';
import 'css/manage/photo.css';
import LoadingSpinner from 'components/LoadingSpinner';
import Axios from 'common/Axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useRWD from 'hooks/useRWD';

const PhotoManager = () => {
  const rwd = useRWD();
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

  // 取得類別說明文字
  const getCategoryDescription = () => {
    if (selectedCategory === '自身照片') {
      return '管理您的個人照片集。這些照片將顯示在您的個人資料頁面。';
    } else {
      return '管理您的公司相關照片。這些照片將顯示在公司資訊頁面。';
    }
  };

  return (
    <Container fluid className="photo-manager admin-container py-4" style={rwd.getContainerStyle()}>
      <ToastContainer />
      
      {/* 頁面標題 */}
      <Row className="mb-4">
        <Col>
          <h2 className="d-flex align-items-center">
            <FaImages className="me-2" style={{ color: '#4a6cf7' }} />
            照片管理中心
          </h2>
          <p className="text-muted">上傳並管理您的照片集，維持最新、最佳的視覺展示</p>
        </Col>
      </Row>
      
      <Row>
        <Col md={rwd.isMobile ? 12 : 3} className="sidebar">
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">照片分類</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup as="div" className="category-container border-0">
                <ListGroup.Item
                  action
                  active={selectedCategory === '自身照片'}
                  onClick={() => setSelectedCategory('自身照片')}
                  className="d-flex align-items-center py-3 border-start-0 border-end-0"
                >
                  <FaUser size={24} className="me-3" />
                  <div>
                    <strong>自身照片</strong>
                    <div className="small text-muted">個人形象與活動照片</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={selectedCategory === '公司照片'}
                  onClick={() => setSelectedCategory('公司照片')}
                  className="d-flex align-items-center py-3 border-start-0 border-end-0"
                >
                  <FaBuilding size={24} className="me-3" />
                  <div>
                    <strong>公司照片</strong>
                    <div className="small text-muted">公司環境與活動照片</div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          
          {/* 使用指引區塊 */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">使用指引</h5>
            </Card.Header>
            <Card.Body>
              <ul className="ps-3 mb-0">
                <li className="mb-2">點擊左側分類切換照片類型</li>
                <li className="mb-2">點擊「新增照片」上傳新照片</li>
                <li className="mb-2">滑鼠懸停在照片上可查看操作選項</li>
                <li>建議上傳比例適當、清晰的照片</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col md={rwd.isMobile ? 12 : 9} className="main-panel">
          {/* 類別說明與操作按鈕 */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4>{selectedCategory}</h4>
                  <p className="text-muted mb-0">{getCategoryDescription()}</p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setShowUploadModal(true)}
                  className="d-flex align-items-center"
                >
                  <FaPlus className="me-2" />
                  新增照片
                </Button>
              </div>
            </Card.Body>
          </Card>

          {loading ? (
            <div className="d-flex justify-content-center p-5">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <Alert variant="warning" className="text-center p-5">
              <div className="mb-3">
                <FaImages size={48} className="text-muted" />
              </div>
              <h5>{error}</h5>
              <p className="mb-0">您可以點擊「新增照片」按鈕開始上傳</p>
            </Alert>
          ) : photos.length === 0 ? (
            <Alert variant="info" className="text-center p-5">
              <div className="mb-3">
                <FaImages size={48} className="text-muted" />
              </div>
              <h5>尚未上傳任何{selectedCategory}</h5>
              <p className="mb-0">點擊「新增照片」按鈕開始上傳</p>
            </Alert>
          ) : (
            <Row className="g-4">
              {photos.map((photo) => (
                <Col
                  xs={12}
                  sm={rwd.isMobile ? 12 : 6}
                  md={rwd.isMobile ? 12 : rwd.isTablet ? 6 : rwd.getCardColumns()}
                  lg={rwd.getCardColumns()}
                  key={photo.id}
                  className="photo-item"
                >
                  <PhotoItem
                    photo={photo}
                    type={selectedCategory}
                    refresh={refreshPhotos}
                    style={{
                      height: rwd.isMobile ? '250px' : rwd.isTablet ? '300px' : '350px',
                      objectFit: 'cover'
                    }}
                  />
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
