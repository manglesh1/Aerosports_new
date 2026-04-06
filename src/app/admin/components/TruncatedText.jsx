import React, { useState, useRef, useEffect } from 'react';

const TruncatedText = ({ text, maxLines = 3 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const { current } = textRef;
    if (current && current.scrollHeight > current.offsetHeight) {
      setIsTruncated(true);
    }
  }, [text]);

  return (
    <div>
      <p
        ref={textRef}
        className={`text-xl ${!isExpanded && `line-clamp-${maxLines}`}`}
      >
       {text.slice(0,50)}
      </p>
      {isTruncated && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-blue-500 underline"
        >
          View More
        </button>
      )}
      {isExpanded && (
        <button
          onClick={() => setIsExpanded(false)}
          className="text-blue-500 underline"
        >
          View Less
        </button>
      )}
    </div>
  );
};

export default TruncatedText;
