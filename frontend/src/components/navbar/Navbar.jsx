import { useEffect, useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        
        {/* Logo */}
        <a href="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-mark">MR</span>

          <span className="logo-text">
            MR.<span>KEMREWALA</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="navbar-links">

          <a href="#portfolio" className="nav-link">
            <span>01</span>
            WORK
          </a>

          <a href="#about" className="nav-link">
            <span>02</span>
            ABOUT
          </a>

          <a href="#services" className="nav-link">
            <span>03</span>
            SERVICES
          </a>

          <a href="#reviews" className="nav-link">
            <span>04</span>
            REVIEWS
          </a>

          <a href="#portal" className="nav-link">
            <span>05</span>
            PORTAL
          </a>

        </div>

        {/* Contact Button */}
        <a href="#contact" className="navbar-contact-btn">
          <span>LET'S TALK</span>
          <span className="contact-arrow">↗</span>
        </a>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>

        <div className="mobile-menu-inner">

          <p className="mobile-menu-label">
            NAVIGATION
          </p>

          <a href="#portfolio" onClick={closeMenu}>
            <span>01</span>
            WORK
          </a>

          <a href="#about" onClick={closeMenu}>
            <span>02</span>
            ABOUT
          </a>

          <a href="#services" onClick={closeMenu}>
            <span>03</span>
            SERVICES
          </a>

          <a href="#reviews" onClick={closeMenu}>
            <span>04</span>
            REVIEWS
          </a>

          <a href="#portal" onClick={closeMenu}>
            <span>05</span>
            PORTAL
          </a>

          <a
            href="#contact"
            className="mobile-contact"
            onClick={closeMenu}
          >
            LET'S TALK <span>↗</span>
          </a>

        </div>
      </div>
    </>
  );
};

export default Navbar;