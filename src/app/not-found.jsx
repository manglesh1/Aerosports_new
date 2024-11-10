'use client'
import React from "react";
import { usePathname } from "next/navigation";
import './styles/notfound.css';

const NotFound = () => {
  const router = usePathname();
  const keyword = router?.split("/").pop() || "page";
  // console.log(keyword)

  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">
        Sorry&apos; we couldn&apos;t find the{" "}
        <span className="highlight">&quot; {keyword} &quot;</span> you were
        looking for.
      </p>
      <p className="suggestion">
        Try checking the URL or go back to the homepage.
      </p>
      <a href="/" className="not-found-link">
        Return to Home
      </a>
    </div>
  );
};

export default NotFound;
