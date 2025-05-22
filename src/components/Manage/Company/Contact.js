import React from "react";
import { Form, Alert, Image, Row, Col, InputGroup, FormText, Card } from "react-bootstrap";

const ContactInfo = ({ company, handleInputChange, handleFileChange }) => {
  return (
    <div>
      <Form.Group controlId="formWebsite" className="mb-4">
        <Form.Label style={{ fontSize: "18px", fontWeight: "500" }}>
          公司網站連結
        </Form.Label>
        <InputGroup>
          <InputGroup.Text>
            <span className="text-primary">🌐</span>
          </InputGroup.Text>
          <Form.Control
            type="url"
            name="website"
            value={company.website}
            onChange={handleInputChange}
            placeholder="例如：https://www.example.com"
            style={{ fontSize: "16px", padding: "12px", borderRadius: "8px" }}
          />
        </InputGroup>
        <FormText className="text-muted mt-2" style={{ fontSize: "14px" }}>
          <span>✅ 提示：輸入完整網址，記得包含 http:// 或 https://</span>
        </FormText>
      </Form.Group>

      <Form.Group controlId="formAddress" className="mb-4">
        <Form.Label style={{ fontSize: "18px", fontWeight: "500" }}>
          公司地址
        </Form.Label>
        <InputGroup>
          <InputGroup.Text>
            <span className="text-primary">📍</span>
          </InputGroup.Text>
          <Form.Control
            as="textarea"
            rows={2}
            name="address"
            value={company.address}
            onChange={handleInputChange}
            placeholder="例如：台北市信義區松仁路100號10樓"
            style={{ fontSize: "16px", padding: "12px", borderRadius: "8px" }}
          />
        </InputGroup>
        <FormText className="text-muted mt-2" style={{ fontSize: "14px" }}>
          <span>✅ 提示：填寫完整地址，包含郵遞區號（如有）</span>
        </FormText>
      </Form.Group>

      <Form.Group controlId="formEmail" className="mb-4">
        <Form.Label style={{ fontSize: "18px", fontWeight: "500" }}>
          聯絡信箱
        </Form.Label>
        <InputGroup>
          <InputGroup.Text>
            <span className="text-primary">✉️</span>
          </InputGroup.Text>
          <Form.Control
            type="email"
            name="email"
            value={company.email}
            onChange={handleInputChange}
            placeholder="例如：contact@example.com"
            style={{ fontSize: "16px", padding: "12px", borderRadius: "8px" }}
          />
        </InputGroup>
        <FormText className="text-muted mt-2" style={{ fontSize: "14px" }}>
          <span>✅ 提示：建議使用公司信箱，而非個人信箱</span>
        </FormText>
      </Form.Group>

      <Form.Group controlId="formPhoneNumber" className="mb-4">
        <Form.Label style={{ fontSize: "18px", fontWeight: "500" }}>
          聯絡電話
        </Form.Label>
        <InputGroup>
          <InputGroup.Text>
            <span className="text-primary">📞</span>
          </InputGroup.Text>
          <Form.Control
            type="text"
            name="phone_number"
            value={company.phone_number}
            onChange={handleInputChange}
            placeholder="例如：0287654321 或 0912345678"
            style={{ fontSize: "16px", padding: "12px", borderRadius: "8px" }}
          />
        </InputGroup>
        <FormText className="text-muted mt-2" style={{ fontSize: "14px" }}>
          <span>✅ 提示：請只輸入數字，不需輸入其他符號如空格、橫線等</span>
        </FormText>
      </Form.Group>

      <Card className="bg-light mb-4">
        <Card.Body>
          <Card.Title style={{ fontSize: "16px" }}>照片上傳教學</Card.Title>
          <Card.Text>
            <ol>
              <li>準備一張清晰的公司照片（如公司外觀、辦公環境或團隊合照）</li>
              <li>點擊下方「選擇檔案」按鈕</li>
              <li>在您的電腦中選取照片</li>
              <li>照片會自動顯示在預覽區域</li>
            </ol>
            <div className="alert alert-warning">
              <b>注意：</b> 照片大小不能超過 5MB，建議使用正方形照片獲得最佳顯示效果。
            </div>
          </Card.Text>
        </Card.Body>
      </Card>

      <Form.Group controlId="formPhoto" className="mb-4">
        <Form.Label style={{ fontSize: "18px", fontWeight: "500" }}>
          公司照片
        </Form.Label>
        <div className="custom-file-upload">
          <Form.Control
            type="file"
            name="photo"
            accept="image/jpeg, image/png, image/gif"
            onChange={handleFileChange}
            style={{ padding: "12px", borderRadius: "8px", fontSize: "16px" }}
          />
          <FormText className="text-muted mt-2" style={{ fontSize: "14px" }}>
            <span>✅ 提示：上傳公司外觀、辦公環境或團隊合照，檔案大小不超過 5MB</span>
          </FormText>
        </div>
      </Form.Group>

      <h4 className="text-center mt-5 mb-3">照片預覽</h4>

      <Row className="text-center">
        <Col xs={12} md={6} className="mb-4">
          <h5 style={{ fontSize: "18px", marginBottom: "15px" }}>您上傳的照片</h5>
          <div style={{ border: "1px dashed #ccc", padding: "10px", borderRadius: "8px", minHeight: "200px" }}>
            {company.photo ? (
              <Image
                src={company.photo}
                alt="上傳照片預覽"
                fluid
                style={{
                  maxWidth: "100%",
                  maxHeight: "250px",
                  objectFit: "contain",
                }}
              />
            ) : company.photo_url ? (
              <Image
                src={process.env.REACT_APP_BASE_URL + company.photo_url}
                alt="公司照片"
                fluid
                style={{
                  maxWidth: "100%",
                  maxHeight: "250px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div className="text-center p-5 text-muted">
                <span style={{ fontSize: "40px" }}>📷</span>
                <p className="mt-3">尚未上傳照片</p>
              </div>
            )}
          </div>
        </Col>
        
        <Col xs={12} md={6} className="mb-4">
          <h5 style={{ fontSize: "18px", marginBottom: "15px" }}>在網站上的顯示效果</h5>
          <div style={{ border: "1px dashed #ccc", padding: "10px", borderRadius: "8px", minHeight: "200px", backgroundColor: "#f9f9f9" }}>
            {company.photo ? (
              <Image
                src={company.photo}
                rounded
                fluid
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                alt="網站顯示效果預覽"
              />
            ) : company.photo_url ? (
              <Image
                src={process.env.REACT_APP_BASE_URL + company.photo_url}
                rounded
                fluid
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                alt="網站顯示效果預覽"
              />
            ) : (
              <div className="text-center p-5 text-muted">
                <span style={{ fontSize: "40px" }}>🖼️</span>
                <p className="mt-3">尚未上傳照片</p>
              </div>
            )}
          </div>
        </Col>
      </Row>
      
      <div className="text-center p-3 bg-light rounded" style={{ fontSize: "16px" }}>
        <p className="mb-1">💡 <b>專業提示：</b></p>
        <p>上傳一張高品質的公司照片可以提高客戶對您的信任度及專業形象。<br/>
        建議使用專業拍攝的照片，避免使用模糊或像素低的圖片。</p>
      </div>
    </div>
  );
};

export default ContactInfo;