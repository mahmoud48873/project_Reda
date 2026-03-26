import React, { useContext, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { IoMdStarHalf } from "react-icons/io";
import { FaCartPlus, FaShare, FaHeart, FaWhatsapp, FaFacebook, FaLink } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
export default function Product({ item }) {




const { CartItem, addToCart } = useContext(CartContext);
const { wishlistItems, addToWishlist } = useContext(WishlistContext);
const [showShare, setShowShare] = useState(false);
const isAdded = CartItem.some((cartItem) => cartItem.id === item.id);
const isWishlisted = wishlistItems.some((wishlistItem) => wishlistItem.id === item.id);
  return (
    <div className={`poduct   ${isAdded ? "added" : ""}`}>
      <Link to={`/products/${item.id}`}>
     
      {isAdded && <span className="stat_cart"><FaCheck /> in cart</span>}
        <div className="img_product">
          <img src={item.images[0]} alt={item.title} />
        </div>
        <p className="name_product">{item.title}</p>
        <div className="starts">
          <IoStar />
          <IoStar />
          <IoStar />
          <IoStar />
          <IoMdStarHalf />
        </div>
        <p className="price">
          <span>${item.price}</span>
        </p>
      </Link>

      <div className="icons">
        <span className="add" onClick={() => addToCart(item)}>
          <FaCartPlus />
        </span>
        <span onClick={(e) => { e.preventDefault(); addToWishlist(item); }} style={{ color: isWishlisted ? "#ff6b6b" : "inherit" }}>
          {isWishlisted ? <FaHeart /> : <CiHeart />}
        </span>
        <span style={{ position: 'relative' }}>
          <FaShare onClick={(e) => { e.preventDefault(); setShowShare(!showShare); }} />
          {showShare && (
              <div className="share_menu" style={{
                  position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'white', padding: '10px', 
                  borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', gap: '15px', zIndex: 10
              }}>
                  <FaWhatsapp size={22} color="#25D366" onClick={(e)=> {e.preventDefault(); window.open(`https://wa.me/?text=Check this out: ${window.location.origin}/products/${item.id}`)}}/>
                  <FaFacebook size={22} color="#1877F2" onClick={(e)=> {e.preventDefault(); window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/products/${item.id}`)}}/>
                  <FaLink size={22} color="#333" onClick={(e)=> {e.preventDefault(); navigator.clipboard.writeText(`${window.location.origin}/products/${item.id}`); alert('Link copied!')}}/>
              </div>
          )}
        </span>
      </div>
    </div>
  );
}
