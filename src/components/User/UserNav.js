import React from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container } from 'react-bootstrap';
import logo from 'assets/logo.png'; // 請替換為你的 logo 圖片路徑
import "css/Navlogo.css"

/**
 * 使用者端的導覽列設計
 * @returns html
 */
function UserNav() {
    return (
<Container fluid>
    <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/" className="d-flex align-items-center mx-3">
            <img
                src={logo}
                className="d-inline-block align-top logo-img"
                alt="智商系友會LOGO"
            />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="ml-auto align-items-center">
                <NavDropdown title="　系友會介紹　" id="basic-nav-dropdown" className="mx-3 border-item">
                    <NavDropdown.Item href="/IC/intro">簡介</NavDropdown.Item>
                    <NavDropdown.Item href="/IC/rule">章程</NavDropdown.Item>
                    <NavDropdown.Item href="/IC/member">組織</NavDropdown.Item>
                    <NavDropdown.Item href="/IC/joinUs">入會方式</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/alumniList" className="mx-3 border-item">　系友們　</Nav.Link>
                <Nav.Link href="/search" className="mx-3 border-item">　公司查詢　</Nav.Link>
                <Nav.Link href="/Recruitment" className="mx-3 border-item">　徵才啟示　</Nav.Link>
                <NavDropdown title="　系友專區　" id="basic-nav-dropdown" className="mx-3 border-item">
                    <NavDropdown.Item href="/login">登入</NavDropdown.Item>
                    <NavDropdown.Item href="/User">使用說明</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
</Container>    );
}

export default UserNav;