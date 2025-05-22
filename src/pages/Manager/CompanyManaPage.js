import React, { useState, useEffect } from "react";
import { Button, Container, Form, Tabs, Tab, Alert, Card, ProgressBar, Row, Col, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompanyInfo from "components/Manage/Company/Info";
import ContactInfo from "components/Manage/Company/Contact";
import ProductInfo from "components/Manage/Company/Product";
import IndustryDropdown from "components/Manage/Company/IndustryDropdown";
import Axios from "common/Axios";
import "css/manage/company.css";

const CompanyForm = () => {
  // 原有的狀態保持不變
  const [company, setCompany] = useState({
    name: "",
    member: "",
    industry: "",
    positions: "",
    description: "",
    products: "",
    product_description: "",
    website: "",
    address: "",
    email: "",
    phone_number: "",
    photo: "",
  });

  const [originalCompany, setOriginalCompany] = useState({});
  const [industries, setIndustries] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeKey, setActiveKey] = useState("companyInfo");
  
  // 新增進度追蹤
  const [formProgress, setFormProgress] = useState(0);
  
  // 新增提示狀態
  const [showTips, setShowTips] = useState(true);

  // 原有的資料載入邏輯
  useEffect(() => {
    Axios()
      .get("/company/industry/all/")
      .then((response) => {
        setIndustries(response.data);
      })
      .catch(() => {
        toast.error("取得產業資料失敗，請稍後再試。");
      });

    Axios()
      .get("/company/data/selfInfo/")
      .then((res) => {
        setCompany(res.data);
        setOriginalCompany(res.data);
        setIsEditMode(true);
        calculateProgress(res.data);
      })
      .catch((error) => {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              toast.error("未授權，請登入後再試。");
              break;
            case 403:
              toast.error("您沒有權限執行此操作。");
              break;
            case 404:
              toast.info("未找到公司資料，請新增您的公司資料。");
              setIsEditMode(false);
              break;
            default:
              toast.error("獲取公司資料失敗，請稍後再試。");
              break;
          }
        } else {
          toast.error("伺服器錯誤，請稍後再試。");
        }
      });
  }, []);

  // 計算表單填寫進度
  const calculateProgress = (data) => {
    const fields = Object.keys(data);
    let filledFields = 0;
    
    fields.forEach(field => {
      if (data[field] && String(data[field]).trim() !== '') {
        filledFields++;
      }
    });
    
    const progress = Math.round((filledFields / fields.length) * 100);
    setFormProgress(progress);
  };

  // 原有的輸入處理函數
  const handleInputChange = (e) => {
    const updatedCompany = { ...company, [e.target.name]: e.target.value };
    setCompany(updatedCompany);
    calculateProgress(updatedCompany);
  };

  // 原有的檔案處理函數，稍作修改
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.warning("照片大小不能超過 5MB，請選擇較小的照片");
        e.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedCompany = { ...company, photo: reader.result };
        setCompany(updatedCompany);
        calculateProgress(updatedCompany);
      };
      reader.readAsDataURL(file);
    }
  };

  // 原有的提交函數
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 如果是編輯模式，檢查是否有實際變更
    const changedData = {};
    Object.keys(company).forEach((key) => {
      if (company[key] !== originalCompany[key]) {
        changedData[key] = company[key];
      }
    });

    if (isEditMode && Object.keys(changedData).length === 0) {
      toast.info("您沒有修改任何資料。");
      return;
    }

    const fetchUpdatedData = () => {
      Axios()
        .get("/company/data/selfInfo/")
        .then((res) => {
          setCompany(res.data);
          setOriginalCompany(res.data);
          calculateProgress(res.data);
          toast.success("資料已更新！");
        })
        .catch(() => {
          toast.error("重新取得公司資料失敗，請稍後再試。");
        });
    };

    const apiUrl = isEditMode
      ? "/company/data/selfChange/"
      : "/company/data/new/";
    const requestData = isEditMode ? changedData : company;

    Axios()
      .post(apiUrl, requestData)
      .then(() => {
        toast.success(
          isEditMode ? "公司資料修改成功！" : "公司資料新增成功！"
        );
        fetchUpdatedData();
      })
      .catch((error) => {
        handleApiError(error);
      });
  };

  // 原有的錯誤處理
  const handleApiError = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          toast.error("未授權，請登入後再試。");
          break;
        case 403:
          toast.error("您沒有權限執行此操作。");
          break;
        default:
          const messages = Object.values(error.response.data || {}).flat();
          if (messages.length > 0) {
            messages.forEach((message) => {
              toast.error(message);
            });
          } else {
            toast.error("操作失敗，請稍後再試。");
          }
          break;
      }
    } else {
      toast.error("伺服器錯誤，請稍後再試。");
    }
  };
  
  // 新增：上一頁/下一頁導航
  const navigateTabs = (direction) => {
    const tabs = ["companyInfo", "industry", "productInfo", "contactInfo"];
    const currentIndex = tabs.indexOf(activeKey);
    
    if (direction === 'next' && currentIndex < tabs.length - 1) {
      setActiveKey(tabs[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      setActiveKey(tabs[currentIndex - 1]);
    }
  };
  
  return (
    <Container fluid className="py-4" style={{ maxWidth: "980px" }}>
      <Card className="shadow mb-4">
        <Card.Body>
          <h1 className="text-center mb-2" style={{ fontSize: "28px", fontWeight: "bold", color: "#0056b3" }}>
            公司資料維護
          </h1>
          
          {showTips && (
            <Alert variant="info" className="mb-3" dismissible onClose={() => setShowTips(false)}>
              <Alert.Heading>填寫說明</Alert.Heading>
              <p>歡迎使用公司資料維護功能。請依照下面的分類填寫您的公司資料，所有欄位均為<b>選填</b>，您可隨時儲存並稍後繼續完善。</p>
              <p>完整的公司資料有助於提高您的曝光度和專業形象。</p>
              <hr />
              <p className="mb-0">
                <b>小提示：</b> 可以點擊上方的分頁標籤或使用下方的「上一步」、「下一步」按鈕來切換不同區塊。
              </p>
            </Alert>
          )}
          
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span><b>資料完整度：</b> {formProgress}%</span>
              <Button variant="light" size="sm" onClick={() => setShowTips(!showTips)}>
                {showTips ? "隱藏說明" : "顯示說明"}
              </Button>
            </div>
            <ProgressBar 
              now={formProgress} 
              variant={formProgress > 70 ? "success" : formProgress > 30 ? "info" : "warning"} 
              style={{ height: "10px", borderRadius: "5px" }}
            />
          </div>
          
          <Form onSubmit={handleSubmit}>
            <Tabs
              id="company-form-tabs"
              activeKey={activeKey}
              onSelect={(k) => setActiveKey(k)}
              className="mb-4"
            >
              <Tab eventKey="companyInfo" title={
                <span style={{ fontSize: "16px", padding: "8px 0" }}>
                  1. 公司資訊 {formProgress > 0 && <Badge bg="success" pill>已開始填寫</Badge>}
                </span>
              }>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h3 style={{ fontSize: "20px", margin: "0" }}>基本公司資訊</h3>
                  </Card.Header>
                  <Card.Body>
                    <Alert variant="light" className="mb-3">
                      這裡填寫公司的基本資料，讓客戶能夠了解您的公司。所有欄位均為<b>選填</b>，您可填寫對您最重要的資訊。
                    </Alert>
                    <CompanyInfo 
                      company={company} 
                      handleInputChange={handleInputChange} 
                    />
                  </Card.Body>
                </Card>
              </Tab>
              
              <Tab eventKey="industry" title={
                <span style={{ fontSize: "16px", padding: "8px 0" }}>
                  2. 產業分類 {company.industry && <Badge bg="success" pill>已填寫</Badge>}
                </span>
              }>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h3 style={{ fontSize: "20px", margin: "0" }}>選擇產業分類</h3>
                  </Card.Header>
                  <Card.Body>
                    <Alert variant="light" className="mb-3">
                      選擇最符合您公司的產業類型，這將有助於潛在客戶找到您。
                    </Alert>
                    <IndustryDropdown 
                      industries={industries} 
                      company={company} 
                      handleInputChange={handleInputChange} 
                    />
                  </Card.Body>
                </Card>
              </Tab>
              
              <Tab eventKey="productInfo" title={
                <span style={{ fontSize: "16px", padding: "8px 0" }}>
                  3. 產品資訊 {(company.products || company.product_description) && <Badge bg="success" pill>已填寫</Badge>}
                </span>
              }>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h3 style={{ fontSize: "20px", margin: "0" }}>產品或服務資訊</h3>
                  </Card.Header>
                  <Card.Body>
                    <Alert variant="light" className="mb-3">
                      簡單描述您提供的主要產品或服務，讓客戶了解您的業務範圍。
                    </Alert>
                    <ProductInfo 
                      company={company} 
                      handleInputChange={handleInputChange} 
                    />
                  </Card.Body>
                </Card>
              </Tab>
              
              <Tab eventKey="contactInfo" title={
                <span style={{ fontSize: "16px", padding: "8px 0" }}>
                  4. 聯絡資訊 {(company.website || company.email || company.phone_number) && <Badge bg="success" pill>已填寫</Badge>}
                </span>
              }>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h3 style={{ fontSize: "20px", margin: "0" }}>聯絡方式與照片</h3>
                  </Card.Header>
                  <Card.Body>
                    <Alert variant="light" className="mb-3">
                      填寫聯絡資訊，以便客戶能夠與您聯繫。您也可以上傳公司照片，增加專業形象。
                    </Alert>
                    <ContactInfo 
                      company={company} 
                      handleInputChange={handleInputChange} 
                      handleFileChange={handleFileChange} 
                    />
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>

            <div className="d-flex justify-content-between mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigateTabs('prev')}
                disabled={activeKey === "companyInfo"}
                size="lg"
                style={{ padding: "12px 20px", fontSize: "16px" }}
              >
                ← 上一步
              </Button>
              
              <Button 
                variant="success" 
                type="submit" 
                size="lg"
                style={{ padding: "12px 30px", fontSize: "16px", fontWeight: "bold" }}
              >
                {isEditMode ? "儲存變更" : "儲存資料"}
              </Button>
              
              <Button 
                variant="outline-primary" 
                onClick={() => navigateTabs('next')}
                disabled={activeKey === "contactInfo"}
                size="lg"
                style={{ padding: "12px 20px", fontSize: "16px" }}
              >
                下一步 →
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      <Card className="mt-3 shadow-sm">
        <Card.Body>
          <h4>常見問題</h4>
          <Row>
            <Col md={6}>
              <p><b>問：我需要填寫所有欄位嗎？</b></p>
              <p>答：不需要，所有欄位都是選填的，您可以只填寫對您重要的資訊。</p>
            </Col>
            <Col md={6}>
              <p><b>問：我可以稍後再回來完善資料嗎？</b></p>
              <p>答：可以，您隨時可以回來修改或完善資料。</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CompanyForm;