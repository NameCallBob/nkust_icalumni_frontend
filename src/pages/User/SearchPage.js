// Search.jsx
import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Nav, Card, Container, Row, Col, Form, Button, 
  InputGroup, Dropdown, Badge, Fade, Spinner 
} from 'react-bootstrap';
import CompanyCard from 'components/User/search/Companycard';
import LoadingSpinner from 'components/LoadingSpinner';
import SEO from 'SEO';
import { 
  BsSearch, BsFilter, BsArrowDown, BsArrowUp, 
  BsExclamationCircle, BsBuilding, BsList 
} from "react-icons/bs";

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

  // 渲染排序下拉選單
  // const renderSortDropdown = () => {
  //   return (
  //     <Dropdown>
  //       <Dropdown.Toggle variant="outline-secondary" size="sm" id="dropdown-sort">
  //         <BsArrowDown className="me-1" />排序: {
  //           sortBy === 'newest' ? '最新' :
  //           sortBy === 'oldest' ? '最舊' :
  //           sortBy === 'nameAsc' ? '公司名稱 A-Z' :
  //           '公司名稱 Z-A'
  //         }
  //       </Dropdown.Toggle>
  //       <Dropdown.Menu>
  //         <Dropdown.Item active={sortBy === 'newest'} onClick={() => sortResults('newest')}>
  //           <BsArrowDown className="me-2" />最新
  //         </Dropdown.Item>
  //         <Dropdown.Item active={sortBy === 'oldest'} onClick={() => sortResults('oldest')}>
  //           <BsArrowUp className="me-2" />最舊
  //         </Dropdown.Item>
  //         <Dropdown.Item active={sortBy === 'nameAsc'} onClick={() => sortResults('nameAsc')}>
  //           <BsArrowDown className="me-2" />公司名稱 A-Z
  //         </Dropdown.Item>
  //         <Dropdown.Item active={sortBy === 'nameDesc'} onClick={() => sortResults('nameDesc')}>
  //           <BsArrowUp className="me-2" />公司名稱 Z-A
  //         </Dropdown.Item>
  //       </Dropdown.Menu>
  //     </Dropdown>
  //   );
  // };

  // 渲染視圖模式切換按鈕
  const renderViewToggle = () => {
    return (
      <div className="d-flex">
        <Button 
          variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'} 
          size="sm" 
          className="me-2"
          onClick={() => setViewMode('grid')}
        >
          <i className="bi bi-grid"></i>
        </Button>
        <Button 
          variant={viewMode === 'list' ? 'primary' : 'outline-secondary'} 
          size="sm"
          onClick={() => setViewMode('list')}
        >
          <BsList />
        </Button>
      </div>
    );
  };

  // 渲染搜尋結果
  const renderSearchResults = () => {
    if (loading) {
      return (
        <Col xs={12} className="text-center py-5">
          <LoadingSpinner />
        </Col>
      );
    }

    if (filteredResults.length === 0) {
      return (
        <Fade in={showNoResults}>
          <Col xs={12} className="d-flex justify-content-center py-5">
            <Card className="text-center shadow-sm" style={{ maxWidth: "500px", padding: "20px" }}>
              <Row className="justify-content-center">
                <Col xs="auto">
                  <BsExclamationCircle size={50} className="text-muted" />
                </Col>
              </Row>
              <Card.Body>
                <Card.Title className="mt-3">找不到相關結果</Card.Title>
                <Card.Text>
                  {searchTerm ? (
                    <>
                      沒有找到與 <strong>{searchTerm}</strong> 相關的內容，請換個關鍵詞搜尋!
                    </>
                  ) : (
                    "請嘗試輸入其他關鍵字或選擇不同行業分類。"
                  )}
                </Card.Text>
                <Button variant="outline-primary" onClick={() => handleTypeSearch(0)}>
                  查看所有公司
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Fade>
      );
    }

    return (
      <>
        <Col xs={12} className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Badge bg="info" className="me-2">
                共 {filteredResults.length} 個結果
              </Badge>
              {selectedType !== null && selectedType !== 0 && (
                <Badge bg="primary">
                  {categories.find(c => c.id === selectedType)?.title || ''}
                </Badge>
              )}
            </div>
            <div className="d-flex">
              {/* {renderSortDropdown()} */}
              <div className="ms-2 d-none d-md-block">
                {renderViewToggle()}
              </div>
            </div>
          </div>
        </Col>

        {viewMode === 'grid' ? (
          // 網格視圖
          filteredResults.map((company, index) => (
            <Col xs={12} sm={6} md={4} lg={4} key={index} className="mb-4">
              <CompanyCard 
                company={company} 
                onClick={() => handleCardClick(company)} 
              />
            </Col>
          ))
        ) : (
          // 列表視圖
          <Col xs={12}>
            {filteredResults.map((company, index) => (
              <Card 
                key={index} 
                className="mb-3 shadow-sm" 
                onClick={() => handleCardClick(company)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body>
                  <Row>
                    <Col xs={12} md={3}>
                      <img 
                        src={company.photo} 
                        alt={company.name} 
                        style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} 
                      />
                    </Col>
                    <Col xs={12} md={9}>
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="mb-2 fw-bold text-primary">
                          <BsBuilding className="me-2" />{company.name}
                        </h5>
                        {company.industry_title && (
                          <Badge bg="primary">{company.industry_title}</Badge>
                        )}
                      </div>
                      <p className="mb-2 text-truncate" style={{ fontSize: '0.9rem' }}>
                        {company.description || company.products || '暫無公司描述'}
                      </p>
                      <div className="mt-2">
                        <small className="text-muted">
                          系友：{company.member_name} 
                          {company.position && ` | 職位：${company.position}`}
                        </small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>
        )}
      </>
    );
  };

  return (
    <Container className='my-4'>
      <SEO
        main={false}
        title="公司 查詢"
        description="了解智慧商務系友會中系友們的招募需求與最新機會，加入我們，共創未來。"
        keywords={["智慧商務", "招募", "招聘", "加入系友會"]}
      />
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body className="p-4">
          <h2 className="mb-4 text-center fw-bold">公司查詢</h2>
          <Form className="mb-4" onSubmit={handleInputSearch}>
            <Row className="g-2">
              <Col xs={12} md={10}>
                <InputGroup>
                  <InputGroup.Text>
                    <BsSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="輸入公司名稱、產品或關鍵字..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col xs={12} md={2}>
                <Button variant="primary" type="submit" className="w-100">
                  搜尋
                </Button>
              </Col>
            </Row>
            <div className="mt-3 d-flex justify-content-between align-items-center">
              <Button 
                variant="link" 
                className="text-decoration-none p-0" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <BsFilter className="me-1" />
                {showFilters ? '隱藏篩選' : '顯示篩選'}
              </Button>
              <div className="d-block d-md-none">
                {renderViewToggle()}
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Row>
        {/* 行業分類篩選區塊，在大螢幕永遠顯示，在小螢幕時根據showFilters判斷是否顯示 */}
                <Col md={3} className={`mb-4 ${showFilters ? 'd-block' : 'd-none d-md-block'}`}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="mb-3 fw-bold">行業分類</h5>
              <Nav variant="pills" className="flex-column">
                {categories.map((category, index) => (
                  <Nav.Item key={index} className="mb-2">
                    <Nav.Link
                      active={category.id === selectedType}
                      onClick={() => { setActiveCategory(index); handleTypeSearch(category.id); }}
                      className="d-flex justify-content-between align-items-center"
                    >
                      {category.title}
                      {category.count && <Badge bg="light" text="dark">{category.count}</Badge>}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Card.Body>
          </Card>
        </Col>

        {/* 搜尋結果區塊，根據篩選區域是否顯示來決定寬度 */}
        <Col md={showFilters ? 9 : 12} className="col-12">
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="p-3">
              <Row>
                {renderSearchResults()}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Search;