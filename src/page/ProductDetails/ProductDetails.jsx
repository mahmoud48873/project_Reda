// Developer: Mahmoud Sameh Fathy Ibrahim
// Student Code: 624018

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { IoMdStarHalf } from "react-icons/io";
import './ProductDetails.css';
import { FaCartPlus, FaHeart, FaBalanceScale, FaUserCircle, FaPaperPlane } from "react-icons/fa";
import SilederProduct from "../../components/sliderProducts/SilederProduct";
import ProductLoading from "../../components/loading/ProductLoading";
import { CartContext } from "../../components/context/CartContext";
import { WishlistContext } from "../../components/context/WishlistContext";
import { CompareContext } from "../../components/context/CompareContext";
import { ToastContext } from "../../components/context/ToastContext";
import { UserContext } from "../../components/context/UserContext";
import { LanguageContext } from "../../components/context/LanguageContext";

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
  const { addToWishlist } = useContext(WishlistContext);
  const { addToCompare, isInCompare } = useContext(CompareContext) || {};
  const { showToast } = useContext(ToastContext) || {};
  const { user } = useContext(UserContext) || {};
  const { t, language } = useContext(LanguageContext) || {};
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelatedProducts, setLoadingRelatedProducts] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  // Reviews state & pagination
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isEditingMyReview, setIsEditingMyReview] = useState(false);

  const hasUserReviewed = user && reviews.some(rev => rev.reviewerName === user.email);

  const getPaginationGroup = (current, total) => {
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  };

  const reviewsPerPage = 5;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  // Calculate average rating dynamically from reviews
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, rev) => sum + Number(rev.rating), 0) / reviews.length
    : (product?.rating || 5.0);

  // Helper for translation with fallback
  const tr = (key, fallback) => {
    if (!t) return fallback;
    const res = t(key);
    return (res && res !== key) ? res : fallback;
  };

  useEffect(() => {
    const FetchData = async () => {
      setLoading(true);
      try {
        // 1. Try fetching from Firestore first (for admin-added products)
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('../../firebase');
          const docRef = doc(db, 'products', id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = { id: docSnap.id, ...docSnap.data() };
            const mainImg = data.imageUrl || data.thumbnail || (data.images && data.images[0]) || "";
            const formattedImages = (data.images && data.images.length > 0) ? data.images : [mainImg];
            
            const fullProductData = {
              ...data,
              title: data.title || data.name || "Product",
              images: formattedImages,
              thumbnail: mainImg,
              stock: data.stock !== undefined ? data.stock : 15,
              rating: data.rating || 5.0,
              description: (data.description && data.description !== "0" && data.description !== 0) ? data.description : ""
            };

            setProduct(fullProductData);
            setActiveImage(mainImg);
            setReviews(data.reviews && data.reviews.length > 0 ? data.reviews : []);
            setLoading(false);
            return;
          }
        } catch (fsErr) {
          console.log("Firestore fetch fallback to DummyJSON:", fsErr);
        }

        // 2. Fallback to DummyJSON API
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) {
          throw new Error("Product not found");
        }
        const data = await res.json();
        setProduct(data);
        setActiveImage(data.images?.[0] || data.thumbnail || "");

        let fetchedReviews = [];
        try {
            const { getDoc, doc } = await import('firebase/firestore');
            const { db } = await import('../../firebase');
            const reviewsDocRef = doc(db, 'product_reviews', String(id));
            const reviewSnap = await getDoc(reviewsDocRef);
            if (reviewSnap.exists() && reviewSnap.data().reviews) {
                fetchedReviews = reviewSnap.data().reviews;
            }
        } catch (e) {
            console.error("Error fetching dummyjson reviews from firestore", e);
        }

        setReviews(fetchedReviews);
        setLoading(false);
      } catch (error) {
        console.error("Error loading product details:", error);
        setProduct(null);
        setLoading(false);
      }
    };

    FetchData();
  }, [id]);

  useEffect(() => {
    if (!product?.images || product.images.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveImage((prevImg) => {
        const images = product.images;
        const currentIndex = images.indexOf(prevImg);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % images.length;
        return images[nextIndex];
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [product, isPaused]);

  useEffect(() => {
    if (!product) return;
    const catToFetch = product.category || 'smartphones';
    fetch(`https://dummyjson.com/products/category/${catToFetch}`)
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          setRelatedProducts(data.products);
        } else {
          fetch(`https://dummyjson.com/products/category/smartphones`)
            .then(r => r.json())
            .then(d => setRelatedProducts(d.products || []));
        }
        setLoadingRelatedProducts(false);
      })
      .catch(error => {
        console.error(error);
        setLoadingRelatedProducts(false);
      });
  }, [product]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast?.(tr('loginToReview', "Please login to write a review"), "error");
      return;
    }
    if (!newComment.trim()) {
      showToast?.(tr('writeCommentPrompt', "Please write a comment for your review"), "error");
      return;
    }

    setIsSubmittingReview(true);

    const reviewObj = {
      reviewerName: user.email,
      comment: newComment.trim(),
      rating: Number(newRating),
      date: new Date().toISOString()
    };

    let updatedReviews;
    if (isEditingMyReview) {
      updatedReviews = reviews.map(rev => rev.reviewerName === user.email ? reviewObj : rev);
    } else {
      updatedReviews = [reviewObj, ...reviews];
    }

    try {
      const { updateDoc, setDoc, doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../../firebase');
      const docRef = doc(db, 'products', String(id));
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, { reviews: updatedReviews });
      } else {
        const reviewsDocRef = doc(db, 'product_reviews', String(id));
        await setDoc(reviewsDocRef, { reviews: updatedReviews }, { merge: true });
      }
    } catch (err) {
      console.error("Error saving review to Firestore:", err);
    }

    setReviews(updatedReviews);
    setNewComment("");
    setCurrentPage(1);
    setIsSubmittingReview(false);
    setIsEditingMyReview(false);
    showToast?.(
      isEditingMyReview 
        ? (language === 'ar' ? "تم تعديل تقييمك بنجاح." : "Your review has been updated.")
        : tr('reviewSubmitted', "Thank you! Your review has been added."), 
      "success"
    );
  };

  const handleDeleteReview = async () => {
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف تقييمك؟' : 'Are you sure you want to delete your review?')) return;
    setIsSubmittingReview(true);
    const updatedReviews = reviews.filter(rev => rev.reviewerName !== user.email);
    try {
      const { updateDoc, setDoc, doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../../firebase');
      const docRef = doc(db, 'products', String(id));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, { reviews: updatedReviews });
      } else {
        const reviewsDocRef = doc(db, 'product_reviews', String(id));
        await setDoc(reviewsDocRef, { reviews: updatedReviews }, { merge: true });
      }
    } catch (err) {
      console.error("Error deleting review:", err);
    }
    setReviews(updatedReviews);
    setCurrentPage(1);
    setIsSubmittingReview(false);
    showToast?.(language === 'ar' ? "تم حذف التقييم بنجاح." : "Review deleted successfully.", "success");
  };

  if (loading) {
    return <ProductLoading />;
  }

  if (!product) {
    return <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>{tr('productNotFound', "Product not found")}</div>;
  }

  const isCompared = isInCompare ? isInCompare(product.id) : false;

  const getStockStatusText = () => {
    if (product.stock > 0) {
      return tr('inStock', "In Stock");
    }
    return tr('outOfStock', "Out of Stock");
  };

  const productMainImage = activeImage || product.imageUrl || product.thumbnail || product.images?.[0] || "";

  return (
    <div className="product_details_page">
      <div className="item_details">
        <div className="container">
          <div
            className="img_item"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div className="bag_img">
              <img id="bag_img" src={productMainImage} alt={product.title || product.name} />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="sma_img">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={product.title || product.name}
                    className={activeImage === img ? "active_thumb" : ""}
                    onClick={() => setActiveImage(img)}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="details_item">
            <h1 className="title_item">{product.title || product.name}</h1>
            <div className="rating_wrap">
              <div className="starts">{renderStars(averageRating)}</div>
              <span className="rating_num">({averageRating.toFixed(1)})</span>
              <span className="review_count">• {reviews.length} {tr('reviewsCountLabel', 'reviews')}</span>
            </div>

            <p className="price_item">
              ${product.price}
              {product.discountPercentage > 0 && (
                <span className="discount_tag">-{Math.round(product.discountPercentage)}% {tr('off', 'OFF')}</span>
              )}
            </p>

            <p className="availability_item">
              {tr('availabilityLabel', 'Availability')}: <span className={product.stock > 0 ? "in_stock" : "out_stock"}>{getStockStatusText()}</span>
            </p>
            <p className="brand_item">{tr('brandLabel', 'Brand')}: <span>{product.brand || tr('genericBrand', "Generic")}</span></p>
            
            {product.description && product.description !== "0" && product.description !== 0 && (
              <p className="description_item">{product.description}</p>
            )}

            <p className="stock_item">{tr('stockLabel', 'Stock')}: <span>{product.stock ?? 15} {tr('itemsLeft', 'items left')}</span></p>

            <div className="actions_row">
              <button className="add_to_cart btn btn-primary" onClick={() => addToCart(product)}>
                <FaCartPlus /> {tr('addToCart', 'Add to Cart')}
              </button>

              <button className="btn btn_wishlist_page" onClick={() => addToWishlist(product)}>
                <FaHeart /> {tr('wishlist', 'Wishlist')}
              </button>

              <button
                className={`btn btn_compare_page ${isCompared ? "compared" : ""}`}
                onClick={() => addToCompare && addToCompare(product)}
              >
                <FaBalanceScale /> {tr('compare', 'Compare')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="reviews_section">
        <div className="container">
          <h3 className="section_title" style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: 'var(--color_heading)' }}>
            {tr('customerReviews', 'Customer Reviews')}
          </h3>
          
          <div className="reviews_grid">
            <div className="reviews_list">
              {reviews.length === 0 ? (
                <div className="no_reviews_box">
                  <p>{language === 'ar' ? 'لا توجد تقييمات لهذا المنتج بعد. كن أول من يكتب تقييماً!' : 'No reviews for this product yet. Be the first to write a review!'}</p>
                </div>
              ) : (
                currentReviews.map((rev, index) => (
                  <div key={index} className="review_card">
                    <div className="review_card_top">
                      <div className="reviewer_info">
                        <FaUserCircle className="reviewer_avatar" />
                        <div className="reviewer_details">
                          <h4 className="reviewer_name">{rev.reviewerName}</h4>
                          <div className="review_stars">{renderStars(rev.rating)}</div>
                        </div>
                      </div>
                      <span className="review_date">{new Date(rev.date).toLocaleDateString()}</span>
                    </div>
                    <p className="review_comment">{rev.comment}</p>
                  </div>
                ))
              )}

              {totalPages > 1 && (
                <div className="reviews_pagination">
                  <button
                    type="button"
                    className="pagination_btn"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    {language === 'ar' ? 'السابق' : 'Previous'}
                  </button>

                  <div className="pagination_numbers">
                    {getPaginationGroup(currentPage, totalPages).map((item, idx) => (
                      item === '...' ? (
                        <span key={`dots-${idx}`} className="pagination_ellipsis">...</span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          className={`page_num_btn ${currentPage === item ? 'active' : ''}`}
                          onClick={() => setCurrentPage(item)}
                        >
                          {item}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    type="button"
                    className="pagination_btn"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    {language === 'ar' ? 'التالي' : 'Next'}
                  </button>
                </div>
              )}
            </div>

            <div className="add_review_form">
              <h3>{tr('writeAReview', 'Write a Review')}</h3>
              {!user ? (
                <p className="login_prompt">{tr('loginToReview', 'Please login to write a review')}</p>
              ) : (hasUserReviewed && !isEditingMyReview) ? (
                <div className="already_reviewed_box">
                  <p>{language === 'ar' ? 'لقد قمت بتقييم هذا المنتج مسبقاً' : 'You have already reviewed this product'}</p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button 
                      type="button" 
                      className="edit_review_btn" 
                      onClick={() => {
                        const userReview = reviews.find(rev => rev.reviewerName === user.email);
                        if (userReview) {
                          setNewComment(userReview.comment);
                          setNewRating(userReview.rating);
                          setIsEditingMyReview(true);
                        }
                      }}
                    >
                      {language === 'ar' ? 'تعديل التقييم ✏️' : 'Edit Review ✏️'}
                    </button>
                    <button 
                      type="button" 
                      className="delete_review_btn" 
                      onClick={handleDeleteReview}
                      disabled={isSubmittingReview}
                    >
                      {language === 'ar' ? 'حذف التقييم 🗑️' : 'Delete Review 🗑️'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddReview}>
                  <div className="logged_in_as">
                    <FaUserCircle className="logged_in_avatar" />
                    <span>{user.email}</span>
                  </div>
                  <div className="form_group">
                    <label>{tr('rating', 'Rating')}</label>
                    <select value={newRating} onChange={(e) => setNewRating(e.target.value)}>
                      <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5)</option>
                      <option value="3">⭐⭐⭐ (3/5)</option>
                      <option value="2">⭐⭐ (2/5)</option>
                      <option value="1">⭐ (1/5)</option>
                    </select>
                  </div>
                  <div className="form_group">
                    <label>{tr('yourReview', 'Your Review')}</label>
                    <textarea
                      rows="4"
                      placeholder={tr('writeReviewPlaceholder', "Write your honest feedback about this product...")}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                      disabled={isSubmittingReview}
                      maxLength={120}
                    ></textarea>
                    <small style={{ display: 'block', textAlign: 'right', color: newComment.length === 120 ? '#ef4444' : '#888', marginTop: '6px', fontSize: '13px' }}>
                      {newComment.length} / 120
                    </small>
                  </div>
                  <button type="submit" className="submit_review_btn" disabled={isSubmittingReview}>
                    <FaPaperPlane /> 
                    {isSubmittingReview 
                      ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
                      : (isEditingMyReview 
                          ? (language === 'ar' ? 'تحديث التقييم' : 'Update Review') 
                          : tr('submitReview', 'Submit Review'))
                    }
                  </button>
                  {isEditingMyReview && (
                    <button 
                      type="button" 
                      className="cancel_edit_review_btn" 
                      onClick={() => {
                        setIsEditingMyReview(false);
                        setNewComment("");
                        setNewRating(5);
                      }}
                      disabled={isSubmittingReview}
                    >
                      {language === 'ar' ? 'إلغاء التعديل' : 'Cancel Edit'}
                    </button>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {!loadingRelatedProducts && relatedProducts.length > 0 && (
        <div className="related_products_section">
          <SilederProduct data={relatedProducts} title={tr('relatedProducts', 'Related Products')} />
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
