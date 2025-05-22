import React, { useState, useEffect } from 'react';
import { Container, Alert, Card, ProgressBar, Row, Col } from 'react-bootstrap';
import ForgotPassword from 'pages/User/func_forgot/ForgotPassPage';
import ResetPassword from 'pages/User/func_forgot/ResetPassPage';
import Axios from 'common/Axios';
import { CheckCircleFill, XCircleFill, EnvelopeFill, KeyFill } from 'react-bootstrap-icons';

const ForgotPasswordFlow = () => {
  // 基本狀態管理
  const [step, setStep] = useState(1); // 管理步驟
  const [email, setEmail] = useState(''); // 儲存輸入的電子郵件
  
  // 提示訊息狀態管理
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    variant: 'success',
    icon: <CheckCircleFill className="me-2" />
  });
  
  // 載入狀態
  const [isLoading, setIsLoading] = useState(false);
  
  // 處理階段1的提交：發送驗證碼
  const handleNext = async (email) => {
    setEmail(email); // 設定用戶的電子郵件
    setIsLoading(true); // 開始載入
    
    try {
      const response = await Axios().post('/basic/forgot_password', { 'email': email });
      
      if (response.status === 200) {
        showNotification('已寄驗證碼到您信箱，請查收！', 'success');
        // 延遲切換到下一步，讓用戶有時間看到成功訊息
        setTimeout(() => {
          setStep(2); // 切換到下一步
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '查無此電子郵件或系統發生錯誤';
      showNotification(errorMessage, 'danger');
    } finally {
      setIsLoading(false); // 結束載入狀態
    }
  };
  
  // 回到上一步
  const handleBack = () => {
    setStep(1);
  };
  
  // 重設密碼成功的回調
  const handleResetSuccess = () => {
    showNotification('密碼重設成功！即將返回登入頁面...', 'success');
    // 這裡可以設定一個定時器，然後導航到登入頁面
    setTimeout(() => {
      // window.location.href = '/login';
      // 或使用 React Router 導航
    }, 3000);
  };
  
  // 統一的提示訊息顯示函數
  const showNotification = (message, variant) => {
    const icon = variant === 'success' ? 
      <CheckCircleFill className="me-2" /> : 
      <XCircleFill className="me-2" />;
    
    setNotification({
      show: true,
      message,
      variant,
      icon
    });
    
    // 自動隱藏提示訊息
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };
  
  // 清除提示訊息
  const clearNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };
  
  // 獲取當前步驟的進度百分比
  const getProgressPercentage = () => {
    return step === 1 ? 33 : 66;
  };
  
  // 獲取當前步驟的標題
  const getStepTitle = () => {
    return step === 1 ? '步驟一：發送重設密碼信件' : '步驟二：輸入驗證碼並重設密碼';
  };
  
  // 獲取當前步驟的圖示
  const getStepIcon = () => {
    return step === 1 ? <EnvelopeFill className="me-2" /> : <KeyFill className="me-2" />;
  };

  return (
    <Container fluid="md" className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8} xl={7}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pt-4 pb-0">
              <h4 className="text-center mb-3">{getStepIcon()} {getStepTitle()}</h4>
              <ProgressBar 
                now={getProgressPercentage()} 
                variant="primary" 
                className="mb-4" 
                style={{ height: '8px' }}
              />
            </Card.Header>
            
            <Card.Body className="px-1 py-1">
              {notification.show && (
                <Alert 
                  variant={notification.variant}
                  dismissible
                  onClose={clearNotification}
                  className="d-flex align-items-center"
                >
                  {notification.icon}
                  {notification.message}
                </Alert>
              )}
              
              {step === 1 ? (
                <ForgotPassword onNext={handleNext} isLoading={isLoading} />
              ) : (
                <ResetPassword 
                  email={email} 
                  onBack={handleBack}
                  onResetSuccess={handleResetSuccess}
                />
              )}
            </Card.Body>
            
            <Card.Footer className="bg-white border-0 text-center pb-4">
              <small className="text-muted">
                {step === 1 ? 
                  '輸入您的電子郵件後，我們將發送一封含有驗證碼的郵件給您' : 
                  '請檢查您的信箱並輸入收到的驗證碼，然後設定新密碼'
                }
              </small>
            </Card.Footer>
          </Card>
          
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPasswordFlow;