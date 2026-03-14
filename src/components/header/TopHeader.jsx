import { FaSearch } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { IoMdCart } from "react-icons/io";
import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import "./header.css";
export default function TopHeader() {
  return (
    <div className="top_header ">
      <div className="container ">
        <Link to="/" className="logo  w-[160px]">
          <img src={logo} alt="logo" />
        </Link>
        <form action="" className="search_box   ">
          <input type="text" placeholder="Search" id="search" name="search" />
          <button type="submit  ">
            <FaSearch className="text-white" />
          </button>
        </form>
        <div className="header">
          <div className="icon">
            <CiHeart />
            <span className="count">0</span>
          </div>
          <div className="icon">
            <IoMdCart />
            <span className="count">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}