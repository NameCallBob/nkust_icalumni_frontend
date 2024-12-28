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
import PhotoManagementPage from 'pages/Manager/PicManaPage';
import CompanyForm from 'pages/Manager/CompanyManaPage';
import OtherManage from 'pages/Manager/OtherManagePage';
import ArticleEditor from 'pages/Manager/Article/ArticleManaPage';
import ArticleForm from 'pages/Manager/Article/ArticleFormPage';
import EventDetail from 'pages/User/ActivityPage';
import WebPicManager from 'pages/Manager/WebsiteManaPage';
import ContactUsPage from 'pages/User/ContactUsPage';
import InfoManager from 'pages/Manager/Alumni/InfoManaPage';
import RuleManaPage from 'pages/Manager/Alumni/RuleManaPage';
import JoinUsPage from 'pages/User/icalumni_Intro/JoinPage';
import StructurePage from 'pages/User/icalumni_Intro/strucPage';
import AlumniAssociationBylaws from 'pages/User/icalumni_Intro/RulePage';
import IntroPage from 'pages/User/icalumni_Intro/IntroPage';
import OutstandingAlumniPage from 'pages/Manager/OutstandingMemberManaPage';
import GoogleAnalyticsWrapper from 'GA';
import PosterModal from 'components/User/Home/PosterModal';
import ProductManagement from 'pages/Manager/ProductListManaPage';

function App() {
  return (
    <>
      <Router>
      <GoogleAnalyticsWrapper>
      <PosterModal />

        <Routes>
        {/* 使用者端路由 */}
        {/* 首頁 */}
    <Route path="/" element={
      <>
        <UserNav />
        <Home />
      </>
    } />
  {/* 聯絡我們 */}
 <Route path="/IC/contactUs" element={
      <>
        <UserNav />
        <ContactUsPage />
      </>
    } />
      {/* 加入 */}
 <Route path="/IC/joinUs" element={
      <>
        <UserNav />
        <JoinUsPage></JoinUsPage>
      </>
    } />
      {/* 組織 */}
 <Route path="/IC/structure" element={
      <>
        <UserNav />
        <StructurePage></StructurePage>
      </>
    } />
      {/* 簡介*/}
 <Route path="/IC/intro" element={
      <>
        <UserNav />
        <IntroPage></IntroPage>
      </>
    } />
          {/* 章程 */}
 <Route path="/IC/constitution" element={
      <>
        <UserNav />
        <AlumniAssociationBylaws></AlumniAssociationBylaws>
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

    {/* 忘記密碼 */}
    <Route path="/forgot" element={
      <>
        <UserNav />
        <ForgotPasswordFlow />
      </>
    } />

    {/* 活動頁面 */}
    <Route path="/activity/:id" element={
      <>
        <UserNav />
        <EventDetail />
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
        <ProductManagement />
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
    {/* 系友會資料相關 */}
    {/* 其他管理 */}
    <Route path="/alumni/manage/info/" element={
      <>
        <ManagerNav />
        <InfoManager></InfoManager>
      </>
    } />
    {/* 其他管理 */}
    <Route path="/alumni/manage/structure/" element={
      <>
        <ManagerNav />
        <OtherManage></OtherManage>
      </>
    } />
    {/* 其他管理 */}
    <Route path="/alumni/manage/requirement/" element={
      <>
        <ManagerNav />
        <OtherManage></OtherManage>
      </>
    } />
    {/* 其他管理 */}
    <Route path="/alumni/manage/constitutions/" element={
      <>
        <ManagerNav />
        <RuleManaPage></RuleManaPage>
      </>
    } />
    {/*  */}
        <Route path="/alumni/manage/website/" element={
      <>
        <ManagerNav />
        <WebPicManager></WebPicManager>
      </>
    } />
    {/* 傑出系友 */}
    <Route path="/alumni/manage/outstanding/" element={
      <>
        <ManagerNav />
        <OutstandingAlumniPage></OutstandingAlumniPage>
      </>
    } />
    {/* 文章管理 */}
    <Route path="/alumni/manage/article/" element={
      <>
        <ManagerNav />
        <ArticleEditor></ArticleEditor>
      </>
    } />
    {/* 文章管理_新增 */}
        <Route path="/alumni/manage/article/new/" element={
      <>
        <ManagerNav />
        <ArticleForm />
      </>
    } />
    {/* 文章管理_編輯 */}
    <Route path="/alumni/manage/article/edit/:id" element={
      <>
        <ManagerNav />
        <ArticleForm />
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
        </GoogleAnalyticsWrapper>
      </Router>

      <Footer />
    </>
  );
}

export default App;
