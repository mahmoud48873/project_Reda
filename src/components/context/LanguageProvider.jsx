import { useState, useEffect } from 'react';
import { LanguageContext } from './LanguageContext';

const translations = {
  en: {
    home: "Home",
    about: "About",
    accessories: "Accessories",
    blog: "Blog",
    contact: "Contact",
    browseCategory: "Browse Category",
    searchPlaceholder: "Search products...",
    signIn: "Sign In",
    signUp: "Create Account",
    logout: "Logout",
    dashboard: "Dashboard",
    account: "Account",
    quickFilters: "Quick Filters",
    maxPriceLimit: "Max Price Limit",
    productCategory: "Product Category",
    allCategories: "All Categories",
    applyFilters: "Apply Filters",
    mainPages: "Main Pages",
    wishlist: "Wishlist",
    cart: "Cart",
    compare: "Compare",
    welcome: "Welcome",
    navigation: "Navigation & Account",
    footerDesc: "We provide the best products with high quality and competitive prices. Shop with us now!",
    allRights: "All rights reserved for",
    quickLinksTitle: "Quick Links",
    supportTitle: "Technical Support",
    contactTitle: "Contact Us",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    faq: "FAQ",
    returns: "Return Policy",
    address: "Address",
    cairo: "Cairo, Egypt",
    emailText: "Email:",
    phoneText: "Call us:"
  },
  ar: {
    home: "الرئيسية",
    about: "من نحن",
    accessories: "إكسسوارات",
    blog: "المدونة",
    contact: "اتصل بنا",
    browseCategory: "تصفح الأقسام",
    searchPlaceholder: "ابحث عن المنتجات...",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    logout: "تسجيل الخروج",
    dashboard: "لوحة التحكم",
    account: "الحساب الشخصي",
    quickFilters: "فلاتر سريعة",
    maxPriceLimit: "الحد الأقصى للسعر",
    productCategory: "قسم المنتج",
    allCategories: "جميع الأقسام",
    applyFilters: "تطبيق الفلاتر",
    mainPages: "الصفحات الرئيسية",
    wishlist: "المفضلة",
    cart: "السلة",
    compare: "المقارنة",
    welcome: "مرحباً بك",
    navigation: "التنقل والحساب",
    footerDesc: "نحن نقدم أفضل المنتجات بجودة عالية وأسعار تنافسية. تسوق معنا الآن واستمتع بتجربة فريدة.",
    allRights: "جميع الحقوق محفوظة لـ",
    quickLinksTitle: "روابط سريعة",
    supportTitle: "الدعم الفني",
    contactTitle: "تواصل معنا",
    privacy: "سياسة الخصوصية",
    terms: "الشروط والأحكام",
    faq: "الأسئلة الشائعة",
    returns: "سياسة الإسترجاع",
    address: "العنوان:",
    cairo: "القاهرة، مصر",
    emailText: "البريد الإلكتروني:",
    phoneText: "اتصل بنا:"
  }
};

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('site_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('site_lang', language);
    document.documentElement.lang = language;
    if (language === 'ar') {
      document.body.classList.add('rtl_mode');
    } else {
      document.body.classList.remove('rtl_mode');
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
