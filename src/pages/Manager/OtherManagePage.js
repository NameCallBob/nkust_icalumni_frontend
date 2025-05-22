import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Container, Card, Row, Col, Breadcrumb, Spinner } from 'react-bootstrap';
import IndustryCRUD from 'components/Manage/Other/IndustryMana';
import AlumniPositionCRUD from 'components/Manage/Other/PositionMana';
import 'css/manage/othermanage.css';
import { Link } from 'react-router-dom';

const OtherManage = () => {
    const [activeKey, setActiveKey] = useState('industry');
    const [loading, setLoading] = useState(true);

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
      <Container className="py-4">
        {/* 面包屑導航 */}
        <Breadcrumb className="mb-3">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>首頁</Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/manager" }}>管理後台</Breadcrumb.Item>
          <Breadcrumb.Item active>系統設定管理</Breadcrumb.Item>
        </Breadcrumb>
        
        <Card className="shadow-sm border-0 mb-4">
          <Card.Header className="bg-gradient text-white d-flex align-items-center" 
                       style={{ backgroundColor: '#3a75c4' }}>
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
            >
              <Tab 
                eventKey="industry" 
                title={
                  <div className="d-flex align-items-center py-2">
                    <i className="fas fa-industry me-2"></i>
                    <span>公司產業別管理</span>
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
                  <div className="d-flex align-items-center py-2">
                    <i className="fas fa-user-tag me-2"></i>
                    <span>系友會職稱管理</span>
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
