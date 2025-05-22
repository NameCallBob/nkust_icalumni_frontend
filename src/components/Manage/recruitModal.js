import React, { useState } from 'react';
import { 
  Modal, Button, Form, ProgressBar, Container, 
  Card, Alert, InputGroup, Col, Row, Image, Spinner
} from 'react-bootstrap';
import { CheckCircle, AlertCircle, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RecruitFormModal = ({ 
  show, 
  onHide, 
  formData, 
  setFormData, 
  isPersonalContact, 
  setIsPersonalContact,
  isPersonalCompany,
  setIsPersonalCompany,
  handleQuillChange,
  imagePreviews,
  handleImageChange,
  handleSubmit,
  isEdit = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [validated, setValidated] = useState(false);
  const [stepErrors, setStepErrors] = useState({});
  // 新增加載狀態
  const [isLoading, setIsLoading] = useState(false);
  
  // 表單步驟定義
  const steps = [
    { 
      title: "職缺基本資訊", 
      description: "請填寫職缺的基本資料，讓求職者清楚了解這個職位",
      icon: "📋" 
    },
    { 
      title: "聯絡資訊", 
      description: "請提供求職者可以聯繫的方式",
      icon: "📞" 
    },
    { 
      title: "職缺詳細說明", 
      description: "詳細描述職缺內容、福利與要求",
      icon: "📝" 
    },
    { 
      title: "上傳相關圖片", 
      description: "可上傳公司環境、福利或其他相關圖片",
      icon: "🖼️" 
    }
  ];
  
  // 驗證當前步驟表單
  const validateCurrentStep = () => {
    let isValid = true;
    const errors = {};
    
    // 根據當前步驟驗證不同欄位
    switch(currentStep) {
      case 0: // 職缺基本資訊
        if (!formData.title?.trim()) {
          isValid = false;
          errors.title = "請輸入職位名稱";
        }
        
        if (!isPersonalCompany && !formData.company_name?.trim()) {
          isValid = false;
          errors.company_name = "請輸入公司名稱";
        }
        
        if (!formData.release_date) {
          isValid = false;
          errors.release_date = "請選擇發布日期";
        }
        
        if (!formData.deadline) {
          isValid = false;
          errors.deadline = "請選擇截止日期";
        }
        
        if (formData.release_date && formData.deadline && 
            new Date(formData.release_date) > new Date(formData.deadline)) {
          isValid = false;
          errors.deadline = "截止日期不能早於發布日期";
        }
        break;
        
      case 1: // 聯絡資訊
        if (!isPersonalContact) {
          if (!formData.contact?.name?.trim()) {
            isValid = false;
            errors.contactName = "請輸入聯絡人姓名";
          }
          
          if (!formData.contact?.email?.trim()) {
            isValid = false;
            errors.contactEmail = "請輸入聯絡人 Email";
          } else if (!/\S+@\S+\.\S+/.test(formData.contact.email)) {
            isValid = false;
            errors.contactEmail = "請輸入有效的 Email 地址";
          }
          
          if (!formData.contact?.phone?.trim()) {
            isValid = false;
            errors.contactPhone = "請輸入聯絡人電話";
          }
        }
        break;
        
      case 2: // 職缺詳細說明
        if (!formData.intro || formData.intro === '<p><br></p>') {
          isValid = false;
          errors.intro = "請填寫職缺詳細說明";
        }
        break;
        
      // 第 3 步驟 (圖片上傳) 沒有必填欄位
      case 3:
        // 您可以在這裡添加圖片的驗證邏輯，例如檢查圖片大小、類型等
        break;
    }
    
    setStepErrors(errors);
    return isValid;
  };
  
  // 驗證所有步驟
  const validateAllSteps = () => {
    // 儲存當前步驟
    const originalStep = currentStep;
    let allValid = true;
    
    // 驗證每個步驟
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      if (!validateCurrentStep()) {
        allValid = false;
        setCurrentStep(i); // 停在第一個無效的步驟
        break;
      }
    }
    
    // 如果全部有效但我們改變了當前步驟，恢復原來的步驟
    if (allValid && originalStep !== currentStep) {
      setCurrentStep(originalStep);
    }
    
    return allValid;
  };
  
  // 處理表單提交 - 修改此函數以添加加載狀態
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // 只有在最後一步時才執行完整表單驗證和提交
    if (currentStep === steps.length - 1) {
      if (!validateAllSteps()) {
        setValidated(true);
        return;
      }
      
      // 顯示加載動畫
      setIsLoading(true);
      
      // 所有驗證都通過，呼叫提交處理函數
      try {
        // 呼叫 Promise 類型的 handleSubmit
        Promise.resolve(handleSubmit(e))
          .then(() => {
            // 提交成功後隱藏加載動畫
            setIsLoading(false);
          })
          .catch(error => {
            console.error('表單提交錯誤:', error);
            setIsLoading(false);
          });
      } catch (error) {
        // 處理非 Promise 類型的 handleSubmit
        console.error('表單提交錯誤:', error);
        setIsLoading(false);
      }
    } else {
      // 如果不是最後一步，只進行到下一步的操作
      handleNext();
    }
  };
  
  // 下一步
  const handleNext = () => {
    // 使用自定義表單驗證
    if (!validateCurrentStep()) {
      setValidated(true);
      return;
    }
    
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    setValidated(false);
  };
  
  // 上一步
  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setValidated(false);
    setStepErrors({});
  };

  // 渲染步驟指示器
  const renderStepIndicator = () => (
    <div className="mb-4">
      <ProgressBar now={(currentStep + 1) * 100 / steps.length} />
      <div className="d-flex justify-content-between mt-2">
        {steps.map((step, index) => (
          <div key={index} className={`text-center ${index <= currentStep ? 'text-primary fw-bold' : 'text-muted'}`} style={{width: '25%'}}>
            <div>{step.icon}</div>
            <small>{step.title}</small>
          </div>
        ))}
      </div>
    </div>
  );

  // 渲染當前步驟表單
  const renderStepContent = () => {
    switch(currentStep) {
      case 0: // 職缺基本資訊
        return (
          <div className="step-form">
            <Alert variant="info" className="mb-3">
              <div className="d-flex align-items-center">
                <HelpCircle className="me-2" size={20} />
                <span>{steps[0].description}</span>
              </div>
            </Alert>
            
            <Form.Group className="mb-3" controlId="formJobTitle">
              <Form.Label>職位名稱 <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={e => setFormData({...formData, title: e.target.value})}
                isInvalid={validated && !!stepErrors.title}
                placeholder="例如：前端工程師、行銷專員、專案經理"
              />
              <Form.Control.Feedback type="invalid">
                {stepErrors.title || "請輸入職位名稱"}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                一個清晰的職位名稱將吸引更多合適的求職者
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="isPersonalCompany"
                label="使用我的公司資料"
                checked={isPersonalCompany}
                onChange={() => setIsPersonalCompany(!isPersonalCompany)}
              />
              <Form.Text className="text-muted ms-4">
                勾選後將使用您的公司資料，無需再次填寫
              </Form.Text>
            </Form.Group>
            
            {!isPersonalCompany && (
              <Form.Group className="mb-3" controlId="formJobCompany">
                <Form.Label>公司名稱 <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="company_name"
                  value={formData.company_name || ''}
                  onChange={e => setFormData({...formData, company_name: e.target.value})}
                  isInvalid={validated && !!stepErrors.company_name}
                  placeholder="請輸入公司名稱"
                />
                <Form.Control.Feedback type="invalid">
                  {stepErrors.company_name || "請輸入公司名稱"}
                </Form.Control.Feedback>
              </Form.Group>
            )}
            
            <Row>
              <Form.Group as={Col} className="mb-3" controlId="formPostDate">
                <Form.Label>發布時間 <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="date"
                  name="release_date"
                  value={formData.release_date || ''}
                  onChange={e => setFormData({...formData, release_date: e.target.value})}
                  isInvalid={validated && !!stepErrors.release_date}
                />
                <Form.Control.Feedback type="invalid">
                  {stepErrors.release_date || "請選擇發布日期"}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  職缺開始顯示的日期
                </Form.Text>
              </Form.Group>
              
              <Form.Group as={Col} className="mb-3" controlId="formEndDate">
                <Form.Label>截止時間 <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="date"
                  name="deadline"
                  value={formData.deadline || ''}
                  onChange={e => setFormData({...formData, deadline: e.target.value})}
                  isInvalid={validated && !!stepErrors.deadline}
                />
                <Form.Control.Feedback type="invalid">
                  {stepErrors.deadline || "請選擇截止日期"}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  職缺停止顯示的日期
                </Form.Text>
              </Form.Group>
            </Row>
          </div>
        );
        
      case 1: // 聯絡資訊
        return (
          <div className="step-form">
            <Alert variant="info" className="mb-3">
              <div className="d-flex align-items-center">
                <HelpCircle className="me-2" size={20} />
                <span>{steps[1].description}</span>
              </div>
            </Alert>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="isPersonalContact"
                label="使用我的聯絡資料"
                checked={isPersonalContact}
                onChange={() => setIsPersonalContact(!isPersonalContact)}
              />
              <Form.Text className="text-muted ms-4">
                勾選後將使用您的聯絡資料，無需再次填寫
              </Form.Text>
            </Form.Group>
            
            {!isPersonalContact && (
              <>
                <Form.Group className="mb-3" controlId="formContactName">
                  <Form.Label>聯絡人姓名 <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="contact.name"
                    value={(formData.contact?.name) || ''}
                    onChange={e => setFormData({
                      ...formData, 
                      contact: {...formData.contact, name: e.target.value}
                    })}
                    isInvalid={validated && !!stepErrors.contactName}
                    placeholder="請輸入聯絡人姓名"
                  />
                  <Form.Control.Feedback type="invalid">
                    {stepErrors.contactName || "請輸入聯絡人姓名"}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formContactEmail">
                  <Form.Label>聯絡人 Email <span className="text-danger">*</span></Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text>@</InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="contact.email"
                      value={(formData.contact?.email) || ''}
                      onChange={e => setFormData({
                        ...formData, 
                        contact: {...formData.contact, email: e.target.value}
                      })}
                      isInvalid={validated && !!stepErrors.contactEmail}
                      placeholder="example@company.com"
                    />
                    <Form.Control.Feedback type="invalid">
                      {stepErrors.contactEmail || "請輸入有效的 Email 地址"}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    此 Email 將用於接收求職者的應徵訊息
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formContactPhone">
                  <Form.Label>聯絡人電話 <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="contact.phone"
                    value={(formData.contact?.phone) || ''}
                    onChange={e => setFormData({
                      ...formData, 
                      contact: {...formData.contact, phone: e.target.value}
                    })}
                    isInvalid={validated && !!stepErrors.contactPhone}
                    placeholder="例如：02-12345678 或 0912-345-678"
                  />
                  <Form.Control.Feedback type="invalid">
                    {stepErrors.contactPhone || "請輸入聯絡人電話"}
                  </Form.Control.Feedback>
                </Form.Group>
              </>
            )}
          </div>
        );
        
      case 2: // 職缺詳細說明
        return (
          <div className="step-form">
            <Alert variant="info" className="mb-3">
              <div className="d-flex align-items-center">
                <HelpCircle className="me-2" size={20} />
                <span>{steps[2].description}</span>
              </div>
            </Alert>
            
            <Card className="mb-3">
              <Card.Header>填寫技巧</Card.Header>
              <Card.Body>
                <p>優秀的職缺說明應包含以下部分：</p>
                <ul>
                  <li>職責範圍：此職位的主要工作內容</li>
                  <li>資格要求：應徵者需具備的技能與經驗</li>
                  <li>工作福利：提供的薪資範圍、獎金制度或其他福利</li>
                  <li>工作環境：工作地點、時間、遠端工作機會等</li>
                </ul>
              </Card.Body>
            </Card>
            
            <Form.Group className="mb-3" controlId="formJobDescription">
              <Form.Label>詳細資料說明 <span className="text-danger">*</span></Form.Label>
              <div className="border" style={{ minHeight: '300px' }}>
                <ReactQuill
                  value={formData.intro || ''}
                  onChange={handleQuillChange}
                  placeholder="請詳細描述此職位..."
                  style={{ height: '250px' }}
                />
              </div>
              {validated && stepErrors.intro && (
                <div className="text-danger mt-1 small">
                  {stepErrors.intro}
                </div>
              )}
              <Form.Text className="text-muted">
                使用上方的編輯工具可以格式化文字，添加列表、標題等
              </Form.Text>
            </Form.Group>
          </div>
        );
        
      case 3: // 上傳圖片
        return (
          <div className="step-form">
            <Alert variant="info" className="mb-3">
              <div className="d-flex align-items-center">
                <HelpCircle className="me-2" size={20} />
                <span>{steps[3].description}</span>
              </div>
            </Alert>
            
            <Card className="mb-3">
              <Card.Header>圖片上傳指南</Card.Header>
              <Card.Body>
                <p>您可以上傳與職缺相關的圖片，例如：</p>
                <ul>
                  <li>公司環境照片</li>
                  <li>團隊活動照片</li>
                  <li>相關產品或服務照片</li>
                </ul>
                <p className="mb-0">建議上傳清晰、專業的圖片，尺寸不超過 2MB</p>
              </Card.Body>
            </Card>
            
            <Form.Group controlId="formJobImages" className="mb-3">
              <Form.Label>上傳照片</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              <Form.Text className="text-muted">
                可選擇多張圖片一起上傳
              </Form.Text>
            </Form.Group>
            
            {imagePreviews.length > 0 && (
              <div>
                <p>已選擇的圖片：</p>
                <div className="d-flex flex-wrap">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="position-relative me-2 mb-2">
                      <Image
                        src={typeof src === 'string' ? src : (src.image ? process.env.REACT_APP_BASE_URL + src.image : src)}
                        alt="預覽照片"
                        thumbnail
                        style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Form noValidate onSubmit={handleFormSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "編輯職位" : "新增職位"}</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {renderStepIndicator()}
          
          <h4 className="mb-3">
            {steps[currentStep].icon} {steps[currentStep].title}
          </h4>
          
          {renderStepContent()}
        </Modal.Body>
        
        <Modal.Footer>
          {/* 禁用按鈕當正在提交時 */}
          {currentStep > 0 && (
            <Button 
              variant="outline-secondary" 
              onClick={handlePrev} 
              disabled={isLoading}
            >
              <ChevronLeft size={16} /> 上一步
            </Button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <Button 
              variant="primary" 
              onClick={handleNext} 
              type="button" 
              disabled={isLoading}
            >
              下一步 <ChevronRight size={16} />
            </Button>
          ) : (
            <Button 
              variant="success" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {isEdit ? "儲存中..." : "發布中..."}
                </>
              ) : (
                isEdit ? "儲存修改" : "發布職位"
              )}
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RecruitFormModal;