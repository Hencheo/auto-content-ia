import React from 'react';

interface NeonButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const NeonButton = ({ label, isActive, onClick }: NeonButtonProps) => {
  return (
    <button
      className={`format-btn ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="fold" />
      <div className="points_wrapper">
        <i className="point" />
        <i className="point" />
        <i className="point" />
        <i className="point" />
        <i className="point" />
      </div>
      <span className="btn-label">{label}</span>
    </button>
  );
};
