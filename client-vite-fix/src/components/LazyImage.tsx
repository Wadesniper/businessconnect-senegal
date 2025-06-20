import React, { useState, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  style?: React.CSSProperties;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  placeholderColor = '#f0f2f5',
  style,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;
    const image = new Image();
    image.src = src;
    image.onload = () => {
      // Petite attente pour rendre l'animation visible même sur les images en cache
      setTimeout(() => setIsLoaded(true), 100);
    };
  }, [src]);

  return (
    <div
      className={className}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: isLoaded ? 'transparent' : placeholderColor,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out',
        }}
      />
    </div>
  );
};

export default LazyImage; 