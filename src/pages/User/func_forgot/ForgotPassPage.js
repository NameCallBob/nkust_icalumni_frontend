import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card, InputGroup, Spinner } from 'react-bootstrap';
import { EnvelopeFill, ArrowRightCircleFill, InfoCircle } from 'react-bootstrap-icons';

const ForgotPassword = ({ onNext }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  
  // 驗證電子郵件格式
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const isEmailValid = email ? validateEmail(email) : false;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('請輸入您的電子郵件');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('請輸入有效的電子郵件格式');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // 這裡可以添加與後端 API 的通信邏輯
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 800));
      onNext(email); // 移動到下一步，並傳遞電子郵件
    } catch (err) {
      setError('發送重置密碼郵件時出錯，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsTouched(true);
    // 清除之前的錯誤
    if (e.target.value && validateEmail(e.target.value)) {
      setError('');
    }
  };

  return (
      <Row className="justify-content-center">
        <Col md={10} lg={7} xl={6}>
          <Card className="shadow-sm border-0 rounded-lg">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-2">忘記密碼</h2>
                <p className="text-muted">
                  請輸入您的電子郵件，我們將發送重置密碼的驗證碼，確認是您本人進行密碼修正
                </p>
              </div>
              
              {error && (
                <Alert variant="danger" className="d-flex align-items-center">
                  <InfoCircle className="me-2" size={20} />
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail" className="mb-4">
                  <Form.Label className="fw-medium">電子郵件地址</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light">
                      <EnvelopeFill />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="example@company.com"
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={() => setIsTouched(true)}
                      className="py-2"
                      isInvalid={isTouched && email && !isEmailValid}
                      aria-describedby="emailHelpBlock"
                    />
                    <Form.Control.Feedback type="invalid">
                      請輸入有效的電子郵件格式
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text id="emailHelpBlock" muted>
                    請輸入您註冊時使用的電子郵件地址
                  </Form.Text>
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    className="fw-medium rounded-pill py-2" 
                    disabled={isLoading || !email || !isEmailValid}
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
                      <>
                        下一步
                        <ArrowRightCircleFill className="ms-2" />
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="text-center mt-4">
                  <a href="/login" className="text-decoration-none">
                    返回登入頁面
                  </a>
                </div>
              </Form>
            </Card.Body>
          </Card>

        </Col>
      </Row>
  );
};

export default ForgotPassword;