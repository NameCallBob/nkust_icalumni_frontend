// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from 'components/User/UserFooter';
import UserRoutes from 'urls/UserRoutes';
import ManagerRoutes from 'urls/ManagerRoutes';

function App() {
  return (
    <>
      <Router>
        {/* 使用者端路由 */}
        <UserRoutes />
        {/* 管理者端路由 */}
        <ManagerRoutes />
      </Router>
      <Footer />
    </>
  );
}

export default App;
