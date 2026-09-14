import { useEffect, useRef } from "react";
import "./Intro.css";

import heroBlur from "./hero-blur.jpg";

import GlassOverlay from "./GlassOverlay";
import AnimatedText from "./AnimatedText";
import introTimeline from "./IntroTimeline";

const Intro = ({ onFinish }) => {
  const introRef = useRef(null);
  const glassRef = useRef(null);
  const textRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
  let timeline;
  let cancelled = false;

  document.body.style.overflow = "hidden";

  const image = new Image();

  image.src = heroBlur;

  image.onload = () => {
    if (cancelled) return;

    timeline = introTimeline({
      introRef,
      glassRef,
      textRef,
      backgroundRef,

      onFinish: () => {
        // Re-enable scrolling
        document.body.style.overflow = "";

        if (onFinish) {
          onFinish();
        }
      },
    });
  };

  return () => {
    cancelled = true;
    timeline?.kill();
    document.body.style.overflow = "";
  };
}, [onFinish]);

  return (
    <section className="intro" ref={introRef}>
      <div
        className="intro-background"
        ref={backgroundRef}
        style={{ backgroundImage: `url(${heroBlur})` }}
      ></div>

      <GlassOverlay glassRef={glassRef} />

      <AnimatedText textRef={textRef} />
    </section>
  );
};

export default Intro;