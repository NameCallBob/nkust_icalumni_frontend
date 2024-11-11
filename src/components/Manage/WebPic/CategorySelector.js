import React from "react";
import { Button } from "react-bootstrap";

const CategorySelector = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div>
      <h5>類別選擇</h5>
      <Button
        variant={selectedCategory === "廣告設置" ? "primary" : "outline-primary"}
        className="w-100 mb-2"
        onClick={() => onSelectCategory("廣告設置")}
      >
        廣告設置
      </Button>
      <Button
        variant={selectedCategory === "主頁輪播" ? "primary" : "outline-primary"}
        className="w-100"
        onClick={() => onSelectCategory("主頁輪播")}
      >
        主頁輪播
      </Button>
    </div>
  );
};

export default CategorySelector;
