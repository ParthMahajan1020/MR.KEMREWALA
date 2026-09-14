import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

window.contactAnimation = (sectionRef, contentRef, formRef) => {
  if (!sectionRef.current || !contentRef.current || !formRef.current) return;

  // Kill previous triggers (prevents duplicates during hot reload)
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.trigger === sectionRef.current) {
      trigger.kill();
    }
  });

  // Background zoom
  gsap.fromTo(
    sectionRef.current,
    {
      backgroundSize: "110%",
    },
    {
      backgroundSize: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );

  // Left content animation
  gsap.from(contentRef.current.children, {
    x: -80,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  // Form animation
  gsap.from(formRef.current, {
    x: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  // Inputs stagger animation
  const fields = formRef.current.querySelectorAll(
    ".input-group, .contact-btn"
  );

  gsap.from(fields, {
    y: 40,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: "power2.out",
    scrollTrigger: {
      trigger: formRef.current,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });
};