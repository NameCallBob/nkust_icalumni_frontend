import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Accordion } from "react-bootstrap";
import Axios from "common/Axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { modes } from "react-transition-group/SwitchTransition";

function NewUserModal({
  showModal,
  handleClose,
  isComplex,
  userId,
  handleAddUser,
  fetchUserData,
}) {
  const [simple_email, setSimpleEmail] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    mobile_phone: "",
    home_phone: "",
    address: "",
    position: { title: "" },
    photo: null,
    graduate: { school: "", grade: "", student_id: "" },
    private_input: { email: "", password: "" },
    is_paid: false,
    birth_date: "", // 新增出生日期
  });
  const [originalData, setOriginalData] = useState(null); // 用於儲存原始資料
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // 儲存錯誤訊息

  /**
   * 進行資料更改前後判斷
   */
  const getModifiedFields = () => {
    if (!originalData) return formData;

    const modifiedData = {};
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === 'object' && formData[key] !== null) {
        Object.keys(formData[key] || {}).forEach((subKey) => {
          if (formData[key][subKey] !== (originalData[key]?.[subKey] || '')) {
            if (!modifiedData[key]) modifiedData[key] = {};
            modifiedData[key][subKey] = formData[key][subKey];
          }
        });
      } else {
        if (formData[key] !== (originalData[key] || '')) {
          modifiedData[key] = formData[key];
        }
      }
    });

    // 刪掉原本就沒有再前端的資料
    delete modifiedData['intro']
    delete modifiedData['notice_type']
    delete modifiedData['photo']

    return modifiedData;
  };
  
  const [hint ,setHint] = useState("")

  const handleFocus = (field) => {
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
      case "email":
        setHint("請輸入有效的電子郵件，例如：user@example.com。");
        break;
      case "password":
        setHint("請設定帳號密碼，至少 8 個字元。");
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

  const handleBlur = () => {
    setHint(""); // 失焦時清空提示
  };



  // 從後端獲取資料
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        // 編輯
        setLoading(true);
        const data = await fetchUserData(userId);
        if (data) {
          const initializedData = {
            ...data,
            graduate: data.graduate || { school: "", grade: "", student_id: "" },
            position: data.position || { title: "" },
            private_input: data.private || { email: "", password: null },
            birth_date: data.birth_date || "", // 初始化出生日期
          };
          setFormData(initializedData);
          setOriginalData(initializedData); // 儲存原始資料
          setSimpleEmail(data.email);
        }
        setLoading(false);
      } else {
        setFormData({
          name: "",
          gender: "",
          mobile_phone: "",
          home_phone: "",
          address: "",
          position: { title: "" },
          graduate: { school: "國立高雄科技大學智慧商務系", grade: "", student_id: "" },
          private_input: { email: "", password: "" },
          is_paid: false,
        });
        setSimpleEmail("");
      }
    };
    fetchData();

    Axios()
      .get("member/position/get-all/")
      .then((res) => {
        setPositions(res.data);
      })
      .catch((error) => console.error("Error fetching positions:", error));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "school" || name === "grade" || name === "student_id") {
      // 處理學校相關資料
      setFormData((prev) => ({
        ...prev,
        graduate: { ...prev.graduate, [name]: value },
      }));
    } else if (name === "position") {
      // 處理系友會職位
      setFormData((prev) => ({
        ...prev,
        position: positions.find((pos) => pos.id === parseInt(value)) || {
          title: "",
        },
      }));
    } else if (name === "email" || name === "password"){
      // 處理隱私資料
      setFormData((prev) => ({
        ...prev,
        private_input: { ...prev.private_input, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /**
   * 處裡使用者輸入所有帳號資料的創建帳號方式
   * @param {*} e 
   */
  const handleComplexSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const modifiedData = getModifiedFields();
    try {
      const response = await handleAddUser(true, modifiedData);

    // 假設 `handleAddUser` 返回成功時有明確標誌，例如 `response.success`
    if (response && response.success) {
      setErrors({}); // 清空錯誤
      handleClose(); // 成功後關閉模態框
      toast.success("帳號保存成功！");
    } 
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error.response.data)
        setErrors(error.response.data); // 設置錯誤訊息
        toast.error("請檢查輸入資料！");
      }
    }
    setLoading(false);
  };

  /**
   *  處理使用者僅輸入電子郵件的創建帳號方式
   */
  const handleSimpleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleAddUser(false, { simple_email });
    setLoading(false);
  };

  return (
    <Modal show={showModal} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {userId ? "編輯帳號" : isComplex ? "新增複雜帳號" : "新增簡單帳號"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {/* 輸入提示區域 */}
      {hint && (
        <div className="p-2 mb-3 bg-light text-secondary border rounded">
          {hint}
        </div>
      )}
      {/* 表單內容 */}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : isComplex ? (
          <Form onSubmit={handleComplexSubmit}>
            <Accordion defaultActiveKey="0">
              {/* 基本資訊 */}
              <Accordion.Item eventKey="0">
                <Accordion.Header>基本資訊</Accordion.Header>
                <Accordion.Body>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>姓名</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onFocus={() => handleFocus("name")}
                      onChange={handleChange}
                      placeholder="輸入姓名"
                    />
                    {errors.name && (
                      <div className="text-danger">{errors.name[0]}</div>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGender">
                    <Form.Label>性別</Form.Label>
                    <Form.Control
                      as="select"
                      name="gender"
                      onFocus={() => handleFocus("gender")}
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">選擇性別</option>
                      <option value="M">男性</option>
                      <option value="F">女性</option>
                      <option value="O">其他</option>
                    </Form.Control>
                    {errors.gender && (
                      <div className="text-danger">{errors.gender[0]}</div>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBirthDate">
                    <Form.Label>出生日期</Form.Label>
                    <Form.Control
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onFocus={() => handleFocus("birth_data")}
                      onChange={handleChange}
                      placeholder="選擇出生日期"
                    />
                    {errors.birth_date && (
                      <div className="text-danger">{errors.birth_date[0]}</div>
                    )}
                  </Form.Group>
                </Accordion.Body>
              </Accordion.Item>

              {/* 聯絡資訊 */}
              <Accordion.Item eventKey="1">
                <Accordion.Header>聯絡資訊</Accordion.Header>
                <Accordion.Body>
                  <Form.Group className="mb-3" controlId="formMobilePhone">
                    <Form.Label>行動電話</Form.Label>
                    <Form.Control
                      type="text"
                      name="mobile_phone"
                      value={formData.mobile_phone}
                      onChange={handleChange}
                      onFocus={() => handleFocus("mobile_phone")}
                      placeholder="輸入行動電話"
                    />
                    {errors.mobile_phone && (
                      <div className="text-danger">
                        {errors.mobile_phone[0]}
                      </div>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formHomePhone">
                    <Form.Label>市內電話</Form.Label>
                    <Form.Control
                      type="text"
                      name="home_phone"
                      value={formData.home_phone}
                      onFocus={() => handleFocus("home_phone")}
                      onChange={handleChange}
                      placeholder="輸入市內電話"
                    />
                    {errors.home_phone && (
                      <div className="text-danger">{errors.home_phone[0]}</div>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formAddress">
                    <Form.Label>住址</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      onFocus={() => handleFocus("address")}
                      placeholder="輸入住址"
                    />
                  </Form.Group>
                  {errors.address && (
                      <div className="text-danger">{errors.address[0]}</div>
                    )}
                </Accordion.Body>
              </Accordion.Item>

              {/* 學籍與職位 */}
              <Accordion.Item eventKey="2">
                <Accordion.Header>學籍與職位</Accordion.Header>
                <Accordion.Body>
                  <Form.Group className="mb-3" controlId="formPosition">
                    <Form.Label>職位</Form.Label>
                    <Form.Control
                      as="select"
                      name="position"
                      value={
                        positions.find(
                          (pos) => pos.title === formData.position.title
                        )?.id || ""
                      }
                      onChange={handleChange}
                    >
                      <option value="">選擇職位</option>
                      {positions.map((position) => (
                        <option key={position.id} value={position.id}>
                          {position.title}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formSchool">
                    <Form.Label>畢業學校</Form.Label>
                    <Form.Control
                      type="text"
                      name="school"
                      value={formData.graduate.school}
                      onChange={handleChange}
                      onFocus={() => handleFocus("school")}
                      placeholder="輸入畢業學校"
                    />
                    {errors.graduate?.school && (
                      <div className="text-danger">{errors.graduate.school[0]}</div>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGrade">
                    <Form.Label>畢業學年</Form.Label>
                    <Form.Control
                      type="text"
                      name="grade"
                      value={formData.graduate.grade}
                      onFocus={() => handleFocus("grade")}
                      onChange={handleChange}
                      placeholder="輸入畢業學年"
                    />
                    {errors.graduate?.year && (
                      <div className="text-danger">{errors.graduate.year[0]}</div>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formStudentId">
                    <Form.Label>學號</Form.Label>
                    <Form.Control
                      type="text"
                      name="student_id"
                      value={formData.graduate.student_id}
                      onChange={handleChange}
                      onFocus={() => handleFocus("student_id")}
                      placeholder="輸入學號"
                    />
                    {errors.graduate?.student_id && (
                      <div className="text-danger">{errors.graduate.student_id[0]}</div>
                    )}
                  </Form.Group>
                </Accordion.Body>
              </Accordion.Item>

              {/* 其他資訊 */}
              <Accordion.Item eventKey="3">
                <Accordion.Header>其他資訊</Accordion.Header>
                <Accordion.Body>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>電子郵件</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      value={formData.private_input.email}
                      onChange={handleChange}                      
                      placeholder="輸入電子郵件"
                      onFocus={() => handleFocus("email")}
                    />
                    {errors.private_input?.email && (
                      <div className="text-danger">{errors.private_input.email[0]}</div>
                    )}              
                    
                    </Form.Group>
                  {!userId && (
                    <>
                      <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>帳號密碼</Form.Label>
                        <Form.Control
                          type="text"
                          name="password"
                          value={formData.private_input.password}
                          onChange={handleChange}
                          placeholder="輸入帳號密碼"
                          onFocus={() => handleFocus("password")}
                        />
                      </Form.Group>
                    </>
                  )}
                  <Form.Group className="mb-3" controlId="formPaid">
                    <Form.Check
                      type="checkbox"
                      name="is_paid"
                      label="是否繳費"
                      checked={formData.is_paid}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_paid: e.target.checked,
                        }))
                      }
                    />
                  </Form.Group>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleClose}>
                取消
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="ms-2"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "保存"}
              </Button>
            </div>
          </Form>
        ) : (
          // 簡單帳號表單
          <Form onSubmit={handleSimpleSubmit}>
            <Form.Group className="mb-3" controlId="formEmailSimple">
              <Form.Label>電子郵件</Form.Label>
              <Form.Control
                type="email"
                value={simple_email}
                onChange={(e) => setSimpleEmail(e.target.value)}
                placeholder="輸入電子郵件"
                onFocus={() => handleFocus("email")}
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : '新增帳號'}
            </Button>

          </Form>
          
        )}
      </Modal.Body>
    </Modal>
  );
}

export default NewUserModal;
