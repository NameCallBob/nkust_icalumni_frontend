import React from "react";
import { Tabs, Tab , Container } from "react-bootstrap";
import useRWD from 'hooks/useRWD';
import SlideManager from "components/Manage/WebPic/SlideManager";
import PopupAdManager from "components/Manage/WebPic/Popup";

const WebPicManager = () => {
  const rwd = useRWD();

  return (
    <div style={rwd.getContainerStyle()}>
      <Container className="admin-container my-5" style={rwd.getTableStyle()}>
        <Tabs
          defaultActiveKey="slides"
          id="web-pic-tabs"
          className={`mb-3 ${rwd.isMobile ? 'mobile-tabs' : ''}`}
          variant={rwd.isMobile ? 'pills' : 'tabs'}
        >
          <Tab eventKey="slides" title={rwd.isMobile ? "Slide" : "官網 Slide 管理"}>
            <SlideManager />
          </Tab>
          <Tab eventKey="popup" title={rwd.isMobile ? "廣告" : "彈跳廣告設置"}>
            <PopupAdManager />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default WebPicManager;