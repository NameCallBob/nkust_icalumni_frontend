// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from 'pages/User/HomePage';
import Footer from 'components/User/UserFooter';
import UserNav from 'components/User/UserNav';
import MemberCenter from 'pages/Manager/ManagerMainPage';
import ManagerNav from 'components/Manage/ManagerNav.js'
import Login from 'pages/User/LoginPage';
import NotFoundPage from 'pages/NotFoundPage';
import MemberManagement from 'pages/Manager/UserManagePage';

// import About from 'pages/User/AboutPage';
// import Contact from 'pages/User/ContactPage';
import Search from 'pages/User/SearchPage';
import CompanyIntro from './pages/User/CompanyDetailPage';
import ProductPage from 'pages/User/ProductPage';
import AlumniDetailPage from 'pages/User/AlumniIntroPage';
import AlumniListPage from 'pages/User/AlumniListPage';
import RecruitPage from 'pages/User/RecruitPage';
import ForgotPasswordFlow from 'pages/User/func_forgot/ForgotStep';
import RecruitManaPage from 'pages/Manager/RecruitManaPage';
import ProductList from 'pages/Manager/ProductListManaPage';

function App() {
  return (
    <>
    <Router>
      <Routes>
        {/* 使用者端意指官網的部分 */}
        <Route path="/" element={
            <>
            <UserNav />
            <Home />
            </>
            } />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/news" element={<News />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
        {/* 查詢 */}
        <Route path="/search" element={
          <>
          <UserNav />
          <Search />
          </>
          } />
          <Route path="/search/company/:id" element={
          <>
          <UserNav />
          <CompanyIntro />
          </>
          } />
          {/* 登入 */}
        <Route path="/login" element={
          <>
          <UserNav />
          <Login />
          </>          } />
          {/* 忘記密碼 */}
          <Route path="/forgot" element={
          <>
          <UserNav />
          <ForgotPasswordFlow />
          </>          } />
          {/* 系友 */}
        <Route path="/alumni/:memberId" element={
          <>
          <UserNav />
          <AlumniDetailPage/>
          </>
        }></Route>
        <Route path="/alumniList" element={
          <>
          <UserNav />
          <AlumniListPage/>
          </>
        }></Route>
        {/* 產品 */}
        <Route path="/product/:id" element={
          <>
          <UserNav />
          <ProductPage />
          </>          } />
          {/* 招募 */}
        <Route path="/Recruitment" element={
          <>
          <UserNav />
          <RecruitPage/>
          </>
        }></Route>


        {/* 管理者端 */}
        <Route path='/alumni/manage/' element={
          <>
          <ManagerNav />
          <MemberCenter />
          </>
        }>
        </Route>
        <Route path='/alumni/manage/member/' element={
          <>
          <ManagerNav />
          <MemberManagement />
          </>
        }>
        </Route>

        <Route path='/alumni/manage/Recruit/' element={
          <>
          <ManagerNav />
          <RecruitManaPage />
          </>
        }></Route>
          <Route path='/alumni/manage/ProductManage/' element={
          <>
          <ManagerNav />
          <ProductList />
          </>
        }></Route>
        {/* <Route path='/alumni/manage/' element={
          <>
          <ManagerNav />
          <MemberCenter />
          </>
        }> */}
        {/* </Route> */}
        {/* 404 */}
        <Route path='*' element={
          <>
          <UserNav />
          <NotFoundPage />
          </>
          }></Route>

      </Routes>
    </Router>

    <Footer></Footer>
    </>
  );
}

export default App;
