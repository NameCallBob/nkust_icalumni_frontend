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
        <Route path="/login" element={
          <>
          <UserNav />
          <Login />
          </>          } />
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
        <Route path="/product/:id" element={
          <>
          <UserNav />
          <ProductPage />
          </>          } />
        
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
