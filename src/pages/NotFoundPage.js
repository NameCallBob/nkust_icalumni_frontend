import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SEO from 'SEO';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [randomJoke, setRandomJoke] = useState('');
  
  // 幽默的404錯誤訊息集合
  const jokes = [
    '哎呀！這個頁面好像搭錯了時空列車...',
    '糟糕！這個頁面被網路狗狗叼走了！',
    '喔不！你要找的頁面可能去度假了！',
    '這個頁面正在量子疊加態，同時存在又不存在...',
    '頁面迷路了！就像我們有時在人生中迷路一樣～',
    '404：頁面已經被外星人帶走做研究了！'
  ];
  
  // 隨機選擇一則幽默訊息
  useEffect(() => {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    setRandomJoke(joke);
  }, []);
  
  const goHome = () => {
    navigate('/');
  };
  
  // 計算已經過去的時間
  const [seconds, setSeconds] = useState(5);
  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  return (
    <Container className="text-center my-5" style={{ paddingTop: '50px', minHeight: '80vh' }}>
      <SEO
        main={false}
        title="404 - 頁面未找到"
        description="抱歉，您所尋找的頁面不存在"
        keywords={["404", "頁面未找到", "錯誤頁面"]}
      />
      
      <Card className="shadow-lg border-0 p-4">
        <Card.Body>
          <div className="mb-4">
            {/* 可以替換成實際的SVG或圖片 */}
            <div style={{ fontSize: '120px', color: '#6c757d' }}>
              4😵4
            </div>
          </div>
          
          <h1 className="display-4 mb-3">哎呀！頁面走失了</h1>
          
          <p className="lead mb-4">{randomJoke}</p>
          
          <div className="mb-4">
            <p>您可能是通過過期的連結或輸入了錯誤的地址來到這裡的。</p>
            <p className="text-muted">別擔心，我們會在{seconds > 0 ? `${seconds}秒後` : '立刻'}帶您回家！</p>
          </div>
          
          <Row className="justify-content-center">
            <Col xs={12} md={6} lg={4}>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={goHome} 
                className="w-100 mb-3"
                style={{
                  background: 'linear-gradient(45deg, #007bff, #00d2ff)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(0, 123, 255, 0.4)'
                }}
              >
                <i className="fas fa-home me-2"></i> 讓我們回家吧！
              </Button>
            </Col>
          </Row>
          
          <div className="mt-4">
            <p className="text-muted small">
              如果您認為這是一個錯誤，請 
              <a href="/contact" className="text-decoration-none"> 聯繫我們</a>
            </p>
          </div>
        </Card.Body>
      </Card>
      
      {/* 當倒數結束時自動導向首頁 */}
      {seconds === 0 && (
        <script>{setTimeout(() => navigate('/'), 500)}</script>
      )}
    </Container>
  );
};

export default NotFoundPage;