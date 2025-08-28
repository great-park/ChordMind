"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { CARD_STYLES } from '../../constants/styles';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: any;
  className?: string;
  hoverEffect?: boolean;
  clickEffect?: boolean;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  style,
  className = '',
  hoverEffect = true,
  clickEffect = true,
  delay = 0,
  direction = 'up'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(30px)';
      case 'down': return 'translateY(-30px)';
      case 'left': return 'translateX(30px)';
      case 'right': return 'translateX(-30px)';
      default: return 'translateY(30px)';
    }
  };

  const handleClick = () => {
    if (clickEffect) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200);
    }
  };

  return (
    <Card
      ref={cardRef}
      style={{
        ...style,
        transform: isVisible ? 'none' : getInitialTransform(),
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered && hoverEffect 
          ? 'translateY(-8px) scale(1.02)' 
          : isVisible ? 'none' : getInitialTransform(),
        boxShadow: isHovered && hoverEffect
          ? '0 20px 40px rgba(0,0,0,0.15)'
          : style?.boxShadow || '0 4px 6px rgba(0,0,0,0.1)',
        cursor: hoverEffect ? 'pointer' : 'default',
        ...(isClicked && clickEffect && {
          transform: 'scale(0.95)',
          transition: 'transform 0.1s ease-in-out'
        })
      }}
      className={`animated-card ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {children}
    </Card>
  );
};

export default AnimatedCard;
