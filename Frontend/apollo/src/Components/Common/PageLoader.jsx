import React from 'react';
import './PageLoader.css';

function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="page-loader" role="status" aria-live="polite" aria-label={message}>
      <div className="page-loader-spinner" />
      <p>{message}</p>
    </div>
  );
}

export default PageLoader;