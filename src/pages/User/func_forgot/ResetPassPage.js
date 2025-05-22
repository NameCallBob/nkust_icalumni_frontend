import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card, InputGroup, Spinner, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { KeyFill, EyeFill, EyeSlashFill, ShieldLockFill, CheckCircleFill, ArrowLeftCircleFill, InfoCircle } from 'react-bootstrap-icons';
import Axios from 'common/Axios';

const ResetPassword = ({ email, onBack, onResetSuccess }) => {
  // 基本狀態
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // 密碼相關狀態
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formTouched, setFormTouched] = useState({
    code: false,
    newPassword: false,
    confirmPassword: false
  });
  
  const navigate = useNavigate();
  
  // 檢查密碼強度
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // 長度檢查
    if (newPassword.length >= 8) strength += 25;
    
    // 複雜度檢查
    if (/[A-Z]/.test(newPassword)) strength += 25; // 大寫字母
    if (/[0-9]/.test(newPassword)) strength += 25; // 數字
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 25; // 特殊字符
    
    setPasswordStrength(strength);
  }, [newPassword]);
  
  // 獲取密碼強度顏色
  const getStrengthColor = () => {
    if (passwordStrength < 50) return 'danger';
    if (passwordStrength < 75) return 'warning';
    return 'success';
  };
  
  // 獲取密碼強度文字
  const getStrengthText = () => {
    if (passwordStrength < 50) return '弱';
    if (passwordStrength < 75) return '中';
    return '強';
  };
  
  // 表單驗證
  const validateForm = () => {
    // 檢查是否所有欄位都已填寫
    if (!code || !newPassword || !confirmPassword) {
      setError('所有欄位都需要填寫');
      return false;
    }
    
    // 驗證碼格式驗證（假設是6位數字）
    if (!/^\d{6}$/.test(code)) {
      setError('驗證碼應為6位數字');
      return false;
    }
    
    // 密碼強度檢查
    if (passwordStrength < 50) {
      setError('密碼強度太弱，請包含大寫字母、數字和特殊字符');
      return false;
    }
    
    // 檢查密碼一致性
    if (newPassword !== confirmPassword) {
      setError('新密碼與確認密碼不一致');
      return false;
    }
    
    return true;
  };
  
  // 處理欄位變更
  const handleFieldChange = (field, value) => {
    // 清除錯誤提示
    setError('');
    
    // 更新對應的欄位值
    switch (field) {
      case 'code':
        setCode(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
    
    // 標記欄位為已觸碰
    setFormTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };
  
  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 驗證表單
    if (!validateForm()) {
      return;
    }
    
    // 設置載入狀態
    setIsLoading(true);
    
    try {
      // 發送重設密碼請求
      const response = await Axios().post('/basic/forgot_verify', {
        "code": code,
        "new_password": newPassword
      });
      
      // 處理成功響應
      setSuccessMessage('密碼重設成功！正在跳轉到登入頁面...');
      
      // 如果有成功回調函數，則調用它
      if (typeof onResetSuccess === 'function') {
        onResetSuccess();
      } else {
        // 否則使用默認行為
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      // 處理錯誤
      const errorMessage = error.response?.data?.message || '驗證碼錯誤或已過期';
      setError(errorMessage);
    } finally {
      // 結束載入狀態
      setIsLoading(false);
    }
  };
  
  // 處理返回上一步
  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack();
    }
  };
  
  // 切換密碼可見性
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // 切換確認密碼可見性
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
      <Row className="justify-content-center">
        <Col md={8} lg={7} xl={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  {onBack && (
                    <Button 
                      variant="link" 
                      className="text-decoration-none p-0 me-2" 
                      onClick={handleBack}
                      disabled={isLoading}
                    >
                      <ArrowLeftCircleFill className="me-1" /> 返回
                    </Button>
                  )}
                </div>
                <h4 className="mb-0 text-center flex-grow-1">
                  <ShieldLockFill className="me-2" /> 重設密碼
                </h4>
                <div style={{ width: '60px' }}></div> {/* 為了保持標題居中 */}
              </div>
              
              {email && (
                <Alert variant="info" className="mb-4">
                  <small>為 <strong>{email}</strong> 重設密碼</small>
                </Alert>
              )}
              
              {error && (
                <Alert variant="danger" className="d-flex align-items-center">
                  <InfoCircle className="me-2" /> {error}
                </Alert>
              )}
              
              {successMessage && (
                <Alert variant="success" className="d-flex align-items-center">
                  <CheckCircleFill className="me-2" /> {successMessage}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formCode" className="mb-3">
                  <Form.Label className="fw-medium">驗證碼</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light">
                      <KeyFill />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="輸入6位數驗證碼"
                      value={code}
                      onChange={(e) => handleFieldChange('code', e.target.value)}
                      onBlur={() => setFormTouched(prev => ({ ...prev, code: true }))}
                      isInvalid={formTouched.code && (!/^\d{6}$/.test(code) && code !== '')}
                      disabled={isLoading || !!successMessage}
                    />
                    <Form.Control.Feedback type="invalid">
                      請輸入6位數驗證碼
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    驗證碼已發送到您的電子郵件
                  </Form.Text>
                </Form.Group>
                
                <Form.Group controlId="formNewPassword" className="mb-3">
                  <Form.Label className="fw-medium">新密碼</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light">
                      <KeyFill />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="輸入新密碼"
                      value={newPassword}
                      onChange={(e) => handleFieldChange('newPassword', e.target.value)}
                      onBlur={() => setFormTouched(prev => ({ ...prev, newPassword: true }))}
                      isInvalid={formTouched.newPassword && passwordStrength < 50 && newPassword !== ''}
                      disabled={isLoading || !!successMessage}
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={togglePasswordVisibility}
                      disabled={isLoading || !!successMessage}
                    >
                      {showPassword ? <EyeSlashFill /> : <EyeFill />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      密碼需包含大寫字母、數字和特殊字符
                    </Form.Control.Feedback>
                  </InputGroup>
                  
                  {newPassword && (
                    <div className="mt-2">
                      <small className="d-flex justify-content-between">
                        <span>密碼強度：</span>
                        <span className={`text-${getStrengthColor()}`}>{getStrengthText()}</span>
                      </small>
                      <ProgressBar 
                        variant={getStrengthColor()} 
                        now={passwordStrength} 
                        className="mt-1" 
                        style={{ height: '5px' }}
                      />
                      <Form.Text className="text-muted mt-1">
                        建議使用至少8個字符，包含大小寫字母、數字和符號
                      </Form.Text>
                    </div>
                  )}
                </Form.Group>
                
                <Form.Group controlId="formConfirmPassword" className="mb-4">
                  <Form.Label className="fw-medium">確認新密碼</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light">
                      <KeyFill />
                    </InputGroup.Text>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="再次輸入新密碼"
                      value={confirmPassword}
                      onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                      onBlur={() => setFormTouched(prev => ({ ...prev, confirmPassword: true }))}
                      isInvalid={formTouched.confirmPassword && newPassword !== confirmPassword && confirmPassword !== ''}
                      disabled={isLoading || !!successMessage}
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={toggleConfirmPasswordVisibility}
                      disabled={isLoading || !!successMessage}
                    >
                      {showConfirmPassword ? <EyeSlashFill /> : <EyeFill />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      與新密碼不一致
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isLoading || !code || !newPassword || !confirmPassword || !!successMessage}
                    className="py-2"
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
                        處理中...
                      </>
                    ) : (
                      '確認重設密碼'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          
          <div className="text-center mt-3">
            <small className="text-muted">
              沒有收到驗證碼？ <a href="#resend" className="text-decoration-none">重新發送</a>
            </small>
          </div>
        </Col>
      </Row>
  );
};

export default ResetPassword;