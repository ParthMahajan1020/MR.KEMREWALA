import "./Portfolio.css";
import { useState, forwardRef } from "react";
import { portfolioData } from "./portfolioData";
import CategoryTabs from "./CategoryTabs";
import GalleryGrid from "./GalleryGrid";

const Portfolio = forwardRef((props, ref) => {
  const [activeCategory, setActiveCategory] = useState("wedding");

  const selectedCategory = portfolioData.find(
    (item) => item.id === activeCategory
  );

  return (
    <section id="portfolio" ref={ref} className="portfolio">
      <h4>Featured Work</h4>
      <h2>Moments, Framed to Last</h2>

      <p>
        A curated collection of moments, emotions, and stories captured through my lens.
      </p>

      

      <CategoryTabs
        categories={portfolioData}
        active={activeCategory}
        setActive={setActiveCategory}
      />

      <div className="category-header">
        <div>
          <span>Collection 0{Math.max(1, portfolioData.indexOf(selectedCategory) + 1)}</span>
          <h3>{selectedCategory?.title}</h3>
        </div>
        <p>Six frames from a visual study in light, atmosphere, and human detail.</p>
      </div>

      <GalleryGrid
        images={selectedCategory?.images || []}
        categoryTitle={selectedCategory?.title || "Portfolio"}
      />
    </section>
  );
});

export default Portfolio;