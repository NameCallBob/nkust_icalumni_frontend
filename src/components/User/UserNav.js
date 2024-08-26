import React from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container } from 'react-bootstrap';
import logo from 'assets/ICbaby.png'; // 請替換為你的 logo 圖片路徑


/**
 * 使用者端的導覽列設計
 * @returns html
 */
function UserNav() {

    // 串接邏輯
    
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
                        <NavDropdown title="系友會介紹" id="basic-nav-dropdown" className='mr-auto'>
                            <NavDropdown.Item href="/IC/intro">簡介</NavDropdown.Item>
                            <NavDropdown.Item href="/IC/rule">章程</NavDropdown.Item>
                            <NavDropdown.Item href="/IC/member">組織</NavDropdown.Item>
                            <NavDropdown.Item href="/IC/joinUs">入會方式</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/alumni" className="mx-3">系友們</Nav.Link>
                        <Nav.Link href="/search" className="mx-3">公司查詢</Nav.Link>
                        <Nav.Link href="/Recruitment" className="mx-3">徵才啟示</Nav.Link>
                        <NavDropdown title="系友專區" id="basic-nav-dropdown" className='mr-auto'>
                            <NavDropdown.Item href="/login">登入</NavDropdown.Item>
                            <NavDropdown.Item href="/User">使用說明</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </Container>

    );
}

export default UserNav;