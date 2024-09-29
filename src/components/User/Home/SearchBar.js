import React, { useState } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchClick = () => {
    // 這裡是點擊搜尋按鈕時的邏輯
    alert(`搜尋: ${searchTerm}`);
  };

  return (
    <InputGroup className="mb-3" style={{ height: '40px' }}>

      <FormControl
        placeholder="請輸入搜尋關鍵字"
        aria-label="Search"
        aria-describedby="button-addon1"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ height: '50px' }}
      />
      <Button
        variant="success"
        id="button-addon1"
        onClick={handleSearchClick}
        style={{
          width:"100px",
          height: '50px' }}
      >
        搜尋
      </Button>
    </InputGroup>
  );
};

export default SearchBar;
