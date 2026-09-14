import "./App.css";
import Hero from './components/home/Home.jsx'
import Portfolio from "./components/portfolio/Portfolio.jsx"
import About from './components/about/about.jsx'
import Services from './components/services/Services.jsx'
import Contact from './components/contact/Contact.jsx'
import Footer from './components/footer/Footer.jsx'
import Intro from "./components/intro/Intro.jsx";
import Reviews from "./components/reviews/Reviews.jsx";
import { useRef, useState } from 'react'

const App = () => {
  const portfolioRef = useRef(null);
  const [introFinished, setIntroFinished] = useState(false);

  const handleIntroFinish = () => {
    setIntroFinished(true);
  };

  return (
    <>

      {!introFinished && (
        <Intro onFinish={handleIntroFinish} />
      )}

      <div className="website website-visible">
      <Hero portfolioRef={portfolioRef} />
      <Portfolio ref={portfolioRef} />
      <About />
      <Services />
      <Reviews />
      <Contact />
      <Footer />
      </div>
    </>
  )
}

export default App