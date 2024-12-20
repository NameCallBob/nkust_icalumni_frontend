import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Row, Spinner } from 'react-bootstrap';

const MemberModal = ({ show, handleClose, isEditMode,handleSave, parentData, loading, setLoading }) => {
  const [formData, setFormData] = useState(
    isEditMode
      ? { ...parentData, graduate: parentData.graduate || { grade: '', school: '國立高雄科技大學智慧商務系', student_id: '' } }
      : { name: '', gender: '', birth_date: '', mobile_phone: '', home_phone: '', address: '', intro: '', photo: '', is_show: false, graduate: { grade: '', school: '國立高雄科技大學智慧商務系', student_id: '' } }
  );
  const [errors, setErrors] = useState({}); // 儲存錯誤訊息

  const [hint ,setHint] = useState("")

  const handleFocus = (field) => {
    setErrors((prevState) => {
      const { [field]: _, ...rest } = prevState; // 移除特定欄位錯誤
      return rest;
    });
  
    switch (field) {
      case "name":
        setHint("請輸入您的真實姓名，例如：王小明，最多 50 個字。");
        break;
      case "gender":
        setHint("請選擇您的性別，例如：男性、女性或其他。");
        break;
      case "birth_date":
        setHint("請選擇出生日期，例如：1990-01-01。");
        break;
      case "mobile_phone":
        setHint("請輸入有效的行動電話號碼，例如：0912345678。");
        break;
      case "home_phone":
        setHint("請輸入市內電話號碼，例如：07-1234567。");
        break;
      case "address":
        setHint("請輸入詳細住址，例如：高雄市鼓山區博愛一路123號。");
        break;
      case "intro":
        setHint("請輸入有關於您的自我介紹，可說明專長、職業以利於被搜尋到．限定200字");
        break;
      case "school":
        setHint("請輸入畢業學校，例如：國立高雄科技大學 智慧商務系。");
        break;
      case "grade":
        setHint("請輸入畢業學年，例如：113。");
        break;
      case "student_id":
        setHint("請輸入學號，例如：S12345678。");
        break;
      default:
        setHint("");
        break;
    }
  };

  const validateFields = (name, value) => {
    const errors = {};
    
    if (name === "name" && (!value || value.trim() === "")) {
      errors.name = ["姓名為必填項目"];
    }
    if (name === "home_phone" && value && !/^\d{6,10}$/.test(value)) {
      errors.home_phone = ["市內電話格式不正確，應為6-10位數字"];
    }
    if (name === "mobile_phone" && (!value || !/^09\d{8}$/.test(value))) {
      errors.mobile_phone = ["行動電話為必填，且需為有效的台灣手機號碼"];
    }
    if (name === "gender" && (!value || value === "")) {
      errors.gender = ["性別為必選項"];
    }
    if (name === "birth_date" && (!value || new Date(value) > new Date())) {
      errors.birth_date = ["生日必填且不能是未來日期"];
    }
    if (name === "graduate_year" && value && !/^\d{4}$/.test(value)) {
      errors.graduate_year = ["畢業學年應為4位數"];
    }
    if (name === "photo" && value && value.size > 2 * 1024 * 1024) {
      errors.photo = ["照片大小不可超過 2MB"];
    }
  
    return errors;
  };

  
  const handleBlur = () => {
    setHint(""); // 失焦時清空提示
  };



  // 當 parentData 或 isEditMode 變更時，更新 formData
  useEffect(() => {
    if (isEditMode) {
      setFormData({ ...parentData, graduate: parentData.graduate || { grade: '', school: '', student_id: '' } });
    } else {
      setFormData({ name: '', gender: '', birth_date: '', mobile_phone: '', home_phone: '', address: '', intro: '', photo: '', is_show: false, graduate: { grade: '', school: '', student_id: '' } });
    }
  }, [parentData, isEditMode]);

  // 處理照片上傳並轉換為 base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    if (file && file.size > 2 * 1024 * 1024) {
      setErrors((prevState) => ({
        ...prevState,
        photo: ["照片大小不可超過 2MB"],
      }));
      return;
    }
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prevState) => ({
        ...prevState,
        photo: reader.result,
      }));
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  
  // 對比 formData 和 parentData，找出變更
  const validateAllFields = () => {
    const newErrors = {};
  
    Object.keys(formData).forEach((key) => {
      if (key === "graduate") {
        Object.keys(formData.graduate).forEach((nestedKey) => {
          const error = validateFields(nestedKey, formData.graduate[nestedKey]);
          if (error[nestedKey]) {
            if (!newErrors.graduate) newErrors.graduate = {};
            newErrors.graduate[nestedKey] = error[nestedKey];
          }
        });
      } else {
        const error = validateFields(key, formData[key]);
        if (error[key]) {
          newErrors[key] = error[key];
        }
      }
    });
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // 回傳是否沒有錯誤
  };
  

  const handleSubmit = () => {
    if (!validateAllFields()) {
      return; // 若驗證未通過，則阻止提交
    }
  
    setLoading(true);
    const changedData = isEditMode ? getChangedData() : formData;
  
    setTimeout(() => {
      handleSave(formData, changedData);
      setLoading(false);
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (['graduate_year', 'graduate', 'student_id'].includes(name)) {
      const graduateField = name === 'graduate_year' ? 'grade' : name === 'graduate' ? 'school' : 'student_id';
      setFormData((prevState) => ({
        ...prevState,
        graduate: {
          ...prevState.graduate,
          [graduateField]: value,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  
    // 動態驗證
    const fieldErrors = validateFields(name, value);
    setErrors((prevState) => ({ ...prevState, ...fieldErrors }));
  };
  
  const getChangedData = () => {
    return Object.keys(formData).reduce((changedData, key) => {
      if (typeof formData[key] === 'object' && formData[key] !== null) {
        const nestedChanges = Object.keys(formData[key]).reduce((nested, nestedKey) => {
          if (formData[key][nestedKey] !== (parentData[key]?.[nestedKey] ?? undefined)) {
            nested[nestedKey] = formData[key][nestedKey];
          }
          return nested;
        }, {});
  
        if (Object.keys(nestedChanges).length > 0) {
          changedData[key] = nestedChanges;
        }
      } else if (formData[key] !== (parentData[key] ?? undefined)) {
        changedData[key] = formData[key];
      }
  
      return changedData;
    }, {});
  };
  

  return (
<Modal show={show} onHide={handleClose} size="lg" centered>
  <Modal.Header closeButton>
    <Modal.Title>{isEditMode ? '編輯會員資料' : '新增會員資料'}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {hint && (
      <div className="p-2 mb-3 bg-light text-secondary border rounded">
        {hint}
      </div>
    )}
    {loading ? (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    ) : (
      <Form>
        <Row>
          {/* 姓名 */}
          <Col xs={12} md={6}>
            <Form.Group controlId="name">
              <Form.Label>姓名</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => handleFocus("name")}
                onBlur={handleBlur}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* 市內電話 */}
          <Col xs={12} md={6}>
            <Form.Group controlId="home_phone">
              <Form.Label>市內電話</Form.Label>
              <Form.Control
                type="text"
                name="home_phone"
                value={formData.home_phone}
                onChange={handleChange}
                onFocus={() => handleFocus("home_phone")}
                onBlur={handleBlur}
                isInvalid={!!errors.home_phone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.home_phone}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* 行動電話 */}
          <Col xs={12} md={6}>
            <Form.Group controlId="mobile_phone">
              <Form.Label>行動電話</Form.Label>
              <Form.Control
                type="text"
                name="mobile_phone"
                value={formData.mobile_phone}
                onChange={handleChange}
                onFocus={() => handleFocus("mobile_phone")}
                onBlur={handleBlur}
                isInvalid={!!errors.mobile_phone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.mobile_phone}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* 性別 */}
          <Col xs={12} md={6}>
            <Form.Group controlId="gender">
              <Form.Label>性別</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                onFocus={() => handleFocus("gender")}
                onBlur={handleBlur}
                isInvalid={!!errors.gender}
              >
                <option value="">選擇性別</option>
                <option value="M">男性</option>
                <option value="F">女性</option>
                <option value="O">其他</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.gender}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* 生日 */}
          <Col xs={12} md={6}>
            <Form.Group controlId="birth_date">
              <Form.Label>生日</Form.Label>
              <Form.Control
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                onFocus={() => handleFocus("birth_date")}
                onBlur={handleBlur}
                isInvalid={!!errors.birth_date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.birth_date}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* 地址 */}
          <Col xs={12} md={6}>
            <Form.Group controlId="address">
              <Form.Label>地址</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
                onFocus={() => handleFocus("address")}
                onBlur={handleBlur}
                isInvalid={!!errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* 畢業學年 */}
          <Col xs={12} md={6}>
            <Form.Group controlId="graduate_year">
              <Form.Label>畢業學年</Form.Label>
              <Form.Control
                type="text"
                name="graduate_year"
                value={formData.graduate?.grade || ""}
                onChange={handleChange}
                onFocus={() => handleFocus("graduate_year")}
                onBlur={handleBlur}
                isInvalid={!!errors.graduate?.grade}
              />
              <Form.Control.Feedback type="invalid">
                {errors.graduate?.grade}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* 畢業學校 */}
          <Col xs={12} md={6}>
            <Form.Group controlId="graduate">
              <Form.Label>畢業學校</Form.Label>
              <Form.Control
                type="text"
                name="graduate"
                value={formData.graduate?.school || ""}
                onChange={handleChange}
                onFocus={() => handleFocus("graduate")}
                onBlur={handleBlur}
                isInvalid={!!errors.graduate?.school}
              />
              <Form.Control.Feedback type="invalid">
                {errors.graduate?.school}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* 學號 */}
          <Col xs={12} md={6}>
            <Form.Group controlId="student_id">
              <Form.Label>學號</Form.Label>
              <Form.Control
                type="text"
                name="student_id"
                value={formData.graduate?.student_id || ""}
                onChange={handleChange}
                onFocus={() => handleFocus("student_id")}
                onBlur={handleBlur}
                isInvalid={!!errors.graduate?.student_id}
              />
              <Form.Control.Feedback type="invalid">
                {errors.graduate?.student_id}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* 照片 */}
          <Col xs={12} md={6}>
            <Form.Group controlId="photo">
              <Form.Label>照片</Form.Label>
              <Form.Control
                type="file"
                name="photo"
                onChange={handleFileChange}
                onFocus={() => handleFocus("photo")}
                onBlur={handleBlur}
                isInvalid={!!errors.photo}
              />
              <Form.Control.Feedback type="invalid">
                {errors.photo}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* 自我介紹 */}
        <Form.Group controlId="intro">
          <Form.Label>自我介紹</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="intro"
            value={formData.intro}
            onChange={handleChange}
            onFocus={() => handleFocus("intro")}
            onBlur={handleBlur}
            isInvalid={!!errors.intro}
          />
          <Form.Control.Feedback type="invalid">
            {errors.intro}
          </Form.Control.Feedback>
        </Form.Group>

        {/* 是否展現於官網 */}
        <Form.Group className="mb-3" controlId="formShow">
          <Form.Check
            type="checkbox"
            name="is_show"
            label="是否展現於官網"
            checked={formData.is_show}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                is_show: e.target.checked,
              }))
            }
          />
        </Form.Group>
      </Form>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose} disabled={loading}>
      取消
    </Button>
    <Button variant="primary" onClick={handleSubmit} disabled={loading}>
      {loading ? "保存中..." : isEditMode ? "保存" : "新增"}
    </Button>
  </Modal.Footer>
</Modal>
  );
};

export default MemberModal;
