import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Container, Row, Col } from "react-bootstrap";
import Axios from "common/Axios";
import { toast } from "react-toastify";

const PopupAdManager = () => {
  const [ads, setAds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, image: "", active: true });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await Axios().get("picture/popup-ads/");
      setAds(response.data.results);
    } catch (error) {
      toast.error("無法取得照片，伺服器可能離線");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleShowModal = (ad = null) => {
    setFormData(ad || { id: null, image: "", active: true });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (formData.id) {
        await Axios().put(`picture/popup-ads/${formData.id}/`, formData);
      } else {
        await Axios().post("picture/popup-ads/", formData);
      }
      setShowModal(false);
      fetchAds();
      toast.success("操作成功");
    } catch (error) {
      toast.error("操作失敗，請稍後再試");
    }
  };

  const handleDelete = async (id) => {
    try {
      await Axios().delete(`picture/popup-ads/${id}/`);
      setAds(ads.filter((ad) => ad.id !== id));
      toast.success("刪除成功");
    } catch (error) {
      toast.error("刪除失敗，請稍後再試");
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      await Axios().patch(`picture/popup-ads/${id}/toggle_active/`);
      setAds(
        ads.map((ad) => (ad.id === id ? { ...ad, active: !isActive } : ad))
      );
      toast.success(isActive ? "狀態改為停用!" : "狀態改為啟用!");
    } catch (error) {
      toast.error("狀態切換失敗，請稍後再試");
    }
  };

  return (
    <Container>
      <div className="text-center my-3">
        <Button variant="success" onClick={() => handleShowModal()}>新增廣告</Button>
      </div>
      <Row className="justify-content-center">
        {ads.map((ad) => (
          <Col xs={12} sm={6} md={4} lg={3} key={ad.id} className="mb-4">
            <Card className="text-center">
              <Card.Img
                variant="top"
                src={ad.image || "https://via.placeholder.com/300x150.png?text=No+Image+Available"}
                className="img-fluid"
              />
              <Card.Body>
                <Card.Text>
                  <strong>狀態:</strong>{" "}
                  {ad.active ? <span className="text-success">啟用</span> : <span className="text-danger">停用</span>}
                </Card.Text>
                <Button variant={ad.active ? "warning" : "success"} onClick={() => toggleActive(ad.id, ad.active)}>
                  {ad.active ? "停用" : "啟用"}
                </Button>
                <Button variant="primary" onClick={() => handleShowModal(ad)} className="ms-2">編輯</Button>
                <Button variant="danger" onClick={() => handleDelete(ad.id)} className="ms-2">刪除</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? "編輯廣告" : "新增廣告"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>上傳照片 (最佳尺寸: 海報比例)</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
              {formData.image && <img src={formData.image} alt="預覽" className="mt-3 img-fluid" />}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="啟用" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>取消</Button>
          <Button variant="primary" onClick={handleSave}>儲存</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PopupAdManager;
