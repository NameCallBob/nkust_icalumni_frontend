import React, { useState } from 'react';
import TabsComponent from 'components/User/Home/CompanyTabs';
import CompanyListWithPagination from 'components/User/Home/CompanyList';
import "css/user/homepage/CompanySearch.css"
const CompanyTabsSearch = () => {
    const [selectedCategory, setSelectedCategory] = useState('3C');

    const categories = [
      '3C', '家電', '美妝個清', '保健/食品', '服飾/內衣',
      '鞋包/精品', '母嬰用品', '圖書文具', '傢寢運動',
      '運動用品', '戶外休閒', '數位內容', '玩具遊戲',
    ];

    const companies = {
      '3C': Array.from({ length: 15 }, (_, i) => ({
        name: `Company ${i + 1}`,
        alumni: `Alumni ${i + 1}`,
        image: `https://via.placeholder.com/800x400?text=Company+${i + 1}`,
      })),
      '家電': Array.from({ length: 10 }, (_, i) => ({
        name: `Company ${i + 1}`,
        alumni: `Alumni ${i + 1}`,
        image: `https://via.placeholder.com/800x400?text=Company+${i + 1}`,
      })),
      // 其他類別資料...
    };

    return (
      <div>
        <TabsComponent
          categories={categories}
          onCategorySelect={setSelectedCategory}
          activeCategory={selectedCategory} // 傳遞目前選中的類別
        />
        <CompanyListWithPagination
          companies={companies[selectedCategory] || []}
        />
      </div>
    );};

export default CompanyTabsSearch;
