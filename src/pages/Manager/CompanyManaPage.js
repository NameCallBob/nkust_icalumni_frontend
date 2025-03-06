import React, { useState, useEffect } from "react";
import { Button, Container, Form, Tabs, Tab, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompanyInfo from "components/Manage/Company/Info";
import ContactInfo from "components/Manage/Company/Contact";
import ProductInfo from "components/Manage/Company/Product";
import IndustryDropdown from "components/Manage/Company/IndustryDropdown";
import Axios from "common/Axios";
import "css/manage/company.css"; // 引入你的CSS文件

const CompanyForm = () => {
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
   photo: "", // base64 編碼後的圖片
  });

  const [originalCompany, setOriginalCompany] = useState({});
  const [industries, setIndustries] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeKey, setActiveKey] = useState("companyInfo");

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

  const handleInputChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 使用 FileReader 讀取圖片並轉換為 base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompany({
          ...company,
         photo: reader.result, // 存放 base64 編碼
        });
      };
      reader.readAsDataURL(file); // 將圖片轉換為 base64
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // **檢查新增時，是否有欄位為空**
    if (!isEditMode) {
      const hasEmptyField = Object.values(company).some(
        (value) => value.trim() === ""
      );

      if (hasEmptyField) {
        toast.error("所有欄位都必須填寫，不能為空！");
        return;
      }
    }

    // **檢查修改時，是否有實際變更**
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
              toast.error(message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
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
  
  return (
    <Container fluid className="py-4" style={{ maxWidth: "1000px" }}>
      <h1 className="text-center mb-4">公司資料維護</h1>
      <Form onSubmit={handleSubmit}>
        <Tabs
          id="controlled-tab"
          activeKey={activeKey}
          onSelect={(k) => setActiveKey(k)}
          className="mb-3"
        >
          <Tab eventKey="companyInfo" title="公司資訊">
            <div className="custom-card">
              <div className="custom-card-header">公司資訊</div>
              <div className="custom-card-body">
                <CompanyInfo company={company} handleInputChange={handleInputChange} />
              </div>
            </div>
          </Tab>
          <Tab eventKey="industry" title="產業分類">
            <div className="custom-card">
              <div className="custom-card-header">產業分類</div>
              <div className="custom-card-body">
                <IndustryDropdown
                  industries={industries}
                  company={company}
                  handleInputChange={handleInputChange}
                />
              </div>
            </div>
          </Tab>
          <Tab eventKey="productInfo" title="產品資訊">
            <div className="custom-card">
              <div className="custom-card-header">產品資訊</div>
              <div className="custom-card-body">
                <ProductInfo company={company} handleInputChange={handleInputChange} />
              </div>
            </div>
          </Tab>
          <Tab eventKey="contactInfo" title="聯絡資訊">
            <div className="custom-card">
              <div className="custom-card-header">聯絡資訊</div>
              <div className="custom-card-body">
                <ContactInfo
                  company={company}
                  handleInputChange={handleInputChange}
                  handleFileChange={handleFileChange}
                />
                {/* 顯示圖片預覽 */}
                {company.photo && (
                  <div className="mt-3">
                    <h5>即將上傳的照片：</h5>
                    <Image src={company.photo} alt="Preview" fluid />
                  </div>
                )}
              </div>
            </div>
          </Tab>
        </Tabs>

        <div className="text-center">
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            {isEditMode ? "修改" : "保存"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CompanyForm;
