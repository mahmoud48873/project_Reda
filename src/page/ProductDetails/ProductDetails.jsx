import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { IoStar } from "react-icons/io5";
import { IoMdStarHalf } from "react-icons/io";
import './ProductDetails.css'
import { FaCartPlus, FaShare, FaHeart, FaWhatsapp, FaFacebook, FaLink } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import SilederProduct from "../../components/sliderProducts/SilederProduct";
import Loading from "../../components/loading/Loading";
import ProductLoading from "../../components/loading/ProductLoading";
import { CartContext } from "../../components/context/CartContext";
import { WishlistContext } from "../../components/context/WishlistContext";
function ProductDetails() {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, wishlistItems } = useContext(WishlistContext);
  const { id } = useParams();
  console.log(id);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelatedProducts, setLoadingRelatedProducts] = useState(true);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    const FetchData = async () => {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await res.json();
        console.log(data);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    FetchData();
  }, [id]);
  useEffect(() => {
    if(!product) return;
    fetch(`https://dummyjson.com/products/category/${product.category}`)
    .then(res => res.json())
    .then(data =>{
      setRelatedProducts(data.products);
      setLoadingRelatedProducts(false);
    })
    .catch(error =>{
      console.log(error);
     setLoadingRelatedProducts(false);
    })
  }, [product]);

  if (loading) {
    return <ProductLoading />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
 <div>
    <div className="item_details">
      <div className="container">
        <div className="img_item">
          <div className="bag_img">
            <img id="bag_img" src={product.images[0]} alt={product.title} />
          </div>
          <div className="sma_img">
            {product.images.map((img, index) => (
              <img key={index} src={img} alt={product.title} onClick={() => document.getElementById("bag_img").src = img} />
            ))}
          </div>
        </div>
        <div className="details_item">
          <h1 className="title_item">{product.title}</h1>
          <div className="starts">
            <IoStar />
            <IoStar />
            <IoStar />
            <IoStar />
            <IoMdStarHalf />
          </div>
          <p className="price_item">${product.price}</p>
          <p className="availability_item">
            Availability: <span>{product.availabilityStatus}</span>
          </p>
          <p className="brand_item">Brand: <span>{product.brand}</span></p>
          <p className="description_item">{product.description}</p>
          <p className="stock_item">Stock: <span>{product.stock}</span></p>
          <button className="add_to_cart btn btn-primary " onClick={() => addToCart(product)}>Add to Cart</button>
          <div className="icons">
    
        <span onClick={() => addToWishlist(product)} style={{ color: (product && wishlistItems.some(item => item.id === product.id)) ? "#ff6b6b" : "inherit", cursor: "pointer" }}>
          {(product && wishlistItems.some(item => item.id === product.id)) ? <FaHeart /> : <CiHeart />}
        </span>
        <span style={{ position: 'relative', cursor: 'pointer' }}>
          <FaShare onClick={(e) => { e.preventDefault(); setShowShare(!showShare); }} />
          {showShare && (
              <div className="share_menu" style={{
                  position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'white', padding: '10px', 
                  borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', gap: '15px', zIndex: 10
              }}>
                  <FaWhatsapp size={24} color="#25D366" onClick={(e)=> {e.preventDefault(); window.open(`https://wa.me/?text=Check this out: ${window.location.origin}/products/${product.id}`)}}/>
                  <FaFacebook size={24} color="#1877F2" onClick={(e)=> {e.preventDefault(); window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/products/${product.id}`)}}/>
                  <FaLink size={24} color="#333" onClick={(e)=> {e.preventDefault(); navigator.clipboard.writeText(`${window.location.origin}/products/${product.id}`); alert('Link copied!')}}/>
              </div>
          )}
        </span>
      </div>
        </div>
      </div>
    </div> 
    {loadingRelatedProducts?(
      <Loading />

    ):(
      <SilederProduct key={product.category}  data={relatedProducts} title={product.category.replace("-"," ")}/>
    )
    }
 </div>
  );
}
export default ProductDetails;
