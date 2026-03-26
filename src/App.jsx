import TopHeader from "./components/header/TopHeader";
import BtmHeader from "./components/header/BtmHeader";
import Home from "./page/Home/Home";
import { Routes, Route } from "react-router-dom";
import ProductDetails from "./page/ProductDetails/ProductDetails";
import Footer from "./components/footer/Footer";
import Cart from "./page/Cart/Cart";
import Wishlist from "./page/Wishlist/Wishlist";
import Login from "./page/Login/Login";
import SignUp from "./page/SignUp/SignUp";
import Search from "./page/Search/Search";
import Category from "./page/Category/Category";
import About from "./page/About/About";
import Accessories from "./page/Accessories/Accessories";
import Blog from "./page/Blog/Blog";
import Contact from "./page/Contact/Contact";
function App() {
  return (
    <>
      <header>
        <TopHeader />
        <BtmHeader />
      </header>

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/wishlist" element={<Wishlist />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/category/:categoryName" element={<Category />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/accessories" element={<Accessories />}></Route>
        <Route path="/blog" element={<Blog />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/products/:id" element={<ProductDetails />}></Route>
      </Routes>

      <Footer />
    </>
  );
}
export default App;
