import React, { useState, useEffect } from 'react';
import { Button, Spinner, PageHeader, Card, Badge } from 'components/common/ui';
import { useNavigate } from 'react-router-dom';
import useRWD from 'hooks/useRWD';
import MemberModal from 'components/Manage/Center/EditModal';
import Axios from 'common/Axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PwdUpdateModal from 'components/Manage/Center/PwdUpdateModal';
import ThankYouModal from 'components/Manage/Center/introModal';
import { BsPencilSquare, BsKey, BsMortarboardFill } from 'react-icons/bs';

/**
 * 會員中心 
 * @returns  
 */
function MemberCenter() {
    const navigate = useNavigate();
    const rwd = useRWD();

    const [showEditModal, setShowEditModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [showPwdModal, setShowPwdModal] = useState(false);
    const [showThxModal, setThxModal] = useState(false);
    const [userData, setUserData] = useState({ name: '使用者名稱', email: '使用者電子郵件', photo: 'https://via.placeholder.com/150' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // 保留原有的處理函數
    const handleCloseThxModal = () => setThxModal(false);
    const handleShowThxModal = () => setThxModal(true);
    const handleShowEditModal = (isEdit = true) => setShowEditModal(true);
    const handleCloseEditModal = () => setShowEditModal(false);
    const handleShowPwdModal = () => setShowPwdModal(true);
    const handleClosePwdModal = () => setShowPwdModal(false);

    const handleSave = (formData, changedData) => {
        setLoading(true);
        if (Object.keys(changedData).length === 0) {
            return;
        }
        const apiEndpoint = isEditMode
            ? "/member/logined/partial_change/"
            : "/member/logined/new/"
        console.log(formData)
        Axios()[isEditMode ? 'patch' : 'post'](apiEndpoint, changedData)
            .then((res) => {
                toast.success(isEditMode ? "修改成功!" : "新增成功!", { position: 'top-right' });
                setUserData(formData);
            })
            .catch((err) => {
                handleAxiosError(err);
                console.log(err)
            })
            .finally(() => {
                setLoading(false);
                setShowEditModal(false);
            });
        
    };

    const handleAxiosError = (err) => {
        if (err.response) {
            const status = err.response.status;
            const errorMessage = err.response.data?.detail || '';
            setError(errorMessage)
            if (status === 401 && errorMessage.includes('token')) {
                toast.error("Token 已失效，請重新登入", { position: toast.POSITION.TOP_RIGHT});
                navigate('/login');
            } else {
                // 顯示後端回傳的錯誤訊息
                if (errorMessage) {
                    toast.error(errorMessage, { position: 'top-right' });
                } else {
                    switch (status) {
                        case 400:
                            toast.error("請確認資料是否輸入齊全，且照片有上傳", { position: 'top-right' });
                            break;
                        case 401:
                            toast.error("未授權，請重新登入", { position: 'top-right' });
                            navigate('/login');
                            break;
                        case 403:
                            toast.error("禁止訪問，您沒有權限執行此操作", { position: 'top-right' });
                            break;
                        default:
                            toast.error("發生錯誤，請稍後再試", { position: 'top-right' });
                    }
                }
            }
        } else {
            toast.error("無法連接到伺服器，請稍後再試", { position: 'top-right' });
        }
    };

    useEffect(() => {
        Axios().get("/member/logined/selfInfo/")
            .then((res) => {
                setUserData(res.data);
                setLoading(false);
                setIsEditMode(true);
            })
            .catch((err) => {
                toast.warn("偵測到無會員資料，請填寫基本資訊")
                setLoading(false);
                handleShowThxModal()
                setIsEditMode(false);
                setUserData((prevState) => ({ ...prevState, photo: '' }));
            });
    }, []);

    // 個人基本資訊列
    const InfoRow = ({ label, value }) => (
        <div className="flex items-start gap-3 py-2.5 border-b border-base-200 last:border-0">
            <span className="w-24 shrink-0 text-sm text-base-content/50">{label}</span>
            <span className="text-sm font-medium text-base-content break-words">{value}</span>
        </div>
    );

    // 個人資料卡片
    const renderProfileCard = () => (
        <Card padding="none" className="overflow-hidden">
            {/* 深藍封面 */}
            <div className="relative">
                <div
                    className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a]"
                    style={{ height: '120px' }}
                ></div>
                <div className="absolute inset-x-0 -bottom-12 flex justify-center">
                    <img
                        src={loading || error ? 'https://placehold.co/400' : process.env.REACT_APP_BASE_URL + userData.photo}
                        alt={userData.name}
                        className="rounded-full border-4 border-white shadow-md bg-white"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                </div>
            </div>

            <div className="px-6 pt-16 pb-6">
                {loading ? (
                    <div className="text-center py-6">
                        <Spinner size="lg" />
                        <p className="mt-3 text-base-content/60">資料載入中...</p>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-5">
                            <h2 className="text-xl font-bold text-base-content">{userData.name}</h2>
                            <p className="text-sm text-base-content/60 mt-1 break-words">{userData.email}</p>
                            <div className="mt-3 flex justify-center">
                                <Badge variant={isEditMode ? 'success' : 'warning'}>
                                    {isEditMode ? '資料已建立' : '尚未填寫資料'}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid gap-2 mb-6">
                            <Button
                                variant="primary"
                                className="flex items-center justify-center w-full"
                                onClick={handleShowEditModal}
                                disabled={error || loading}
                            >
                                <BsPencilSquare className="mr-2" />
                                編輯個人資料
                            </Button>
                            <Button
                                variant="outline"
                                className="flex items-center justify-center w-full"
                                onClick={handleShowPwdModal}
                                disabled={error || loading}
                            >
                                <BsKey className="mr-2" />
                                修改密碼
                            </Button>
                        </div>

                        {/* 基本資訊列表 */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-base-content/40 mb-1">
                                個人基本資訊
                            </h3>
                            <InfoRow label="性別" value={userData.gender === 'M' ? '男性' : userData.gender === 'F' ? '女性' : '其他'} />
                            <InfoRow label="生日" value={userData.birth_date || '尚未設定'} />
                            <InfoRow label="電話" value={userData.mobile_phone || '尚未設定'} />
                            <InfoRow label="地址" value={userData.address || '尚未設定'} />
                            {userData.graduate && (
                                <InfoRow label="入學年度" value={userData.graduate.grade || '尚未設定'} />
                            )}
                            {userData.graduate && (
                                <InfoRow label="學號" value={userData.graduate.student_id || '尚未設定'} />
                            )}
                        </div>
                    </>
                )}
            </div>
        </Card>
    );

    // 歡迎卡片
    const renderWelcomeCard = () => (
        <Card padding="lg" className="overflow-hidden">
            <div className="flex items-center gap-4 mb-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BsMortarboardFill className="text-2xl" />
                </span>
                <div className="min-w-0">
                    <h2 className="text-lg font-bold text-base-content truncate">
                        歡迎回來，{userData.name || '系友'}！
                    </h2>
                    <p className="text-sm text-base-content/60">高科大智慧商務系 系友專區</p>
                </div>
            </div>
            <p className="text-sm leading-relaxed text-base-content/80">
                感謝您回到系友專區！在這裡您可以隨時更新個人資料、查看系上最新動態，以及與其他系友保持聯繫。
                若您有任何問題或建議，請隨時與系辦聯絡。
            </p>
        </Card>
    );


    return (
        <div className="min-h-screen bg-base-200/40">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <PageHeader
                    title="會員中心"
                    subtitle="管理您的個人資料與帳號設定"
                    icon={<BsMortarboardFill className="text-xl" />}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="min-w-0 lg:col-span-4">
                        {/* 左側會員資料卡片 */}
                        {renderProfileCard()}
                    </div>

                    <div className="min-w-0 lg:col-span-8">
                        {/* 右側內容區 */}
                        <div className="flex flex-col gap-6 h-full">
                            {/* 歡迎卡片 */}
                            {renderWelcomeCard()}
                        </div>
                    </div>
                </div>
            </div>

            {/* 保留原有的Modal */}
            <MemberModal
                show={showEditModal}
                isEditMode={isEditMode}
                handleClose={handleCloseEditModal}
                handleSave={handleSave}
                parentData={userData}
                loading={loading}
                setLoading={setLoading}
            />
            
            <ThankYouModal 
                show={showThxModal}
                handleClose={handleCloseThxModal}
            />

            <PwdUpdateModal
                show={showPwdModal}
                handleClose={handleClosePwdModal}
            />
            
            <ToastContainer />
        </div>
    );
}

export default MemberCenter;