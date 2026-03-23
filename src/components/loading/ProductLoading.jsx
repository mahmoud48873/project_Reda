import React from 'react';
import './ProductLoading.css';

const ProductLoading = () => {
  return (
    <div className="product-loading">
      <div className="item_details">
        <div className="container">
          <div className="img_item">
            <div className="skeleton-bag-img pulse"></div>
            <div className="sma_img_skeleton">
              <div className="skeleton-sma-img pulse"></div>
              <div className="skeleton-sma-img pulse"></div>
              <div className="skeleton-sma-img pulse"></div>
              <div className="skeleton-sma-img pulse"></div>
            </div>
          </div>
          <div className="details_item">
            <div className="skeleton-title pulse"></div>
            <div className="skeleton-stars pulse"></div>
            <div className="skeleton-price pulse"></div>
            <div className="skeleton-availability pulse"></div>
            <div className="skeleton-brand pulse"></div>
            <div className="skeleton-description pulse"></div>
            <div className="skeleton-description pulse" style={{width: '80%'}}></div>
            <div className="skeleton-description pulse" style={{width: '60%'}}></div>
            <div className="skeleton-stock pulse"></div>
            <div className="skeleton-button pulse"></div>
            <div className="icons_skeleton">
              <div className="skeleton-icon pulse"></div>
              <div className="skeleton-icon pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductLoading;
