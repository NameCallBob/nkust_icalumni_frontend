import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Container, Row, Col } from "react-bootstrap";
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
        toast.error("無法取得資料，伺服器可能離線");
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
    setFormData(slide || { id: null, title: "", description: "", image: "", active: true });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (formData.id) {
        await Axios().put("picture/slide-images/change/", formData);
      } else {
        await Axios().post("picture/slide-images/add/", formData);
      }
      setShowModal(false);
      toast.success("成功");
      setSlides(await Axios().get("picture/slide-images/all/").then((res) => res.data));
    } catch (error) {
      toast.error("操作失敗，請稍後再試");
    }
  };

  const handleDelete = async (id) => {
    try {
      await Axios().delete("picture/slide-images/remove/", { data: { id } });
      setSlides(slides.filter((slide) => slide.id !== id));
    } catch (error) {
      toast.error("刪除失敗，請稍後再試");
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      await Axios().post("picture/slide-images/switch_active/", { id });
      setSlides(
        slides.map((slide) => (slide.id === id ? { ...slide, active: !isActive } : slide))
      );
      toast.success("已切換狀態");
    } catch (error) {
      toast.error("狀態切換失敗，請稍後再試");
    }
  };

  return (
    <Container>
      <div className="text-center my-3">
        <Button variant="success" onClick={() => handleShowModal()}>新增輪播圖片</Button>
      </div>
      <Row className="justify-content-center">
        {slides.map((slide) => (
          <Col xs={12} sm={6} md={4} lg={3} key={slide.id} className="mb-4">
            <Card className="text-center">
              <Card.Img variant="top" src={process.env.REACT_APP_BASE_URL + slide.image} className="img-fluid" />
              <Card.Body>
                <Card.Title>{slide.title}</Card.Title>
                <Card.Text>{slide.description}</Card.Text>
                <Card.Text>
                  <strong>狀態:</strong>{" "}
                  {slide.active ? <span className="text-success">啟用</span> : <span className="text-danger">停用</span>}
                </Card.Text>
                <Button variant="primary" onClick={() => handleShowModal(slide)}>編輯</Button>
                <Button variant={slide.active ? "warning" : "success"} onClick={() => toggleActive(slide.id, slide.active)} className="ms-2">
                  {slide.active ? "停用" : "啟用"}
                </Button>
                <Button variant="danger" onClick={() => handleDelete(slide.id)} className="ms-2">刪除</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentSlide ? "編輯輪播" : "新增輪播"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>標題</Form.Label>
              <Form.Control type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>描述</Form.Label>
              <Form.Control as="textarea" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>上傳圖片</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
              {formData.image && <img src={process.env.REACT_APP_BASE_URL+formData.image} alt="預覽" className="mt-3 img-fluid" />}
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

export default SlideManager;
