import React, { useContext } from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useContext(LanguageContext) || {};

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section about">
            <h2 className="footer-logo">
              <span className="logo_name">MAHMOUD</span>
              <span className="logo_store"> STORE</span>
            </h2>
            <p className="footer-desc">
              {t?.('footerDesc') || "We provide the best products with high quality and competitive prices. Shop with us now!"}
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook" title="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram" title="Instagram">
                <FaInstagram />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-icon tiktok" title="TikTok">
                <FaTiktok />
              </a>
              <a href="https://wa.me/201280658002" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp" title="WhatsApp">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section links">
            <h3>{t?.('quickLinksTitle') || "Quick Links"}</h3>
            <ul>
              <li><Link to="/">{t?.('home') || "Home"}</Link></li>
              <li><Link to="/search">{t?.('searchPlaceholder') ? t('searchPlaceholder').split('...')[0] : "Products"}</Link></li>
              <li><Link to="/about">{t?.('about') || "About Us"}</Link></li>
              <li><Link to="/contact">{t?.('contact') || "Contact Us"}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section links">
            <h3>{t?.('supportTitle') || "Technical Support"}</h3>
            <ul>
              <li><Link to="/about">{t?.('privacy') || "Privacy Policy"}</Link></li>
              <li><Link to="/about">{t?.('terms') || "Terms & Conditions"}</Link></li>
              <li><Link to="/contact">{t?.('faq') || "FAQ"}</Link></li>
              <li><Link to="/contact">{t?.('returns') || "Return Policy"}</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section contact">
            <h3>{t?.('contactTitle') || "Contact Us"}</h3>
            <div className="contact-item">
              <FaPhoneAlt className="contact-icon" />
              <div className="contact-text">
                <p>{t?.('phoneText') || "Call us:"}</p>
                <a href="https://wa.me/201280658002" target="_blank" rel="noopener noreferrer">01280658002</a>
              </div>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <div className="contact-text">
                <p>{t?.('emailText') || "Email:"}</p>
                <a href="mailto:mahmod48873@gmail.com">mahmod48873@gmail.com</a>
              </div>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div className="contact-text">
                <p>{t?.('address') || "Address:"}</p>
                <span>{t?.('cairo') || "Cairo, Egypt"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} {t?.('allRights') || "All rights reserved for"} <strong className="footer_brand_name">MAHMOUD STORE</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
