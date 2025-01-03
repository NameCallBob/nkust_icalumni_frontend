import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Container } from "react-bootstrap";
import Axios from "common/Axios";

import { toast } from "react-toastify";

const SlideManager = () => {
  const [slides, setSlides] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    image: "",
    active: true,
  });

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await Axios().get("picture/slide-images/all/");
        setSlides(response.data);
      } catch (error) {
        toast.error("無法取得資料，伺服器可能離線")
      }
    };
    fetchSlides();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleShowModal = (slide = null) => {
    setCurrentSlide(slide);
    setFormData(
      slide || { id: null, title: "", description: "", image: "", active: true }
    );
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (formData.id) {
        formData['id'] = formData.id
        await Axios().put(`picture/slide-images/change/`, formData);
      } else {
        await Axios().post("picture/slide-images/add/", formData);
      }
      setShowModal(false);
      toast.success("成功")
      setSlides(await Axios().get("picture/slide-images/all/").then((res) => res.data)); // Refresh data
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

  const handleDelete = async (id) => {
    try {
      await Axios().delete(`picture/slide-images/remove/`,{data:{id:id}});
      setSlides(slides.filter((slide) => slide.id !== id));
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

  const toggleActive = async (id, isActive) => {
    try {
      await Axios().post(`picture/slide-images/switch_active/`, { id:id });
      setSlides(
        slides.map((slide) =>
          slide.id === id ? { ...slide, active: !isActive } : slide
        )
      );
      toast.success("已切換狀態")
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

  return (
    <Container>
      <div className="d-flex flex-wrap justify-content-center">
        {slides.map((slide) => (
          <Card
            key={slide.id}
            style={{
              width: "18rem",
              margin: "10px",
              textAlign: "center",
            }}
          >
            <Card.Img variant="top" src={process.env.REACT_APP_BASE_URL+slide.image} />
            <Card.Body>
              <Card.Title>{slide.title}</Card.Title>
              <Card.Text>{slide.description}</Card.Text>
              <Card.Text>
                <strong>狀態:</strong>{" "}
                {slide.active ? (
                  <span className="text-success">啟用</span>
                ) : (
                  <span className="text-danger">停用</span>
                )}
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => handleShowModal(slide)}
              >
                編輯
              </Button>
              <Button
                variant={slide.active ? "warning" : "success"}
                onClick={() => toggleActive(slide.id, slide.active)}
                className="ms-2"
              >
                {slide.active ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(slide.id)}
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
        新增官網輪播
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentSlide ? "編輯輪播資訊" : "新增輪播"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>照片標題</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>照片描述</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                照片上傳
              </Form.Label>
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
                label="照片是否啟用"
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
            上傳保存
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SlideManager;
