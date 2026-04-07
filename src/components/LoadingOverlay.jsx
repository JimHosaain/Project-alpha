import React from 'react';
import { LoadingBreadcrumb } from './LoadingBreadcrumb';
import { useLoading } from '../contexts/LoadingContext';
import './styles/loading.css';

export function LoadingOverlay() {
  const { isLoading, loadingText } = useLoading();

  return (
    <div className={`loading-overlay ${isLoading ? 'active' : ''}`}>
      <div className="loading-overlay-content">
        <LoadingBreadcrumb text={loadingText} />
      </div>
    </div>
  );
}

export default LoadingOverlay;
