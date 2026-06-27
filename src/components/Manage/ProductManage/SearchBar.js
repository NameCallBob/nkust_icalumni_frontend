import React from 'react';
import { Search } from 'lucide-react';

function SearchBar({ onSearch }) {
    const handleSearchChange = (e) => {
        onSearch(e.target.value);
    };

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full"
            role="search"
        >
            <div className="relative w-full sm:w-80">
                <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                />
                <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                    placeholder="搜尋產品..."
                    onChange={handleSearchChange}
                    aria-label="搜尋產品"
                />
            </div>
        </form>
    );
}

export default SearchBar;
