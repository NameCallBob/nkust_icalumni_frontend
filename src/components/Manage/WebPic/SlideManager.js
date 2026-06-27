import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Container, Row, Col, Alert, Tooltip, OverlayTrigger, Badge, Spinner } from "react-bootstrap";
import Axios from "common/Axios";
import { toast } from "react-toastify";
import { FaImage, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaInfoCircle, FaPlus, FaQuestionCircle, FaEye } from "react-icons/fa";

const SlideManager = () => {
  const [slides, setSlides] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState(null);
  const [showHelp, setShowHelp] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    link_url: "",
    image: "",
    active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true);
      try {
        const response = await Axios().get("picture/slide-images/all/");
        setSlides(response.data);
      } catch (error) {
        toast.error("無法取得資料，請確認網路連線正常");
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "請輸入標題";
    if (!formData.image && !currentSlide) newErrors.image = "請上傳圖片";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // 檢查檔案大小 (限制為 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors({...errors, image: "圖片檔案過大，請上傳 2MB 以下的圖片"});
      return;
    }
    
    // 檢查檔案類型
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setErrors({...errors, image: "只能上傳 JPG、PNG 或 GIF 格式的圖片"});
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
      setErrors({...errors, image: null});
    };
    reader.readAsDataURL(file);
  };

  const handleShowModal = (slide = null) => {
    setCurrentSlide(slide);
    setFormData(slide || { id: null, title: "", description: "", link_url: "", image: "", active: true });
    setErrors({});
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (formData.id) {
        const payload = {};
        Object.keys(formData).forEach(key => {
          if (formData[key] !== currentSlide[key]) {
            payload[key] = formData[key];
          }
        });
        
        // The id is required for the backend to identify the record.
        payload.id = formData.id;

        // If no fields have changed, don't send the request.
        if (Object.keys(payload).length > 1) {
            await Axios().patch("picture/slide-images/change/", payload);
            toast.success("圖片已成功更新！");
        } else {
            toast.info("沒有偵測到任何變更");
        }

      } else {
        await Axios().post("picture/slide-images/add/", formData);
        toast.success("已成功新增圖片！");
      }
      setShowModal(false);

      const response = await Axios().get("picture/slide-images/all/");
      setSlides(response.data);
    } catch (error) {
      toast.error("操作失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (slide) => {
    setSlideToDelete(slide);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!slideToDelete) return;
    
    setLoading(true);
    try {
      await Axios().delete("picture/slide-images/remove/", { data: { id: slideToDelete.id } });
      setSlides(slides.filter((slide) => slide.id !== slideToDelete.id));
      toast.success("圖片已成功刪除");
    } catch (error) {
      toast.error("刪除失敗，請稍後再試");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setSlideToDelete(null);
    }
  };

  const toggleActive = async (id, isActive) => {
    setLoading(true);
    try {
      await Axios().post("picture/slide-images/switch_active/", { id });
      setSlides(
        slides.map((slide) => (slide.id === id ? { ...slide, active: !isActive } : slide))
      );
      toast.success(isActive ? "圖片已停用" : "圖片已啟用");
    } catch (error) {
      toast.error("狀態切換失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const showImagePreview = (slide) => {
    setPreviewImage(slide);
  };

  const renderTooltip = (props, text) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">網站輪播圖片管理</h1>
      
      {showHelp && (
        <Alert variant="info" onClose={() => setShowHelp(false)} dismissible>
          <Alert.Heading><FaInfoCircle className="me-2" />使用說明</Alert.Heading>
          <p>這裡可以管理網站首頁的輪播圖片。您可以：</p>
          <ul>
            <li>點擊「新增輪播圖片」按鈕來上傳新的圖片</li>
            <li>點擊「查看」按鈕預覽已上傳的圖片</li>
            <li>點擊「編輯」按鈕修改現有圖片的資訊</li>
            <li>點擊「啟用/停用」按鈕控制圖片是否顯示在網站上</li>
            <li>點擊「刪除」按鈕移除不需要的圖片</li>
          </ul>
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center my-4">
        <Button 
          variant="success" 
          onClick={() => handleShowModal()}
          className="d-flex align-items-center"
        >
          <FaPlus className="me-2" /> 新增輪播圖片
        </Button>
        
        <OverlayTrigger
          placement="left"
          delay={{ show: 250, hide: 400 }}
          overlay={(props) => renderTooltip(props, "顯示使用說明")}
        >
          <Button 
            variant="outline-info" 
            onClick={() => setShowHelp(true)}
            className="rounded-circle"
          >
            <FaQuestionCircle />
          </Button>
        </OverlayTrigger>
      </div>

      {loading && !showModal && !showDeleteConfirm ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-3">資料載入中，請稍候...</p>
        </div>
      ) : slides.length === 0 ? (
        <Alert variant="warning">
          <div className="text-center py-5">
            <FaImage size={48} className="mb-3 text-muted" />
            <h4>目前沒有輪播圖片</h4>
            <p>點擊「新增輪播圖片」按鈕來上傳您的第一張輪播圖片。</p>
          </div>
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped hover>
            <thead>
              <tr>
                <th style={{ width: '5%' }}>#</th>
                <th style={{ width: '12%' }}>縮圖</th>
                <th style={{ width: '18%' }}>標題</th>
                <th style={{ width: '20%' }}>描述</th>
                <th style={{ width: '15%' }}>跳轉連結</th>
                <th style={{ width: '10%' }}>狀態</th>
                <th style={{ width: '20%' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide, index) => (
                <tr key={slide.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="thumbnail-container" style={{ width: '100px', height: '60px', overflow: 'hidden' }}>
                      <img 
                        src={process.env.REACT_APP_BASE_URL + slide.image} 
                        alt={slide.title}
                        className="img-fluid rounded"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => showImagePreview(slide)}
                      />
                    </div>
                  </td>
                  <td>{slide.title}</td>
                  <td>
                    <div style={{ maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {slide.description || <span className="text-muted">(無描述)</span>}
                    </div>
                  </td>
                  <td>
                    {slide.link_url ? (
                      <a
                        href={slide.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                        style={{ fontSize: '0.9em' }}
                      >
                        {slide.link_url.length > 30 ? `${slide.link_url.substring(0, 30)}...` : slide.link_url}
                      </a>
                    ) : (
                      <span className="text-muted">(無連結)</span>
                    )}
                  </td>
                  <td>
                    <Badge bg={slide.active ? "success" : "danger"}>
                      {slide.active ? "使用中" : "已停用"}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) => renderTooltip(props, "查看圖片")}
                      >
                        <Button 
                          variant="info" 
                          size="sm"
                          onClick={() => showImagePreview(slide)}
                        >
                          <FaEye />
                        </Button>
                      </OverlayTrigger>
                    
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) => renderTooltip(props, "編輯圖片資訊")}
                      >
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleShowModal(slide)}
                        >
                          <FaEdit />
                        </Button>
                      </OverlayTrigger>
                      
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) => renderTooltip(props, slide.active ? "停用此圖片" : "啟用此圖片")}
                      >
                        <Button 
                          variant={slide.active ? "warning" : "success"} 
                          size="sm"
                          onClick={() => toggleActive(slide.id, slide.active)}
                        >
                          {slide.active ? <FaToggleOff /> : <FaToggleOn />}
                        </Button>
                      </OverlayTrigger>
                      
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) => renderTooltip(props, "刪除此圖片")}
                      >
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => confirmDelete(slide)}
                        >
                          <FaTrash />
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* 新增/編輯圖片的表單 */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentSlide ? "編輯輪播圖片" : "新增輪播圖片"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="mb-3 border-bottom pb-2">
              <h5 className="text-muted">基本資訊</h5>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>標題 <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                isInvalid={!!errors.title}
                placeholder="請輸入標題，例如：春季促銷活動"
              />
              <Form.Text className="text-muted">
                輸入簡短的標題來描述這張圖片的用途。
              </Form.Text>
              {errors.title && <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>描述 <span className="text-muted">(選填)</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="請輸入詳細描述（非必填）"
              />
              <Form.Text className="text-muted">
                添加詳細說明，幫助您日後識別此輪播圖片的用途。
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>點擊跳轉連結 <span className="text-muted">(選填)</span></Form.Label>
              <Form.Control
                type="url"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                placeholder="請輸入完整網址，例如：https://www.example.com"
                isInvalid={!!errors.link_url}
              />
              <Form.Text className="text-muted">
                當使用者點擊輪播圖片時，將跳轉到此連結。留空則不會有跳轉功能。
              </Form.Text>
              {errors.link_url && <Form.Control.Feedback type="invalid">{errors.link_url}</Form.Control.Feedback>}
            </Form.Group>
            
            <div className="mb-3 border-bottom pb-2">
              <h5 className="text-muted">圖片設定</h5>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>上傳圖片 {!currentSlide && <span className="text-danger">*</span>}</Form.Label>
              <div className="border rounded p-3 text-center bg-light">
                {(formData.image || (currentSlide && currentSlide.image)) ? (
                  <div className="position-relative">
                    <img 
                      src={formData.image || (process.env.REACT_APP_BASE_URL + currentSlide.image)} 
                      alt="預覽" 
                      className="img-fluid mb-3 rounded" 
                      style={{ maxHeight: '300px' }} 
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <Button 
                        variant="light" 
                        size="sm" 
                        className="rounded-circle p-1 shadow"
                        onClick={() => setFormData({ ...formData, image: "" })}
                      >
                        <FaTrash color="red" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-3">
                    <FaImage size={36} className="mb-2 text-muted" />
                    <p className="text-muted">點擊下方按鈕選擇圖片</p>
                  </div>
                )}
                
                <div>
                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleImageUpload}
                    isInvalid={!!errors.image}
                    className="d-none"
                    id="image-upload"
                  />
                  <Button 
                    variant="outline-primary" 
                    onClick={() => document.getElementById('image-upload').click()}
                    className="d-flex align-items-center mx-auto"
                  >
                    <FaImage className="me-2" /> 選擇圖片檔案
                  </Button>
                </div>
                <Form.Text className="text-muted">
                  建議使用尺寸比例為 16:9 的橫式圖片，檔案大小不超過 2MB。
                  <br />
                  支援的檔案格式：JPG、PNG、GIF
                </Form.Text>
                {errors.image && (
                  <Alert variant="danger" className="mt-2 small">
                    {errors.image}
                  </Alert>
                )}
              </div>
            </Form.Group>
            
            <div className="mb-3 border-bottom pb-2">
              <h5 className="text-muted">顯示設定</h5>
            </div>
            
            <Form.Group className="mb-3">
              <div className="d-flex align-items-center">
                <Form.Check 
                  type="switch"
                  id="active-switch"
                  label="立即啟用此圖片"
                  checked={formData.active} 
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })} 
                />
              </div>
              <Form.Text className="text-muted ms-4">
                啟用後，此圖片將會出現在網站輪播區域中。您可以隨時更改此設定。
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 d-flex justify-content-between">
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  處理中...
                </>
              ) : (
                <>儲存</>
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* 刪除確認對話框 */}
      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>確認刪除</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-3">
            <FaTrash size={36} className="text-danger mb-3" />
            <h4>您確定要刪除這張圖片嗎？</h4>
            {slideToDelete && (
              <div className="mt-3 text-muted">
                <p><strong>標題：</strong> {slideToDelete.title}</p>
                <img
                  src={process.env.REACT_APP_BASE_URL + slideToDelete.image}
                  alt={slideToDelete.title}
                  className="img-fluid rounded mt-2"
                  style={{ maxHeight: '150px' }}
                />
              </div>
            )}
            <Alert variant="warning" className="mt-3">
              <FaInfoCircle className="me-2" />
              此操作無法復原，刪除後圖片將永久移除。
            </Alert>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteConfirm(false)}>
            取消
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                處理中...
              </>
            ) : (
              <>確認刪除</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 圖片預覽對話框 */}
      <Modal
        show={!!previewImage}
        onHide={() => setPreviewImage(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{previewImage?.title || '圖片預覽'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          {previewImage && (
            <>
              <img
                src={process.env.REACT_APP_BASE_URL + previewImage.image}
                alt={previewImage.title}
                className="img-fluid rounded"
                style={{ maxHeight: '60vh' }}
              />
              {previewImage.description && (
                <div className="mt-3 text-muted">
                  <p>{previewImage.description}</p>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPreviewImage(null)}>
            關閉
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SlideManager;