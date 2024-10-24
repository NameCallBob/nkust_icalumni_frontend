import React, { useState, useEffect } from "react";
import { Button, Container, Form, Card, Tabs, Tab } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompanyInfo from "components/Manage/Company/Info";
import ContactInfo from "components/Manage/Company/Contact";
import ProductInfo from "components/Manage/Company/Product";
import IndustryDropdown from "components/Manage/Company/IndustryDropdown";
import Axios from "common/Axios";

const CompanyForm = () => {
  const [company, setCompany] = useState({
    name: "",
    member: "",
    industry: "",
    positions: "",
    description: "",
    products: "",
    productDescription: "",
    website: "",
    address: "",
    email: "",
    phoneNumber: "",
    photo: null,
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
    setCompany({ ...company, photo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const changedData = {};
    Object.keys(company).forEach((key) => {
      if (company[key] !== originalCompany[key]) {
        changedData[key] = company[key];
      }
    });

    const formData = new FormData();
    Object.keys(changedData).forEach((key) => {
      formData.append(key, changedData[key]);
    });

    if (isEditMode) {
      Axios()
        .post("/company/data/selfChange/", formData)
        .then(() => {
          toast.success("公司資料修改成功！");
          setOriginalCompany(company);
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
              default:
                toast.error("修改公司資料失敗，請稍後再試。");
                break;
            }
          } else {
            toast.error("伺服器錯誤，請稍後再試。");
          }
        });
    } else {
      Axios()
        .post("/company/data/new/", formData)
        .then(() => {
          toast.success("公司資料新增成功！");
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
              default:
                toast.error("新增公司資料失敗，請稍後再試。");
                break;
            }
          } else {
            toast.error("伺服器錯誤，請稍後再試。");
          }
        });
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
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <CompanyInfo company={company} handleInputChange={handleInputChange} />
              </Card.Body>
            </Card>
          </Tab>
          <Tab eventKey="industry" title="產業分類">
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <IndustryDropdown
                  industries={industries}
                  company={company}
                  handleInputChange={handleInputChange}
                />
              </Card.Body>
            </Card>
          </Tab>
          <Tab eventKey="productInfo" title="產品資訊">
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <ProductInfo company={company} handleInputChange={handleInputChange} />
              </Card.Body>
            </Card>
          </Tab>
          <Tab eventKey="contactInfo" title="聯絡資訊">
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <ContactInfo
                  company={company}
                  handleInputChange={handleInputChange}
                  handleFileChange={handleFileChange}
                />
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        <div className="text-center">
          <Button variant="primary" type="submit">
            {isEditMode ? "修改公司資料" : "新增公司資料"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CompanyForm;
