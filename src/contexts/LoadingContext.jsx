import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading');
  const timerRef = useRef(null);

  const startLoading = useCallback((text = 'Loading', duration = 1200) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setLoadingText(text);
    setIsLoading(true);

    // Safety fallback so the overlay never gets stuck.
    timerRef.current = window.setTimeout(() => {
      setIsLoading(false);
      timerRef.current = null;
    }, duration);
  }, []);

  const stopLoading = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, loadingText, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}
