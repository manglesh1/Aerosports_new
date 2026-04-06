'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for triggering animations on scroll
 * @param {Object} options - Configuration options
 * @param {string} options.animation - Animation name (e.g., 'fadeInUp', 'slideInLeft')
 * @param {number} options.threshold - Intersection threshold (0-1, default 0.2)
 * @param {boolean} options.once - Trigger animation only once (default true)
 * @param {number} options.duration - Animation duration in ms (optional)
 * @returns {Object} - { ref, isVisible }
 */
export const useScrollAnimation = (options = {}) => {
  const {
    animation = 'fadeInUp',
    threshold = 0.2,
    once = true,
    duration = null,
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasAnimated || !once) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, once, hasAnimated]);

  const animationStyle = isVisible
    ? {
        animation: `${animation} 0.6s var(--ease-in-out) forwards`,
        ...(duration && { animationDuration: `${duration}ms` }),
      }
    : {
        opacity: 0,
      };

  return { ref, isVisible, animationStyle };
};

/**
 * Hook for staggered animations on multiple elements
 * @param {number} itemCount - Number of items to stagger
 * @param {Object} options - Configuration options
 * @returns {Object} - { containerRef, getItemProps }
 */
export const useStaggerAnimation = (itemCount, options = {}) => {
  const {
    animation = 'fadeInUp',
    staggerDelay = 100,
    threshold = 0.2,
    once = true,
  } = options;

  const containerRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasAnimated || !once) {
            // Animate all items in sequence
            const newVisibleItems = new Set();
            for (let i = 0; i < itemCount; i++) {
              newVisibleItems.add(i);
            }
            setVisibleItems(newVisibleItems);
            setHasAnimated(true);
          }
        } else if (!once) {
          setVisibleItems(new Set());
        }
      },
      { threshold }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [itemCount, threshold, once, hasAnimated]);

  const getItemProps = (index) => ({
    style: visibleItems.has(index)
      ? {
          animation: `${animation} 0.6s var(--ease-in-out) forwards`,
          animationDelay: `${index * staggerDelay}ms`,
        }
      : {
          opacity: 0,
        },
  });

  return { containerRef, getItemProps, visibleItems };
};

/**
 * Hook for scroll-triggered counter animations
 * @param {number} end - Final value to count to
 * @param {Object} options - Configuration options
 * @returns {Object} - { ref, count }
 */
export const useCountUpAnimation = (end, options = {}) => {
  const {
    start = 0,
    duration = 2000,
    threshold = 0.5,
  } = options;

  const ref = useRef(null);
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let animationFrameId;
    let startTime;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentCount = Math.floor(start + (end - start) * progress);
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [hasStarted, start, end, duration]);

  return { ref, count };
};

/**
 * Hook for scroll-based progress bar or animation
 * @param {Object} options - Configuration options
 * @returns {Object} - { progress, ref }
 */
export const useScrollProgress = (options = {}) => {
  const { threshold = 0.2 } = options;
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const elementRect = element.getBoundingClientRect();
      const elementTop = elementRect.top;
      const elementBottom = elementRect.bottom;
      const elementHeight = elementRect.height;

      // Calculate progress from 0 to 1
      const windowHeight = window.innerHeight;
      const scrollProgress = 1 - (elementTop / (windowHeight + elementHeight));
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

      setProgress(clampedProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { ref, progress };
};

/**
 * Hook for parallax scroll with animation
 * @param {Object} options - Configuration options
 * @returns {Object} - { ref, style }
 */
export const useScrollParallax = (options = {}) => {
  const { speed = 0.5, startAnimation = 'fadeInUp' } = options;

  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => {
      if (!ref.current) return;

      const elementPosition = ref.current.offsetTop;
      const scrollPosition = window.scrollY;
      const offset = (scrollPosition - elementPosition) * speed;

      setOffset(offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible, speed]);

  const style = {
    transform: `translateY(${offset}px)`,
    ...(isVisible && {
      animation: `${startAnimation} 0.6s var(--ease-in-out) forwards`,
    }),
  };

  return { ref, style, isVisible };
};
