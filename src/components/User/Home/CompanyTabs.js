import React, { useState } from 'react';
import AppModal from 'components/common/AppModal';
import { Layers } from 'lucide-react';
const MAX_VISIBLE_CATEGORIES = 5; // 設定最多顯示多少個分類

const TabsComponent = ({ categories, onCategorySelect, activeCategory }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCategoryClick = (categoryId) => {
    onCategorySelect(categoryId); // 呼叫父組件的 callback，傳遞選擇的分類
  };

  const baseTab =
    'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium ' +
    'transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/30 ' +
    'whitespace-nowrap';
  const activeTab =
    'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-md shadow-[#1e3a8a]/20';
  const inactiveTab =
    'bg-white text-[#0f172a] border-slate-200 hover:border-[#1e3a8a]/40 hover:text-[#1e3a8a] hover:shadow-sm';

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
      {categories.slice(0, MAX_VISIBLE_CATEGORIES).map((category) => (
        <button
          type="button"
          className={`${baseTab} ${category.id === activeCategory ? activeTab : inactiveTab}`}
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
        >
          {category.title}
        </button>
      ))}
      {categories.length > MAX_VISIBLE_CATEGORIES && (
        <button
          type="button"
          className={`${baseTab} ${inactiveTab} gap-1.5`}
          onClick={() => setShowModal(true)}
        >
          <Layers size={16} className="text-[#a0781c]" />
          其他
        </button>
      )}

      {/* Modal to show all categories */}
      <AppModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="選擇分類"
        icon={<Layers size={20} />}
        size="sm"
      >
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {categories.map((category) => (
            <button
              type="button"
              className={
                'w-full rounded-xl px-4 py-3 text-sm font-medium text-center ' +
                'transition-all duration-200 border break-words ' +
                'focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/30 ' +
                (category.id === activeCategory
                  ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-md shadow-[#1e3a8a]/20'
                  : 'bg-white text-[#0f172a] border-slate-200 hover:border-[#1e3a8a]/40 hover:text-[#1e3a8a] hover:bg-slate-50')
              }
              key={category.id}
              onClick={() => {
                handleCategoryClick(category.id);
                setShowModal(false);
              }}
            >
              {category.title}
            </button>
          ))}
        </div>
      </AppModal>
    </div>
  );
};

export default TabsComponent;
