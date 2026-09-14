import React from "react";

const GlassOverlay = ({ glassRef }) => {
  return (
    <div className="glass-overlay" ref={glassRef}>
      <div className="glass-noise"></div>
    </div>
  );
};

export default GlassOverlay;