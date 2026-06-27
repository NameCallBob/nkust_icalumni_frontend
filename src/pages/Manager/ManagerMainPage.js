import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'components/common/ui';
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

    // 個人資料卡片
    const renderProfileCard = () => (
        <div className="card bg-base-100 rounded-2xl shadow-sm overflow-hidden mb-4">
            <div className="relative">
                {/* 背景裝飾 */}
                <div className="bg-primary opacity-75" style={{ height: '120px' }}></div>

                {/* 個人照片 */}
                <div className="text-center" style={{ marginTop: '-60px' }}>
                    <div className="inline-block relative">
                        <img
                            src={loading || error ? 'https://placehold.co/400' : process.env.REACT_APP_BASE_URL + userData.photo}
                            alt={userData.name}
                            className="rounded-full border-[3px] border-white shadow-sm"
                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </div>

            <div className="card-body text-center pt-3 pb-6">
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner size="lg" />
                        <p className="mt-3 text-base-content/60">資料載入中...</p>
                    </div>
                ) : (
                    <>
                        <h4 className="font-bold mb-1" style={{ fontSize: rwd.getFontSize('h4') }}>{userData.name}</h4>
                        <p className="text-base-content/60 mb-3" style={{ fontSize: rwd.getFontSize('body') }}>{userData.email}</p>

                        <div className="grid gap-2 mb-3">
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
                        <div className="text-left">
                            <h6 className="mb-3 border-b border-base-300 pb-2" style={{ fontSize: rwd.getFontSize('h6') }}>個人基本資訊</h6>
                            <div className="flex mb-2">
                                <div className="text-base-content/60" style={{ width: '100px' }}>性別：</div>
                                <div>{userData.gender === 'M' ? '男性' : userData.gender === 'F' ? '女性' : '其他'}</div>
                            </div>
                            <div className="flex mb-2">
                                <div className="text-base-content/60" style={{ width: '100px' }}>生日：</div>
                                <div>{userData.birth_date || '尚未設定'}</div>
                            </div>
                            <div className="flex mb-2">
                                <div className="text-base-content/60" style={{ width: '100px' }}>電話：</div>
                                <div>{userData.mobile_phone || '尚未設定'}</div>
                            </div>
                            <div className="flex mb-2">
                                <div className="text-base-content/60" style={{ width: '100px' }}>地址：</div>
                                <div>{userData.address || '尚未設定'}</div>
                            </div>
                            {userData.graduate && (
                                <div className="flex mb-2">
                                    <div className="text-base-content/60" style={{ width: '100px' }}>入學年度：</div>
                                    <div>{userData.graduate.grade || '尚未設定'}</div>
                                </div>
                            )}
                            {userData.graduate && (
                                <div className="flex mb-2">
                                    <div className="text-base-content/60" style={{ width: '100px' }}>學號：</div>
                                    <div>{userData.graduate.student_id || '尚未設定'}</div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    // 歡迎卡片
    const renderWelcomeCard = () => (
        <div className="card bg-base-100 rounded-2xl shadow-sm overflow-hidden mb-4">
            <div className="card-body p-6">
                <div className="flex items-center mb-3">
                    <div className="rounded-full bg-primary/10 p-3 mr-3">
                        <BsMortarboardFill className="text-primary text-2xl" />
                    </div>
                    <div>
                        <h4 className="mb-0" style={{ fontSize: rwd.getFontSize('h4') }}>歡迎回來，{userData.name || '系友'}！</h4>
                        <p className="text-base-content/60 mb-0" style={{ fontSize: rwd.getFontSize('body') }}>高科大智慧商務系 系友專區</p>
                    </div>
                </div>
                <p className="mt-3 mb-0" style={{ fontSize: rwd.getFontSize('body') }}>
                    感謝您回到系友專區！在這裡您可以隨時更新個人資料、查看系上最新動態，以及與其他系友保持聯繫。
                    若您有任何問題或建議，請隨時與系辦聯絡。
                </p>
            </div>
        </div>
    );


    return (
        <div className="admin-container container mx-auto px-4 py-5" style={rwd.getContainerStyle()}>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-5 lg:col-span-4">
                    {/* 左側會員資料卡片 */}
                    {renderProfileCard()}
                </div>

                <div className="col-span-12 md:col-span-7 lg:col-span-8">
                    {/* 右側內容區 */}
                    <div className="flex flex-col h-full">
                        {/* 歡迎卡片 */}
                        {renderWelcomeCard()}
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