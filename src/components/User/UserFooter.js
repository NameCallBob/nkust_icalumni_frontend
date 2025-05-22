import React from "react";
import "css/Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="modern-footer">
      <div className="footer-wave">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>
      
      <div className="footer-content">
        <div className="footer-branding">
          <div className="university-logo">NKUST</div>
          <div className="department">智慧商務系 系友會</div>
        </div>
        
        <div className="footer-info">
          <div className="info-block">
            <div className="info-title">聯絡我們</div>
            <div className="info-content">
              <div className="info-item"><i className="bi bi-geo-alt"></i> 807高雄市三民區建工路415號</div>
              <div className="info-item"><i className="bi bi-telephone"></i> 07-3814526 轉 17501</div>
              <div className="info-item"><i className="bi bi-envelope"></i> icdaa2019@nkust.edu.tw</div>
            </div>
          </div>
          
          <div className="info-block">
            <div className="info-title">官方網站</div>
            <div className="info-content links-list">
              <a href="https://www.nkust.edu.tw/" className="link-item">
                <span>國立高雄科技大學</span>
              </a>
              <a href="https://ic.nkust.edu.tw/" className="link-item">
                <span>智慧商務系</span>
              </a>
              <a href="https://bis.nkust.edu.tw/index.php" className="link-item">
                <span>商業智慧學院</span>
              </a>
            </div>
          </div>
          
          <div className="info-block">
            <div className="info-title">關注我們</div>
            <div className="social-icons">
              <a href="https://www.facebook.com/ic.nkust/?locale=zh_TW" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://line.me/R/ti/p/@261cygls" aria-label="Line">
                <i className="bi bi-line"></i>
              </a>
              <a href="https://www.instagram.com/ic.nkust/" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="mailto:icdaa2019@nkust.edu.tw" aria-label="Email">
                <i className="bi bi-envelope"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="copyright">Copyright © {year} 國立高雄科技大學 智慧商務系 系友會</div>
        <a href="/website/terms/" className="terms-link">網站使用條款</a>
      </div>
    </footer>
  );
};

export default Footer;