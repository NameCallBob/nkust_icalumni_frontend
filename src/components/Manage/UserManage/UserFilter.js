import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { Button, Field } from 'components/common/ui';

function UserFilter({ filters, setFilters, applyFilters,
   handleAddUser_easy, handleAddUser_complex,handleAccountModal,
  handleExcelModal
  }) {
  const [positions, setPositions] = useState([]);

  // 篩選條件變更處理
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    Axios().get("member/position/get-all/")
      .then((res) => {
        setPositions(res.data);
      })
      .catch((error) => {
        console.error("Error fetching positions:", error);
      });
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h5 className="text-lg font-semibold text-base-content">已開通帳號</h5>
      <div className="grid grid-cols-12 gap-4 my-3">
        <div className="col-span-6">
          <Button variant="success" onClick={handleAccountModal}>
            查詢
          </Button>
        </div>
        <div className="col-span-6">
          <Button variant="success" onClick={handleExcelModal}>
            上傳系友資料
          </Button>
        </div>
      </div>

      <h5 className="text-lg font-semibold text-base-content">新增帳號</h5>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Button variant="success" onClick={handleAddUser_easy}>
            添加簡單帳號
          </Button>
        </div>
        <div className="col-span-6">
          <Button variant="success" onClick={handleAddUser_complex}>
            添加完整帳號
          </Button>
        </div>
      </div>

      <h5 className="text-lg font-semibold text-base-content my-3">篩選條件</h5>
      <form className="my-1">
        <Field
          as="input"
          id="filterSearch"
          label="搜尋"
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="輸入關鍵字搜尋，如:姓名、地點"
        />

        <Field
          as="select"
          id="filterGender"
          label="性別"
          name="gender"
          value={filters.gender}
          onChange={handleFilterChange}
        >
          <option value="">全部</option>
          <option value="M">男</option>
          <option value="F">女</option>
          <option value="O">其他</option>
        </Field>

        <Field
          as="select"
          id="filterPosition"
          label="職位"
          name="position"
          value={filters.position}
          onChange={handleFilterChange}
        >
          <option value="">全部</option>
          {positions.map((position) => (
            <option key={position.id} value={position.title}>
              {position.title}
            </option>
          ))}
        </Field>

        <Field
          as="select"
          id="filterIsPaid"
          label="是否繳費"
          name="is_paid"
          value={filters.is_paid}
          onChange={handleFilterChange}
        >
          <option value="">全部</option>
          <option value="true">已繳費</option>
          <option value="false">未繳費</option>
        </Field>

        <Field
          as="select"
          id="filterIsActive"
          label="是否啟用"
          name="is_active"
          value={filters.is_active}
          onChange={handleFilterChange}
        >
          <option value="">全部</option>
          <option value="true">已啟用</option>
          <option value="false">未啟用</option>
        </Field>

        <Button variant="primary" onClick={applyFilters} className="mt-2">
          套用篩選
        </Button>
      </form>
    </div>
  );
}

export default UserFilter;
