import React from "react";
import { Tabs, Tab , Container } from "react-bootstrap";
import SlideManager from "components/Manage/WebPic/SlideManager";
import PopupAdManager from "components/Manage/WebPic/Popup";

const WebPicManager = () => {
  return (
    <Container className="my-5">
      <Tabs defaultActiveKey="slides" id="web-pic-tabs" className="mb-3">
        <Tab eventKey="slides" title="官網 Slide 管理">
          <SlideManager />
        </Tab>
        <Tab eventKey="popup" title="彈跳廣告設置">
          <PopupAdManager />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default WebPicManager;