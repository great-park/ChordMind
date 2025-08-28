"use client";

import React, { useEffect, useRef } from 'react';

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  showParticles?: boolean;
  gradientType?: 'music' | 'creative' | 'learning' | 'custom';
  customColors?: string[];
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  className = '',
  showParticles = true,
  gradientType = 'music',
  customColors
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
  }>>([]);

  const getGradientColors = () => {
    switch (gradientType) {
      case 'music':
        return ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
      case 'creative':
        return ['#4facfe', '#00f2fe', '#43e97b', '#38f9d7'];
      case 'learning':
        return ['#fa709a', '#fee140', '#a8edea', '#fed6e3'];
      case 'custom':
        return customColors || ['#667eea', '#764ba2'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  const getGradientStyle = () => {
    const colors = getGradientColors();
    const angle = gradientType === 'music' ? '135deg' : '45deg';
    
    return {
      background: `linear-gradient(${angle}, ${colors.join(', ')})`,
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite'
    };
  };

  useEffect(() => {
    if (!showParticles || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [showParticles]);

  return (
    <div 
      className={`gradient-background ${className}`}
      style={getGradientStyle()}
    >
      {showParticles && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .gradient-background {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default GradientBackground;
