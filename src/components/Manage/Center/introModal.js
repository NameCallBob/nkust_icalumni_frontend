import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

const ThankYouModal = ({show , handleClose}) => {

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered 
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100 text-primary">
          哈摟系友～
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Alert variant="warning" className="text-center">
          <h3>親愛的系友，請注意！</h3>
          <p>在開始使用系友會平台前，您需要完成兩個重要步驟：</p>
        </Alert>

        <div className="text-center mb-4">
          <h4>📝 資料登錄檢查表</h4>
          <div className="d-flex justify-content-center">
            <ul className="list-unstyled text-left">
              <li>✅ 個人資料登錄</li>
              <li>✅ 工作/公司資料登錄</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted">
            完成資料登錄後，您將可以：
            • 上傳個人、公司照片
            • 添加招募資訊
            • 登入各種商品
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer className="justify-content-center">
        <p>請先到頁面左邊填寫個人資訊～</p>
      </Modal.Footer>
    </Modal>
  );
};

export default ThankYouModal;