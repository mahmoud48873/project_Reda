import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoStar } from "react-icons/io5";
import { IoMdStarHalf } from "react-icons/io";
import './ProductDetails.css'
import { FaCartPlus, FaShare } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import SilederProduct from "../../components/sliderProducts/SilederProduct";

function ProductDetails() {
  const { id } = useParams();
  console.log(id);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelatedProducts, setLoadingRelatedProducts] = useState(true);

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
    return <div>Loading...</div>;
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
          <button className="add_to_cart btn btn-primary ">Add to Cart</button>
          <div className="icons">
    
        <span>
          <CiHeart />
        </span>
        <span>
          <FaShare />
        </span>
      </div>
        </div>
      </div>
    </div> 
    {loadingRelatedProducts?(
      <p>Loading Related Products...</p>

    ):(
      <SilederProduct key={product.category}  data={relatedProducts} title={product.category.replace("-"," ")}/>
    )
    }
 </div>
  );
}
export default ProductDetails;
