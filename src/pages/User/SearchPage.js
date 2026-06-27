// Search.jsx
import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CompanyCard from 'components/User/search/Companycard';
import LoadingSpinner from 'components/LoadingSpinner';
import SEO from 'SEO';
import {
  BsSearch, BsFilter, BsArrowDown, BsArrowUp,
  BsExclamationCircle, BsBuilding, BsList
} from "react-icons/bs";
import { handleImageError, getImageSrc } from '../../utils/imageDefaults';

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
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setViewMode('grid')}
          style={{
            padding: '6px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            background: viewMode === 'grid' ? '#1e3a8a' : '#ffffff',
            color: viewMode === 'grid' ? '#ffffff' : '#475569',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: '500',
          }}
        >
          <i className="bi bi-grid"></i>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('list')}
          style={{
            padding: '6px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            background: viewMode === 'list' ? '#1e3a8a' : '#ffffff',
            color: viewMode === 'list' ? '#ffffff' : '#475569',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: '500',
          }}
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
        <div className="col-span-12 text-center py-12">
          <LoadingSpinner />
        </div>
      );
    }

    if (filteredResults.length === 0) {
      return (
        <div
          className={`col-span-12 flex justify-center py-12 transition-opacity duration-300 ${showNoResults ? 'opacity-100' : 'opacity-0'}`}
        >
            <div
              className="text-center"
              style={{
                maxWidth: '500px',
                padding: '40px 32px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <BsExclamationCircle size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
              <h5 style={{ color: '#0f172a', fontWeight: '600', marginBottom: '8px' }}>找不到相關結果</h5>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '20px' }}>
                {searchTerm ? (
                  <>
                    沒有找到與 <strong>{searchTerm}</strong> 相關的內容，請換個關鍵詞搜尋!
                  </>
                ) : (
                  "請嘗試輸入其他關鍵字或選擇不同行業分類。"
                )}
              </p>
              <button
                type="button"
                onClick={() => handleTypeSearch(0)}
                style={{
                  padding: '8px 20px',
                  border: '1px solid #1e3a8a',
                  borderRadius: '6px',
                  background: '#ffffff',
                  color: '#1e3a8a',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                }}
              >
                查看所有公司
              </button>
            </div>
        </div>
      );
    }

    return (
      <>
        <div className="col-span-12 mb-3">
          <div className="flex justify-between items-center">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '3px 10px',
                  background: '#eff6ff',
                  color: '#1e3a8a',
                  border: '1px solid #bfdbfe',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                }}
              >
                共 {filteredResults.length} 個結果
              </span>
              {selectedType !== null && selectedType !== 0 && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '3px 10px',
                    background: '#1e3a8a',
                    color: '#ffffff',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                  }}
                >
                  {categories.find(c => c.id === selectedType)?.title || ''}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => sortResults(e.target.value)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  outline: 'none',
                }}
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
        </div>

        {viewMode === 'grid' ? (
          // 網格視圖
          filteredResults.map((company, index) => (
            <div className="col-span-12 sm:col-span-6 md:col-span-4 mb-4" key={index}>
              <CompanyCard
                company={company}
                onClick={() => handleCardClick(company)}
              />
            </div>
          ))
        ) : (
          // 列表視圖
          <div className="col-span-12">
            {filteredResults.map((company, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(company)}
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '12px',
                  padding: '16px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ flexShrink: 0, width: '100px' }}>
                  <img
                    src={getImageSrc(company.photo, 'company')}
                    alt={company.name}
                    style={{
                      width: '100px',
                      height: '72px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                    }}
                    onError={(e) => handleImageError(e, 'company')}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h5 style={{ margin: 0, fontWeight: '600', color: '#0f172a', fontSize: '1rem' }}>
                      <BsBuilding style={{ marginRight: '6px', color: '#1e3a8a' }} />
                      {company.name}
                    </h5>
                    {company.industry_title && (
                      <span
                        style={{
                          flexShrink: 0,
                          marginLeft: '12px',
                          padding: '2px 8px',
                          background: '#eff6ff',
                          color: '#1e3a8a',
                          border: '1px solid #bfdbfe',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                        }}
                      >
                        {company.industry_title}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      margin: '0 0 6px',
                      fontSize: '0.875rem',
                      color: '#475569',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {company.description || company.products || '暫無公司描述'}
                  </p>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>
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
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <SEO
        main={false}
        title="公司 查詢"
        description="了解智慧商務系友會中系友們的招募需求與最新機會，加入我們，共創未來。"
        keywords={["智慧商務", "招募", "招聘", "加入系友會"]}
      />

      {/* Page Header */}
      <div
        style={{
          background: '#1e3a8a',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
        }}
      >
        <h1 style={{ color: '#ffffff', fontWeight: '700', fontSize: '2rem', margin: 0, letterSpacing: '0.02em' }}>
          系友企業
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '8px 0 0', fontSize: '1rem' }}>
          探索系友企業，了解業界動態
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '20px 0' }}>
        <div className="container mx-auto px-4">
          <form onSubmit={handleInputSearch}>
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-12 md:col-span-9">
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <BsSearch
                    style={{
                      position: 'absolute',
                      left: '12px',
                      color: '#94a3b8',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="輸入公司名稱、產品或關鍵字..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: '#0f172a',
                      outline: 'none',
                      background: '#ffffff',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-3">
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '10px 20px',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  搜尋
                </button>
              </div>
            </div>

            {/* Industry Filter Pills */}
            <div
              style={{
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {categories.map((category, index) => {
                const isActive = category.id === selectedType || (category.id === 0 && selectedType === null);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => { setActiveCategory(index); handleTypeSearch(category.id); }}
                    style={{
                      flexShrink: 0,
                      padding: '6px 14px',
                      border: '1px solid ' + (isActive ? '#1e3a8a' : '#e2e8f0'),
                      borderRadius: '20px',
                      background: isActive ? '#1e3a8a' : '#f1f5f9',
                      color: isActive ? '#ffffff' : '#475569',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    {category.title}
                    {category.count && (
                      <span style={{ marginLeft: '6px', opacity: 0.75 }}>({category.count})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </form>
        </div>
      </div>

      {/* Results Area */}
      <div className="container mx-auto px-4" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <div className="grid grid-cols-12 gap-x-4">
              {renderSearchResults()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
