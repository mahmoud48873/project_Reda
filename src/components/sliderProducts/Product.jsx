import React, { useContext } from "react";
import { FaCheck } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { IoMdStarHalf } from "react-icons/io";
import { FaCartPlus, FaShare } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
export default function Product({ item }) {




const { CartItem, addToCart } = useContext(CartContext);
const isAdded = CartItem.some((cartItem) => cartItem.id === item.id);
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
        <span>
          <CiHeart />
        </span>
        <span>
          <FaShare />
        </span>
      </div>
    </div>
  );
}
