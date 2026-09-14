import { gsap } from "gsap";

const introTimeline = ({
    introRef,
    textRef,
    backgroundRef,
    onFinish,
}) => {

    const tl = gsap.timeline({

        defaults: {
            ease: "power3.out",
        },

        onComplete: () => {
            if (onFinish) onFinish();
        },

    });

    /* ===========================
        INITIAL STATES
    =========================== */

    gsap.set(".word", {
        opacity: 0,
        y: 80,
    });

    gsap.set(".letter", {
        opacity: 0,
        y: -100,
    });

    gsap.set(".brand-letter", {
        opacity: 0,
        y: -100,
    });

    gsap.set(backgroundRef.current, {
        scale: 1.08,
        filter: "blur(22px)",
    });

    gsap.set(".reveal-hero", {
        opacity: 0,
        scale: 1.08,
        filter: "blur(20px)",
    });

    /* ===========================
        WORD ANIMATION
    =========================== */

    tl.to(".word-1", {
        opacity: 1,
        y: 0,
        duration: 0.55,
    })

        .to(".word-2", {
            opacity: 1,
            y: 0,
            duration: 0.55,
        })

        .to(".word-3", {
            opacity: 1,
            y: 0,
            duration: 0.5,
        })

        .to(".word-4", {
            opacity: 1,
            y: 0,
            duration: 0.35,
        })

        .to(".word-5", {
            opacity: 1,
            y: 0,
            duration: 0.55,
        });

    /* ===========================
        MR.
    =========================== */

    tl.to(".letter-m", {
        opacity: 1,
        y: 0,
        duration: 0.35,
    })

        .to(".letter-r", {
            opacity: 1,
            y: 0,
            duration: 0.35,
        })

        .to(".letter-dot", {
            opacity: 1,
            y: 0,
            duration: 0.25,
        });

    /* ===========================
        KEMREWALA
    =========================== */

    tl.to(".brand-letter", {
        opacity: 1,
        y: 0,
        duration: 0.18,
        stagger: 0.08,
        ease: "back.out(1.7)",
    });

    /* ===========================
        PAUSE
    =========================== */

    /* ==========================================
     CINEMATIC WEBSITE REVEAL
  ========================================== */

    tl.to(textRef.current, {
            x: "100%",
            opacity: 0,
            duration: 1,
            ease: "expo.inOut",
        })

        /* Reveal Hero */

        .to(
            ".reveal-hero",
            {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: 1.2,
                ease: "expo.out",
            },
            "<"
        )

        /* Move the complete cover away so its background leaves with it. */

        .to(
            introRef.current,
            {
                x: "-100%",
                duration: 0.5,
                ease: "power4.inOut",
                pointerEvents: "none",
            },
            "<0.15"
        );

    return tl;
};

export default introTimeline;