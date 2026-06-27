import React, { useState } from "react";
import useRWD from 'hooks/useRWD';
import SlideManager from "components/Manage/WebPic/SlideManager";
import PopupAdManager from "components/Manage/WebPic/Popup";

const WebPicManager = () => {
  const rwd = useRWD();
  // 目前選取的分頁（取代 react-bootstrap Tabs 的 defaultActiveKey="slides"）
  const [activeKey, setActiveKey] = useState("slides");

  return (
    <div style={rwd.getContainerStyle()}>
      <div className="admin-container container mx-auto px-4 my-5" style={rwd.getTableStyle()}>
        {/* 分頁列：手機用 pills 風格、桌機用 bordered 風格 */}
        <div
          role="tablist"
          className={`tabs mb-3 ${rwd.isMobile ? 'tabs-boxed mobile-tabs' : 'tabs-bordered'}`}
        >
          <button
            type="button"
            role="tab"
            className={`tab ${activeKey === 'slides' ? 'tab-active' : ''}`}
            onClick={() => setActiveKey('slides')}
          >
            {rwd.isMobile ? "Slide" : "官網 Slide 管理"}
          </button>
          <button
            type="button"
            role="tab"
            className={`tab ${activeKey === 'popup' ? 'tab-active' : ''}`}
            onClick={() => setActiveKey('popup')}
          >
            {rwd.isMobile ? "廣告" : "彈跳廣告設置"}
          </button>
        </div>

        {/* 分頁內容 */}
        {activeKey === 'slides' && <SlideManager />}
        {activeKey === 'popup' && <PopupAdManager />}
      </div>
    </div>
  );
};

export default WebPicManager;
