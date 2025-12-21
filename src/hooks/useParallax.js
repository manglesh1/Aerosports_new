'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for parallax scroll effects
 * @param {number} speed - Parallax speed multiplier (0.5 = 50% of scroll speed)
 * @param {number} direction - Direction: 'y' for vertical (default), 'x' for horizontal
 * @returns {Object} - { ref, offset }
 */
export const useParallax = (speed = 0.5, direction = 'y') => {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const element = ref.current;
      const elementRect = element.getBoundingClientRect();
      const scrollPosition = window.scrollY;
      const elementPosition = element.offsetTop;

      // Calculate how far into view the element is
      const distance = window.innerHeight - elementRect.top;

      if (distance > 0 && distance < window.innerHeight * 1.5) {
        if (direction === 'y') {
          const parallaxOffset = (scrollPosition - elementPosition) * speed;
          setOffset({ x: 0, y: parallaxOffset });
        } else if (direction === 'x') {
          const parallaxOffset = (scrollPosition - elementPosition) * speed;
          setOffset({ x: parallaxOffset, y: 0 });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return { ref, offset };
};

/**
 * Hook for mouse-based parallax effect (hover parallax)
 * @param {number} intensity - Parallax intensity (default 20)
 * @returns {Object} - { ref, offset }
 */
export const useMouseParallax = (intensity = 20) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const offsetX = (x - centerX) / centerX * intensity;
      const offsetY = (y - centerY) / centerY * intensity;

      setOffset({ x: offsetX, y: offsetY });
    };

    const handleMouseLeave = () => {
      setOffset({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity]);

  return { ref, offset };
};

/**
 * Hook for depth-based parallax on layered elements
 * @param {number} layer - Layer depth (1 = furthest, 3 = closest)
 * @returns {Object} - { ref, layerStyle }
 */
export const useLayerParallax = (layer = 1) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const scrollPosition = window.scrollY;
      const elementPosition = ref.current.offsetTop;
      const visibleDistance = window.innerHeight - (elementPosition - scrollPosition);

      if (visibleDistance > 0 && visibleDistance < window.innerHeight * 1.5) {
        const parallaxOffset = (scrollPosition - elementPosition) * (layer * 0.1);
        setOffset(parallaxOffset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [layer]);

  const layerStyle = {
    transform: `translateY(${offset}px)`,
    transition: 'transform 0.1s linear',
  };

  return { ref, layerStyle, offset };
};
