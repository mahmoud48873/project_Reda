// Developer: Mahmoud Sameh Fathy Ibrahim
// Student Code: 624018

import { useState, useEffect, useContext, useRef } from "react";
import { IoMdMenu, IoIosArrowDown } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoSignIn } from "react-icons/go";
import { LuUserRoundPlus } from "react-icons/lu";
import { FaUser, FaSignOutAlt, FaTachometerAlt, FaTimes, FaFilter, FaHome, FaInfoCircle, FaLaptop, FaNewspaper, FaEnvelope, FaSearch, FaGlobe, FaPlusCircle, FaUserShield } from "react-icons/fa";
import "./header.css";
import { UserContext } from "../context/UserContext";
import { ToastContext } from "../context/ToastContext";
import { LanguageContext } from "../context/LanguageContext";

export default function BtmHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Sidebar filter states
  const [sidebarMaxPrice, setSidebarMaxPrice] = useState(1500);
  const [sidebarCategory, setSidebarCategory] = useState("");

  const { user, logout } = useContext(UserContext);
  const { showToast } = useContext(ToastContext);
  const { language, toggleLanguage, t } = useContext(LanguageContext) || {};
  const userMenuRef = useRef(null);

  // Check if current logged-in user is Admin
  const isAdmin = user && (user.email?.toLowerCase() === 'mahmod48873@gmail.com' || user.role === 'admin');

  const NavLinks = [
    { title: t?.('home') || "Home", link: "/", icon: <FaHome /> },
    { title: t?.('about') || "About", link: "/about", icon: <FaInfoCircle /> },
    { title: t?.('accessories') || "Accessories", link: "/accessories", icon: <FaLaptop /> },
    { title: t?.('blog') || "Blog", link: "/blog", icon: <FaNewspaper /> },
    { title: t?.('contact') || "Contact", link: "/contact", icon: <FaEnvelope /> },
  ];

  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategory(data));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImgError = (e, name) => {
    e.target.onerror = null;
    const initial = (name || 'U').trim().charAt(0).toUpperCase() || 'U';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <rect width="128" height="128" fill="%230090f0" rx="64"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-size="60" font-weight="bold" font-family="sans-serif">${initial}</text>
    </svg>`;
    e.target.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const handleLogout = () => {
    logout();
    showToast(language === 'ar' ? 'تم تسجيل الخروج بنجاح 👋' : 'Logged out. See you soon! 👋', 'info');
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleApplySidebarFilter = (e) => {
    e.preventDefault();
    setIsSidebarOpen(false);
    if (sidebarCategory) {
      navigate(`/category/${sidebarCategory}`);
    } else {
      navigate(`/search?q=a`);
    }
    showToast(language === 'ar' ? `فلترة المنتجات حتى $${sidebarMaxPrice}` : `Filtering products up to $${sidebarMaxPrice}`, 'info');
  };

  return (
    <>
      <div className="btm_header bg-(--main-color) transition-colors duration-300">
        <div className="container flex items-center justify-between">
          <nav className="nav flex items-center gap-6 md:gap-8">
            <div className="category_nav relative">
              <div className="category_btm">
                <button
                  type="button"
                  className="hamburger_btn_icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSidebarOpen(true);
                  }}
                  title="Open Side Menu & Filters"
                >
                  <IoMdMenu />
                </button>

                <div
                  className="category_title_wrap cursor-pointer"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <p className="category_text_white">{t?.('browseCategory') || "Browse Category"}</p>
                  <IoIosArrowDown className={`category_arrow ${isCategoryOpen ? 'rotated' : ''}`} />
                </div>
              </div>

              {/* Category Dropdown List - Modern rounded-2xl & shadow-xl with smooth hover */}
              <div className={`category_nav_list rounded-2xl shadow-xl border border-gray-100 ${isCategoryOpen ? "active" : ""}`}>
                {category.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="hover:bg-blue-50 transition-colors px-4 py-3 text-sm font-medium"
                    onClick={() => setIsCategoryOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Nav Links - Hidden on mobile, Flex on md+ with gap-6 md:gap-8 & items-center */}
            <div className="nav_links hidden md:flex items-center gap-6 md:gap-8">
              {NavLinks.map((item, index) => (
                <span key={index} className={location.pathname === item.link ? "active" : ""}>
                  <Link to={item.link}>{item.title}</Link>
                </span>
              ))}
            </div>
          </nav>

          {/* User Sign / Profile */}
          <div className="header_sign flex items-center gap-3">
            
            {/* Direct Admin Dashboard Quick Icon Button for Admin */}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="admin_quick_btn"
                title="Admin Dashboard - إضافة منتجات جديدة"
              >
                <FaPlusCircle />
                <span>Admin Panel</span>
              </Link>
            )}

            {user ? (
              <div className="user_menu_wrap" ref={userMenuRef}>
                <div className="user_avatar_btn" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0090f0&color=fff&size=128&bold=true`} 
                    alt={user.name} 
                    className="user_avatar_img" 
                    onError={(e) => handleImgError(e, user.name)}
                  />
                  <span className="user_name_header">{user.name.split(' ')[0]}</span>
                  <IoIosArrowDown className={`user_arrow ${isUserMenuOpen ? 'rotated' : ''}`} />
                </div>
                {isUserMenuOpen && (
                  <div className="user_dropdown">
                    <div className="user_dropdown_info">
                      <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0090f0&color=fff&size=128&bold=true`} 
                        alt={user.name} 
                        onError={(e) => handleImgError(e, user.name)}
                      />
                      <div>
                        <strong>{user.name}</strong>
                        <p>{user.email}</p>
                      </div>
                    </div>
                    <hr />

                    {/* Admin Dashboard link inside User Dropdown for mahmod48873@gmail.com */}
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 border-b border-blue-100"
                      >
                        <FaUserShield className="text-blue-600" /> 
                        <span>Admin Dashboard (لوحة التحكم)</span>
                      </Link>
                    )}

                    <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)}>
                      <FaTachometerAlt /> {t?.('dashboard') || "Dashboard"}
                    </Link>
                    <button onClick={handleLogout}>
                      <FaSignOutAlt /> {t?.('logout') || "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" title={t?.('signIn') || "Sign In"}>
                  <GoSignIn className="text-white text-2xl" />
                </Link>
                <Link to="/signup" title={t?.('signUp') || "Sign Up"}>
                  <LuUserRoundPlus className="text-white text-2xl" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Off-canvas Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="sidebar_overlay" onClick={() => setIsSidebarOpen(false)}>
          <div className="sidebar_drawer" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar_header">
              <h3>{t?.('navigation') || "Navigation & Account"}</h3>
              <button className="sidebar_close_btn" onClick={() => setIsSidebarOpen(false)}>
                <FaTimes />
              </button>
            </div>

            {/* Account Auth Section */}
            <div className="sidebar_section sidebar_auth_section">
              <h4 className="sidebar_subtitle"><FaUser /> {t?.('account') || "Account"}</h4>
              {user ? (
                <div className="sidebar_user_card">
                  <div className="sidebar_user_info">
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0090f0&color=fff&size=128&bold=true`} 
                      alt={user.name} 
                      onError={(e) => handleImgError(e, user.name)}
                    />
                    <div>
                      <strong>{user.name}</strong>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  <div className="sidebar_auth_btns">
                    
                    {/* Admin Dashboard button in Sidebar Drawer */}
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="sidebar_auth_btn profile" 
                        onClick={() => setIsSidebarOpen(false)}
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#ffffff' }}
                      >
                        <FaUserShield /> Admin Dashboard (لوحة التحكم)
                      </Link>
                    )}

                    <Link to="/dashboard" className="sidebar_auth_btn profile" onClick={() => setIsSidebarOpen(false)}>
                      <FaTachometerAlt /> {t?.('dashboard') || "Dashboard"}
                    </Link>
                    <button className="sidebar_auth_btn logout" onClick={() => { handleLogout(); setIsSidebarOpen(false); }}>
                      <FaSignOutAlt /> {t?.('logout') || "Logout"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="sidebar_auth_btns">
                  <Link to="/login" className="sidebar_auth_btn login" onClick={() => setIsSidebarOpen(false)}>
                    <GoSignIn /> {t?.('signIn') || "Sign In (تسجيل الدخول)"}
                  </Link>
                  <Link to="/signup" className="sidebar_auth_btn signup" onClick={() => setIsSidebarOpen(false)}>
                    <LuUserRoundPlus /> {t?.('signUp') || "Create Account (إنشاء حساب)"}
                  </Link>
                </div>
              )}
            </div>

            {/* Language Switcher Button in Sidebar */}
            <div className="sidebar_section">
              <button className="sidebar_lang_btn" onClick={toggleLanguage}>
                <FaGlobe /> {language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
              </button>
            </div>

            {/* Navigation Links Section */}
            <div className="sidebar_section">
              <h4 className="sidebar_subtitle">{t?.('mainPages') || "Main Pages"}</h4>
              <ul className="sidebar_nav_list">
                {NavLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className={location.pathname === item.link ? "active" : ""}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span className="nav_icon_wrap">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Search & Filter Section */}
            <div className="sidebar_section filter_section">
              <h4 className="sidebar_subtitle"><FaFilter /> {t?.('quickFilters') || "Quick Filters"}</h4>
              <form onSubmit={handleApplySidebarFilter}>
                <div className="sidebar_filter_group">
                  <label>{t?.('maxPriceLimit') || "Max Price Limit"}: <strong>${sidebarMaxPrice}</strong></label>
                  <input
                    type="range"
                    min="10"
                    max="2000"
                    step="10"
                    value={sidebarMaxPrice}
                    onChange={(e) => setSidebarMaxPrice(Number(e.target.value))}
                    className="sidebar_price_slider"
                  />
                  <div className="price_range_labels">
                    <span>$10</span>
                    <span>$2000</span>
                  </div>
                </div>

                <div className="sidebar_filter_group">
                  <label>{t?.('productCategory') || "Product Category"}</label>
                  <select
                    value={sidebarCategory}
                    onChange={(e) => setSidebarCategory(e.target.value)}
                  >
                    <option value="">{t?.('allCategories') || "All Categories"}</option>
                    {category.map(cat => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="sidebar_filter_submit_btn">
                  <FaSearch /> {t?.('applyFilters') || "Apply Filters"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
