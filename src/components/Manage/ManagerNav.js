import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import logo from 'assets/logo.png'; // 請替換為你的 logo 圖片路徑
import Axios from 'common/Axios'
import "css/Navlogo.css"

/**
 * 使用者端的導覽列設計
 * @returns html
 */
function ManagerNav() {
    const [userInfo,setUserInfo] = useState(null);
    const navigator = useNavigate()

    useEffect(() => {
        // 確認token有效並另取人員資訊
        if (window.localStorage.getItem("IsAuth") === false){
            Axios().post("member/token/verify/",{
                'token':window.localStorage.getItem("jwt")
            })
            .catch((err) => {
                if (err.response.status === 401){
                    alert("登入時效已過，請重新登入！")
                    navigator('/login')
                }
            })
        }
    } , [])


    return (
        <Container fluid >
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/" className="d-flex align-items-center mx-5 ">
                    <img
                    src={logo}
                    className="d-inline-block align-top logo-img"
                    alt="智商系友會LOGO"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end' >
                    <Nav className="ml-auto">
                        <Nav.Link href="/alumni/manage/member/" className="mx-3 border-item">使用者管理</Nav.Link>
                        <Nav.Link href="/alumni/manage/company/" className="mx-3 border-item">公司登陸</Nav.Link>
                        <Nav.Link href="/alumni/manage/product/" className="mx-3 border-item">商品登陸</Nav.Link>
                        <Nav.Link href="/alumni/manage/recruit/" className="mx-3 border-item">招募登陸</Nav.Link>
                        <Nav.Link href="/alumni/manage/pic/" className="mx-3 border-item">官網照片管理</Nav.Link>
                        <NavDropdown title="帳號相關" id="basic-nav-dropdown" className='mr-auto border-item'>
                            <NavDropdown.Item href="/login">登出</NavDropdown.Item>
                            <NavDropdown.Item href="/Manager/User">使用說明</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </Container>

    );
}

export default ManagerNav;