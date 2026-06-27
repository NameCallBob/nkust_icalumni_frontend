import React, { useState, useEffect, useCallback } from 'react';
import { UserCog, UserPlus } from 'lucide-react';
import { debounce } from 'lodash';
import AppModal from 'components/common/AppModal';
import { Button, Field, Spinner } from 'components/common/ui';

const MemberModal = ({ show, handleClose, isEditMode, handleSave, parentData, loading, setLoading }) => {
  const [activeStep, setActiveStep] = useState(1); // 分段表單步驟
  const [formProgress, setFormProgress] = useState(0); // 填寫進度
  const [submitAttempted, setSubmitAttempted] = useState(false); // 是否嘗試提交表單
  const [apiErrors, setApiErrors] = useState({}); // 存儲API返回的錯誤
  const [focusedField, setFocusedField] = useState(''); // 當前聚焦的欄位
  const [serverValidating, setServerValidating] = useState(false); // 後端驗證中
  const [isSubmitting, setIsSubmitting] = useState(false); // 提交防抖變數

  // 添加新的狀態來追蹤每個步驟的完成狀態
  const [stepCompletionStatus, setStepCompletionStatus] = useState({
    1: false,
    2: false,
    3: false
  });

  // 初始化表單數據
  const [formData, setFormData] = useState(
    isEditMode
      ? {
          ...parentData,
          graduate: parentData.graduate || {
            grade: '113',
            school: '國立高雄科技大學智慧商務系',
            student_id: 'J110256100'
          }
        }
      : {
          name: '',
          gender: '',
          birth_date: '',
          mobile_phone: '',
          home_phone: '',
          address: '',
          intro: '',
          photo: '',
          is_show: false,
          graduate: {
            grade: '113',
            school: '國立高雄科技大學智慧商務系',
            student_id: 'J110256100'
          }
        }
  );

  // 表單驗證錯誤
  const [errors, setErrors] = useState({});

  // 表單分段
  const formSteps = [
    {
      title: '基本資料',
      fields: ['name', 'gender', 'birth_date', 'mobile_phone', 'home_phone'],
      percent: 33
    },
    {
      title: '聯絡與學校資料',
      fields: ['address', 'graduate.grade', 'graduate.school', 'graduate.student_id'],
      percent: 66
    },
    {
      title: '個人介紹與設定',
      fields: ['photo', 'intro', 'is_show'],
      percent: 100
    }
  ];

  // 表單欄位提示信息
  const fieldHints = {
    name: "請輸入您的真實姓名，例如：王小明，最多 50 個字。",
    gender: "請選擇您的性別，例如：男性、女性或其他。",
    birth_date: "請選擇出生日期，例如：1990-01-01。",
    mobile_phone: "請輸入有效的行動電話號碼，例如：0912345678。",
    home_phone: "請輸入市內電話號碼，例如：07-1234567（可選）。",
    address: "請輸入詳細住址，例如：高雄市鼓山區博愛一路123號。",
    intro: "請輸入有關於您的自我介紹，可說明專長、職業以利於被搜尋到，限定200字。",
    "graduate.school": "請輸入畢業學校，例如：國立高雄科技大學智慧商務系。",
    "graduate.grade": "請輸入入學學年，例如：113。",
    "graduate.student_id": "請輸入學號，例如：J12345678。",
    photo: "請上傳您的照片，檔案大小不可超過2MB。",
    is_show: "勾選此項後，您的資料將會顯示在官網上。"
  };

  // 欄位驗證規則
  const validationRules = {
    name: (value) => {
      if (!value || value.trim() === "") return ["姓名為必填項目"];
      if (value.length > 50) return ["姓名不可超過50個字"];
      return null;
    },
    gender: (value) => {
      if (!value || value === "") return ["性別為必選項"];
      return null;
    },
    birth_date: (value) => {
      if (!value) return ["生日為必填項"];
      if (new Date(value) > new Date()) return ["生日不能是未來日期"];
      return null;
    },
    mobile_phone: (value) => {
      if (!value) return ["行動電話為必填項"];
      if (!/^09\d{8}$/.test(value)) return ["請輸入有效的台灣手機號碼，例如：0912345678"];
      return null;
    },
    home_phone: (value) => {
      if (!value) return null; // 非必填
      if (!/^\d{6,10}$/.test(value)) return ["市內電話格式不正確，應為6-10位數字"];
      return null;
    },
    "graduate.grade": (value) => {
      if (!value) return null; // 改為非必填
      if (!/^\d{3}$/.test(value)) return ["入學學年應為3位數"];
      return null;
    },
    "graduate.school": (value) => {
      if (!value) return null; // 改為非必填
      return null;
    },
    "graduate.student_id": (value) => {
      if (!value) return null; // 改為非必填
      return null;
    },
    photo: (file) => {
      if (!file) return ["照片為必填項"];
      if (file && typeof file === 'object' && file.size > 2 * 1024 * 1024) {
        return ["照片大小不可超過 2MB"];
      }
      return null;
    }
  };

  // 計算表單完成度
  useEffect(() => {
    const requiredFields = ['name', 'gender', 'birth_date', 'mobile_phone', 'graduate.grade', 'graduate.school', 'graduate.student_id', 'photo'];
    let completed = 0;

    requiredFields.forEach(field => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (formData[parent]?.[child] && formData[parent][child].trim() !== '') {
          completed++;
        }
      } else if (field === 'photo') {
        if (formData[field]) {
          completed++;
        }
      } else if (formData[field] && formData[field].trim !== undefined && formData[field].trim() !== '') {
        completed++;
      } else if (formData[field]) {
        completed++;
      }
    });

    setFormProgress(Math.floor((completed / requiredFields.length) * 100));
  }, [formData]);

  // 當 parentData 或 isEditMode 變更時，更新 formData
  useEffect(() => {
    if (isEditMode) {
      setFormData({ ...parentData, graduate: parentData.graduate || { grade: '', school: '國立高雄科技大學智慧商務系', student_id: '' } });
    } else {
      setFormData({ name: '', gender: '', birth_date: '', mobile_phone: '', home_phone: '', address: '', intro: '', photo: '', is_show: false, graduate: { grade: '', school: '國立高雄科技大學智慧商務系', student_id: '' } });
    }

    // 重置步驟和錯誤
    setActiveStep(1);
    setErrors({});
    setApiErrors({});
    setSubmitAttempted(false);
  }, [parentData, isEditMode, show]);

  // 處理API錯誤響應，將Django REST框架錯誤格式轉換為本地格式
  const handleApiErrors = (apiResponse) => {
    if (!apiResponse || !apiResponse.errors) return {};

    const formattedErrors = {};

    // 處理一般錯誤
    Object.keys(apiResponse.errors).forEach(key => {
      if (key === 'graduate') {
        // 處理嵌套錯誤
        formattedErrors.graduate = {};
        Object.keys(apiResponse.errors.graduate).forEach(nestedKey => {
          formattedErrors.graduate[nestedKey] = apiResponse.errors.graduate[nestedKey];
        });
      } else {
        formattedErrors[key] = apiResponse.errors[key];
      }
    });

    return formattedErrors;
  };

  // 模擬後端字段實時驗證 - 移除學號和電話號碼的驗證
  const validateFieldWithServer = useCallback(
    debounce((fieldName, value) => {
      // 這裡模擬發送到後端API的請求
      setServerValidating(true);

      // 模擬API延遲
      setTimeout(() => {
        // 不再檢測電話和學號
        setServerValidating(false);
      }, 600);
    }, 800),
    []
  );

  // 驗證單個字段
  const validateField = (name, value) => {
    // 處理嵌套字段
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      // 確保使用正確的路徑驗證
      return validationRules[name] ? validationRules[name](value) : null;
    }

    // 一般字段
    return validationRules[name] ? validationRules[name](value) : null;
  };

  // 處理表單欄位變更
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // 處理不同類型的輸入
    if (name.includes('.')) {
      // 處理嵌套欄位（如 graduate.grade）
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'file' ? files[0] : value
        }
      }));
    } else if (name === 'photo' && files && files[0]) {
      // 處理照片上傳
      handleFileChange(files[0]);
    } else {
      // 處理常規欄位
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // 實時驗證
    const fieldValue = type === 'checkbox' ? checked : (files && files[0] ? files[0] : value);
    const fieldName = name.includes('.') ? name : name;
    const fieldErrors = validateField(fieldName, fieldValue);

    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors
    }));
  };

  // 處理照片上傳並轉換為 base64
  const handleFileChange = (file) => {
    if (file && file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        photo: ["照片大小不可超過 2MB"]
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        photo: reader.result
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // 處理欄位聚焦，顯示提示
  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);

    // 清除錯誤
    setErrors(prev => {
      const { [fieldName]: _, ...rest } = prev;
      return rest;
    });

    // 清除API錯誤
    setApiErrors(prev => {
      const { [fieldName]: _, ...rest } = prev;
      return rest;
    });
  };

  // 處理欄位失焦，檢查錯誤
  const handleBlur = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFocusedField('');

    // 驗證字段
    const fieldValue = type === 'checkbox' ? checked : (files && files[0] ? files[0] : value);
    const fieldErrors = validateField(name, fieldValue);

    // 更新錯誤狀態
    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors
    }));
  };

  // 驗證所有欄位
  const validateAllFields = () => {
    const newErrors = {};
    let hasErrors = false;

    // 更新必填欄位列表，添加學校相關欄位和照片
    const requiredFields = ['name', 'gender', 'birth_date', 'mobile_phone', 'graduate.grade', 'graduate.school', 'graduate.student_id', 'photo'];

    // 驗證一般欄位
    Object.keys(formData).forEach(key => {
      if (key === 'graduate') {
        // 驗證嵌套欄位
        Object.keys(formData.graduate).forEach(nestedKey => {
          const fullKey = `graduate.${nestedKey}`;
          const errors = validateField(fullKey, formData.graduate[nestedKey]);
          if (errors) {
            if (!newErrors.graduate) newErrors.graduate = {};
            newErrors.graduate[nestedKey] = errors;
            hasErrors = true;
          }
        });
      } else {
        // 驗證一般欄位
        const errors = validateField(key, formData[key]);
        if (errors) {
          newErrors[key] = errors;
          hasErrors = true;
        }
      }
    });

    // 設置新的錯誤
    setErrors(newErrors);

    // 檢查是否有API錯誤
    const hasApiErrors = Object.keys(apiErrors).length > 0;

    return !hasErrors && !hasApiErrors;
  };

  // 判斷當前步驟是否可以繼續
  const canProceedToNextStep = () => {
    const currentStepFields = formSteps[activeStep - 1].fields;
    let canProceed = true;

    // 檢查當前步驟的所有字段
    currentStepFields.forEach(field => {
      if (field.includes('.')) {
        // 檢查嵌套字段
        const [parent, child] = field.split('.');
        const value = formData[parent]?.[child];
        const fieldErrors = validateField(field, value);

        if (fieldErrors) {
          canProceed = false;
        }
      } else {
        // 檢查一般字段
        const value = formData[field];
        const fieldErrors = validateField(field, value);

        if (field === 'home_phone' || field === 'address' || field === 'intro' || field === 'is_show') {
          // 這些是非必填字段，即使為空也可以繼續
          if (fieldErrors && value) canProceed = false;
        } else if (fieldErrors) {
          canProceed = false;
        }
      }
    });

    // 檢查API錯誤
    currentStepFields.forEach(field => {
      if (apiErrors[field]) canProceed = false;
    });

    return canProceed;
  };

  // 處理下一步按鈕點擊
  const handleNextStep = () => {
    // 臨時標記為嘗試提交，觸發當前步驟的驗證
    setSubmitAttempted(true);

    if (canProceedToNextStep()) {
      setActiveStep(prev => Math.min(prev + 1, formSteps.length));
      setSubmitAttempted(false);
    }
  };

  // 處理上一步按鈕點擊
  const handlePrevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
    setSubmitAttempted(false);
  };

  // 處理表單提交
  const handleSubmit = async () => {
    setSubmitAttempted(true);

    if (!validateAllFields()) {
      // 找出哪一步有錯誤，並跳轉到該步驟
      for (let i = 0; i < formSteps.length; i++) {
        const stepFields = formSteps[i].fields;
        let stepHasErrors = false;

        for (const field of stepFields) {
          if (field.includes('.')) {
            const [parent, child] = field.split('.');
            if (errors[parent]?.[child] || apiErrors[field]) {
              stepHasErrors = true;
              break;
            }
          } else if (errors[field] || apiErrors[field]) {
            stepHasErrors = true;
            break;
          }
        }

        if (stepHasErrors) {
          setActiveStep(i + 1);
          return;
        }
      }

      return; // 防止提交
    }

    // 避免重複提交
    if (loading || isSubmitting) return;

    // 開始提交
    setLoading(true);
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        // 編輯模式下，只發送已變更的欄位（用於 PATCH 請求）
        const changedData = getChangedData();
        await handleSave(formData, changedData);
      } else {
        // 新增模式下，發送完整數據
        await handleSave(formData, formData);
      }
    } catch (error) {
      console.error("提交表單時發生錯誤:", error);
      setApiErrors(handleApiErrors(error.response?.data) || {});
    } finally {
      setLoading(false);
      // 延遲重置提交狀態，防止立即重複點擊
      setTimeout(() => {
        setIsSubmitting(false);
      }, 800);
    }
  };

  // 獲取已變更的數據 - 這個函數保留但不再使用，我們直接發送完整表單數據
  const getChangedData = () => {
    const changedData = {};

    Object.keys(formData).forEach(key => {
      // 特殊處理 photo 欄位
      if (key === 'photo') {
        // 檢查是否為新上傳照片 (base64 格式)
        if (formData.photo && formData.photo.startsWith('data:image')) {
          changedData.photo = formData.photo;
        }
        // 其他情況不傳送 photo 參數
      }
      // 處理嵌套物件
      else if (typeof formData[key] === 'object' && formData[key] !== null && !Array.isArray(formData[key])) {
        const nestedChanges = {};
        let hasNestedChanges = false;

        Object.keys(formData[key]).forEach(nestedKey => {
          if (formData[key][nestedKey] !== (parentData[key]?.[nestedKey] ?? '')) {
            nestedChanges[nestedKey] = formData[key][nestedKey];
            hasNestedChanges = true;
          }
        });

        if (hasNestedChanges) {
          changedData[key] = nestedChanges;
        }
      }
      // 處理其他一般欄位
      else if (formData[key] !== (parentData[key] ?? '')) {
        changedData[key] = formData[key];
      }
    });

    return changedData;
  };

  // 檢查當前步驟的完成狀態
  const checkStepCompletion = (stepNumber) => {
    const currentStepFields = formSteps[stepNumber - 1].fields;
    let isComplete = true;

    currentStepFields.forEach(field => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        const value = formData[parent]?.[child];
        const fieldErrors = validateField(field, value);

        if (fieldErrors) {
          isComplete = false;
        }
      } else {
        const value = formData[field];
        const fieldErrors = validateField(field, value);

        if (field === 'home_phone' || field === 'address' || field === 'intro' || field === 'is_show') {
          if (fieldErrors && value) isComplete = false;
        } else if (fieldErrors) {
          isComplete = false;
        }
      }
    });

    return isComplete;
  };

  // 更新步驟完成狀態
  useEffect(() => {
    const newStatus = {
      1: checkStepCompletion(1),
      2: checkStepCompletion(2),
      3: checkStepCompletion(3)
    };
    setStepCompletionStatus(newStatus);
  }, [formData]);

  // 修改箭頭提示組件
  const RequiredFieldArrow = ({ fieldName }) => {
    const shouldShowArrow = () => {
      // 檢查欄位是否為空
      const isFieldEmpty = () => {
        if (fieldName.includes('.')) {
          const [parent, child] = fieldName.split('.');
          return !formData[parent]?.[child] || formData[parent][child].trim() === '';
        }
        return !formData[fieldName] || formData[fieldName].trim() === '';
      };

      // 檢查是否有驗證錯誤
      const hasValidationError = () => {
        if (fieldName.includes('.')) {
          const [parent, child] = fieldName.split('.');
          return errors[parent]?.[child] || apiErrors[fieldName];
        }
        return errors[fieldName] || apiErrors[fieldName];
      };

      // 如果是必填欄位且為空，或是有驗證錯誤，則顯示箭頭
      const requiredFields = ['name', 'gender', 'birth_date', 'mobile_phone', 'photo'];
      return (requiredFields.includes(fieldName) && isFieldEmpty()) || hasValidationError();
    };

    if (shouldShowArrow()) {
      return (
        <div className="absolute" style={{
          right: '-30px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000
        }}>
          <div className="text-error">
            <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '1.5rem' }}></i>
          </div>
        </div>
      );
    }
    return null;
  };

  // 修改步驟導航渲染
  const renderStepNavigation = () => (
    <div className="step-indicator mb-4 relative">
      <progress className="progress progress-primary w-full" value={formSteps[activeStep - 1].percent} max="100" />
      <div className="text-xs text-right text-base-content/60">{`${formSteps[activeStep - 1].percent}%`}</div>
      <div className="flex justify-between mt-2">
        {formSteps.map((step, index) => (
          <div key={index} className="relative">
            <Button
              variant={activeStep === index + 1 ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveStep(index + 1)}
              disabled={loading || (!stepCompletionStatus[index + 1] && index + 1 > activeStep)}
            >
              {index + 1}. {step.title}
            </Button>
            {index + 1 === activeStep && !stepCompletionStatus[index + 1] && (
              <RequiredFieldArrow fieldName={step.fields[0]} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // 渲染當前步驟的表單欄位
  const renderFormFields = () => {
    if (loading) {
      return (
        <div className="text-center p-5">
          {/* 處理中... */}
          <Spinner size="lg" center label="資料處理中，請稍候..." />
        </div>
      );
    }

    const currentStep = formSteps[activeStep - 1];

    return (
      <div className="form-step">
        {/* 步驟導航 */}
        {renderStepNavigation()}

        {/* 欄位提示區 */}
        {focusedField && fieldHints[focusedField] && (
          <div className="alert alert-info mb-3">
            <i className="bi bi-info-circle"></i>
            <span>{fieldHints[focusedField]}</span>
          </div>
        )}

        {/* 未完成提示 */}
        {!stepCompletionStatus[activeStep] && (
          <div className="alert alert-warning mb-3">
            <i className="bi bi-exclamation-triangle"></i>
            <span>請完成所有必填欄位後再繼續</span>
          </div>
        )}

        {/* API錯誤提示 */}
        {Object.keys(apiErrors).length > 0 && (
          <div className="alert alert-error mb-3 flex-col items-start">
            <div>
              <i className="bi bi-exclamation-triangle mr-2"></i>
              表單驗證失敗，請檢查以下欄位:
            </div>
            <ul className="mb-0 mt-2 list-disc pl-5">
              {Object.keys(apiErrors).map(key => (
                <li key={key}>
                  {key.includes('.')
                    ? `${key.split('.')[0]} ${key.split('.')[1]}: ${apiErrors[key]}`
                    : `${key}: ${apiErrors[key]}`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 表單欄位 */}
        <form>
          {currentStep.title === '基本資料' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                {/* 姓名 */}
                <div className="relative">
                  <Field
                    label="姓名"
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus("name")}
                    onBlur={handleBlur}
                    error={((submitAttempted && errors.name) || apiErrors.name) ? (errors.name || apiErrors.name) : undefined}
                    placeholder="請輸入真實姓名"
                    autoComplete="name"
                  />
                  <RequiredFieldArrow fieldName="name" />
                </div>

                {/* 性別 */}
                <div className="relative">
                  <Field
                    as="select"
                    label="性別"
                    required
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    onFocus={() => handleFocus("gender")}
                    onBlur={handleBlur}
                    error={((submitAttempted && errors.gender) || apiErrors.gender) ? (errors.gender || apiErrors.gender) : undefined}
                  >
                    <option value="">請選擇性別</option>
                    <option value="M">男性</option>
                    <option value="F">女性</option>
                    <option value="O">其他</option>
                  </Field>
                  <RequiredFieldArrow fieldName="gender" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                {/* 生日 */}
                <div className="relative">
                  <Field
                    label="生日"
                    required
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    onFocus={() => handleFocus("birth_date")}
                    onBlur={handleBlur}
                    error={((submitAttempted && errors.birth_date) || apiErrors.birth_date) ? (errors.birth_date || apiErrors.birth_date) : undefined}
                  />
                  <RequiredFieldArrow fieldName="birth_date" />
                </div>

                {/* 行動電話 */}
                <div className="relative">
                  <Field
                    label="行動電話"
                    required
                    type="text"
                    name="mobile_phone"
                    value={formData.mobile_phone}
                    onChange={handleChange}
                    onFocus={() => handleFocus("mobile_phone")}
                    onBlur={handleBlur}
                    error={((submitAttempted && errors.mobile_phone) || apiErrors.mobile_phone) ? (errors.mobile_phone || apiErrors.mobile_phone) : undefined}
                    placeholder="09開頭的10位數字"
                    autoComplete="tel"
                  />
                  <RequiredFieldArrow fieldName="mobile_phone" />
                </div>
              </div>

              {/* 市內電話 */}
              <div className="grid grid-cols-1">
                <div className="relative">
                  <Field
                    label="市內電話（選填）"
                    type="text"
                    name="home_phone"
                    value={formData.home_phone}
                    onChange={handleChange}
                    onFocus={() => handleFocus("home_phone")}
                    onBlur={handleBlur}
                    error={((submitAttempted && errors.home_phone) || apiErrors.home_phone) ? (errors.home_phone || apiErrors.home_phone) : undefined}
                    placeholder="不含區碼的6-10位數字（選填）"
                    autoComplete="tel"
                  />
                  <RequiredFieldArrow fieldName="home_phone" />
                </div>
              </div>
            </>
          )}

          {currentStep.title === '聯絡與學校資料' && (
            <>
              {/* 地址 */}
              <div className="relative">
                <Field
                  as="textarea"
                  rows={2}
                  label="地址（選填）"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onFocus={() => handleFocus("address")}
                  onBlur={handleBlur}
                  error={((submitAttempted && errors.address) || apiErrors.address) ? (errors.address || apiErrors.address) : undefined}
                  placeholder="請輸入您的詳細地址"
                  autoComplete="street-address"
                />
                <RequiredFieldArrow fieldName="address" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                {/* 入學學年 */}
                <div className="relative">
                  <Field
                    label="入學學年（選填）"
                    type="text"
                    name="graduate.grade"
                    value={formData.graduate?.grade || ""}
                    onChange={handleChange}
                    onFocus={() => handleFocus("graduate.grade")}
                    onBlur={handleBlur}
                    error={((submitAttempted && errors.graduate?.grade) || apiErrors["graduate.grade"]) ? (errors.graduate?.grade || apiErrors["graduate.grade"]) : undefined}
                    placeholder="例如：113"
                  />
                  <RequiredFieldArrow fieldName="graduate.grade" />
                </div>

                {/* 畢業學校 */}
                <div className="relative">
                  <Field
                    label="畢業學校（選填）"
                    type="text"
                    name="graduate.school"
                    value={formData.graduate?.school || ""}
                    onChange={handleChange}
                    onFocus={() => handleFocus("graduate.school")}
                    onBlur={handleBlur}
                    error={((submitAttempted && errors.graduate?.school) || apiErrors["graduate.school"]) ? (errors.graduate?.school || apiErrors["graduate.school"]) : undefined}
                    placeholder="例如：國立高雄科技大學智慧商務系"
                  />
                  <RequiredFieldArrow fieldName="graduate.school" />
                </div>
              </div>

              {/* 學號 */}
              <div className="relative">
                <Field
                  label="學號（選填）"
                  type="text"
                  name="graduate.student_id"
                  value={formData.graduate?.student_id || ""}
                  onChange={handleChange}
                  onFocus={() => handleFocus("graduate.student_id")}
                  onBlur={handleBlur}
                  error={((submitAttempted && errors.graduate?.student_id) || apiErrors["graduate.student_id"]) ? (errors.graduate?.student_id || apiErrors["graduate.student_id"]) : undefined}
                  placeholder="例如：J12345678"
                />
                <RequiredFieldArrow fieldName="graduate.student_id" />
              </div>
            </>
          )}

          {currentStep.title === '個人介紹與設定' && (
            <>
              {/* 照片 */}
              <div className="form-control w-full mb-4 relative">
                <label className="label pb-1">
                  <span className="label-text font-medium text-base-content">
                    照片 <span className="text-error">*</span>
                  </span>
                </label>
                <div className="flex items-center">
                  <div className="mr-3">
                    {formData.photo ? (
                      <img
                        src={formData.photo.startsWith('data:') ? formData.photo : process.env.REACT_APP_BASE_URL+formData.photo}
                        alt="預覽"
                        className="rounded-lg border border-base-300 p-1"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="bg-base-200 flex items-center justify-center"
                        style={{ width: '100px', height: '100px', border: '1px dashed #ccc' }}
                      >
                        <span className="text-base-content/50">無照片</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <input
                      type="file"
                      name="photo"
                      onChange={handleChange}
                      onFocus={() => handleFocus("photo")}
                      onBlur={handleBlur}
                      accept="image/*"
                      className={`file-input file-input-bordered w-full ${((submitAttempted && errors.photo) || apiErrors.photo) ? 'file-input-error' : ''}`}
                    />
                    <RequiredFieldArrow fieldName="photo" />
                    {((submitAttempted && errors.photo) || apiErrors.photo) && (
                      <span className="label-text-alt text-error mt-1 block">
                        {errors.photo || apiErrors.photo}
                      </span>
                    )}
                    <span className="label-text-alt text-base-content/60 mt-1 block">
                      請上傳不超過2MB的照片
                    </span>
                  </div>
                </div>
              </div>

              {/* 自我介紹 */}
              <div className="form-control w-full mb-4 relative">
                <label className="label pb-1">
                  <span className="label-text font-medium text-base-content">自我介紹（選填）</span>
                </label>
                <textarea
                  className={`textarea textarea-bordered w-full ${((submitAttempted && errors.intro) || apiErrors.intro) ? 'border-error' : ''}`}
                  rows={4}
                  name="intro"
                  value={formData.intro}
                  onChange={handleChange}
                  onFocus={() => handleFocus("intro")}
                  onBlur={handleBlur}
                  placeholder="請輸入有關於您的自我介紹，可說明專長、職業以利於被搜尋到"
                  maxLength={200}
                />
                <RequiredFieldArrow fieldName="intro" />
                {((submitAttempted && errors.intro) || apiErrors.intro) && (
                  <span className="label-text-alt text-error mt-1 block">
                    {errors.intro || apiErrors.intro}
                  </span>
                )}
                <span className="label-text-alt text-base-content/60 block text-right">
                  {formData.intro ? formData.intro.length : 0}/200
                </span>
              </div>

              {/* 是否展現於官網 */}
              <div className="form-control w-full mb-4 relative">
                <label className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    name="is_show"
                    className="checkbox checkbox-primary"
                    checked={formData.is_show}
                    onChange={handleChange}
                    onFocus={() => handleFocus("is_show")}
                    onBlur={handleBlur}
                  />
                  <span className="label-text">是否展現於官網</span>
                </label>
                <RequiredFieldArrow fieldName="is_show" />
                <span className="label-text-alt text-base-content/60 block">
                  勾選此項後，您的資料將會顯示在官網上
                </span>
              </div>
            </>
          )}
        </form>
      </div>
    );
  };

  // 底部按鈕
  const footer = (
    <div className="w-full flex justify-between">
      <Button
        variant="outline"
        onClick={activeStep > 1 ? handlePrevStep : handleClose}
        disabled={loading}
      >
        {activeStep > 1 ? '上一步' : '取消'}
      </Button>

      <div>
        {activeStep < formSteps.length ? (
          <Button
            variant="primary"
            onClick={handleNextStep}
            disabled={loading || !canProceedToNextStep()}
          >
            下一步
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={loading || isSubmitting}
            loading={loading}
            className="min-w-[120px]"
          >
            {loading ? (
              '處理中...'
            ) : (
              isEditMode ? '保存修改' : '新增會員'
            )}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <AppModal
      show={show}
      onHide={handleClose}
      size="lg"
      variant="admin"
      title={isEditMode ? '編輯會員資料' : '新增會員資料'}
      icon={isEditMode ? <UserCog size={18} /> : <UserPlus size={18} />}
      steps={formSteps.map((s) => s.title)}
      currentStep={activeStep - 1}
      closeOnBackdrop={false}
      footer={footer}
    >
      {/* 必填欄位說明 */}
      <div className="alert alert-info mb-3">
        <i className="bi bi-info-circle"></i>
        <span>標記 <span className="text-error">*</span> 的欄位為必填項目</span>
      </div>

      {/* 表單進度指示器 */}
      {!loading && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-lg font-semibold">{formSteps[activeStep - 1].title}</h5>
            <small className="text-base-content/60">步驟 {activeStep}/{formSteps.length}</small>
          </div>
        </div>
      )}

      {/* 表單欄位 */}
      {renderFormFields()}
    </AppModal>
  );
};

export default MemberModal;
