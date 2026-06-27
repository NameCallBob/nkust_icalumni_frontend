// App.js - 優化版本，使用 React.lazy() 進行代碼分割
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PageLoading } from 'components/common/LoadingComponent';
import ErrorBoundary from 'components/common/ErrorBoundary';
import PageLoader from 'components/common/PageLoader';
import Footer from 'components/User/UserFooter';
import GoogleAnalyticsWrapper from 'GA';
import PosterModal from 'components/User/Home/PosterModal';
import "./App.css"

// 核心導航組件 - 立即載入
import UserNav from 'components/User/UserNav';
import ManagerNav from 'components/Manage/ManagerNav.js';

// 使用 React.lazy() 進行代碼分割 - 使用者端頁面
const Home = React.lazy(() => import('pages/User/HomePage'));
const Login = React.lazy(() => import('pages/User/LoginPage'));
const Search = React.lazy(() => import('pages/User/SearchPage'));
const AlumniDetailPage = React.lazy(() => import('pages/User/AlumniIntroPage'));
const AlumniListPage = React.lazy(() => import('pages/User/AlumniListPage'));
const RecruitPage = React.lazy(() => import('pages/User/RecruitPage'));
const ForgotPasswordFlow = React.lazy(() => import('pages/User/func_forgot/ForgotStep'));
const NotFoundPage = React.lazy(() => import('pages/NotFoundPage'));
const TermsAndConditionsPage = React.lazy(() => import('pages/User/TermsPage'));
const EventDetail = React.lazy(() => import('pages/User/ActivityPage'));
const ContactUsPage = React.lazy(() => import('pages/User/ContactUsPage'));

// 使用者端介紹頁面
const JoinUsPage = React.lazy(() => import('pages/User/icalumni_Intro/JoinPage'));
const StructurePage = React.lazy(() => import('pages/User/icalumni_Intro/strucPage'));
const AlumniAssociationBylaws = React.lazy(() => import('pages/User/icalumni_Intro/RulePage'));
const IntroPage = React.lazy(() => import('pages/User/icalumni_Intro/IntroPage'));

// 管理端頁面 - 按功能分組
const MemberCenter = React.lazy(() => import('pages/Manager/ManagerMainPage'));
const MemberManagement = React.lazy(() => import('pages/Manager/UserManagePage'));
const RecruitManaPage = React.lazy(() => import('pages/Manager/RecruitManaPage'));
const PhotoManagementPage = React.lazy(() => import('pages/Manager/PicManaPage'));
const CompanyForm = React.lazy(() => import('pages/Manager/CompanyManaPage'));
const OtherManage = React.lazy(() => import('pages/Manager/OtherManagePage'));
const WebPicManager = React.lazy(() => import('pages/Manager/WebsiteManaPage'));
const InfoManager = React.lazy(() => import('pages/Manager/Alumni/InfoManaPage'));
const RuleManaPage = React.lazy(() => import('pages/Manager/Alumni/RuleManaPage'));
const OutstandingAlumniPage = React.lazy(() => import('pages/Manager/OutstandingMemberManaPage'));
const OutstandingAlumniManaPage = React.lazy(() => import('pages/Manager/OutstandingAlumniManaPage'));
const ProductManagement = React.lazy(() => import('pages/Manager/ProductListManaPage'));
const AllRecruitManaPage = React.lazy(() => import('pages/Manager/AllRecruitManaPage'));

// 文章管理模組
const ArticleEditor = React.lazy(() => import('pages/Manager/Article/ArticleManaPage'));
const ArticleForm = React.lazy(() => import('pages/Manager/Article/ArticleFormPage'));

// SEO 優化頁面
const SmartBusinessLanding = React.lazy(() => import('pages/SEO/SmartBusinessLanding'));
const ICDepartmentLanding = React.lazy(() => import('pages/SEO/ICDepartmentLanding'));
const NKUSTICLanding = React.lazy(() => import('pages/SEO/NKUSTICLanding'));
const AboutDepartment = React.lazy(() => import('pages/SEO/AboutDepartment'));
const CareerProspects = React.lazy(() => import('pages/SEO/CareerProspects'));
const RWDTableDemo = React.lazy(() => import('pages/RWDTableDemo'));

function App() {
  return (
    <ErrorBoundary>
      <PageLoader />
      <Router>
        <GoogleAnalyticsWrapper>
          <PosterModal />
          <Suspense fallback={<PageLoading />}>
            <Routes>
              {/* 開發展示頁面 */}
              <Route path="/dev/rwd-table-demo" element={
                <>
                  <UserNav />
                  <RWDTableDemo />
                </>
              } />
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
    {/* 條款頁面 */}
    <Route path="/website/terms/" element={
      <>
        <UserNav />
        <TermsAndConditionsPage />
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

    {/* SEO 優化頁面路由 */}
    {/* 智慧商務系專頁 */}
    <Route path="/smart-business-department" element={
      <>
        <UserNav />
        <SmartBusinessLanding />
      </>
    } />

    {/* 智商系專頁 */}
    <Route path="/ic-department" element={
      <>
        <UserNav />
        <ICDepartmentLanding />
      </>
    } />

    {/* NKUST智慧商務系專頁 */}
    <Route path="/nkust-ic" element={
      <>
        <UserNav />
        <NKUSTICLanding />
      </>
    } />

    {/* 系所介紹專頁 */}
    <Route path="/about-department" element={
      <>
        <UserNav />
        <AboutDepartment />
      </>
    } />

    {/* 就業前景專頁 */}
    <Route path="/career-prospects" element={
      <>
        <UserNav />
        <CareerProspects />
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
    {/* 傑出校友 */}
    <Route path="/alumni/manage/outstanding-alumni/" element={
      <>
        <ManagerNav />
        <OutstandingAlumniManaPage></OutstandingAlumniManaPage>
      </>
    } />
        {/* 招募總管理 */}
        <Route path="/alumni/manage/recruit/all/" element={
      <>
        <ManagerNav />
        <AllRecruitManaPage></AllRecruitManaPage>
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
          </Suspense>
        </GoogleAnalyticsWrapper>
      </Router>

      <Footer />
    </ErrorBoundary>
  );
}

export default App;
