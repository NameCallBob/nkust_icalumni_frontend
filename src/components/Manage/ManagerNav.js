import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaBuilding, FaProductHunt, FaCamera, FaClipboardList, FaTasks, FaSignOutAlt, FaInfoCircle, FaGlobe } from 'react-icons/fa'; // 引入所需圖標
import logo from 'assets/logo.png'; // 請替換為你的 logo 圖片路徑
import "css/Navlogo.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // 引入react-toastify的樣式

/**
 * 管理端專用導覽列
 * @returns
 */
function ManagerNav() {

    const navigator = useNavigate();
    const [isAdmin,setAdminStatus] = useState(false)


    const Logout = () => {
        window.localStorage.setItem("jwt", "")
        toast.success("已登出，期待在見到您!", { position: 'top-right' });
        setTimeout(() => {
            navigator("/");
        }, 2000); // 加一個延遲，讓用戶有時間看到通知
    }

    useEffect(() => {
        const currentTime = Math.floor(Date.now() / 1000); // 當前時間 (秒)
        const expiry = localStorage.getItem("expiry");
        // 確認token有效並另取人員資訊
        if (currentTime >= expiry) {
            toast.error("登入時效已過，請重新登入！", {
                position: toast.POSITION.TOP_RIGHT
            });
            setTimeout(() => {
                navigator('/login');
            }, 2000); // 同樣加上延遲
        }
        window.localStorage.getItem("super") === 'true' ? setAdminStatus(true) : setAdminStatus(false)
        console.log(window.localStorage.getItem("super"))
    }, [navigator]);

    return (
        <Container fluid>
            <ToastContainer /> {/* 放置 ToastContainer，來顯示通知 */}
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/" className="d-flex align-items-center mx-5">
                    <img
                        src={logo}
                        className="d-inline-block align-top logo-img"
                        alt="智商系友會LOGO"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
                    <Nav className="ml-auto">
                        {/* 一般管理 */}
                        <NavDropdown title="一般管理" id="general-management-dropdown" className='mx-3 border-item'>
                        <NavDropdown.Item href="/alumni/manage/">
                                <FaUsers className="me-2" /> 個人頁面
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/alumni/manage/company/">
                                <FaBuilding className="me-2" /> 公司登陸
                            </NavDropdown.Item>
                            {/* <NavDropdown.Item href="/alumni/manage/product/">
                                <FaProductHunt className="me-2" /> 商品登陸
                            </NavDropdown.Item> */}
                            <NavDropdown.Item href="/alumni/manage/recruit/">
                                <FaClipboardList className="me-2" /> 招募登陸
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/alumni/manage/pic/">
                                <FaCamera className="me-2" /> 照片管理
                            </NavDropdown.Item>
                        </NavDropdown>

                        {/* 管理者管理 - 根據 isAdmin 條件渲染 */}
                        {isAdmin && (
                            <NavDropdown title="管理者管理" id="admin-management-dropdown" className='mx-3 border-item'>
                                <NavDropdown.Item href="/alumni/manage/member/">
                                    <FaUsers className="me-2" /> 使用者管理
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/alumni/manage/article/">
                                    <FaTasks className="me-2" /> 活動發布管理
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/alumni/manage/outstanding/">
                                    <FaUsers className="me-2" /> 傑出系友設置
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}

                        {/* 官網管理 - 根據 isAdmin 條件渲染*/}
                        {isAdmin && (
                        <NavDropdown title="官網管理" id="website-management-dropdown" className='mx-3 border-item'>
                            <NavDropdown.Item href="/alumni/manage/website/">
                                <FaGlobe className="me-2" /> 官網照片設置
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/alumni/manage/other/">
                                <FaTasks className="me-2" /> 其他管理
                            </NavDropdown.Item>

                        </NavDropdown>
                        )}

                        {/* 官網管理 - 根據 isAdmin 條件渲染*/}
                        {isAdmin && (
                        <NavDropdown title="系友會資訊管理" id="website-management-dropdown" className='mx-3 border-item'>
                            <NavDropdown.Item href="/alumni/manage/info/?type=rule">
                                <FaTasks className="me-2" /> 介紹
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/alumni/manage/info/?type=structure">
                                <FaTasks className="me-2" /> 組織
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/alumni/manage/info/?type=us">
                                <FaTasks className="me-2" /> 加入我們
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/alumni/manage/constitutions/">
                                <FaTasks className="me-2" /> 章程
                            </NavDropdown.Item>
                        </NavDropdown>
                        )}

                        {/* 其他管理
                        <NavDropdown title="其他管理" id="other-management-dropdown" className='mx-3 border-item'>

                        </NavDropdown> */}

                        {/* 帳號相關 */}
                        <NavDropdown title="帳號相關" id="account-dropdown" className='mr-auto border-item'>
                            <NavDropdown.Item onClick={Logout}>
                                <FaSignOutAlt className="me-2" /> 登出
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/Manager/User">
                                <FaInfoCircle className="me-2" /> 使用說明
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </Container>
    );
}

export default ManagerNav;
