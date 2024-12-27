import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Nav, Card, Container, Row, Col, Form, Button, Fade, Spinner } from 'react-bootstrap';
import LoadingSpinner from 'components/LoadingSpinner';
import SEO from 'SEO';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate(); // 用來處理導航
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false); // 控制淡出動畫的狀態
  const [selectedType, setSelectedType] = useState(null); // 儲存選擇的類型
  const [loading, setLoading] = useState(false); // 加載狀態
  const { type_id, search_text } = location.state || { type_id: null, search_text: null };
  console.log(location.state)

  useEffect(() => {
    // industry輸入中，預設取得所有的分類
    Axios().get('company/industry/all/')
      .then((res) => {
        setCategories(res.data);
      });
    // 檢查是否有傳來的搜尋參數，並預設查詢
    if (type_id || search_text) {
      const initialQuery = {};
      if (type_id) {
        setSelectedType(type_id);

        initialQuery['industry'] = type_id;
      }
      if (search_text) {
        setSearchTerm(search_text);
        initialQuery['name'] = search_text;
      }
      console.log(initialQuery)
      handleSearch(initialQuery); // 預設查詢
    }else{
      handleSearch()
    }
  }, []);

  // 處理類型搜尋
  const handleTypeSearch = (categoryId) => {
    setSelectedType(categoryId);
    const query = {};

    // 如果有輸入的搜尋條件則加入查詢
    if (searchTerm) {
      query['name'] = searchTerm;
    }

    // 添加類型條件
    query['industry'] = categoryId;

    handleSearch(query);
  };

  // 處理輸入搜尋
  const handleInputSearch = (e) => {
    e.preventDefault();
    const query = {};

    // 如果有選擇的類型則加入查詢
    if (selectedType) {
      query['industry'] = selectedType;
    } 

    // 添加輸入條件
    if (searchTerm) {
      query['search'] = searchTerm;
    }

    handleSearch(query);
  };

  // 處理聯合搜尋並串接後端
  const handleSearch = (searchQuery=null) => {
    setLoading(true); // 開始加載資料
    console.log(searchQuery)
    Axios().get('company/search_any/', { params: searchQuery })
      .then((res) => {
        if (res.data.results.length === 0) {
          setShowNoResults(true);
          setSearchResults([]);
        } else {
          setShowNoResults(false);
          setSearchResults(res.data.results);
        }
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      })
      .finally(() => {
        setLoading(false); // 加載完成
      });
  };

  // 處理卡片點擊
  const handleCardClick = (result) => {
    navigate(`/alumni/${result.member}`); // 假設公司詳細頁面是這樣的路徑
  };

  return (
    <Container className='my-4'>
      <SEO
      title="招募查詢"
      description="了解智慧商務系友會中系友們的招募需求與最新機會，加入我們，共創未來。"
      keywords={["智慧商務", "招募", "招聘", "加入系友會"]}
    />
      <Row className="d-flex flex-column flex-md-row">
        <Col md={3} className="mb-3 mb-md-0">
          <Nav variant="pills" className="flex-md-column justify-content-center">
            {categories.map((category, index) => (
              <Nav.Item key={index}>
                <Nav.Link
                  active={category.id === selectedType}
                  onClick={() => { setActiveCategory(index); handleTypeSearch(category.id); }}
                  className="text-center"
                >
                  {category.title}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Col>
        <Col md={9}>
          <Form className="mb-4" onSubmit={handleInputSearch}>
            <Row>
              <Col xs={8} md={10}>
                <Form.Control
                  type="text"
                  placeholder="搜尋..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col xs={4} md={2}>
                <Button variant="primary" type="submit" className="w-100">
                  搜尋
                </Button>
              </Col>
            </Row>
          </Form>

          {/* 搜索結果展示區域 */}
          <Row>
            {loading ? (
              <Col xs={12} className="text-center">
                <LoadingSpinner></LoadingSpinner>
              </Col>
            ) : searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <Col xs={12} md={4} key={index}>
                  <Card
                    className="mb-4 shadow-sm"
                    style={{ borderRadius: '10px', cursor: 'pointer' }}
                    onClick={() => handleCardClick(result)} // 點擊整個卡片
                  >
                    <Card.Img
                      variant="top"
                      src={result.photo}
                      alt={result.name}
                      style={{ objectFit: 'cover', height: '200px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                    />
                    <Card.Body>
                      <Card.Title className="text-truncate" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{result.name}</Card.Title>
                      <Card.Text className="text-truncate" style={{ fontSize: '1rem', color: '#6c757d' }}>
                        系友： {result.member_name}
                      </Card.Text>
                      <Card.Text>
                        {result.products}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Fade in={showNoResults}>
                <Col xs={12}>
                  <div className="text-center">
                    <p>沒有符合的搜尋結果</p>
                  </div>
                </Col>
              </Fade>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Search;
