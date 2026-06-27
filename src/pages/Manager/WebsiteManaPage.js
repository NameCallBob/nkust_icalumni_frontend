import React, { useState } from "react";
import { Monitor, Images, Megaphone } from "lucide-react";
import useRWD from 'hooks/useRWD';
import { PageHeader, Card } from "components/common/ui";
import SlideManager from "components/Manage/WebPic/SlideManager";
import PopupAdManager from "components/Manage/WebPic/Popup";

const WebPicManager = () => {
  const rwd = useRWD();
  // 目前選取的分頁（取代 react-bootstrap Tabs 的 defaultActiveKey="slides"）
  const [activeKey, setActiveKey] = useState("slides");

  const tabs = [
    {
      key: 'slides',
      label: rwd.isMobile ? "Slide" : "官網 Slide 管理",
      icon: <Images className="h-4 w-4" />,
    },
    {
      key: 'popup',
      label: rwd.isMobile ? "廣告" : "彈跳廣告設置",
      icon: <Megaphone className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-base-200/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <PageHeader
          title="官網內容管理"
          subtitle="管理首頁輪播圖與彈跳廣告，掌握網站對外的視覺呈現。"
          icon={<Monitor className="h-5 w-5" />}
        />

        <Card padding="none">
          {/* 分頁列：深藍 admin 風格，手機可橫向滑動 */}
          <div
            role="tablist"
            className="flex gap-1 overflow-x-auto border-b border-base-200 px-2 pt-2"
          >
            {tabs.map((tab) => {
              const isActive = activeKey === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveKey(tab.key)}
                  className={`relative inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-t-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-base-content/60 hover:bg-base-200/60 hover:text-base-content'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  <span
                    className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-colors ${
                      isActive ? 'bg-primary' : 'bg-transparent'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* 分頁內容 */}
          <div className="p-4 sm:p-6">
            {activeKey === 'slides' && <SlideManager />}
            {activeKey === 'popup' && <PopupAdManager />}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WebPicManager;
