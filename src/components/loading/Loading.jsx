import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="skeleton-container container">
      <div className="skeleton-header"></div>
      <div className="skeleton-content">
        <div className="skeleton-box"></div>
        <div className="skeleton-box"></div>
        <div className="skeleton-box"></div>
        <div className="skeleton-box"></div>
        <div className="skeleton-box"></div>
      </div>
    </div>
  );
};

export default Loading;
