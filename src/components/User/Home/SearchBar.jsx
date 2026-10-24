import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigator = useNavigate()

  const handleSearchClick = () => {
    // 這裡是點擊搜尋按鈕時的邏輯
    navigator("/search" , {state:{
      type_id:null,search_text:searchTerm
    }})  };

  return (
    <div className="mb-3 w-full">
      <div className="flex items-stretch gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm transition-shadow focus-within:border-[#1e3a8a] focus-within:shadow-md sm:gap-3 sm:p-2">
        <div className="flex flex-1 items-center gap-2 pl-3 sm:gap-3 sm:pl-4">
          <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            className="w-full min-w-0 border-0 bg-transparent py-2.5 text-base text-[#0f172a] placeholder:text-slate-400 focus:outline-none"
            placeholder="請輸入搜尋關鍵字"
            aria-label="Search"
            aria-describedby="button-addon1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          type="button"
          id="button-addon1"
          onClick={handleSearchClick}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0f172a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a8a] focus-visible:ring-offset-2 sm:px-7 sm:text-base"
        >
          <Search className="h-4 w-4 sm:hidden" aria-hidden="true" />
          <span>搜尋</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
