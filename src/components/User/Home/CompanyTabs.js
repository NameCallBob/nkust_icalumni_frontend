import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
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
        <Button
          variant={category.id === activeCategory ? "primary" : "outline-primary"}
          className={`tab-button ${category.id === activeCategory ? "active-tab" : ""}`}
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
        >
          {category.title}
        </Button>
      ))}
      {categories.length > MAX_VISIBLE_CATEGORIES && (
        <Button
          variant="outline-secondary"
          className="tab-button"
          onClick={() => setShowModal(true)}
        >
          其他
        </Button>
      )}

      {/* Modal to show all categories */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>選擇分類</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-category-list">
            {categories.map((category) => (
              <Button
                variant={category.id === activeCategory ? "primary" : "outline-primary"}
                className={`modal-category-button ${category.id === activeCategory ? "active-tab" : ""}`}
                key={category.id}
                onClick={() => {
                  handleCategoryClick(category.id);
                  setShowModal(false);
                }}
              >
                {category.title}
              </Button>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TabsComponent;
