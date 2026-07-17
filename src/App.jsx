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
import Checkout from "./page/Checkout/Checkout";
import OrderSuccess from "./page/OrderSuccess/OrderSuccess";
import Dashboard from "./page/Dashboard/Dashboard";
import Compare from "./page/Compare/Compare";
import CompareBar from "./components/compare/CompareBar";

function App() {
  return (
    <>
      <header>
        <TopHeader />
        <BtmHeader />
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/category/:categoryName" element={<Category />} />
        <Route path="/about" element={<About />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>

      <CompareBar />
      <Footer />
    </>
  );
}

export default App;
