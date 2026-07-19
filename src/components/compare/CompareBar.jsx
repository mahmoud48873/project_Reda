import React, { useContext } from 'react';
import { CompareContext } from '../context/CompareContext';
import { LanguageContext } from '../context/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import { FaBalanceScale, FaTimes, FaArrowRight, FaTrashAlt } from 'react-icons/fa';
import './CompareBar.css';

export default function CompareBar() {
  const { compareItems, removeFromCompare, clearCompare } = useContext(CompareContext) || {};
  const { t } = useContext(LanguageContext) || {};
  const location = useLocation();

  if (!compareItems || compareItems.length === 0 || location.pathname === '/compare') {
    return null;
  }

  return (
    <div className="compare_bar">
      <div className="container compare_bar_container">
        <div className="compare_bar_header">
          <FaBalanceScale className="compare_bar_icon" />
          <span>{t ? t('compareProducts') : 'Compare Products'} ({compareItems.length}/4)</span>
        </div>

        <div className="compare_bar_items">
          {compareItems.map(item => (
            <div key={item.id} className="compare_bar_item">
              <img src={item.images?.[0]} alt={item.title} />
              <p className="compare_item_title">{item.title}</p>
              <button className="remove_compare_btn" onClick={() => removeFromCompare(item.id)} title={t ? t('remove') : 'Remove'}>
                <FaTimes />
              </button>
            </div>
          ))}
        </div>

        <div className="compare_bar_actions">
          <button className="clear_compare_btn" onClick={clearCompare} title={t ? t('clearAll') : 'Clear all'}>
            <FaTrashAlt /> {t ? t('clear') : 'Clear'}
          </button>
          <Link to="/compare" className="btn btn-primary go_compare_btn">
            {t ? t('compareNow') : 'Compare Now'} <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
