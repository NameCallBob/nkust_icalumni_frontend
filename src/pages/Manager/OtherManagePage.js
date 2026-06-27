import React, { useState, useEffect } from 'react';
import { Spinner } from 'components/common/ui';
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

    // 標籤設定
    const tabs = [
      {
        key: 'industry',
        icon: 'fas fa-industry',
        label: rwd.isMobile ? '產業別' : '公司產業別管理',
        content: <IndustryCRUD />,
      },
      {
        key: 'position',
        icon: 'fas fa-user-tag',
        label: rwd.isMobile ? '職稱' : '系友會職稱管理',
        content: <AlumniPositionCRUD />,
      },
    ];

    return (
      <div className="admin-container container mx-auto px-4 py-4" style={rwd.getContainerStyle()}>
        <div className="card card-bordered border-0 shadow-sm mb-4 bg-base-100">
          {/* 標題列：深藍漸層 */}
          <div
            className="flex items-center rounded-t-2xl px-4 py-3 text-white"
            style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #3a75c4 100%)', ...rwd.getButtonStyle() }}
          >
            <i className="fas fa-cogs mr-2 fa-lg"></i>
            <h3 className="mb-0 text-xl font-semibold">系統設定管理</h3>
          </div>
          <div className="card-body">
            {/* 分頁標籤 */}
            <div
              role="tablist"
              className="tabs tabs-bordered nav-tabs-custom mb-4 grid grid-cols-2"
              style={rwd.getTableStyle()}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  role="tab"
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`tab h-auto ${activeKey === tab.key ? 'tab-active text-primary font-semibold' : ''}`}
                >
                  <div className={rwd.isMobile ? 'flex items-center py-1' : 'flex items-center py-2'}>
                    <i className={`${tab.icon} mr-2`}></i>
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* 分頁內容 */}
            <div className="tab-content-wrapper">
              {loading ? (
                <div className="text-center py-12">
                  <Spinner size="lg" />
                  <p className="mt-2">載入中...</p>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12">
                    {tabs.find((tab) => tab.key === activeKey)?.content}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

export default OtherManage;
