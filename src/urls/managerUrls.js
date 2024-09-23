// ManagerRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ManagerNav from 'components/Manage/ManagerNav.js';
import MemberCenter from 'pages/Manager/ManagerMainPage';
import MemberManagement from 'pages/Manager/UserManagePage';
import RecruitManaPage from 'pages/Manager/RecruitManaPage';
import ProductList from 'pages/Manager/ProductListManaPage';

const ManagerRoutes = () => (
  <Routes>
    {/* 管理者首頁 */}
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
  </Routes>
);

export default ManagerRoutes;
