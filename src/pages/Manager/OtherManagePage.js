import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Container, Card, Row, Col, Breadcrumb, Spinner } from 'react-bootstrap';
import IndustryCRUD from 'components/Manage/Other/IndustryMana';
import AlumniPositionCRUD from 'components/Manage/Other/PositionMana';
import 'css/manage/othermanage.css';
import { Link } from 'react-router-dom';
import useRWD from 'hooks/useRWD';

const OtherManage = () => {
    const [activeKey, setActiveKey] = useState('industry');
    const [loading, setLoading] = useState(true);
    const rwd = useRWD();

    useEffect(() => {
      // 模擬載入過程
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }, []);

    const handleTabChange = (key) => {
      setLoading(true);
      setActiveKey(key);
      
      // 模擬切換標籤時的載入狀態
      setTimeout(() => {
        setLoading(false);
      }, 300);
    };

    return (
      <Container className="admin-container py-4" style={rwd.getContainerStyle()}>
        <Card className="shadow-sm border-0 mb-4">
          <Card.Header className="bg-gradient text-white d-flex align-items-center"
                       style={{ backgroundColor: '#3a75c4', ...rwd.getButtonStyle() }}>
            <i className="fas fa-cogs me-2 fa-lg"></i>
            <h3 className="mb-0 fs-4">系統設定管理</h3>
          </Card.Header>
          <Card.Body>
            <Tabs
              id="controlled-tab"
              activeKey={activeKey}
              onSelect={handleTabChange}
              className="mb-4 nav-tabs-custom"
              fill
              style={rwd.getTableStyle()}
            >
              <Tab 
                eventKey="industry" 
                title={
                  <div className={rwd.isMobile ? "d-flex align-items-center py-1" : "d-flex align-items-center py-2"}>
                    <i className="fas fa-industry me-2"></i>
                    <span>{rwd.isMobile ? "產業別" : "公司產業別管理"}</span>
                  </div>
                }
              >
                <div className="tab-content-wrapper">
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                      <p className="mt-2">載入中...</p>
                    </div>
                  ) : (
                    <Row>
                      <Col>
                        <IndustryCRUD />
                      </Col>
                    </Row>
                  )}
                </div>
              </Tab>
              <Tab 
                eventKey="position" 
                title={
                  <div className={rwd.isMobile ? "d-flex align-items-center py-1" : "d-flex align-items-center py-2"}>
                    <i className="fas fa-user-tag me-2"></i>
                    <span>{rwd.isMobile ? "職稱" : "系友會職稱管理"}</span>
                  </div>
                }
              >
                <div className="tab-content-wrapper">
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                      <p className="mt-2">載入中...</p>
                    </div>
                  ) : (
                    <Row>
                      <Col>
                        <AlumniPositionCRUD />
                      </Col>
                    </Row>
                  )}
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Container>
    );
};

export default OtherManage;
