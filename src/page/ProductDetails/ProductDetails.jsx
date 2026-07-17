import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { IoMdStarHalf } from "react-icons/io";
import './ProductDetails.css';
import { FaCartPlus, FaShare, FaHeart, FaWhatsapp, FaFacebook, FaLink, FaBalanceScale, FaUserCircle, FaPaperPlane } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import SilederProduct from "../../components/sliderProducts/SilederProduct";
import Loading from "../../components/loading/Loading";
import ProductLoading from "../../components/loading/ProductLoading";
import { CartContext } from "../../components/context/CartContext";
import { WishlistContext } from "../../components/context/WishlistContext";
import { CompareContext } from "../../components/context/CompareContext";
import { ToastContext } from "../../components/context/ToastContext";
import { UserContext } from "../../components/context/UserContext";

function renderStars(rating = 5) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<IoStar key={i} className="star_icon full" />);
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(<IoMdStarHalf key={i} className="star_icon half" />);
    } else {
      stars.push(<IoStarOutline key={i} className="star_icon empty" />);
    }
  }
  return stars;
}

function ProductDetails() {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, wishlistItems } = useContext(WishlistContext);
  const { addToCompare, isInCompare } = useContext(CompareContext) || {};
  const { showToast } = useContext(ToastContext) || {};
  const { user } = useContext(UserContext) || {};
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelatedProducts, setLoadingRelatedProducts] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState("");

  useEffect(() => {
    const FetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setActiveImage(data.images?.[0] || data.thumbnail || "");
        setReviews(data.reviews || [
          { reviewerName: "Sara Ahmed", comment: "Awesome quality, fast shipping!", rating: 5, date: new Date().toISOString() },
          { reviewerName: "Omar Hassan", comment: "Good product for the price.", rating: 4, date: new Date().toISOString() }
        ]);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    FetchData();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    fetch(`https://dummyjson.com/products/category/${product.category}`)
      .then(res => res.json())
      .then(data => {
        setRelatedProducts(data.products || []);
        setLoadingRelatedProducts(false);
      })
      .catch(error => {
        console.error(error);
        setLoadingRelatedProducts(false);
      });
  }, [product]);

  const handleAddReview = (e) => {
    e.preventDefault();
    const nameToUse = reviewerName.trim() || user?.name || "Anonymous Customer";
    if (!newComment.trim()) {
      showToast?.("Please write a comment for your review", "error");
      return;
    }

    const reviewObj = {
      reviewerName: nameToUse,
      comment: newComment.trim(),
      rating: Number(newRating),
      date: new Date().toISOString()
    };

    setReviews([reviewObj, ...reviews]);
    setNewComment("");
    setReviewerName("");
    showToast?.("Thank you! Your review has been added.", "success");
  };

  if (loading) {
    return <ProductLoading />;
  }

  if (!product) {
    return <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>Product not found</div>;
  }

  const isCompared = isInCompare ? isInCompare(product.id) : false;

  return (
    <div className="product_details_page">
      <div className="item_details">
        <div className="container">
          <div className="img_item">
            <div className="bag_img">
              <img id="bag_img" src={activeImage || product.images?.[0] || product.thumbnail} alt={product.title} />
            </div>
            <div className="sma_img">
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={product.title}
                  className={activeImage === img ? "active_thumb" : ""}
                  onClick={() => setActiveImage(img)}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ))}
            </div>
          </div>

          <div className="details_item">
            <h1 className="title_item">{product.title}</h1>
            <div className="rating_wrap">
              <div className="starts">{renderStars(product.rating || 4.5)}</div>
              <span className="rating_num">({product.rating?.toFixed(1) || 4.5})</span>
              <span className="review_count">• {reviews.length} reviews</span>
            </div>

            <p className="price_item">
              ${product.price}
              {product.discountPercentage > 0 && (
                <span className="discount_tag">-{Math.round(product.discountPercentage)}% OFF</span>
              )}
            </p>

            <p className="availability_item">
              Availability: <span className={product.stock > 0 ? "in_stock" : "out_stock"}>{product.availabilityStatus || (product.stock > 0 ? "In Stock" : "Out of Stock")}</span>
            </p>
            <p className="brand_item">Brand: <span>{product.brand || "Generic"}</span></p>
            <p className="description_item">{product.description}</p>
            <p className="stock_item">Stock: <span>{product.stock} items left</span></p>

            <div className="actions_row">
              <button className="add_to_cart btn btn-primary" onClick={() => addToCart(product)}>
                <FaCartPlus /> Add to Cart
              </button>

              <button
                className={`compare_btn ${isCompared ? "compared" : ""}`}
                onClick={() => addToCompare && addToCompare(product)}
                title="Compare Product"
              >
                <FaBalanceScale /> {isCompared ? "Compared" : "Compare"}
              </button>
            </div>

            <div className="icons">
              <span
                onClick={() => addToWishlist(product)}
                style={{ color: (product && wishlistItems.some(item => item.id === product.id)) ? "#ff6b6b" : "inherit", cursor: "pointer" }}
                title="Wishlist"
              >
                {(product && wishlistItems.some(item => item.id === product.id)) ? <FaHeart /> : <CiHeart />}
              </span>

              <span style={{ position: 'relative', cursor: 'pointer' }} title="Share">
                <FaShare onClick={(e) => { e.preventDefault(); setShowShare(!showShare); }} />
                {showShare && (
                  <div className="share_menu">
                    <FaWhatsapp size={22} color="#25D366" onClick={(e) => { e.preventDefault(); window.open(`https://wa.me/?text=Check this out: ${window.location.origin}/products/${product.id}`) }} />
                    <FaFacebook size={22} color="#1877F2" onClick={(e) => { e.preventDefault(); window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/products/${product.id}`) }} />
                    <FaLink size={22} color="#333" onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(`${window.location.origin}/products/${product.id}`); showToast ? showToast("Link copied to clipboard!", "info") : alert('Link copied!'); }} />
                  </div>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews Section */}
      <div className="reviews_section">
        <div className="container">
          <div className="reviews_header">
            <div className="reviews_header_title">
              <h2>Customer Reviews</h2>
              <span className="reviews_count_badge">{reviews.length} reviews</span>
            </div>
            <div className="overall_rating">
              <span className="big_rating">{product.rating?.toFixed(1) || 4.5}</span>
              <div>
                <div className="starts">{renderStars(product.rating || 4.5)}</div>
                <p>Based on customer experiences</p>
              </div>
            </div>
          </div>

          <div className="reviews_grid">
            {/* Review Form */}
            <form className="add_review_form" onSubmit={handleAddReview}>
              <h3>Write a Review</h3>
              <div className="form_group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder={user?.name || "Enter your name"}
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                />
              </div>

              <div className="form_group">
                <label>Rating</label>
                <select value={newRating} onChange={(e) => setNewRating(e.target.value)}>
                  <option value="5">⭐⭐⭐⭐⭐ (5/5 - Excellent)</option>
                  <option value="4">⭐⭐⭐⭐ (4/5 - Very Good)</option>
                  <option value="3">⭐⭐⭐ (3/5 - Average)</option>
                  <option value="2">⭐⭐ (2/5 - Poor)</option>
                  <option value="1">⭐ (1/5 - Terrible)</option>
                </select>
              </div>

              <div className="form_group">
                <label>Your Review</label>
                <textarea
                  rows="4"
                  placeholder="Share your thoughts about this product..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary submit_review_btn">
                <FaPaperPlane /> Submit Review
              </button>
            </form>

            {/* List of Reviews */}
            <div className="reviews_list">
              {reviews.map((rev, idx) => (
                <div className="review_card" key={idx}>
                  <div className="review_card_top">
                    <div className="reviewer_info">
                      <FaUserCircle className="reviewer_avatar" />
                      <div>
                        <h4>{rev.reviewerName}</h4>
                        <span className="review_date">
                          {rev.date ? new Date(rev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                        </span>
                      </div>
                    </div>
                    <div className="starts">{renderStars(rev.rating)}</div>
                  </div>
                  <p className="review_comment">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loadingRelatedProducts ? (
        <Loading />
      ) : (
        <SilederProduct key={product.category} data={relatedProducts} title={product.category.replace("-", " ")} />
      )}
    </div>
  );
}

export default ProductDetails;
