import React from 'react';
import styled from 'styled-components';

interface NeonButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const NeonButton = ({ label, isActive, onClick }: NeonButtonProps) => {
  // Generate unique IDs for filters based on label to avoid conflicts
  const idSuffix = label.replace(/\s+/g, '').toLowerCase();

  return (
    <StyledWrapper $isActive={isActive}>
      <div className="button-wrapper">
        {/* SVG Filters - Hidden but referenced */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter width="300%" x="-100%" height="300%" y="-100%" id={`unopaq-${idSuffix}`}>
            <feColorMatrix values="1 0 0 0 0 
            0 1 0 0 0 
            0 0 1 0 0 
            0 0 0 9 0" />
          </filter>
          <filter width="300%" x="-100%" height="300%" y="-100%" id={`unopaq2-${idSuffix}`}>
            <feColorMatrix values="1 0 0 0 0 
            0 1 0 0 0 
            0 0 1 0 0 
            0 0 0 3 0" />
          </filter>
          <filter width="300%" x="-100%" height="300%" y="-100%" id={`unopaq3-${idSuffix}`}>
            <feColorMatrix values="1 0 0 0.2 0 
            0 1 0 0.2 0 
            0 0 1 0.2 0 
            0 0 0 2 0" />
          </filter>
        </svg>

        <button className="real-button" onClick={onClick} />
        {/* Removed backdrop to clean up UI */}
        <div className="button-container">
          {/* Removed spin-blur to remove background glow */}
          <div className={`spin spin-intense`} style={{ filter: `blur(0.25em) url(#unopaq2-${idSuffix})` }} />
          {/* Removed backdrop */}
          <div className="button-border">
            <div className={`spin spin-inside`} style={{ filter: `blur(2px) url(#unopaq3-${idSuffix})` }} />
            <div className="button-content">{label}</div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $isActive: boolean }>`
  .button-wrapper {
    position: relative;
    /* Reduced margin for smaller screens */
    margin: 0 0.5em; 
  }

  .button-border {
    padding: 2px; /* Thinner border */
    inset: 0;
    background: #0005;
    border-radius: 12px; /* Standard radius instead of complex clip-path */
    position: relative;
    z-index: 1;
  }

  .button-content {
    justify-content: center;
    align-items: center;
    border: none;
    border-radius: 10px; /* Slightly smaller than border */
    /* Smaller dimensions */
    min-width: 80px;
    height: 36px;
    padding: 0 12px;
    
    background: #111215;
    display: flex;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    overflow: hidden;
    position: relative;
    z-index: 2;
  }

  .real-button {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    outline: none;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    opacity: 0;
  }

  /* Backdrop removed */

  .spin {
    position: absolute;
    inset: 0;
    z-index: -2;
    opacity: ${props => props.$isActive ? 1 : 0.3}; /* Active state visibility */
    overflow: hidden;
    transition: 0.3s;
    border-radius: 12px;
  }

  .real-button:hover ~ .button-container .spin {
    opacity: 1;
  }

  .spin-intense {
    inset: -2px;
  }

  .spin-inside {
    inset: -2px;
    z-index: 0;
  }

  .spin::before {
    content: "";
    position: absolute;
    inset: -150%;
    animation:
      speen 4s cubic-bezier(0.56, 0.15, 0.28, 0.86) infinite,
      woah 2s infinite; /* Faster animation for smaller size */
    animation-play-state: ${props => props.$isActive ? 'running' : 'paused'};
  }

  .real-button:hover ~ .button-container .spin::before {
    animation-play-state: running;
  }

  /* Colors adapted to project palette */
  .spin-blur::before {
    background: linear-gradient(90deg, #fbbf24 30%, #0000 50%, #21af24 70%); /* Gold to Green */
  }

  .spin-intense::before {
    background: linear-gradient(90deg, #fbbf24 20%, #0000 45% 55%, #21af24 80%);
  }

  .spin-inside::before {
    background: linear-gradient(90deg, #fbbf24 30%, #0000 45% 55%, #21af24 70%);
  }

  @keyframes speen {
    0% { rotate: 0deg; }
    100% { rotate: 360deg; }
  }

  @keyframes woah {
    0%, 100% { scale: 1; }
    50% { scale: 0.85; }
  }
`;
