import wedding from "./wedding.jpg";
import preWedding from "./prewedding.jpg";
import portrait from "./portrait.jpg";
import event from "./event.jpg";
import commercial from "./commercial.jpg";

export const services = [
  {
    title: "Wedding Photography",
    description:
      "Every laugh, every tear, and every unforgettable moment beautifully preserved for a lifetime.",
    image: wedding,
    className: "large",
  },

  {
    title: "Portrait Sessions",
    description:
      "Creative portraits that capture your personality with natural expressions and timeless style.",
    image: portrait,
    className: "small",
  },

  {
    title: "Pre-Wedding",
    description:
      "Romantic storytelling through cinematic photographs that celebrate your journey together.",
    image: preWedding,
    className: "small",
  },

  {
    title: "Commercial Photography",
    description:
      "Premium visual content crafted to elevate brands, products, and businesses with impact.",
    image: commercial,
    className: "large",
  },

  {
    title: "Event Photography",
    description:
      "From corporate events to private celebrations, every important moment is documented with precision.",
    image: event,
    className: "large",
  },
];