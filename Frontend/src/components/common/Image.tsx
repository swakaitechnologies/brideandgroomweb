import React from "react";

/**
 * Bride&Groom Common Image Component
 * Replaces next/image with a standard img tag for Vite/React SPA.
 * Handles Next.js props (fill, priority, unoptimized) for compatibility.
 */
interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
}

export const Image = ({ fill, priority, unoptimized, className, ...props }: ImageProps) => {
  const fillStyles: React.CSSProperties = fill ? {
    position: 'absolute',
    height: '100%',
    width: '100%',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    objectFit: 'cover',
  } : {};

  // priority → native fetchpriority for eager loading
  const fetchProps = priority ? { fetchPriority: "high" as const, loading: "eager" as const } : {};

  // Standard img tag with compatibility styles
  return (
    <img 
      className={className} 
      style={{ ...fillStyles, ...props.style }} 
      {...fetchProps}
      {...props} 
    />
  );
};
