import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Navigation } from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";

import "swiper/css";
import "yet-another-react-lightbox/styles.css";

const GalleryGrid = ({ images, categoryTitle }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = images.map((image) => ({
    src: image,
    alt: `${categoryTitle} photograph`,
    description: `${categoryTitle} collection`,
  }));

  return (
    <>
      <div className="gallery-exhibition">
        <div className="gallery-slider">
        <Swiper
          modules={[A11y, Keyboard, Navigation]}
          navigation={{
            nextEl: ".gallery-next",
            prevEl: ".gallery-prev",
          }}
          keyboard={{ enabled: true }}
          onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
          grabCursor={true}
          loop={false}
          speed={850}
          spaceBetween={18}
          centeredSlides={true}
          watchOverflow={true}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 1.25,
            },
            1024: {
              slidesPerView: 1.45,
            },
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <button
                type="button"
                className="gallery-card"
                aria-label={`View ${categoryTitle} photograph ${index + 1} fullscreen`}
                onClick={() => {
                  setCurrentIndex(index);
                  setOpen(true);
                }}
              >
                <img
                  src={image}
                  alt={`${categoryTitle} photograph ${index + 1}`}
                  loading="lazy"
                  draggable="false"
                />
                <span className="gallery-card-caption">Open frame</span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
        </div>

        <div className="gallery-controls">
          <button type="button" className="gallery-arrow gallery-prev" aria-label="Previous photograph">
            <span aria-hidden="true">&#8592;</span>
          </button>
          <span className="gallery-index">{String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
          <button type="button" className="gallery-arrow gallery-next" aria-label="Next photograph">
            <span aria-hidden="true">&#8594;</span>
          </button>
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={currentIndex}
        on={{ view: ({ index }) => setCurrentIndex(index) }}
        carousel={{ finite: true, preload: 2 }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  );
};

export default GalleryGrid;