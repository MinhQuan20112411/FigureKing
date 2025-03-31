// src/components/Footer.js
import React from 'react';
import './Footer.css'; // Nhập CSS cho footer
import logo from '../assets/logo.png'; // Đường dẫn đến logo

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-brand">
      <img src={logo} alt="FigureKing Logo" className="footer-logo" /> {/* Hiển thị logo */}
      </div>
      <div className="footer-content">
      <div className="footer-slogan">
          <h3>Khám phá mô hình đẹp vãi tại FigureKing!</h3> {/* Câu slogan */}
        </div>
        <div className="footer-contact">
          <h3>Liên hệ</h3>
          <p><strong>Service Hotline tư vấn & mua hàng: </strong>0000000000</p>
          <p><strong>Góp ý & Khiếu nại:</strong> 0123456789 - 0912348767</p>
          <p><strong>Email: </strong>figureking@gmail.com</p>
          <p><strong>Địa chỉ:</strong> 18A/1 Cộng Hòa, P.4, Q. Tân Bình, TP.HCM, VN.</p>
        </div>
      </div>
      <p className="footer-rights">&copy; {new Date().getFullYear()} FigureKing.</p>
    </footer>
  );
};

export default Footer;
