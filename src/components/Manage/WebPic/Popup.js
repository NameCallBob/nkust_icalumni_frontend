import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Container, Alert, Tooltip, OverlayTrigger, Badge, Spinner } from "react-bootstrap";
import Axios from "common/Axios";
import { toast } from "react-toastify";
import { FaImage, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaInfoCircle, FaPlus, FaQuestionCircle, FaEye } from "react-icons/fa";

const PopupAdManager = () => {
  const [ads, setAds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [showHelp, setShowHelp] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    id: null, 
    image: "", 
    active: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const response = await Axios().get("picture/popup-ads/");
      setAds(response.data.results);
    } catch (error) {
      toast.error("無法取得資料，請確認網路連線正常");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.image && !currentAd) newErrors.image = "請上傳圖片";
    
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

  const handleShowModal = (ad = null) => {
    setCurrentAd(ad);
    setFormData(ad || { id: null, image: "", active: true });
    setErrors({});
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (formData.id) {
        await Axios().put(`picture/popup-ads/${formData.id}/`, formData);
        toast.success("廣告已成功更新！");
      } else {
        await Axios().post("picture/popup-ads/", formData);
        toast.success("已成功新增廣告！");
      }
      setShowModal(false);
      fetchAds();
    } catch (error) {
      toast.error("操作失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (ad) => {
    setAdToDelete(ad);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!adToDelete) return;
    
    setLoading(true);
    try {
      await Axios().delete(`picture/popup-ads/${adToDelete.id}/`);
      setAds(ads.filter((ad) => ad.id !== adToDelete.id));
      toast.success("廣告已成功刪除");
    } catch (error) {
      toast.error("刪除失敗，請稍後再試");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setAdToDelete(null);
    }
  };

  const toggleActive = async (id, isActive) => {
    setLoading(true);
    try {
      await Axios().patch(`picture/popup-ads/${id}/toggle_active/`);
      setAds(
        ads.map((ad) => (ad.id === id ? { ...ad, active: !isActive } : ad))
      );
      toast.success(isActive ? "廣告已停用" : "廣告已啟用");
    } catch (error) {
      toast.error("狀態切換失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const showImagePreview = (ad) => {
    setPreviewImage(ad);
  };

  const renderTooltip = (props, text) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">網站彈出廣告管理</h1>
      
      {showHelp && (
        <Alert variant="info" onClose={() => setShowHelp(false)} dismissible>
          <Alert.Heading><FaInfoCircle className="me-2" />使用說明</Alert.Heading>
          <p>這裡可以管理網站的彈出廣告。您可以：</p>
          <ul>
            <li>點擊「新增廣告」按鈕來上傳新的廣告圖片</li>
            <li>點擊「查看」按鈕預覽已上傳的廣告圖片</li>
            <li>點擊「編輯」按鈕修改現有廣告的圖片</li>
            <li>點擊「啟用/停用」按鈕控制廣告是否顯示在網站上</li>
            <li>點擊「刪除」按鈕移除不需要的廣告</li>
          </ul>
          <p>啟用的廣告會在網站訪客瀏覽時彈出顯示，請確保您上傳的圖片符合海報比例以獲得最佳顯示效果。</p>
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center my-4">
        <Button 
          variant="success" 
          onClick={() => handleShowModal()}
          className="d-flex align-items-center"
        >
          <FaPlus className="me-2" /> 新增廣告
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
      ) : ads.length === 0 ? (
        <Alert variant="warning">
          <div className="text-center py-5">
            <FaImage size={48} className="mb-3 text-muted" />
            <h4>目前沒有彈出廣告</h4>
            <p>點擊「新增廣告」按鈕來上傳您的第一張廣告圖片。</p>
          </div>
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped hover>
            <thead>
              <tr>
                <th style={{ width: '5%' }}>#</th>
                <th style={{ width: '30%' }}>廣告預覽</th>
                <th style={{ width: '15%' }}>狀態</th>
                <th style={{ width: '15%' }}>上傳日期</th>
                <th style={{ width: '35%' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad, index) => (
                <tr key={ad.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="thumbnail-container" style={{ width: '200px', height: '120px', overflow: 'hidden' }}>
                      <img 
                        src={ad.image || "https://via.placeholder.com/300x150.png?text=No+Image+Available"} 
                        alt="廣告圖片"
                        className="img-fluid rounded"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => showImagePreview(ad)}
                      />
                    </div>
                  </td>
                  <td>
                    <Badge bg={ad.active ? "success" : "danger"}>
                      {ad.active ? "使用中" : "已停用"}
                    </Badge>
                  </td>
                  <td>
                    {ad.created_at ? new Date(ad.created_at).toLocaleDateString('zh-TW') : '未知日期'}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) => renderTooltip(props, "查看廣告圖片")}
                      >
                        <Button 
                          variant="info" 
                          size="sm"
                          onClick={() => showImagePreview(ad)}
                        >
                          <FaEye />
                        </Button>
                      </OverlayTrigger>
                    
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) => renderTooltip(props, "編輯廣告圖片")}
                      >
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleShowModal(ad)}
                        >
                          <FaEdit />
                        </Button>
                      </OverlayTrigger>
                      
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) => renderTooltip(props, ad.active ? "停用此廣告" : "啟用此廣告")}
                      >
                        <Button 
                          variant={ad.active ? "warning" : "success"} 
                          size="sm"
                          onClick={() => toggleActive(ad.id, ad.active)}
                        >
                          {ad.active ? <FaToggleOff /> : <FaToggleOn />}
                        </Button>
                      </OverlayTrigger>
                      
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) => renderTooltip(props, "刪除此廣告")}
                      >
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => confirmDelete(ad)}
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

      {/* 新增/編輯廣告的表單 */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentAd ? "編輯彈出廣告" : "新增彈出廣告"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label>上傳廣告圖片 <span className="text-danger">*</span></Form.Label>
              <div className="border rounded p-3 text-center bg-light">
                {(formData.image) ? (
                  <div className="position-relative">
                    <img 
                      src={formData.image} 
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
                  <div className="py-4">
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
                <Form.Text className="text-muted mt-2">
                  建議使用<strong>海報比例</strong>的圖片，檔案大小不超過 2MB。
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
            
            <Form.Group className="mb-3">
              <div className="d-flex align-items-center">
                <Form.Check 
                  type="switch"
                  id="active-switch"
                  label="立即啟用此廣告"
                  checked={formData.active} 
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })} 
                />
              </div>
              <Form.Text className="text-muted ms-4">
                啟用後，此廣告將會在訪客瀏覽網站時彈出顯示。您可以隨時更改此設定。
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
            <h4>您確定要刪除這張廣告圖片嗎？</h4>
            {adToDelete && (
              <div className="mt-3">
                <img
                  src={adToDelete.image || "https://via.placeholder.com/300x150.png?text=No+Image+Available"}
                  alt="廣告圖片"
                  className="img-fluid rounded mt-2"
                  style={{ maxHeight: '150px' }}
                />
              </div>
            )}
            <Alert variant="warning" className="mt-3">
              <FaInfoCircle className="me-2" />
              此操作無法復原，刪除後廣告將永久移除。
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
          <Modal.Title>廣告圖片預覽</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          {previewImage && (
            <img
              src={previewImage.image || "https://via.placeholder.com/800x600.png?text=No+Image+Available"}
              alt="廣告圖片"
              className="img-fluid rounded"
              style={{ maxHeight: '70vh' }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPreviewImage(null)}>
            關閉
          </Button>
          {previewImage && (
            <Button 
              variant="primary" 
              onClick={() => {
                setPreviewImage(null);
                handleShowModal(previewImage);
              }}
            >
              編輯此廣告
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PopupAdManager;