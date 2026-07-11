import React, { useState, useEffect } from 'react';
import { UserPlus, Eye, EyeOff, Info } from 'lucide-react';
import { toast } from 'react-toastify';

import { validatePassword, PASSWORD_HINT } from 'utils/validatePassword';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Field,
  Label,
  Switch,
  Spinner,
  Alert,
  AlertDescription,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui';
import { positionService } from '@/services';

/**
 * 新增 / 編輯帳號 Modal。
 * API 由父層 handleAddUser 執行（端點與 payload 完全不變）：
 *  - 編輯：PATCH /member/admin/partial_change/  （payload = 變更欄位 + member_id）
 *  - 新增完整：POST /member/admin/newUser_basic/
 *  - 新增簡單：POST /member/admin/newUser_email/  （payload = { email, is_superuser }）
 * 職位清單：GET /member/position/get-all/（positionService.all）。
 */
function NewUserModal({ showModal, handleClose, isComplex, userId, handleAddUser, fetchUserData }) {
  const [simple_email, setSimpleEmail] = useState('');
  const [simple_userType, setUserType] = useState('N');
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    mobile_phone: '',
    home_phone: '',
    address: '',
    position: { title: '' },
    photo: null,
    graduate: { school: '', grade: '', student_id: '' },
    private_input: { email: '', password: '' },
    is_paid: false,
    is_show: false,
    birth_date: '',
  });
  const [originalData, setOriginalData] = useState(null);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [hint, setHint] = useState('');

  /** 送出前計算差異欄位（編輯用）。 */
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
      } else if (formData[key] !== (originalData[key] || '')) {
        modifiedData[key] = formData[key];
      }
    });

    delete modifiedData['intro'];
    delete modifiedData['notice_type'];
    delete modifiedData['photo'];

    return modifiedData;
  };

  const HINTS = {
    is_show: '選擇是否讓使用者呈現於官網',
    name: '請輸入您的真實姓名，例如：王小明，最多 50 個字。',
    gender: '請選擇您的性別，例如：男性、女性或其他。',
    birth_date: '請選擇出生日期，例如：1990-01-01。',
    mobile_phone: '請輸入有效的行動電話號碼，例如：0912345678。',
    home_phone: '請輸入市內電話號碼，例如：07-1234567。',
    address: '請輸入詳細住址，例如：高雄市鼓山區博愛一路123號。',
    email: '請輸入有效的電子郵件，例如：user@example.com。',
    password: PASSWORD_HINT,
    school: '請輸入就學學校，例如：國立高雄科技大學 智慧商務系。',
    grade: '請輸入入學學年，例如：113。',
    student_id: '請輸入學號，例如：S12345678。',
  };
  const handleFocus = (field) => setHint(HINTS[field] || '');
  const handleBlur = () => setHint('');

  // 取回編輯資料 + 職位清單
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        setLoading(true);
        const data = await fetchUserData(userId);
        if (data) {
          const initializedData = {
            ...data,
            graduate: data.graduate || { school: '', grade: '', student_id: '' },
            position: data.position || { title: '' },
            private_input: data.private || { email: '', password: null },
            birth_date: data.birth_date || '',
          };
          setFormData(initializedData);
          setOriginalData(initializedData);
          setSimpleEmail(data.email);
        }
        setLoading(false);
      } else {
        setFormData({
          name: '',
          gender: '',
          mobile_phone: '',
          home_phone: '',
          address: '',
          position: { title: '' },
          graduate: { school: '國立高雄科技大學智慧商務系', grade: '', student_id: '' },
          private_input: { email: '', password: '' },
          is_paid: false,
          is_show: false,
        });
        setOriginalData(null);
        setSimpleEmail('');
      }
      setErrors({});
    };
    fetchData();

    positionService
      .all()
      .then((res) => setPositions(res.data))
      .catch((error) => console.error('Error fetching positions:', error));
  }, [userId, fetchUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'school' || name === 'grade' || name === 'student_id') {
      setFormData((prev) => ({ ...prev, graduate: { ...prev.graduate, [name]: value } }));
    } else if (name === 'email' || name === 'password') {
      setFormData((prev) => ({ ...prev, private_input: { ...prev.private_input, [name]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePositionChange = (idStr) => {
    setFormData((prev) => ({
      ...prev,
      position: positions.find((pos) => pos.id === parseInt(idStr, 10)) || { title: '' },
    }));
  };

  const handleComplexSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      const pwdResult = validatePassword(formData.private_input?.password);
      if (!pwdResult.valid) {
        setErrors((prev) => ({ ...prev, private_input: { password: [pwdResult.message] } }));
        toast.error(pwdResult.message);
        return;
      }
    }
    setLoading(true);
    try {
      await handleAddUser(true, getModifiedFields());
    } catch (error) {
      if (error?.response?.data) setErrors(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSimpleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleAddUser(false, { email: simple_email, is_superuser: simple_userType });
    } finally {
      setLoading(false);
    }
  };

  const selectedPositionId =
    positions.find((pos) => pos.title === formData.position?.title)?.id;

  return (
    <Dialog open={showModal} onOpenChange={(v) => !v && !loading && handleClose()}>
      <DialogContent className="max-w-2xl" preventQuickClose>
        <DialogHeader>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserPlus className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="space-y-1.5">
              <DialogTitle>{userId ? '編輯帳號' : isComplex ? '新增完整帳號' : '新增簡單帳號'}</DialogTitle>
              <DialogDescription>
                {isComplex ? '填寫完整系友資料，欄位聚焦時下方會顯示格式提示。' : '僅需輸入 Email 即可建立帳號。'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {hint && (
          <Alert variant="info">
            <Info className="h-4 w-4" />
            <AlertDescription>{hint}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <Spinner center />
        ) : isComplex ? (
          <form id="newuser-complex-form" className="space-y-6" onSubmit={handleComplexSubmit}>
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">基本資訊</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="姓名"
                  name="name"
                  value={formData.name}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="輸入姓名"
                  error={errors.name && errors.name[0]}
                />
                <div className="space-y-1.5">
                  <Label htmlFor="nu-gender">性別</Label>
                  <Select
                    value={formData.gender || undefined}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, gender: v }))}
                  >
                    <SelectTrigger id="nu-gender" onFocus={() => handleFocus('gender')} onBlur={handleBlur}>
                      <SelectValue placeholder="選擇性別" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">男性</SelectItem>
                      <SelectItem value="F">女性</SelectItem>
                      <SelectItem value="O">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Field
                  label="出生日期"
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onFocus={() => handleFocus('birth_date')}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={errors.birth_date && errors.birth_date[0]}
                />
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">聯絡資訊</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="行動電話"
                  name="mobile_phone"
                  value={formData.mobile_phone}
                  onChange={handleChange}
                  onFocus={() => handleFocus('mobile_phone')}
                  onBlur={handleBlur}
                  placeholder="輸入行動電話"
                  error={errors.mobile_phone && errors.mobile_phone[0]}
                />
                <Field
                  label="市內電話"
                  name="home_phone"
                  value={formData.home_phone}
                  onFocus={() => handleFocus('home_phone')}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="輸入市內電話"
                  error={errors.home_phone && errors.home_phone[0]}
                />
                <Field
                  label="住址"
                  name="address"
                  className="sm:col-span-2"
                  value={formData.address}
                  onChange={handleChange}
                  onFocus={() => handleFocus('address')}
                  onBlur={handleBlur}
                  placeholder="輸入住址"
                  error={errors.address && errors.address[0]}
                />
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">學籍與職位</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="nu-position">職位</Label>
                  <Select
                    value={selectedPositionId ? String(selectedPositionId) : undefined}
                    onValueChange={handlePositionChange}
                  >
                    <SelectTrigger id="nu-position">
                      <SelectValue placeholder="選擇職位" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position.id} value={String(position.id)}>
                          {position.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Field
                  label="就學學校"
                  name="school"
                  value={formData.graduate.school}
                  onChange={handleChange}
                  onFocus={() => handleFocus('school')}
                  onBlur={handleBlur}
                  placeholder="輸入就學學校"
                  error={errors.graduate?.school && errors.graduate.school[0]}
                />
                <Field
                  label="入學學年"
                  name="grade"
                  value={formData.graduate.grade}
                  onFocus={() => handleFocus('grade')}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="輸入入學學年"
                  error={errors.graduate?.year && errors.graduate.year[0]}
                />
                <Field
                  label="學號"
                  name="student_id"
                  value={formData.graduate.student_id}
                  onChange={handleChange}
                  onFocus={() => handleFocus('student_id')}
                  onBlur={handleBlur}
                  placeholder="輸入學號"
                  error={errors.graduate?.student_id && errors.graduate.student_id[0]}
                />
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">其他資訊</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="電子郵件"
                  name="email"
                  value={formData.private_input.email}
                  onChange={handleChange}
                  placeholder="輸入電子郵件"
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  error={errors.private_input?.email && errors.private_input.email[0]}
                />
                {!userId && (
                  <div className="space-y-1.5">
                    <Label htmlFor="nu-password">帳號密碼</Label>
                    <div className="flex items-center gap-2">
                      <Field
                        id="nu-password"
                        className="flex-1"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        autoComplete="new-password"
                        value={formData.private_input.password}
                        onChange={handleChange}
                        placeholder="輸入帳號密碼"
                        onFocus={() => handleFocus('password')}
                        onBlur={handleBlur}
                        error={errors.private_input?.password && errors.private_input.password[0]}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-11 w-11 shrink-0"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <Label htmlFor="nu-is-paid" className="cursor-pointer">是否繳費</Label>
                <Switch
                  id="nu-is-paid"
                  checked={!!formData.is_paid}
                  onCheckedChange={(v) => setFormData((prev) => ({ ...prev, is_paid: v }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <Label htmlFor="nu-is-show" className="cursor-pointer">是否展現於官網</Label>
                <Switch
                  id="nu-is-show"
                  checked={!!formData.is_show}
                  onFocus={() => handleFocus('is_show')}
                  onBlur={handleBlur}
                  onCheckedChange={(v) => setFormData((prev) => ({ ...prev, is_show: v }))}
                />
              </div>
            </section>
          </form>
        ) : (
          <form id="newuser-simple-form" className="space-y-4" onSubmit={handleSimpleSubmit}>
            <Field
              label="電子郵件"
              type="email"
              value={simple_email}
              onChange={(e) => setSimpleEmail(e.target.value)}
              placeholder="輸入電子郵件"
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
            />
            <div className="space-y-1.5">
              <Label htmlFor="nu-superuser">是否為管理員</Label>
              <Select value={simple_userType} onValueChange={setUserType}>
                <SelectTrigger id="nu-superuser">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N">否</SelectItem>
                  <SelectItem value="Y">是</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Alert variant="info">
              <Info className="h-4 w-4" />
              <AlertDescription>
                基於安全考量，系統不會以郵件寄送密碼。帳號建立後，請通知使用者至登入頁點選「忘記密碼」，輸入此 Email 取得驗證碼並設定自己的密碼。
              </AlertDescription>
            </Alert>
          </form>
        )}

        {!loading && (
          <DialogFooter>
            <Button variant="outline" type="button" onClick={handleClose}>
              取消
            </Button>
            <Button
              variant="default"
              type="submit"
              form={isComplex ? 'newuser-complex-form' : 'newuser-simple-form'}
            >
              {isComplex ? '保存' : '新增帳號'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default NewUserModal;
