import "./Footer.css";
import logo from "./logo.png"


import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

import {
  MdEmail,
  MdPhone,
  MdLocationOn,
} from "react-icons/md";

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        <div className="footer-brand">
          <img
            src={logo}
            alt="MR. Kemrewala"
            className="footer-logo"
          />

          <p className="footer-description">
            Capturing timeless moments with creativity, emotion, and a modern
            visual style. Every frame tells a unique story.
          </p>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>

          <a href="mailto:parthmaha28@gmail.com" className="footer-link">
            <MdEmail className="footer-icon" />
            <span>parthmaha28@gmail.com</span>
          </a>

          <a href="tel:+919373550012" className="footer-link">
            <MdPhone className="footer-icon" />
            <span>+91 9373550012</span>
          </a>

          <div className="footer-link">
            <MdLocationOn className="footer-icon" />
            <span>Pune, Maharashtra</span>
          </div>
        </div>

        <div className="footer-social">
          <h3>Follow Me</h3>

          <div className="social-icons">
            <a
              href="https://instagram.com/mr.kemrewala"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://x.com/@Parth_Maha1020"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
            >
              <FaXTwitter />
            </a>

            <a
              href="https://www.linkedin.com/in/parth-mahajan1020/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MR.KEMREWALA. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;