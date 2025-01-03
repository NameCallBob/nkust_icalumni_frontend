import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Container, Toast, ToastContainer } from "react-bootstrap";
import Axios from "common/Axios";
import { toast } from "react-toastify";

const PopupAdManager = () => {
  const [ads, setAds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formData, setFormData] = useState({
    id: null,
    image: "",
    active: true,
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await Axios().get("picture/popup-ads/");
      setAds(response.data.results);
    } catch (error) {
      toast.error("無法取得照片，伺服器可能離線")
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
        toast.success("照片修改成功")
      } else {
        await Axios().post("picture/popup-ads/", formData);
        toast.success("照片新增成功")
      }
      setShowModal(false);
      fetchAds();
    } catch (error) {
        const messages = Object.values(error.response.data).flat();
        messages.forEach((message) => {
            toast.error(message, {
              position: "top-right",
              autoClose: 3000, // 自動關閉時間
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
          });
    }
  };

  const handleDelete = async (id) => {
    try {
      await Axios().delete(`picture/popup-ads/${id}/`);
      setAds(ads.filter((ad) => ad.id !== id));
      toast.success("刪除成功")
    } catch (error) {
        toast.error("刪除失敗")
        const messages = Object.values(error.response.data).flat();
        messages.forEach((message) => {
            toast.error(message, {
              position: "top-right",
              autoClose: 3000, // 自動關閉時間
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
          });
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      await Axios().patch(`picture/popup-ads/${id}/toggle_active/`);
      setAds(
        ads.map((ad) => (ad.id === id ? { ...ad, active: !isActive } : ad))
      );
      toast.success(
        isActive ? "狀態改為停用!" : "狀態改為啟用!"
      );
    } catch (error) {
        const messages = Object.values(error.response.data).flat();
        messages.forEach((message) => {
            toast.error(message, {
              position: "top-right",
              autoClose: 3000, // 自動關閉時間
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
          });    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <Container>

      <div className="d-flex flex-wrap justify-content-center">
        {ads.map((ad) => (
          <Card key={ad.id} style={{ width: "18rem", margin: "10px" }}>
            <Card.Img
              variant="top"
              src={
                ad.image ||
                "https://via.placeholder.com/300x150.png?text=No+Image+Available"
              }
            />
            <Card.Body>
              <Card.Text>
                <strong>狀態:</strong>{" "}
                {ad.active ? (
                  <span className="text-success">Active</span>
                ) : (
                  <span className="text-danger">Inactive</span>
                )}
              </Card.Text>
              <Button
                variant={ad.active ? "warning" : "success"}
                onClick={() => toggleActive(ad.id, ad.active)}
              >
                {ad.active ? "停用" : "啟用"}
              </Button>
              <Button
                variant="primary"
                onClick={() => handleShowModal(ad)}
                className="ms-2"
              >
               編輯              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(ad.id)}
                className="ms-2"
              >
                刪除
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
      <Button
        variant="success"
        onClick={() => handleShowModal()}
        className="mt-3"
      >
        新增官網彈跳廣告
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {formData.id ? "編輯廣告" : "新稱廣告"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>上傳照片(海報最佳)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="mt-3"
                  style={{ width: "100%" }}
                />
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            關閉
          </Button>
          <Button variant="primary" onClick={handleSave}>
          保存上傳
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PopupAdManager;
