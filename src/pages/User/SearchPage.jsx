// Search.jsx
import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CompanyCard from 'components/User/search/Companycard';
import LoadingSpinner from 'components/LoadingSpinner';
import SEO from 'SEO';
import {
  BsSearch, BsFilter, BsArrowDown, BsArrowUp,
  BsExclamationCircle, BsBuilding, BsList, BsGrid
} from "react-icons/bs";
import { handleImageError, getImageSrc } from '../../utils/imageDefaults';
import { Badge, EmptyState, Button } from 'components/common/ui';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' 或 'list'
  const [sortBy, setSortBy] = useState('newest'); // 排序選項
  const [showFilters, setShowFilters] = useState(true);
  const { type_id, search_text } = location.state || { type_id: null, search_text: null };

  useEffect(() => {
    // 獲取所有行業分類
    Axios().get('company/industry/all/')
      .then((res) => {
        setCategories([{ id: 0, title: '全部行業' }, ...res.data]);
      })
      .catch(error => {
        console.error("獲取行業分類失敗:", error);
      });

    // 檢查是否有預設搜尋參數
    if (type_id || search_text) {
      const initialQuery = {};
      if (type_id) {
        setSelectedType(type_id);
        initialQuery['industry'] = type_id;
      }
      if (search_text) {
        setSearchTerm(search_text);
        initialQuery['search'] = search_text;
      }
      handleSearch(initialQuery);
    } else {
      handleSearch();
    }
  }, []);

  useEffect(() => {
    // 當搜索結果或排序方式改變時，重新排序結果
    if (searchResults.length > 0) {
      sortResults(sortBy);
    }
  }, [searchResults, sortBy]);

  // 處理行業分類搜尋
  const handleTypeSearch = (categoryId) => {
    setSelectedType(categoryId);
    const query = {};

    if (searchTerm) {
      query['search'] = searchTerm;
    }

    if (categoryId !== 0) { // 0 表示"全部行業"
      query['industry'] = categoryId;
    }

    handleSearch(query);
  };

  // 處理關鍵字搜尋
  const handleInputSearch = (e) => {
    e.preventDefault();
    const query = {};

    if (selectedType && selectedType !== 0) {
      query['industry'] = selectedType;
    }

    if (searchTerm) {
      query['search'] = searchTerm;
    }

    handleSearch(query);
  };

  // 處理搜尋請求
  const handleSearch = (searchQuery = null) => {
    setLoading(true);

    Axios().get('company/search_any/', { params: searchQuery })
      .then((res) => {
        if (res.data.results.length === 0) {
          setShowNoResults(true);
          setSearchResults([]);
          setFilteredResults([]);
        } else {
          setShowNoResults(false);
          setSearchResults(res.data.results);
          setFilteredResults(res.data.results);
        }
      })
      .catch((error) => {
        console.error("搜尋結果獲取失敗:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 處理排序
  const sortResults = (sortOption) => {
    setSortBy(sortOption);

    let sorted = [...searchResults];
    switch (sortOption) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'nameAsc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredResults(sorted);
  };

  // 處理卡片點擊
  const handleCardClick = (company) => {
    navigate(`/alumni/${company.member}`, { state: { companyData: company } });
  };

  // 渲染視圖模式切換按鈕
  const renderViewToggle = () => {
    return (
      <div className="flex items-center gap-1 rounded-xl border border-base-300 bg-base-100 p-1">
        <button
          type="button"
          onClick={() => setViewMode('grid')}
          aria-label="網格檢視"
          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm transition ${
            viewMode === 'grid'
              ? 'bg-primary text-primary-content shadow-sm'
              : 'text-base-content/50 hover:text-primary'
          }`}
        >
          <BsGrid />
        </button>
        <button
          type="button"
          onClick={() => setViewMode('list')}
          aria-label="列表檢視"
          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm transition ${
            viewMode === 'list'
              ? 'bg-primary text-primary-content shadow-sm'
              : 'text-base-content/50 hover:text-primary'
          }`}
        >
          <BsList />
        </button>
      </div>
    );
  };

  // 渲染搜尋結果
  const renderSearchResults = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      );
    }

    if (filteredResults.length === 0) {
      return (
        <div
          className={`transition-opacity duration-300 ${showNoResults ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="mx-auto max-w-xl rounded-2xl border border-base-300/70 bg-base-100 shadow-sm">
            <EmptyState
              icon={<BsExclamationCircle className="h-7 w-7" />}
              title="找不到相關結果"
              description={
                searchTerm
                  ? `沒有找到與「${searchTerm}」相關的內容，請換個關鍵詞搜尋！`
                  : '請嘗試輸入其他關鍵字或選擇不同行業分類。'
              }
              action={
                <Button variant="outline" onClick={() => handleTypeSearch(0)}>
                  查看所有公司
                </Button>
              }
            />
          </div>
        </div>
      );
    }

    return (
      <>
        {/* 結果工具列 */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">共 {filteredResults.length} 個結果</Badge>
            {selectedType !== null && selectedType !== 0 && (
              <Badge variant="secondary" soft={false}>
                {categories.find(c => c.id === selectedType)?.title || ''}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => sortResults(e.target.value)}
              className="select select-bordered select-sm rounded-xl bg-base-100 text-sm text-base-content/70 focus:border-primary"
            >
              <option value="newest">最新</option>
              <option value="oldest">最舊</option>
              <option value="nameAsc">公司名稱 A-Z</option>
              <option value="nameDesc">公司名稱 Z-A</option>
            </select>
            <div className="hidden md:block">
              {renderViewToggle()}
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          // 網格視圖
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResults.map((company, index) => (
              <CompanyCard
                key={index}
                company={company}
                onClick={() => handleCardClick(company)}
              />
            ))}
          </div>
        ) : (
          // 列表視圖
          <div className="flex flex-col gap-3">
            {filteredResults.map((company, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(company)}
                className="group flex cursor-pointer gap-4 rounded-2xl border border-base-300/70 bg-base-100 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="shrink-0">
                  <img
                    src={getImageSrc(company.photo, 'company')}
                    alt={company.name}
                    className="h-[72px] w-[100px] rounded-xl border border-base-300/70 object-cover"
                    onError={(e) => handleImageError(e, 'company')}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-start justify-between gap-3">
                    <h5 className="m-0 flex min-w-0 items-center gap-1.5 font-serif text-base font-bold text-base-content">
                      <BsBuilding className="shrink-0 text-primary" />
                      <span className="truncate group-hover:text-primary">{company.name}</span>
                    </h5>
                    {company.industry_title && (
                      <Badge variant="primary" className="shrink-0">
                        {company.industry_title}
                      </Badge>
                    )}
                  </div>
                  <p className="mb-1.5 line-clamp-1 text-sm text-base-content/60">
                    {company.description || company.products || '暫無公司描述'}
                  </p>
                  <div className="text-xs text-base-content/50">
                    系友：{company.member_name}
                    {company.position && ` | 職位：${company.position}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-base-200">
      <SEO
        main={false}
        title="公司 查詢"
        description="了解智慧商務系友會中系友們的招募需求與最新機會，加入我們，共創未來。"
        keywords={["智慧商務", "招募", "招聘", "加入系友會"]}
      />

      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-primary to-[#1e3a8a] px-6 py-16 sm:py-20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
            NKUST Alumni Enterprises
          </p>
          <h1 className="font-serif text-3xl font-bold tracking-wide text-white sm:text-4xl">
            系友企業
          </h1>
          <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-secondary to-white/60" />
          <p className="mt-5 max-w-xl text-base text-white/70">
            探索系友企業，了解業界動態
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-0 z-20 border-b border-base-300/70 bg-base-100/95 py-5 shadow-sm backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <form onSubmit={handleInputSearch}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <BsSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="text"
                  placeholder="輸入公司名稱、產品或關鍵字..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-base-300 bg-base-100 py-2.5 pl-11 pr-4 text-sm text-base-content outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="sm:w-40">
                <Button type="submit" variant="primary" className="w-full rounded-xl">
                  <BsSearch className="mr-1" />
                  搜尋
                </Button>
              </div>
            </div>

            {/* Industry Filter Pills */}
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((category, index) => {
                const isActive = category.id === selectedType || (category.id === 0 && selectedType === null);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => { setActiveCategory(index); handleTypeSearch(category.id); }}
                    className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                      isActive
                        ? 'border-primary bg-primary text-primary-content shadow-sm'
                        : 'border-base-300 bg-base-200 text-base-content/60 hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    {category.title}
                    {category.count && (
                      <span className="ml-1.5 opacity-75">({category.count})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </form>
        </div>
      </div>

      {/* Results Area */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        {renderSearchResults()}
      </div>
    </div>
  );
};

export default Search;
