// Developer: Mahmoud Sameh Fathy Ibrahim
// Student Code: 624018

import React, { useContext, useState } from "react";
import { FaCheck, FaBalanceScale, FaCartPlus, FaShare, FaHeart, FaWhatsapp, FaFacebook, FaLink } from "react-icons/fa";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { IoMdStarHalf } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { CompareContext } from "../context/CompareContext";
import { ToastContext } from "../context/ToastContext";
import { LanguageContext } from "../context/LanguageContext";

function renderStars(rating = 5) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<IoStar key={i} />);
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(<IoMdStarHalf key={i} />);
    } else {
      stars.push(<IoStarOutline key={i} style={{ opacity: 0.4 }} />);
    }
  }
  return stars;
}

export default function Product({ item }) {
  const { CartItem, addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist } = useContext(WishlistContext);
  const { addToCompare, isInCompare } = useContext(CompareContext) || {};
  const { showToast } = useContext(ToastContext) || {};
  const { t } = useContext(LanguageContext) || {};
  const [showShare, setShowShare] = useState(false);

  const isAdded = CartItem.some((cartItem) => cartItem.id === item.id);
  const isWishlisted = wishlistItems.some((wishlistItem) => wishlistItem.id === item.id);
  const isCompared = isInCompare ? isInCompare(item.id) : false;

  // Resolve image URL - check all possible fields (supports both DummyJSON and Firebase products)
  const productImage = item.imageUrl || item.thumbnail || item.images?.[0] || '';

  return (
    <div className={`poduct ${isAdded ? "added" : ""}`}>
      <Link to={`/products/${item.id}`}>
        {isAdded && <span className="stat_cart"><FaCheck /> {t ? t('inCart') : 'in cart'}</span>}
        <div className="img_product">
          <img src={productImage} alt={item.title} />
        </div>
        <p className="name_product">{item.title}</p>
        <div className="starts">
          {renderStars(item.rating || 4.5)}
        </div>
        <p className="price">
          <span>${item.price}</span>
        </p>
      </Link>

      <div className="icons">
        <span
          className="add"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(item); }}
          title={t ? t('addToCart') : "Add to Cart"}
        >
          <FaCartPlus />
        </span>

        <span
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToWishlist(item); }}
          style={{ color: isWishlisted ? "#ff6b6b" : "inherit" }}
          title={t ? t('wishlist') : "Wishlist"}
        >
          {isWishlisted ? <FaHeart /> : <CiHeart />}
        </span>

        <span
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCompare && addToCompare(item); }}
          style={{ color: isCompared ? "#6366f1" : "inherit" }}
          title={t ? t('compareProduct') : "Compare Product"}
        >
          <FaBalanceScale />
        </span>

        <span style={{ position: 'relative' }} title={t ? t('share') : "Share"}>
          <FaShare onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowShare(!showShare); }} />
          {showShare && (
            <div className="share_menu" style={{
              position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'white', padding: '10px',
              borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', gap: '15px', zIndex: 10
            }}>
              <FaWhatsapp size={22} color="#25D366" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(`https://wa.me/?text=Check this out: ${window.location.origin}/products/${item.id}`) }} />
              <FaFacebook size={22} color="#1877F2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/products/${item.id}`) }} />
              <FaLink size={22} color="#333" onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigator.clipboard.writeText(`${window.location.origin}/products/${item.id}`); showToast ? showToast(t ? t('linkCopied') : "Link copied!", "info") : alert('Link copied!'); }} />
            </div>
          )}
        </span>
      </div>
    </div>
  );
}
