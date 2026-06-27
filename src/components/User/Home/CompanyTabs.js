import React, { useState } from 'react';
import AppModal from 'components/common/AppModal';
import { Layers } from 'lucide-react';
import "css/user/homepage/tabs.css";
const MAX_VISIBLE_CATEGORIES = 5; // 設定最多顯示多少個分類

const TabsComponent = ({ categories, onCategorySelect, activeCategory }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCategoryClick = (categoryId) => {
    onCategorySelect(categoryId); // 呼叫父組件的 callback，傳遞選擇的分類
  };

  return (
    <div className="button-tabs">
      {categories.slice(0, MAX_VISIBLE_CATEGORIES).map((category) => (
        <button
          type="button"
          className={`tab-button ${category.id === activeCategory ? "active-tab" : ""}`}
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
        >
          {category.title}
        </button>
      ))}
      {categories.length > MAX_VISIBLE_CATEGORIES && (
        <button
          type="button"
          className="tab-button"
          onClick={() => setShowModal(true)}
        >
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
        <div className="modal-category-list">
          {categories.map((category) => (
            <button
              type="button"
              className={`modal-category-button ${category.id === activeCategory ? "active-tab" : ""}`}
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
