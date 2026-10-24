import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { Button, Field, Card } from 'components/common/ui';
import { Search, FileSpreadsheet, UserPlus, UserCog, SlidersHorizontal, Filter } from 'lucide-react';

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

  const sectionTitle = (icon, text) => (
    <div className="flex items-center gap-2 mb-3">
      <span className="grid place-items-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <h5 className="text-base font-semibold text-base-content">{text}</h5>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* 已開通帳號 */}
      <Card padding="md">
        {sectionTitle(<UserCog size={18} />, '已開通帳號')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="secondary" className="w-full" onClick={handleAccountModal}>
            <Search size={16} />
            查詢
          </Button>
          <Button variant="secondary" className="w-full" onClick={handleExcelModal}>
            <FileSpreadsheet size={16} />
            上傳系友資料
          </Button>
        </div>
      </Card>

      {/* 新增帳號 */}
      <Card padding="md">
        {sectionTitle(<UserPlus size={18} />, '新增帳號')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="primary" className="w-full" onClick={handleAddUser_easy}>
            <UserPlus size={16} />
            添加簡單帳號
          </Button>
          <Button variant="outline" className="w-full" onClick={handleAddUser_complex}>
            <UserCog size={16} />
            添加完整帳號
          </Button>
        </div>
      </Card>

      {/* 篩選條件 */}
      <Card padding="md">
        {sectionTitle(<SlidersHorizontal size={18} />, '篩選條件')}
        <form className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <Button variant="primary" onClick={applyFilters} className="w-full">
            <Filter size={16} />
            套用篩選
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default UserFilter;
