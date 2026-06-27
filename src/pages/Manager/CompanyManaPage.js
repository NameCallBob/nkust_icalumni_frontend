import React, { useState, useEffect } from "react";
import { Button } from "components/common/ui";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompanyInfo from "components/Manage/Company/Info";
import ContactInfo from "components/Manage/Company/Contact";
import ProductInfo from "components/Manage/Company/Product";
import IndustryDropdown from "components/Manage/Company/IndustryDropdown";
import Axios from "common/Axios";
import useRWD from 'hooks/useRWD';
import "css/manage/company.css";

const CompanyForm = () => {
  // 響應式設計 hook
  const rwd = useRWD();

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

  // 分頁標籤定義（取代 react-bootstrap Tabs/Tab）
  const tabItems = [
    {
      key: "companyInfo",
      title: (
        <span style={{ fontSize: rwd.isMobile ? "14px" : "16px", padding: "8px 0" }}>
          1. 公司資訊 {formProgress > 0 && <span className="badge badge-success badge-sm ml-1">已開始填寫</span>}
        </span>
      ),
    },
    {
      key: "industry",
      title: (
        <span style={{ fontSize: rwd.isMobile ? "14px" : "16px", padding: "8px 0" }}>
          2. 產業分類 {company.industry && <span className="badge badge-success badge-sm ml-1">已填寫</span>}
        </span>
      ),
    },
    {
      key: "productInfo",
      title: (
        <span style={{ fontSize: rwd.isMobile ? "14px" : "16px", padding: "8px 0" }}>
          3. 產品資訊 {(company.products || company.product_description) && <span className="badge badge-success badge-sm ml-1">已填寫</span>}
        </span>
      ),
    },
    {
      key: "contactInfo",
      title: (
        <span style={{ fontSize: rwd.isMobile ? "14px" : "16px", padding: "8px 0" }}>
          4. 聯絡資訊 {(company.website || company.email || company.phone_number) && <span className="badge badge-success badge-sm ml-1">已填寫</span>}
        </span>
      ),
    },
  ];

  return (
    <div style={rwd.getContainerStyle()}>
    <div className="container mx-auto px-4 py-4" style={{ maxWidth: "980px", ...rwd.getContainerStyle() }}>
      <div className="card card-bordered bg-base-100 shadow mb-4">
        <div className="card-body">
          <h1 className="text-center mb-2" style={{
            fontSize: rwd.isMobile ? "22px" : "28px",
            fontWeight: "bold",
            color: "#0056b3"
          }}>
            公司資料維護
          </h1>

          {showTips && (
            <div className="alert alert-info flex-col items-start mb-3" role="alert">
              <div className="flex justify-between items-start w-full">
                <h4 className="font-bold">填寫說明</h4>
                {/* 關閉說明 */}
                <button type="button" className="btn btn-ghost btn-xs" aria-label="關閉" onClick={() => setShowTips(false)}>✕</button>
              </div>
              <div className="text-left">
                <p>歡迎使用公司資料維護功能。請依照下面的分類填寫您的公司資料，所有欄位均為<b>選填</b>，您可隨時儲存並稍後繼續完善。</p>
                <p>完整的公司資料有助於提高您的曝光度和專業形象。</p>
                <hr className="my-2 border-base-content/20" />
                <p className="mb-0">
                  <b>小提示：</b> 可以點擊上方的分頁標籤或使用下方的「上一步」、「下一步」按鈕來切換不同區塊。
                </p>
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span><b>資料完整度：</b> {formProgress}%</span>
              <Button variant="ghost" size="sm" onClick={() => setShowTips(!showTips)}>
                {showTips ? "隱藏說明" : "顯示說明"}
              </Button>
            </div>
            <progress
              className={`progress w-full ${formProgress > 70 ? "progress-success" : formProgress > 30 ? "progress-info" : "progress-warning"}`}
              value={formProgress}
              max="100"
              style={{ height: "10px", borderRadius: "5px" }}
            />
          </div>

          <form onSubmit={handleSubmit}>
            {/* 分頁標籤列（DaisyUI tabs，取代 react-bootstrap Tabs） */}
            <div role="tablist" className="tabs tabs-bordered mb-4 flex-wrap">
              {tabItems.map((tab) => (
                <a
                  key={tab.key}
                  role="tab"
                  className={`tab ${activeKey === tab.key ? "tab-active" : ""}`}
                  onClick={() => setActiveKey(tab.key)}
                >
                  {tab.title}
                </a>
              ))}
            </div>

            {/* 1. 公司資訊 */}
            {activeKey === "companyInfo" && (
              <div className="card card-bordered border-0 shadow-sm bg-base-100">
                <div className="bg-base-200 px-4 py-3 rounded-t-lg">
                  <h3 style={{ fontSize: "20px", margin: "0" }}>基本公司資訊</h3>
                </div>
                <div className="card-body">
                  <div className="alert bg-base-200 text-base-content mb-3">
                    這裡填寫公司的基本資料，讓客戶能夠了解您的公司。所有欄位均為<b>選填</b>，您可填寫對您最重要的資訊。
                  </div>
                  <CompanyInfo
                    company={company}
                    handleInputChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            {/* 2. 產業分類 */}
            {activeKey === "industry" && (
              <div className="card card-bordered border-0 shadow-sm bg-base-100">
                <div className="bg-base-200 px-4 py-3 rounded-t-lg">
                  <h3 style={{ fontSize: "20px", margin: "0" }}>選擇產業分類</h3>
                </div>
                <div className="card-body">
                  <div className="alert bg-base-200 text-base-content mb-3">
                    選擇最符合您公司的產業類型，這將有助於潛在客戶找到您。
                  </div>
                  <IndustryDropdown
                    industries={industries}
                    company={company}
                    handleInputChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            {/* 3. 產品資訊 */}
            {activeKey === "productInfo" && (
              <div className="card card-bordered border-0 shadow-sm bg-base-100">
                <div className="bg-base-200 px-4 py-3 rounded-t-lg">
                  <h3 style={{ fontSize: "20px", margin: "0" }}>產品或服務資訊</h3>
                </div>
                <div className="card-body">
                  <div className="alert bg-base-200 text-base-content mb-3">
                    簡單描述您提供的主要產品或服務，讓客戶了解您的業務範圍。
                  </div>
                  <ProductInfo
                    company={company}
                    handleInputChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            {/* 4. 聯絡資訊 */}
            {activeKey === "contactInfo" && (
              <div className="card card-bordered border-0 shadow-sm bg-base-100">
                <div className="bg-base-200 px-4 py-3 rounded-t-lg">
                  <h3 style={{ fontSize: "20px", margin: "0" }}>聯絡方式與照片</h3>
                </div>
                <div className="card-body">
                  <div className="alert bg-base-200 text-base-content mb-3">
                    填寫聯絡資訊，以便客戶能夠與您聯繫。您也可以上傳公司照片，增加專業形象。
                  </div>
                  <ContactInfo
                    company={company}
                    handleInputChange={handleInputChange}
                    handleFileChange={handleFileChange}
                  />
                </div>
              </div>
            )}

            <div className={rwd.isMobile ? "flex flex-col gap-3 mt-4" : "flex justify-between mt-4"}>
              <Button
                variant="outline"
                onClick={() => navigateTabs('prev')}
                disabled={activeKey === "companyInfo"}
                size={rwd.isMobile ? "md" : "lg"}
                style={{
                  padding: rwd.isMobile ? "10px 15px" : "12px 20px",
                  fontSize: rwd.isMobile ? "14px" : "16px",
                  width: rwd.isMobile ? "100%" : "auto"
                }}
              >
                ← 上一步
              </Button>

              <Button
                variant="success"
                type="submit"
                size={rwd.isMobile ? "md" : "lg"}
                style={{
                  padding: rwd.isMobile ? "10px 20px" : "12px 30px",
                  fontSize: rwd.isMobile ? "14px" : "16px",
                  fontWeight: "bold",
                  width: rwd.isMobile ? "100%" : "auto"
                }}
              >
                {isEditMode ? "儲存變更" : "儲存資料"}
              </Button>

              <Button
                variant="outline"
                onClick={() => navigateTabs('next')}
                disabled={activeKey === "contactInfo"}
                size={rwd.isMobile ? "md" : "lg"}
                style={{
                  padding: rwd.isMobile ? "10px 15px" : "12px 20px",
                  fontSize: rwd.isMobile ? "14px" : "16px",
                  width: rwd.isMobile ? "100%" : "auto"
                }}
              >
                下一步 →
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="card card-bordered bg-base-100 mt-3 shadow-sm">
        <div className="card-body">
          <h4>常見問題</h4>
          <div className="grid grid-cols-12 gap-4">
            <div className={`col-span-12 ${rwd.isMobile ? "mb-3" : "md:col-span-6"}`}>
              <p><b>問：我需要填寫所有欄位嗎？</b></p>
              <p>答：不需要，所有欄位都是選填的，您可以只填寫對您重要的資訊。</p>
            </div>
            <div className={`col-span-12 ${rwd.isMobile ? "" : "md:col-span-6"}`}>
              <p><b>問：我可以稍後再回來完善資料嗎？</b></p>
              <p>答：可以，您隨時可以回來修改或完善資料。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CompanyForm;
