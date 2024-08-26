// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from 'pages/User/HomePage';
import Footer from 'components/User/UserFooter';
import UserNav from 'components/User/UserNav';
import Login from 'pages/User/LoginPage';
import NotFoundPage from 'pages/NotFoundPage';

// import About from 'pages/User/AboutPage';
// import Contact from 'pages/User/ContactPage';
import Search from 'pages/User/SearchPage';

function App() {
  return (
    <>
    <UserNav></UserNav>
    
    <Router>
      <Routes>
        {/* 使用者端意指官網的部分 */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/news" element={<News />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/alumni/:memberId"></Route>

        {/* 管理者端 */}
        
        {/* 404 */}
        <Route path='*' element={<NotFoundPage />}></Route>

      </Routes>
    </Router>

    <Footer></Footer>
    </>
  );
}

export default App;
