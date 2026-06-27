import React, { useState, useEffect } from "react";
import { Button, PageHeader, Card } from "components/common/ui";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompanyInfo from "components/Manage/Company/Info";
import ContactInfo from "components/Manage/Company/Contact";
import ProductInfo from "components/Manage/Company/Product";
import IndustryDropdown from "components/Manage/Company/IndustryDropdown";
import Axios from "common/Axios";
import useRWD from 'hooks/useRWD';
import {
  Building2,
  Info,
  X,
  ChevronLeft,
  ChevronRight,
  Save,
  Layers,
  Package,
  Phone,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

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

  // 分頁標籤定義（presentation 重建；完成條件與原邏輯一致）
  const tabItems = [
    {
      key: "companyInfo",
      num: 1,
      label: "公司資訊",
      icon: <Building2 size={18} />,
      done: formProgress > 0,
      doneLabel: "已開始填寫",
    },
    {
      key: "industry",
      num: 2,
      label: "產業分類",
      icon: <Layers size={18} />,
      done: !!company.industry,
      doneLabel: "已填寫",
    },
    {
      key: "productInfo",
      num: 3,
      label: "產品資訊",
      icon: <Package size={18} />,
      done: !!(company.products || company.product_description),
      doneLabel: "已填寫",
    },
    {
      key: "contactInfo",
      num: 4,
      label: "聯絡資訊",
      icon: <Phone size={18} />,
      done: !!(company.website || company.email || company.phone_number),
      doneLabel: "已填寫",
    },
  ];

  const progressTone =
    formProgress > 70 ? "progress-success" : formProgress > 30 ? "progress-info" : "progress-warning";

  return (
    <div className="min-h-screen bg-base-200/40" style={rwd.getContainerStyle()}>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="公司資料維護"
          subtitle="完善公司資料，提升曝光度與專業形象。所有欄位皆為選填，可隨時儲存。"
          icon={<Building2 size={22} />}
          actions={
            <Button variant="outline" size="sm" onClick={() => setShowTips(!showTips)}>
              <Info size={16} className="mr-1" />
              {showTips ? "隱藏說明" : "顯示說明"}
            </Button>
          }
        />

        {/* 填寫說明 */}
        {showTips && (
          <Card padding="md" className="mb-5 border-primary/20 bg-primary/5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-primary">
                <Info size={18} />
                <h4 className="font-bold">填寫說明</h4>
              </div>
              <button
                type="button"
                className="rounded-lg p-1 text-base-content/50 transition hover:bg-base-200 hover:text-base-content"
                aria-label="關閉"
                onClick={() => setShowTips(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-base-content/70">
              <p>
                歡迎使用公司資料維護功能。請依照下面的分類填寫您的公司資料，所有欄位均為
                <b className="text-base-content">選填</b>，您可隨時儲存並稍後繼續完善。
              </p>
              <p>完整的公司資料有助於提高您的曝光度和專業形象。</p>
              <div className="rounded-lg bg-base-100/60 px-3 py-2 text-base-content/80">
                <b>小提示：</b> 可以點擊上方的分頁標籤或使用下方的「上一步」、「下一步」按鈕來切換不同區塊。
              </div>
            </div>
          </Card>
        )}

        {/* 資料完整度 */}
        <Card padding="md" className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-base-content">資料完整度</span>
            <span className="text-sm font-bold text-primary">{formProgress}%</span>
          </div>
          <progress
            className={`progress w-full ${progressTone}`}
            value={formProgress}
            max="100"
            style={{ height: "10px", borderRadius: "5px" }}
          />
        </Card>

        <form onSubmit={handleSubmit}>
          {/* 分頁標籤列 */}
          <div role="tablist" className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {tabItems.map((tab) => {
              const active = activeKey === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveKey(tab.key)}
                  className={[
                    "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition",
                    active
                      ? "border-primary bg-primary text-primary-content shadow-sm"
                      : "border-base-300 bg-base-100 text-base-content/70 hover:border-primary/40 hover:bg-primary/5",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                      active ? "bg-primary-content/20 text-primary-content" : "bg-base-200 text-base-content/60",
                    ].join(" ")}
                  >
                    {tab.num}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-sm font-semibold">
                      {tab.icon}
                      <span className="truncate">{tab.label}</span>
                    </span>
                    {tab.done && (
                      <span
                        className={[
                          "mt-0.5 inline-flex items-center gap-1 text-[11px]",
                          active ? "text-primary-content/80" : "text-success",
                        ].join(" ")}
                      >
                        <CheckCircle2 size={12} />
                        {tab.doneLabel}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 1. 公司資訊 */}
          {activeKey === "companyInfo" && (
            <Card padding="none" className="overflow-hidden">
              <div className="flex items-center gap-2 border-b border-base-300 bg-base-200/60 px-5 py-4">
                <Building2 size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-base-content">基本公司資訊</h3>
              </div>
              <div className="p-5 sm:p-6">
                <div className="mb-4 rounded-lg bg-base-200/60 px-4 py-3 text-sm text-base-content/70">
                  這裡填寫公司的基本資料，讓客戶能夠了解您的公司。所有欄位均為
                  <b className="text-base-content">選填</b>，您可填寫對您最重要的資訊。
                </div>
                <CompanyInfo
                  company={company}
                  handleInputChange={handleInputChange}
                />
              </div>
            </Card>
          )}

          {/* 2. 產業分類 */}
          {activeKey === "industry" && (
            <Card padding="none" className="overflow-hidden">
              <div className="flex items-center gap-2 border-b border-base-300 bg-base-200/60 px-5 py-4">
                <Layers size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-base-content">選擇產業分類</h3>
              </div>
              <div className="p-5 sm:p-6">
                <div className="mb-4 rounded-lg bg-base-200/60 px-4 py-3 text-sm text-base-content/70">
                  選擇最符合您公司的產業類型，這將有助於潛在客戶找到您。
                </div>
                <IndustryDropdown
                  industries={industries}
                  company={company}
                  handleInputChange={handleInputChange}
                />
              </div>
            </Card>
          )}

          {/* 3. 產品資訊 */}
          {activeKey === "productInfo" && (
            <Card padding="none" className="overflow-hidden">
              <div className="flex items-center gap-2 border-b border-base-300 bg-base-200/60 px-5 py-4">
                <Package size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-base-content">產品或服務資訊</h3>
              </div>
              <div className="p-5 sm:p-6">
                <div className="mb-4 rounded-lg bg-base-200/60 px-4 py-3 text-sm text-base-content/70">
                  簡單描述您提供的主要產品或服務，讓客戶了解您的業務範圍。
                </div>
                <ProductInfo
                  company={company}
                  handleInputChange={handleInputChange}
                />
              </div>
            </Card>
          )}

          {/* 4. 聯絡資訊 */}
          {activeKey === "contactInfo" && (
            <Card padding="none" className="overflow-hidden">
              <div className="flex items-center gap-2 border-b border-base-300 bg-base-200/60 px-5 py-4">
                <Phone size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-base-content">聯絡方式與照片</h3>
              </div>
              <div className="p-5 sm:p-6">
                <div className="mb-4 rounded-lg bg-base-200/60 px-4 py-3 text-sm text-base-content/70">
                  填寫聯絡資訊，以便客戶能夠與您聯繫。您也可以上傳公司照片，增加專業形象。
                </div>
                <ContactInfo
                  company={company}
                  handleInputChange={handleInputChange}
                  handleFileChange={handleFileChange}
                />
              </div>
            </Card>
          )}

          {/* 導航與儲存 */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              onClick={() => navigateTabs('prev')}
              disabled={activeKey === "companyInfo"}
              size={rwd.isMobile ? "md" : "lg"}
              className="w-full sm:w-auto"
            >
              <ChevronLeft size={18} className="mr-1" />
              上一步
            </Button>

            <Button
              variant="primary"
              type="submit"
              size={rwd.isMobile ? "md" : "lg"}
              className="w-full font-bold sm:w-auto"
            >
              <Save size={18} className="mr-1" />
              {isEditMode ? "儲存變更" : "儲存資料"}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigateTabs('next')}
              disabled={activeKey === "contactInfo"}
              size={rwd.isMobile ? "md" : "lg"}
              className="w-full sm:w-auto"
            >
              下一步
              <ChevronRight size={18} className="ml-1" />
            </Button>
          </div>
        </form>

        {/* 常見問題 */}
        <Card padding="md" className="mt-6">
          <div className="mb-4 flex items-center gap-2">
            <HelpCircle size={20} className="text-primary" />
            <h4 className="text-base font-bold text-base-content">常見問題</h4>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-base-200/50 p-4">
              <p className="mb-1 font-semibold text-base-content">問：我需要填寫所有欄位嗎？</p>
              <p className="text-sm text-base-content/70">
                答：不需要，所有欄位都是選填的，您可以只填寫對您重要的資訊。
              </p>
            </div>
            <div className="rounded-xl bg-base-200/50 p-4">
              <p className="mb-1 font-semibold text-base-content">問：我可以稍後再回來完善資料嗎？</p>
              <p className="text-sm text-base-content/70">
                答：可以，您隨時可以回來修改或完善資料。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompanyForm;
