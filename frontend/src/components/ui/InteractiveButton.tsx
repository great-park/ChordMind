"use client";

import React, { useState, useRef } from 'react';
import { Button } from 'react-bootstrap';

interface InteractiveButtonProps {
  children: React.ReactNode;
  variant?: string;
  size?: 'sm' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  ripple?: boolean;
  glow?: boolean;
}

const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  children,
  variant = 'primary',
  size,
  className = '',
  onClick,
  disabled = false,
  loading = false,
  icon,
  ripple = true,
  glow = false
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ripple || disabled) return;

    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: rippleId.current++,
      x,
      y
    };

    setRipples(prev => [...prev, newRipple]);
    setIsPressed(true);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    if (onClick) {
      onClick();
    }
  };

  const getButtonStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isPressed ? 'scale(0.95)' : 'scale(1)',
      ...(glow && {
        boxShadow: `0 0 20px rgba(var(--bs-${variant}-rgb), 0.4)`,
        filter: 'brightness(1.1)'
      })
    };

    return baseStyle;
  };

  const getRippleStyle = (ripple: { id: number; x: number; y: number }) => ({
    position: 'absolute' as const,
    left: ripple.x - 10,
    top: ripple.y - 10,
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    transform: 'scale(0)',
    animation: 'ripple 0.6s linear',
    pointerEvents: 'none' as const
  });

  return (
    <>
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
      
      <Button
        ref={buttonRef}
        variant={variant}
        size={size}
        className={`interactive-button ${className}`}
        style={getButtonStyle()}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        disabled={disabled || loading}
      >
        {loading && (
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
        )}
        
        {icon && <span className="me-2">{icon}</span>}
        
        {children}
        
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            style={getRippleStyle(ripple)}
          />
        ))}
      </Button>
    </>
  );
};

export default InteractiveButton;
