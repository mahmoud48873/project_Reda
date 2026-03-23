import TopHeader from "./components/header/TopHeader";
import BtmHeader from "./components/header/BtmHeader";
import Home from "./page/Home/Home";
import { Routes, Route } from "react-router-dom";
import ProductDetails from "./page/ProductDetails/ProductDetails";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <>
      <header>
        <TopHeader />
        <BtmHeader />
      </header>

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/products/:id" element={<ProductDetails />}></Route>
      </Routes>

      <Footer />
    </>
  );
}
export default App;
