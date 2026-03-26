import { useState } from "react";
import { useEffect } from "react";
import { IoMdMenu } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { Link , useLocation} from "react-router-dom";
import { GoSignIn } from "react-icons/go";
import { LuUserRoundPlus } from "react-icons/lu";
import "./header.css";

const NavLinks = [
  { title: "Home", link: "/" },
  { title: "About", link: "/about" },
  { title: "Accessories", link: "/accessories" },
  { title: "Blog", link: "/blog" },
  { title: "Contact", link: "/contact" },
];

export default function BtmHeader() {
  const location = useLocation();
  const [category, setCategory] = useState([]);
  const[isCategoryOpen , setIsCategoryOpen] = useState(false);

  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategory(data));
  }, []);
  console.log(category);
  return (
    <div className="btm_header bg-[#0090f0] ">
      <div className="container flex items-center justify-between">
        <nav className="nav flex items-center">
          <div className="category_nav ">
            <div className="category_btm  text-white text-[15px] font-semibold"onClick={()=>setIsCategoryOpen(!isCategoryOpen)}>
              <IoMdMenu />
              <p>Browse Category</p> 
              <IoIosArrowDown />
            </div>
            <div className={`category_nav_list ${isCategoryOpen ? "active" : ""}`}>
              {category.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={() => setIsCategoryOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="nav_links flex items-center  ">
            {NavLinks.map((item,index) => (
              <span className={location.pathname === item.link ? "active" : ""}><Link key={index} to={item.link}>
                {item.title}
              </Link></span>
            ))}
          </div>
        </nav>
        <div className="header_sign flex gap-4  ">
          <Link to="/login">
            <GoSignIn className="text-white text-2xl" />
          </Link>
          <Link to="/signup">
            <LuUserRoundPlus className="text-white text-2xl" />
          </Link>
        </div>
      </div>
    </div>
  );
}
