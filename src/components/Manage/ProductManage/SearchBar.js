import React from 'react';

function SearchBar({ onSearch }) {
    const handleSearchChange = (e) => {
        onSearch(e.target.value);
    };

    return (
        <form>
            <div className="form-control">
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="搜尋產品..."
                    onChange={handleSearchChange}
                />
            </div>
        </form>
    );
}

export default SearchBar;
