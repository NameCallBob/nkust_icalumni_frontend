// UserRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

const UserRoutes = () => (
  <Routes>
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
    <Route path="/alumni" element={
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

    {/* 404 頁面 */}
    <Route path="*" element={
      <>
        <UserNav />
        <NotFoundPage />
      </>
    } />
  </Routes>
);

export default UserRoutes;
