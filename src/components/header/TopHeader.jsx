import { FaSearch, FaMoon, FaSun, FaHeart, FaGlobe } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../img/logo.png";
import "./header.css";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { LanguageContext } from "../context/LanguageContext";

export default function TopHeader() {
  const { CartItem } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { language, toggleLanguage, t } = useContext(LanguageContext) || {};
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <div className="top_header">
      <div className="container">
        <Link to="/" className="logo w-[160px]">
          <img src={logo} alt="logo" />
        </Link>
        <form onSubmit={handleSearch} className="search_box">
          <input
            type="text"
            placeholder={t?.('searchPlaceholder') || "Search products..."}
            id="search"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-white" />
          </button>
        </form>
        <div className="header items-center">
          {/* Language Switcher AR/EN */}
          <button
            type="button"
            className="lang_toggle_btn"
            onClick={toggleLanguage}
            title="Switch Language / تغيير اللغة"
          >
            <FaGlobe />
            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <div className="icon flex items-center justify-center theme_toggle_icon" onClick={() => setIsDarkMode(!isDarkMode)} title="Toggle Theme">
            {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
          </div>

          <div className="icon heart_icon_top">
            <Link to="/wishlist" title={t?.('wishlist') || "Wishlist"}>
              <FaHeart className="heart_red_svg" />
              <span className="count">{wishlistItems.length}</span>
            </Link>
          </div>

          <div className="icon cart_icon_top">
            <Link to="/cart" title={t?.('cart') || "Cart"}>
              <IoMdCart />
              <span className="count">{CartItem.length}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}