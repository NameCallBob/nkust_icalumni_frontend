import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MemberModal from 'components/Manage/Center/EditModal';
import Axios from 'common/Axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PwdUpdateModal from 'components/Manage/Center/PwdUpdateModal';
import ThankYouModal from 'components/Manage/Center/introModal';

/**
 * 會員中心 
 * @returns  
 */
function MemberCenter() {
    const navigate = useNavigate();

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

        Axios()[isEditMode ? 'patch' : 'post'](apiEndpoint, changedData)
            .then((res) => {
                toast.success(isEditMode ? "修改成功!" : "新增成功!", { position: 'top-right' });
                setUserData(formData);
            })
            .catch((err) => {
                handleAxiosError(err);
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
        <Card className="border-0 rounded-4 shadow-sm overflow-hidden mb-4">
            <div className="position-relative">
                {/* 背景裝飾 */}
                <div className="bg-primary opacity-75" style={{ height: '120px' }}></div>
                
                {/* 個人照片 */}
                <div className="text-center" style={{ marginTop: '-60px' }}>
                    <div className="d-inline-block position-relative">
                        <img 
                            src={loading || error ? 'https://placehold.co/400' : process.env.REACT_APP_BASE_URL + userData.photo} 
                            alt={userData.name} 
                            className="rounded-circle border border-3 border-white shadow-sm" 
                            style={{ width: '120px', height: '120px', objectFit: 'cover' }} 
                        />
                    </div>
                </div>
            </div>
            
            <Card.Body className="text-center pt-3 pb-4">
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted">資料載入中...</p>
                    </div>
                ) : (
                    <>
                        <h4 className="fw-bold mb-1">{userData.name}</h4>
                        <p className="text-muted mb-3">{userData.email}</p>
                        
                        <div className="d-grid gap-2 mb-3">
                            <Button 
                                variant="primary" 
                                className="d-flex align-items-center justify-content-center" 
                                onClick={handleShowEditModal}
                                disabled={error || loading}
                            >
                                <i className="bi bi-pencil-square me-2"></i>
                                編輯個人資料
                            </Button>
                            <Button 
                                variant="outline-secondary" 
                                className="d-flex align-items-center justify-content-center" 
                                onClick={handleShowPwdModal}
                                disabled={error || loading}
                            >
                                <i className="bi bi-key me-2"></i>
                                修改密碼
                            </Button>
                        </div>
                        
                        {/* 基本資訊列表 */}
                        <div className="text-start">
                            <h6 className="mb-3 border-bottom pb-2">個人基本資訊</h6>
                            <div className="d-flex mb-2">
                                <div className="text-muted" style={{ width: '100px' }}>性別：</div>
                                <div>{userData.gender === 'M' ? '男性' : userData.gender === 'F' ? '女性' : '其他'}</div>
                            </div>
                            <div className="d-flex mb-2">
                                <div className="text-muted" style={{ width: '100px' }}>生日：</div>
                                <div>{userData.birth_date || '尚未設定'}</div>
                            </div>
                            <div className="d-flex mb-2">
                                <div className="text-muted" style={{ width: '100px' }}>電話：</div>
                                <div>{userData.mobile_phone || '尚未設定'}</div>
                            </div>
                            <div className="d-flex mb-2">
                                <div className="text-muted" style={{ width: '100px' }}>地址：</div>
                                <div>{userData.address || '尚未設定'}</div>
                            </div>
                            {userData.graduate && (
                                <div className="d-flex mb-2">
                                    <div className="text-muted" style={{ width: '100px' }}>入學年度：</div>
                                    <div>{userData.graduate.grade || '尚未設定'}</div>
                                </div>
                            )}
                            {userData.graduate && (
                                <div className="d-flex mb-2">
                                    <div className="text-muted" style={{ width: '100px' }}>學號：</div>
                                    <div>{userData.graduate.student_id || '尚未設定'}</div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Card.Body>
        </Card>
    );

    // 歡迎卡片
    const renderWelcomeCard = () => (
        <Card className="border-0 rounded-4 shadow-sm overflow-hidden mb-4">
            <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                        <i className="bi bi-mortarboard-fill text-primary fs-4"></i>
                    </div>
                    <div>
                        <h4 className="mb-0">歡迎回來，{userData.name || '系友'}！</h4>
                        <p className="text-muted mb-0">高科大智慧商務系 系友專區</p>
                    </div>
                </div>
                <p className="mt-3 mb-0">
                    感謝您回到系友專區！在這裡您可以隨時更新個人資料、查看系上最新動態，以及與其他系友保持聯繫。
                    若您有任何問題或建議，請隨時與系辦聯絡。
                </p>
            </Card.Body>
        </Card>
    );

    // 系友專區卡片
    const renderAlumniCard = () => (
        <Card className="border-0 rounded-4 shadow-sm">
            <Card.Body className="p-4">
                <h5 className="mb-4"><i className="bi bi-stars me-2 text-warning"></i>系友專屬資源</h5>
                <Row xs={1} md={2} className="g-3">
                    <Col>
                        <Card className="h-100 border-0 shadow-sm hover-lift rounded-3">
                            <Card.Body className="p-3">
                                <div className="d-flex align-items-center mb-2">
                                    <div className="rounded bg-info bg-opacity-10 p-2 me-2">
                                        <i className="bi bi-journal-richtext text-info"></i>
                                    </div>
                                    <h6 className="mb-0">數位圖書館</h6>
                                </div>
                                <p className="small text-muted mb-0">持續使用學校數位資源，查閱期刊論文</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="h-100 border-0 shadow-sm hover-lift rounded-3">
                            <Card.Body className="p-3">
                                <div className="d-flex align-items-center mb-2">
                                    <div className="rounded bg-success bg-opacity-10 p-2 me-2">
                                        <i className="bi bi-briefcase text-success"></i>
                                    </div>
                                    <h6 className="mb-0">徵才平台</h6>
                                </div>
                                <p className="small text-muted mb-0">系友專屬就業資訊與工作機會</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="h-100 border-0 shadow-sm hover-lift rounded-3">
                            <Card.Body className="p-3">
                                <div className="d-flex align-items-center mb-2">
                                    <div className="rounded bg-danger bg-opacity-10 p-2 me-2">
                                        <i className="bi bi-calendar-event text-danger"></i>
                                    </div>
                                    <h6 className="mb-0">系友活動</h6>
                                </div>
                                <p className="small text-muted mb-0">各類系友聚會與聯誼活動資訊</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="h-100 border-0 shadow-sm hover-lift rounded-3">
                            <Card.Body className="p-3">
                                <div className="d-flex align-items-center mb-2">
                                    <div className="rounded bg-warning bg-opacity-10 p-2 me-2">
                                        <i className="bi bi-people text-warning"></i>
                                    </div>
                                    <h6 className="mb-0">系友名錄</h6>
                                </div>
                                <p className="small text-muted mb-0">尋找與連結您的同學與其他系友</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );

    return (
        <Container className="py-5">
            <Row className="g-4">
                <Col lg={4}>
                    {/* 左側會員資料卡片 */}
                    {renderProfileCard()}
                </Col>
                
                <Col lg={8}>
                    {/* 右側內容區 */}
                    <div className="d-flex flex-column h-100">
                        {/* 歡迎卡片 */}
                        {renderWelcomeCard()}
                        
                        {/* 系友專區卡片 */}
                        {/* {renderAlumniCard()} */}
                    </div>
                </Col>
            </Row>

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
        </Container>
    );
}

export default MemberCenter;