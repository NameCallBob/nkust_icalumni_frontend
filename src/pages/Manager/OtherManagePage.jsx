import React, { useState, useEffect } from 'react';
import { Spinner, PageHeader, Card } from 'components/common/ui';
import IndustryCRUD from 'components/Manage/Other/IndustryMana';
import AlumniPositionCRUD from 'components/Manage/Other/PositionMana';
import { Settings, Factory, UserCog } from 'lucide-react';
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
        icon: <Factory size={18} />,
        label: rwd.isMobile ? '產業別' : '公司產業別管理',
        content: <IndustryCRUD />,
      },
      {
        key: 'position',
        icon: <UserCog size={18} />,
        label: rwd.isMobile ? '職稱' : '系友會職稱管理',
        content: <AlumniPositionCRUD />,
      },
    ];

    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="系統設定管理"
          subtitle="管理公司產業別與系友會職稱等基礎設定項目"
          icon={<Settings size={22} />}
        />

        <Card padding="none">
          {/* 分頁標籤：深藍底線高亮 */}
          <div
            role="tablist"
            className="flex border-b border-base-200"
          >
            {tabs.map((tab) => {
              const isActive = activeKey === tab.key;
              return (
                <button
                  key={tab.key}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(tab.key)}
                  className={`relative flex flex-1 items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors sm:flex-none sm:px-6 ${
                    isActive
                      ? 'text-primary'
                      : 'text-base-content/55 hover:text-base-content hover:bg-base-200/40'
                  }`}
                >
                  <span className={isActive ? 'text-primary' : 'text-base-content/40'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary sm:inset-x-4" />
                  )}
                </button>
              );
            })}
          </div>

          {/* 分頁內容 */}
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-base-content/60">
                <Spinner size="lg" />
                <p className="mt-3 text-sm">載入中...</p>
              </div>
            ) : (
              tabs.find((tab) => tab.key === activeKey)?.content
            )}
          </div>
        </Card>
      </div>
    );
};

export default OtherManage;
