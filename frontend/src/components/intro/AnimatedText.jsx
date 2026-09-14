import React from "react";

const AnimatedText = ({ textRef }) => {
  const brand = "KEMREWALA".split("");

  return (
    <div className="intro-text" ref={textRef}>
      <div className="intro-heading">
        <span className="word word-1">Every</span>
        <span className="word word-2">Frame</span>
      </div>

      <div className="intro-subheading">
        <span className="word word-3">Tells</span>
        <span className="word word-4">A</span>
        <span className="word word-5">Story</span>
      </div>

      <div className="intro-brand">
        <span className="letter letter-m">M</span>
        <span className="letter letter-r">R</span>
        <span className="letter letter-dot">.</span>

        <div className="brand-name">
          {brand.map((letter, index) => (
            <span
              key={index}
              className={`brand-letter brand-letter-${index}`}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedText;