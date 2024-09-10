import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import logo from 'assets/ICbaby.png'; // 請替換為你的 logo 圖片路徑
import Axios from 'common/Axios'
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
                <Navbar.Brand href="/" className="d-flex align-items-center mx-5">
                    <img
                        src={logo}
                        width="50"
                        height="60"
                        className="d-inline-block align-top"
                        alt="My Brand Logo"
                    />
                    &nbsp; 高科大智慧商務系｜系友會
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end' >
                    <Nav className="ml-auto">
                        <Nav.Link href="/alumni/manage/member/" className="mx-3">使用者管理</Nav.Link>
                        <Nav.Link href="/search" className="mx-3">公司登陸</Nav.Link>
                        <Nav.Link href="/alumni/manage/ProductManage/" className="mx-3">商品登陸</Nav.Link>
                        <Nav.Link href="/Recruitment" className="mx-3">推廣設定</Nav.Link>
                        <Nav.Link href="/alumni/manage/RecruitManage/" className="mx-3">招募登陸</Nav.Link>
                        <NavDropdown title="系友專區" id="basic-nav-dropdown" className='mr-auto'>
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