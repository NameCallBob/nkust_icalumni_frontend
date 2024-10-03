// App.js
import React from 'react';
import { BrowserRouter as Router, Routes ,Route} from 'react-router-dom';
import Footer from 'components/User/UserFooter';
import "./App.css"
// 使用端頁面
import UserNav from 'components/User/UserNav';
import Home from 'pages/User/HomePage';
import Login from 'pages/User/LoginPage';
import Search from 'pages/User/SearchPage';
import CompanyIntro from 'pages/User/CompanyDetailPage';
import ProductPage from 'pages/User/ProductPage';
import AlumniDetailPage from 'pages/User/AlumniIntroPage';
import AlumniListPage from 'pages/User/AlumniListPage';
import RecruitPage from 'pages/User/RecruitPage';
import ForgotPasswordFlow from 'pages/User/func_forgot/ForgotStep';
import NotFoundPage from 'pages/NotFoundPage';

// 管理端頁面
import ManagerNav from 'components/Manage/ManagerNav.js';
import MemberCenter from 'pages/Manager/ManagerMainPage';
import MemberManagement from 'pages/Manager/UserManagePage';
import RecruitManaPage from 'pages/Manager/RecruitManaPage';
import ProductList from 'pages/Manager/ProductListManaPage';
import PhotoManagementPage from 'pages/Manager/PicManaPage';
import CompanyForm from 'pages/Manager/CompanyManaPage';
import OtherManage from 'pages/Manager/OtherManagePage';
import ArticleEditor from 'pages/Manager/ArticleManaPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
        {/* 使用者端路由 */}
        {/* 首頁 */}
    <Route path="/" element={
      <>
        <UserNav />
        <Home />
      </>
    } />

    {/* 登入頁面 */}
    <Route path="/login" element={
      <>
        <UserNav />
        <Login />
      </>
    } />

    {/* 搜索頁面 */}
    <Route path="/search" element={
      <>
        <UserNav />
        <Search />
      </>
    } />

    {/* 公司介紹頁面 */}
    <Route path="/company/:id" element={
      <>
        <UserNav />
        <CompanyIntro />
      </>
    } />

    {/* 產品頁面 */}
    <Route path="/product" element={
      <>
        <UserNav />
        <ProductPage />
      </>
    } />

    {/* 校友詳細頁面 */}
    <Route path="/alumni/:id" element={
      <>
        <UserNav />
        <AlumniDetailPage />
      </>
    } />

    {/* 校友列表頁面 */}
    <Route path="/alumnilist" element={
      <>
        <UserNav />
        <AlumniListPage />
      </>
    } />

    {/* 招聘頁面 */}
    <Route path="/recruit" element={
      <>
        <UserNav />
        <RecruitPage />
      </>
    } />

    {/* 忘記密碼流程 */}
    <Route path="/forgot-password" element={
      <>
        <UserNav />
        <ForgotPasswordFlow />
      </>
    } />
        {/* 管理者端路由 */}
        <Route path="/alumni/manage/" element={
      <>
        <ManagerNav />
        <MemberCenter />
      </>
    } />

    {/* 會員管理 */}
    <Route path="/alumni/manage/member/" element={
      <>
        <ManagerNav />
        <MemberManagement />
      </>
    } />
    {/* 自身公司管理 */}
    <Route path="/alumni/manage/company/" element={
      <>
        <ManagerNav />
        <CompanyForm />
      </>
    } />
    {/* 招聘管理 */}
    <Route path="/alumni/manage/recruit/" element={
      <>
        <ManagerNav />
        <RecruitManaPage />
      </>
    } />

    {/* 產品列表管理 */}
    <Route path="/alumni/manage/product/" element={
      <>
        <ManagerNav />
        <ProductList />
      </>
    } />
    {/* 照片管理 */}
    <Route path="/alumni/manage/pic/" element={
      <>
        <ManagerNav />
        <PhotoManagementPage />
      </>
    } />
    {/* 其他管理 */}
    <Route path="/alumni/manage/other/" element={
      <>
        <ManagerNav />
        <OtherManage></OtherManage>
      </>
    } />
    {/* 文章管理 */}
    <Route path="/alumni/manage/article/" element={
      <>
        <ManagerNav />
        <ArticleEditor></ArticleEditor>
      </>
    } />
        {/*　其他　- 404 頁面 */}
        <Route path="*" element={
          <>
            <UserNav />
            <NotFoundPage />
          </>
        } />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
