import React, { useState } from 'react';
import { HelpCircle, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AppModal from 'components/common/AppModal';
import { Button, Field } from 'components/common/ui';

const RecruitFormModal = ({
  show,
  onHide,
  formData,
  setFormData,
  isPersonalContact,
  setIsPersonalContact,
  isPersonalCompany,
  setIsPersonalCompany,
  handleQuillChange,
  imagePreviews,
  handleImageChange,
  handleSubmit,
  isEdit = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [validated, setValidated] = useState(false);
  const [stepErrors, setStepErrors] = useState({});
  // 新增加載狀態
  const [isLoading, setIsLoading] = useState(false);

  // 表單步驟定義
  const steps = [
    {
      title: "職缺基本資訊",
      description: "請填寫職缺的基本資料，讓求職者清楚了解這個職位",
      icon: "📋"
    },
    {
      title: "聯絡資訊",
      description: "請提供求職者可以聯繫的方式",
      icon: "📞"
    },
    {
      title: "職缺詳細說明",
      description: "詳細描述職缺內容、福利與要求",
      icon: "📝"
    },
    {
      title: "上傳相關圖片",
      description: "可上傳公司環境、福利或其他相關圖片",
      icon: "🖼️"
    }
  ];

  // 驗證當前步驟表單
  const validateCurrentStep = () => {
    let isValid = true;
    const errors = {};

    // 根據當前步驟驗證不同欄位
    switch(currentStep) {
      case 0: // 職缺基本資訊
        if (!formData.title?.trim()) {
          isValid = false;
          errors.title = "請輸入職位名稱";
        }

        if (!isPersonalCompany && !formData.company_name?.trim()) {
          isValid = false;
          errors.company_name = "請輸入公司名稱";
        }

        if (!formData.release_date) {
          isValid = false;
          errors.release_date = "請選擇發布日期";
        }

        if (!formData.deadline) {
          isValid = false;
          errors.deadline = "請選擇截止日期";
        }

        if (formData.release_date && formData.deadline &&
            new Date(formData.release_date) > new Date(formData.deadline)) {
          isValid = false;
          errors.deadline = "截止日期不能早於發布日期";
        }
        break;

      case 1: // 聯絡資訊
        if (!isPersonalContact) {
          if (!formData.contact?.name?.trim()) {
            isValid = false;
            errors.contactName = "請輸入聯絡人姓名";
          }

          if (!formData.contact?.email?.trim()) {
            isValid = false;
            errors.contactEmail = "請輸入聯絡人 Email";
          } else if (!/\S+@\S+\.\S+/.test(formData.contact.email)) {
            isValid = false;
            errors.contactEmail = "請輸入有效的 Email 地址";
          }

          if (!formData.contact?.phone?.trim()) {
            isValid = false;
            errors.contactPhone = "請輸入聯絡人電話";
          }
        }
        break;

      case 2: // 職缺詳細說明
        if (!formData.intro || formData.intro === '<p><br></p>') {
          isValid = false;
          errors.intro = "請填寫職缺詳細說明";
        }
        break;

      // 第 3 步驟 (圖片上傳) 沒有必填欄位
      case 3:
        // 您可以在這裡添加圖片的驗證邏輯，例如檢查圖片大小、類型等
        break;
    }

    setStepErrors(errors);
    return isValid;
  };

  // 驗證所有步驟
  const validateAllSteps = () => {
    // 儲存當前步驟
    const originalStep = currentStep;
    let allValid = true;

    // 驗證每個步驟
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      if (!validateCurrentStep()) {
        allValid = false;
        setCurrentStep(i); // 停在第一個無效的步驟
        break;
      }
    }

    // 如果全部有效但我們改變了當前步驟，恢復原來的步驟
    if (allValid && originalStep !== currentStep) {
      setCurrentStep(originalStep);
    }

    return allValid;
  };

  // 處理表單提交 - 修改此函數以添加加載狀態
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // 只有在最後一步時才執行完整表單驗證和提交
    if (currentStep === steps.length - 1) {
      if (!validateAllSteps()) {
        setValidated(true);
        return;
      }

      // 顯示加載動畫
      setIsLoading(true);

      // 所有驗證都通過，呼叫提交處理函數
      try {
        // 呼叫 Promise 類型的 handleSubmit
        Promise.resolve(handleSubmit(e))
          .then(() => {
            // 提交成功後隱藏加載動畫
            setIsLoading(false);
          })
          .catch(error => {
            console.error('表單提交錯誤:', error);
            setIsLoading(false);
          });
      } catch (error) {
        // 處理非 Promise 類型的 handleSubmit
        console.error('表單提交錯誤:', error);
        setIsLoading(false);
      }
    } else {
      // 如果不是最後一步，只進行到下一步的操作
      handleNext();
    }
  };

  // 下一步
  const handleNext = () => {
    // 使用自定義表單驗證
    if (!validateCurrentStep()) {
      setValidated(true);
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    setValidated(false);
  };

  // 上一步
  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setValidated(false);
    setStepErrors({});
  };

  // 渲染當前步驟表單
  const renderStepContent = () => {
    switch(currentStep) {
      case 0: // 職缺基本資訊
        return (
          <div className="step-form">
            <div className="alert alert-info mb-3">
              <HelpCircle size={20} />
              <span>{steps[0].description}</span>
            </div>

            {/* 職位名稱 */}
            <Field
              label="職位名稱"
              required
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={e => setFormData({...formData, title: e.target.value})}
              error={validated ? stepErrors.title : ''}
              help="一個清晰的職位名稱將吸引更多合適的求職者"
              placeholder="例如：前端工程師、行銷專員、專案經理"
            />

            {/* 使用我的公司資料 */}
            <div className="form-control mb-3">
              <label className="label cursor-pointer justify-start gap-2 pb-1">
                <input
                  type="checkbox"
                  id="isPersonalCompany"
                  className="checkbox checkbox-primary"
                  checked={isPersonalCompany}
                  onChange={() => setIsPersonalCompany(!isPersonalCompany)}
                />
                <span className="label-text">使用我的公司資料</span>
              </label>
              <span className="label-text-alt text-base-content/60 ml-7">
                勾選後將使用您的公司資料，無需再次填寫
              </span>
            </div>

            {!isPersonalCompany && (
              <Field
                label="公司名稱"
                required
                type="text"
                name="company_name"
                value={formData.company_name || ''}
                onChange={e => setFormData({...formData, company_name: e.target.value})}
                error={validated ? stepErrors.company_name : ''}
                placeholder="請輸入公司名稱"
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="發布時間"
                required
                type="date"
                name="release_date"
                value={formData.release_date || ''}
                onChange={e => setFormData({...formData, release_date: e.target.value})}
                error={validated ? stepErrors.release_date : ''}
                help="職缺開始顯示的日期"
              />

              <Field
                label="截止時間"
                required
                type="date"
                name="deadline"
                value={formData.deadline || ''}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
                error={validated ? stepErrors.deadline : ''}
                help="職缺停止顯示的日期"
              />
            </div>
          </div>
        );

      case 1: // 聯絡資訊
        return (
          <div className="step-form">
            <div className="alert alert-info mb-3">
              <HelpCircle size={20} />
              <span>{steps[1].description}</span>
            </div>

            {/* 使用我的聯絡資料 */}
            <div className="form-control mb-3">
              <label className="label cursor-pointer justify-start gap-2 pb-1">
                <input
                  type="checkbox"
                  id="isPersonalContact"
                  className="checkbox checkbox-primary"
                  checked={isPersonalContact}
                  onChange={() => setIsPersonalContact(!isPersonalContact)}
                />
                <span className="label-text">使用我的聯絡資料</span>
              </label>
              <span className="label-text-alt text-base-content/60 ml-7">
                勾選後將使用您的聯絡資料，無需再次填寫
              </span>
            </div>

            {!isPersonalContact && (
              <>
                <Field
                  label="聯絡人姓名"
                  required
                  type="text"
                  name="contact.name"
                  value={(formData.contact?.name) || ''}
                  onChange={e => setFormData({
                    ...formData,
                    contact: {...formData.contact, name: e.target.value}
                  })}
                  error={validated ? stepErrors.contactName : ''}
                  placeholder="請輸入聯絡人姓名"
                />

                {/* 聯絡人 Email（含 @ 前綴） */}
                <div className="form-control w-full mb-4">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-base-content">
                      聯絡人 Email<span className="text-error ml-0.5">*</span>
                    </span>
                  </label>
                  <div className="join w-full">
                    <span className="join-item flex items-center px-3 bg-base-200 border border-base-300">@</span>
                    <input
                      type="email"
                      name="contact.email"
                      value={(formData.contact?.email) || ''}
                      onChange={e => setFormData({
                        ...formData,
                        contact: {...formData.contact, email: e.target.value}
                      })}
                      placeholder="example@company.com"
                      className={`input input-bordered join-item w-full ${validated && stepErrors.contactEmail ? 'border-error' : ''}`}
                    />
                  </div>
                  {validated && stepErrors.contactEmail ? (
                    <span className="label-text-alt text-error mt-1">
                      {stepErrors.contactEmail || "請輸入有效的 Email 地址"}
                    </span>
                  ) : (
                    <span className="label-text-alt text-base-content/60 mt-1">
                      此 Email 將用於接收求職者的應徵訊息
                    </span>
                  )}
                </div>

                <Field
                  label="聯絡人電話"
                  required
                  type="text"
                  name="contact.phone"
                  value={(formData.contact?.phone) || ''}
                  onChange={e => setFormData({
                    ...formData,
                    contact: {...formData.contact, phone: e.target.value}
                  })}
                  error={validated ? stepErrors.contactPhone : ''}
                  placeholder="例如：02-12345678 或 0912-345-678"
                />
              </>
            )}
          </div>
        );

      case 2: // 職缺詳細說明
        return (
          <div className="step-form">
            <div className="alert alert-info mb-3">
              <HelpCircle size={20} />
              <span>{steps[2].description}</span>
            </div>

            <div className="card card-bordered bg-base-100 mb-3">
              <div className="card-body p-4">
                <h3 className="card-title text-base">填寫技巧</h3>
                <p>優秀的職缺說明應包含以下部分：</p>
                <ul className="list-disc list-inside">
                  <li>職責範圍：此職位的主要工作內容</li>
                  <li>資格要求：應徵者需具備的技能與經驗</li>
                  <li>工作福利：提供的薪資範圍、獎金制度或其他福利</li>
                  <li>工作環境：工作地點、時間、遠端工作機會等</li>
                </ul>
              </div>
            </div>

            {/* 詳細資料說明（ReactQuill） */}
            <div className="form-control w-full mb-4">
              <label className="label pb-1">
                <span className="label-text font-medium text-base-content">
                  詳細資料說明<span className="text-error ml-0.5">*</span>
                </span>
              </label>
              <div className="border" style={{ minHeight: '300px' }}>
                <ReactQuill
                  value={formData.intro || ''}
                  onChange={handleQuillChange}
                  placeholder="請詳細描述此職位..."
                  style={{ height: '250px' }}
                />
              </div>
              {validated && stepErrors.intro && (
                <div className="text-error mt-1 text-sm">
                  {stepErrors.intro}
                </div>
              )}
              <span className="label-text-alt text-base-content/60 mt-1">
                使用上方的編輯工具可以格式化文字，添加列表、標題等
              </span>
            </div>
          </div>
        );

      case 3: // 上傳圖片
        return (
          <div className="step-form">
            <div className="alert alert-info mb-3">
              <HelpCircle size={20} />
              <span>{steps[3].description}</span>
            </div>

            <div className="card card-bordered bg-base-100 mb-3">
              <div className="card-body p-4">
                <h3 className="card-title text-base">圖片上傳指南</h3>
                <p>您可以上傳與職缺相關的圖片，例如：</p>
                <ul className="list-disc list-inside">
                  <li>公司環境照片</li>
                  <li>團隊活動照片</li>
                  <li>相關產品或服務照片</li>
                </ul>
                <p className="mb-0">建議上傳清晰、專業的圖片，尺寸不超過 2MB</p>
              </div>
            </div>

            {/* 上傳照片 */}
            <div className="form-control w-full mb-3">
              <label className="label pb-1">
                <span className="label-text font-medium text-base-content">上傳照片</span>
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="file-input file-input-bordered w-full"
              />
              <span className="label-text-alt text-base-content/60 mt-1">
                可選擇多張圖片一起上傳
              </span>
            </div>

            {imagePreviews.length > 0 && (
              <div>
                <p>已選擇的圖片：</p>
                <div className="flex flex-wrap">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative mr-2 mb-2">
                      <img
                        src={typeof src === 'string' ? src : (src.image ? process.env.REACT_APP_BASE_URL + src.image : src)}
                        alt="預覽照片"
                        className="rounded border border-base-300"
                        style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // 底部按鈕區（放入 AppModal 的 footer）
  const footer = (
    <>
      {/* 禁用按鈕當正在提交時 */}
      {currentStep > 0 && (
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={isLoading}
        >
          <ChevronLeft size={16} /> 上一步
        </Button>
      )}

      {currentStep < steps.length - 1 ? (
        <Button
          variant="primary"
          onClick={handleNext}
          type="button"
          disabled={isLoading}
        >
          下一步 <ChevronRight size={16} />
        </Button>
      ) : (
        <Button
          variant="success"
          type="submit"
          form="recruitForm"
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading
            ? (isEdit ? "儲存中..." : "發布中...")
            : (isEdit ? "儲存修改" : "發布職位")}
        </Button>
      )}
    </>
  );

  return (
    <AppModal
      show={show}
      onHide={onHide}
      size="lg"
      variant="admin"
      title={isEdit ? "編輯職位" : "新增職位"}
      icon={<Briefcase size={18} />}
      closeOnBackdrop={false}
      steps={steps.map(step => step.title)}
      currentStep={currentStep}
      footer={footer}
    >
      <form id="recruitForm" noValidate onSubmit={handleFormSubmit}>
        <h4 className="text-lg font-bold mb-3">
          {steps[currentStep].icon} {steps[currentStep].title}
        </h4>

        {renderStepContent()}
      </form>
    </AppModal>
  );
};

export default RecruitFormModal;
