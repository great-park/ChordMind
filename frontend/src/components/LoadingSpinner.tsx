import React from 'react';
import { COLORS } from '../constants/styles';
import { LoadingSpinnerProps } from '../types/components';

const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(({
  size = 'md',
  text = '로딩 중...',
  variant = 'primary'
}) => {
  const sizeClass = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  }[size];

  const variantColor = (() => {
    switch (variant) {
      case 'primary': return COLORS.primary.main;
      case 'secondary': return COLORS.info.main;
      case 'success': return COLORS.success.main;
      case 'danger': return '#ef4444';
      case 'warning': return COLORS.warning.main;
      case 'info': return COLORS.info.main;
      default: return COLORS.primary.main;
    }
  })();
  const textColor = COLORS.text.secondary;

  return (
    <div className="text-center">
      <div 
        className={`spinner-border ${sizeClass}`} 
        role="status"
        style={{ color: variantColor }}
      >
        <span className="visually-hidden">{text}</span>
      </div>
      {text && (
        <p className="mt-2 mb-0" style={{ color: textColor }}>
          {text}
        </p>
      )}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner; 