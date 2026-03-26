import { FaSearch } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { IoMdCart } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../img/logo.png";
import "./header.css";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
export default function TopHeader() {
  const {CartItem} = useContext(CartContext);
  const {wishlistItems} = useContext(WishlistContext);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <div className="top_header ">
      <div className="container ">
        <Link to="/" className="logo  w-[160px]">
          <img src={logo} alt="logo" />
        </Link>
        <form onSubmit={handleSearch} className="search_box   ">
          <input 
            type="text" 
            placeholder="Search" 
            id="search" 
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          <button type="submit  ">
            <FaSearch className="text-white" />
          </button>
        </form>
        <div className="header">
          <div className="icon">
          <Link to="/wishlist">
            <CiHeart />
            <span className="count">{wishlistItems.length}</span>
          </Link>
          </div>
          <div className="icon">
         <Link to="/cart">   <IoMdCart />
            <span className="count">{CartItem.length}</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}