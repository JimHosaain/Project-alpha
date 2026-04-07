import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import './styles/loading.css';

let cachedPathLength = 0;
let stylesInjected = false;

const LOADER_KEYFRAMES = `
  @keyframes drawStroke {
    0% {
      stroke-dashoffset: var(--path-length);
      animation-timing-function: ease-in-out;
    }
    50% {
      stroke-dashoffset: 0;
      animation-timing-function: ease-in-out;
    }
    100% {
      stroke-dashoffset: calc(var(--path-length) * -1);
    }
  }
`;

const Loader = React.forwardRef(
  ({ size = 64, strokeWidth = 2, className = '' }, ref) => {
    const pathRef = useRef(null);
    const [pathLength, setPathLength] = useState(cachedPathLength);

    useEffect(() => {
      if (typeof window !== 'undefined' && !stylesInjected) {
        stylesInjected = true;
        const style = document.createElement('style');
        style.innerHTML = LOADER_KEYFRAMES;
        document.head.appendChild(style);
      }

      if (!cachedPathLength && pathRef.current) {
        cachedPathLength = pathRef.current.getTotalLength();
        // Defer state update to avoid synchronous setState inside effect.
        window.requestAnimationFrame(() => {
          setPathLength(cachedPathLength);
        });
      }
    }, []);

    const isReady = pathLength > 0;

    return (
      <svg
        ref={ref}
        role="status"
        aria-label="Loading..."
        viewBox="0 0 19 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        className={`loader-svg ${className}`}
      >
        <path
          ref={pathRef}
          d="M4.43431 2.42415C-0.789139 6.90104 1.21472 15.2022 8.434 15.9242C15.5762 16.6384 18.8649 9.23035 15.9332 4.5183C14.1316 1.62255 8.43695 0.0528911 7.51841 3.33733C6.48107 7.04659 15.2699 15.0195 17.4343 16.9241"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={isReady ? {
            strokeDasharray: pathLength,
            '--path-length': pathLength,
          } : undefined}
          className={isReady ? 'loader-path' : 'loader-path-hidden'}
        />
      </svg>
    );
  }
);

Loader.displayName = "Loader";

export function LoadingBreadcrumb({ text = "Cooking", className = '' }) {
  return (
    <div className={`loading-breadcrumb ${className}`}>
      <Loader 
        size={18} 
        strokeWidth={2.5} 
        className="loader-icon" 
      />
      
      <span className="shimmer-text">
        {text}
      </span>
      
      <ChevronRight size={16} className="chevron-icon" />
    </div>
  );
}

export default function LoadingBreadcrumbDemo() {
  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem' 
    }}>
      <LoadingBreadcrumb />
    </div>
  );
}
