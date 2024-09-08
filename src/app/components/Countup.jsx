"use client";

import React, { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";

const Countup = ({ num }) => {
  const [inView, setInView] = useState(false);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  return (
    <div ref={countRef}>
      {inView ? <CountUp end={num} duration={3} separator="," /> : num} +
    </div>
  );
};

export default Countup;
