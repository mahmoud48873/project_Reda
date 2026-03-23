import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section about">
            <h2 className="footer-logo">MAHMOUD<span>STORE</span></h2>
            <p className="footer-desc">
              نحن نقدم أفضل المنتجات بجودة عالية وأسعار تنافسية. تسوق معنا الآن واستمتع بتجربة فريدة.
            </p>
            <div className="social-links">
              <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                <FaFacebookF />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                <FaInstagram />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon tiktok">
                <FaTiktok />
              </a>
              <a href="https://wa.me/201280658002" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section links">
            <h3>روابط سريعة</h3>
            <ul>
              <li><Link to="/">الرئيسية</Link></li>
              <li><Link to="/products">المنتجات</Link></li>
              <li><Link to="/about">من نحن</Link></li>
              <li><Link to="/contact">اتصل بنا</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section links">
            <h3>الدعم الفني</h3>
            <ul>
              <li><a href="#">سياسة الخصوصية</a></li>
              <li><a href="#">الشروط والأحكام</a></li>
              <li><a href="#">الأسئلة الشائعة</a></li>
              <li><a href="#">سياسة الإسترجاع</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section contact">
            <h3>تواصل معنا</h3>
            <div className="contact-item">
              <FaPhoneAlt className="contact-icon" />
              <div className="contact-text">
                <p>اتصل بنا:</p>
                <a href="tel:01280658002">01280658002</a>
              </div>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <div className="contact-text">
                <p>البريد الإلكتروني:</p>
                <a href="mailto:mahmod48873@gmail.com">mahmod48873@gmail.com</a>
              </div>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div className="contact-text">
                <p>العنوان:</p>
                <span>القاهرة، مصر</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} جميع الحقوق محفوظة لـ <span>MAHMOUD STORE</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
