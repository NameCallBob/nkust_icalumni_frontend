import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigator = useNavigate()

  const handleSearchClick = () => {
    // 這裡是點擊搜尋按鈕時的邏輯
    navigator("/search" , {state:{
      type_id:null,search_text:searchTerm
    }})  };

  return (
    <div className="join mb-3 w-full">
      <input
        type="text"
        className="input input-bordered join-item w-full h-[50px]"
        placeholder="請輸入搜尋關鍵字"
        aria-label="Search"
        aria-describedby="button-addon1"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        type="button"
        id="button-addon1"
        onClick={handleSearchClick}
        className="btn join-item w-[100px] h-[50px] font-semibold text-white border-[#1e3a8a] bg-[#1e3a8a] hover:bg-[#1e3a8a] hover:border-[#1e3a8a]"
      >
        搜尋
      </button>
    </div>
  );
};

export default SearchBar;
