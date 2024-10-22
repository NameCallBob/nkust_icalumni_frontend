import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaBuilding, FaProductHunt, FaCamera, FaClipboardList, FaTasks, FaSignOutAlt, FaInfoCircle, FaGlobe } from 'react-icons/fa'; // 引入所需圖標
import logo from 'assets/logo.png'; // 請替換為你的 logo 圖片路徑
import Axios from 'common/Axios';
import "css/Navlogo.css";

function ManagerNav() {
    const [userInfo, setUserInfo] = useState(null);
    const navigator = useNavigate();

    useEffect(() => {
        // 確認token有效並另取人員資訊
        if (window.localStorage.getItem("IsAuth") === false) {
            Axios().post("member/token/verify/", {
                'token': window.localStorage.getItem("jwt")
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    alert("登入時效已過，請重新登入！");
                    navigator('/login');
                }
            });
        }
    }, []);

    return (
        <Container fluid>
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
                            <NavDropdown.Item href="/alumni/manage/member/">
                                <FaUsers className="me-2" /> 使用者管理
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/alumni/manage/company/">
                                <FaBuilding className="me-2" /> 公司登陸
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/alumni/manage/product/">
                                <FaProductHunt className="me-2" /> 商品登陸
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/alumni/manage/recruit/">
                                <FaClipboardList className="me-2" /> 招募登陸
                            </NavDropdown.Item>
                        </NavDropdown>

                        {/* 管理者管理 */}
                        <NavDropdown title="管理者管理" id="admin-management-dropdown" className='mx-3 border-item'>
                            <NavDropdown.Item href="/alumni/manage/article/">
                                <FaTasks className="me-2" /> 活動發布管理
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/alumni/manage/pic/">
                                <FaCamera className="me-2" /> 照片管理
                            </NavDropdown.Item>
                        </NavDropdown>

                        {/* 官網管理 */}
                        <NavDropdown title="官網管理" id="website-management-dropdown" className='mx-3 border-item'>
                            <NavDropdown.Item href="/alumni/manage/website/">
                                <FaGlobe className="me-2" /> 官網設置
                            </NavDropdown.Item>
                        </NavDropdown>

                        {/* 其他管理 */}
                        <NavDropdown title="其他管理" id="other-management-dropdown" className='mx-3 border-item'>
                            <NavDropdown.Item href="/alumni/manage/other/">
                                <FaTasks className="me-2" /> 其他管理
                            </NavDropdown.Item>
                        </NavDropdown>

                        {/* 帳號相關 */}
                        <NavDropdown title="帳號相關" id="account-dropdown" className='mr-auto border-item'>
                            <NavDropdown.Item href="/login">
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
