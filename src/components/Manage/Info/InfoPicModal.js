import React, { useState } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import Axios from "common/Axios";
import { toast } from "react-toastify";

const UploadImageModal = ({ show, onClose, onUploadSuccess , page_type }) => {
  const [base64Image, setBase64Image] = useState("");
  const [imageType, setImageType] = useState("large");
  const [isUploading, setIsUploading] = useState(false);

  // 將檔案轉換為 Base64
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBase64Image(reader.result); // 儲存 Base64 編碼的圖片
      };
      reader.readAsDataURL(file); // 將檔案讀取為 Base64 格式
    }
  };

  // 上傳圖片
  const handleUpload = async () => {
    if (!base64Image) {
      alert("請選擇圖片！");
      return;
    }

    try {
      setIsUploading(true);
      const response = await Axios().post(`/info/${page_type}/create_image/`, {
        file: base64Image,
        image_type: imageType,
        is_active:true
      });
      toast.success("圖片上傳成功！");
      onUploadSuccess(response.data); // 回傳成功的圖片資訊
      setBase64Image(""); // 清空 Base64 編碼
      setImageType("large"); // 重置圖片類型
      onClose();
    } catch (error) {
      console.error("上傳失敗：", error);
      toast.error("圖片上傳失敗，請稍後再試！");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>新增照片</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>圖片類型</Form.Label>
            <Form.Select
              value={imageType}
              onChange={(e) => setImageType(e.target.value)}
            >
              <option value="large">大圖</option>
              <option value="small">小圖</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>選擇圖片檔案</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isUploading}>
          取消
        </Button>
        <Button variant="primary" onClick={handleUpload} disabled={isUploading}>
          {isUploading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              上傳中...
            </>
          ) : (
            "保存"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadImageModal;
