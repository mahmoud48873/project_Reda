import React, { useContext } from 'react';
import { CompareContext } from '../../components/context/CompareContext';
import { CartContext } from '../../components/context/CartContext';
import { WishlistContext } from '../../components/context/WishlistContext';
import { Link } from 'react-router-dom';
import { FaBalanceScale, FaTrash, FaCartPlus, FaHeart, FaStar, FaTimes } from 'react-icons/fa';
import './Compare.css';

function Compare() {
  const { compareItems, removeFromCompare, clearCompare } = useContext(CompareContext) || {};
  const { addToCart } = useContext(CartContext) || {};
  const { addToWishlist } = useContext(WishlistContext) || {};

  if (!compareItems || compareItems.length === 0) {
    return (
      <div className="compare_page empty_compare">
        <div className="container">
          <div className="empty_compare_card">
            <FaBalanceScale className="empty_icon" />
            <h2>No products selected for comparison</h2>
            <p>Select up to 4 products from the store to compare their features, prices, and specs side by side.</p>
            <Link to="/" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="compare_page">
      <div className="container">
        <div className="compare_header">
          <div>
            <h1>Product Comparison</h1>
            <p>Comparing {compareItems.length} product(s)</p>
          </div>
          <button className="clear_all_btn" onClick={clearCompare}>
            <FaTrash /> Clear All
          </button>
        </div>

        <div className="compare_table_wrapper">
          <table className="compare_table">
            <thead>
              <tr>
                <th className="feature_header">Feature</th>
                {compareItems.map(item => (
                  <th key={item.id} className="product_th">
                    <button className="remove_col_btn" onClick={() => removeFromCompare(item.id)} title="Remove product">
                      <FaTimes />
                    </button>
                    <div className="product_th_img">
                      <img src={item.images?.[0]} alt={item.title} />
                    </div>
                    <Link to={`/products/${item.id}`} className="product_th_title">
                      {item.title}
                    </Link>
                    <div className="product_th_price">${item.price}</div>
                    <div className="product_th_actions">
                      <button className="btn btn-primary add_btn_sm" onClick={() => addToCart(item)}>
                        <FaCartPlus /> Add to Cart
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="feature_title">Rating</td>
                {compareItems.map(item => (
                  <td key={item.id}>
                    <div className="star_rating">
                      <FaStar className="star" /> {item.rating?.toFixed(1) || 4.5} / 5
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="feature_title">Brand</td>
                {compareItems.map(item => (
                  <td key={item.id}>
                    <strong>{item.brand || 'Generic'}</strong>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="feature_title">Category</td>
                {compareItems.map(item => (
                  <td key={item.id}>
                    <span className="cat_badge">{item.category?.replace('-', ' ')}</span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="feature_title">Availability</td>
                {compareItems.map(item => (
                  <td key={item.id}>
                    <span className={item.stock > 0 ? 'stock_in' : 'stock_out'}>
                      {item.availabilityStatus || (item.stock > 0 ? `In Stock (${item.stock})` : 'Out of Stock')}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="feature_title">Discount</td>
                {compareItems.map(item => (
                  <td key={item.id}>
                    {item.discountPercentage > 0 ? (
                      <span className="discount_badge">-{Math.round(item.discountPercentage)}%</span>
                    ) : (
                      'No discount'
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="feature_title">Description</td>
                {compareItems.map(item => (
                  <td key={item.id} className="desc_td">
                    <p>{item.description}</p>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="feature_title">Actions</td>
                {compareItems.map(item => (
                  <td key={item.id}>
                    <div className="table_actions">
                      <button className="btn_wishlist_sm" onClick={() => addToWishlist(item)}>
                        <FaHeart /> Wishlist
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Compare;
