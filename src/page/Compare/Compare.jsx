import React, { useContext } from 'react';
import { CompareContext } from '../../components/context/CompareContext';
import { CartContext } from '../../components/context/CartContext';
import { WishlistContext } from '../../components/context/WishlistContext';
import { LanguageContext } from '../../components/context/LanguageContext';
import { Link } from 'react-router-dom';
import { FaBalanceScale, FaTrash, FaCartPlus, FaHeart, FaStar, FaTimes } from 'react-icons/fa';
import './Compare.css';

function Compare() {
  const { compareItems, removeFromCompare, clearCompare } = useContext(CompareContext) || {};
  const { addToCart } = useContext(CartContext) || {};
  const { addToWishlist } = useContext(WishlistContext) || {};
  const { t, tCategory } = useContext(LanguageContext) || {};

  if (!compareItems || compareItems.length === 0) {
    return (
      <div className="compare_page empty_compare">
        <div className="container">
          <div className="empty_compare_card">
            <FaBalanceScale className="empty_icon" />
            <h2>{t ? t('noCompareProducts') : 'No products selected for comparison'}</h2>
            <p>{t ? t('compareDesc') : 'Select up to 4 products from the store to compare their features, prices, and specs side by side.'}</p>
            <Link to="/" className="btn btn-primary">
              {t ? t('browseProducts') : 'Browse Products'}
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
            <h1>{t ? t('productComparison') : 'Product Comparison'}</h1>
            <p>{t ? t('comparingCount') : 'Comparing'} {compareItems.length} {t ? t('productsCount') : 'product(s)'}</p>
          </div>
          <button className="clear_all_btn" onClick={clearCompare}>
            <FaTrash /> {t ? t('clearAll') : 'Clear All'}
          </button>
        </div>

        <div className="compare_table_wrapper">
          <table className="compare_table">
            <thead>
              <tr>
                <th className="feature_header">{t ? t('feature') : 'Feature'}</th>
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
                        <FaCartPlus /> {t ? t('addToCart') : 'Add to Cart'}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="feature_title">{t ? t('rating') : 'Rating'}</td>
                {compareItems.map(item => (
                  <td key={item.id}>
                    <div className="star_rating">
                      <FaStar className="star" /> {item.rating?.toFixed(1) || 4.5} / 5
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="feature_title">{t ? t('brand') : 'Brand'}</td>
                {compareItems.map(item => (
                  <td key={item.id}>
                    <strong>{item.brand || (t ? t('genericBrand') : 'Generic')}</strong>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="feature_title">{t ? t('category') : 'Category'}</td>
                {compareItems.map(item => (
                  <td key={item.id}>
                    <span className="cat_badge">{tCategory ? tCategory(item.category) : item.category?.replace('-', ' ')}</span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="feature_title">{t ? t('availability') : 'Availability'}</td>
                {compareItems.map(item => (
                  <td key={item.id}>
                    <span className={item.stock > 0 ? 'stock_in' : 'stock_out'}>
                      {item.stock > 0 ? `${t ? t('inStock') : 'In Stock'} (${item.stock})` : (t ? t('outOfStock') : 'Out of Stock')}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="feature_title">{t ? t('discount') : 'Discount'}</td>
                {compareItems.map(item => (
                  <td key={item.id}>
                    {item.discountPercentage > 0 ? (
                      <span className="discount_badge">-{Math.round(item.discountPercentage)}%</span>
                    ) : (
                      (t ? t('noDiscount') : 'No discount')
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="feature_title">{t ? t('description') : 'Description'}</td>
                {compareItems.map(item => (
                  <td key={item.id} className="desc_td">
                    <p>{item.description}</p>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="feature_title">{t ? t('actions') : 'Actions'}</td>
                {compareItems.map(item => (
                  <td key={item.id}>
                    <div className="table_actions">
                      <button className="btn_wishlist_sm" onClick={() => addToWishlist(item)}>
                        <FaHeart /> {t ? t('wishlist') : 'Wishlist'}
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
