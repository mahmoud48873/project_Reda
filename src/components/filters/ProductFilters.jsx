import React from 'react';
import { FaFilter, FaRedo, FaSortAmountDown } from 'react-icons/fa';
import './ProductFilters.css';

export default function ProductFilters({
  products = [],
  priceRange = [0, 2000],
  setPriceRange,
  maxPriceLimit = 2000,
  minRating = 0,
  setMinRating,
  sortBy = 'default',
  setSortBy,
  selectedBrand = '',
  setSelectedBrand,
  onReset
}) {
  // Extract unique brands from current products
  const brands = Array.from(
    new Set(products.map(p => p.brand).filter(Boolean))
  );

  return (
    <div className="product_filters_card">
      <div className="filters_header">
        <h3><FaFilter /> Filters & Sorting</h3>
        <button className="reset_filters_btn" onClick={onReset} title="Reset all filters">
          <FaRedo /> Reset
        </button>
      </div>

      {/* Sort By */}
      <div className="filter_group">
        <label><FaSortAmountDown /> Sort By</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="default">Featured / Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
          <option value="title-asc">Title: A to Z</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="filter_group">
        <div className="filter_label_row">
          <label>Price Limit</label>
          <span className="price_val">${priceRange[1]}</span>
        </div>
        <input
          type="range"
          min="0"
          max={maxPriceLimit}
          step="10"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="price_slider"
        />
        <div className="slider_range_labels">
          <span>$0</span>
          <span>${maxPriceLimit}</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="filter_group">
        <label>Minimum Rating</label>
        <div className="rating_filter_options">
          {[0, 3, 4, 4.5].map((stars) => (
            <button
              key={stars}
              className={`rating_opt_btn ${minRating === stars ? 'active' : ''}`}
              onClick={() => setMinRating(stars)}
            >
              {stars === 0 ? 'All' : `${stars}+ ⭐`}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="filter_group">
          <label>Brand</label>
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
            <option value="">All Brands ({brands.length})</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
