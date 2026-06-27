import React, { useState, useEffect } from "react";
import Axios from "common/Axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { modes } from "react-transition-group/SwitchTransition";
import { UserPlus } from "lucide-react";
import AppModal from "components/common/AppModal";
import { Button, Field, Spinner } from "components/common/ui";

function NewUserModal({
  showModal,
  handleClose,
  isComplex,
  userId,
  handleAddUser,
  fetchUserData,
}) {
  const [simple_email, setSimpleEmail] = useState("");
  const [simple_userType,setUserType] = useState("N");
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
    is_show: false,
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
      case "is_show":
        setHint("選擇是否讓使用者呈現於官網");
        break;
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
        setHint("請輸入就學學校，例如：國立高雄科技大學 智慧商務系。");
        break;
      case "grade":
        setHint("請輸入入學學年，例如：113。");
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
    try {
      await handleAddUser(false, { "email":simple_email,"is_superuser":simple_userType });
      // 後端（資安修補 MED-5）不再以郵件寄送明文密碼，使用者需自行用「忘記密碼」設定密碼
      toast.success("帳號已建立！請通知該使用者至登入頁點選「忘記密碼」設定自己的密碼（系統不會寄送密碼）。");
    } catch (error) {
      toast.error("建立失敗，請確認 Email 是否正確或已存在。");
    }
    setLoading(false);
  };

  return (
    <AppModal
      show={showModal}
      onHide={handleClose}
      size="lg"
      variant="admin"
      title={userId ? "編輯帳號" : isComplex ? "新增複雜帳號" : "新增簡單帳號"}
      icon={<UserPlus size={18} />}
    >
      {/* 輸入提示區域 */}
      {hint && (
        <div className="p-2 mb-3 bg-base-200 text-base-content/70 border border-base-300 rounded">
          {hint}
        </div>
      )}
      {/* 表單內容 */}
      {loading ? (
        <Spinner center />
      ) : isComplex ? (
        <form onSubmit={handleComplexSubmit}>
          <div className="join join-vertical w-full">
            {/* 基本資訊 */}
            <div className="collapse collapse-arrow join-item border border-base-300 bg-base-100">
              <input type="radio" name="newuser-accordion" defaultChecked />
              <div className="collapse-title font-medium">基本資訊</div>
              <div className="collapse-content">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  <Field
                    label="姓名"
                    type="text"
                    name="name"
                    value={formData.name}
                    onFocus={() => handleFocus("name")}
                    onChange={handleChange}
                    placeholder="輸入姓名"
                    error={errors.name && errors.name[0]}
                  />
                  <Field
                    as="select"
                    label="性別"
                    name="gender"
                    onFocus={() => handleFocus("gender")}
                    value={formData.gender}
                    onChange={handleChange}
                    error={errors.gender && errors.gender[0]}
                  >
                    <option value="">選擇性別</option>
                    <option value="M">男性</option>
                    <option value="F">女性</option>
                    <option value="O">其他</option>
                  </Field>
                  <Field
                    label="出生日期"
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onFocus={() => handleFocus("birth_data")}
                    onChange={handleChange}
                    placeholder="選擇出生日期"
                    error={errors.birth_date && errors.birth_date[0]}
                  />
                </div>
              </div>
            </div>

            {/* 聯絡資訊 */}
            <div className="collapse collapse-arrow join-item border border-base-300 bg-base-100">
              <input type="radio" name="newuser-accordion" />
              <div className="collapse-title font-medium">聯絡資訊</div>
              <div className="collapse-content">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  <Field
                    label="行動電話"
                    type="text"
                    name="mobile_phone"
                    value={formData.mobile_phone}
                    onChange={handleChange}
                    onFocus={() => handleFocus("mobile_phone")}
                    placeholder="輸入行動電話"
                    error={errors.mobile_phone && errors.mobile_phone[0]}
                  />
                  <Field
                    label="市內電話"
                    type="text"
                    name="home_phone"
                    value={formData.home_phone}
                    onFocus={() => handleFocus("home_phone")}
                    onChange={handleChange}
                    placeholder="輸入市內電話"
                    error={errors.home_phone && errors.home_phone[0]}
                  />
                  <Field
                    label="住址"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onFocus={() => handleFocus("address")}
                    placeholder="輸入住址"
                    error={errors.address && errors.address[0]}
                  />
                </div>
              </div>
            </div>

            {/* 學籍與職位 */}
            <div className="collapse collapse-arrow join-item border border-base-300 bg-base-100">
              <input type="radio" name="newuser-accordion" />
              <div className="collapse-title font-medium">學籍與職位</div>
              <div className="collapse-content">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  <Field
                    as="select"
                    label="職位"
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
                  </Field>
                  <Field
                    label="就學學校"
                    type="text"
                    name="school"
                    value={formData.graduate.school}
                    onChange={handleChange}
                    onFocus={() => handleFocus("school")}
                    placeholder="輸入就學學校"
                    error={errors.graduate?.school && errors.graduate.school[0]}
                  />
                  <Field
                    label="入學學年"
                    type="text"
                    name="grade"
                    value={formData.graduate.grade}
                    onFocus={() => handleFocus("grade")}
                    onChange={handleChange}
                    placeholder="輸入入學學年"
                    error={errors.graduate?.year && errors.graduate.year[0]}
                  />
                  <Field
                    label="學號"
                    type="text"
                    name="student_id"
                    value={formData.graduate.student_id}
                    onChange={handleChange}
                    onFocus={() => handleFocus("student_id")}
                    placeholder="輸入學號"
                    error={errors.graduate?.student_id && errors.graduate.student_id[0]}
                  />
                </div>
              </div>
            </div>

            {/* 其他資訊 */}
            <div className="collapse collapse-arrow join-item border border-base-300 bg-base-100">
              <input type="radio" name="newuser-accordion" />
              <div className="collapse-title font-medium">其他資訊</div>
              <div className="collapse-content">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  <Field
                    label="電子郵件"
                    type="text"
                    name="email"
                    value={formData.private_input.email}
                    onChange={handleChange}
                    placeholder="輸入電子郵件"
                    onFocus={() => handleFocus("email")}
                    error={errors.private_input?.email && errors.private_input.email[0]}
                  />
                  {!userId && (
                    <Field
                      label="帳號密碼"
                      type="text"
                      name="password"
                      value={formData.private_input.password}
                      onChange={handleChange}
                      placeholder="輸入帳號密碼"
                      onFocus={() => handleFocus("password")}
                    />
                  )}
                </div>
                <div className="form-control mb-3">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      name="is_paid"
                      checked={formData.is_paid}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_paid: e.target.checked,
                        }))
                      }
                    />
                    <span className="label-text">是否繳費</span>
                  </label>
                </div>
                <div className="form-control mb-3">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      name="is_show"
                      checked={formData.is_show}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_show: e.target.checked,
                        }))
                      }
                    />
                    <span className="label-text">是否展現於官網</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-3 gap-2">
            <Button variant="ghost" onClick={handleClose}>
              取消
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "保存"}
            </Button>
          </div>
        </form>
      ) : (
        // 簡單帳號表單
        <form onSubmit={handleSimpleSubmit}>
          <Field
            label="電子郵件"
            type="email"
            value={simple_email}
            onChange={(e) => setSimpleEmail(e.target.value)}
            placeholder="輸入電子郵件"
            onFocus={() => handleFocus("email")}
          />

          <Field
            as="select"
            label="是否為管理員"
            name="is_superuser"
            value={simple_userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="N">否</option>
            <option value="Y">是</option>
          </Field>
          <div className="alert alert-info py-2 my-2 text-sm">
            ℹ️ 基於安全考量，系統不會以郵件寄送密碼。帳號建立後，請通知使用者至登入頁點選「忘記密碼」，輸入此 Email 取得驗證碼並設定自己的密碼。
          </div>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : '新增帳號'}
          </Button>
        </form>
      )}
    </AppModal>
  );
}

export default NewUserModal;
