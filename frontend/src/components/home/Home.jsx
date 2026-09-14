import Navbar from "../navbar/Navbar.jsx"
import './Home.css'
import DriftWall from './DriftWall';
import { portfolioData } from "../portfolio/portfolioData";

const Home = ({ portfolioRef }) => {

  const scrollToPortfolio = () => {
    portfolioRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const items = portfolioData.flatMap((category) =>
    category.images.map((image, index) => ({
      image,
      title: `${category.title} photograph ${index + 1}`,
    }))
  );

  return (
    <>
      <div
        className="hero reveal-hero">

        <Navbar />

        {/* DriftWall Background */}
        <div className="driftwall-container">
          <DriftWall
            items={items}
            columns={7}
            tileWidth={220}
            tileHeight={148}
            gap={16}
            tilt={12}
            turn={-10}
            perspective={1200}
            depth={100}
            speed={30}
            direction="up"
            variance={0.28}
            parallax={0.4}
            lift={48}
            fade={0.58}
            dim={0.5}
            overlayColor="#070707"
            radius={8}
            roll={0}
            pauseOnHover={false}
            grayscale={false}
          />
        </div>


        <div className="overlay"></div>

        <div className="hero-content">
          <h1>MR.KEMREWALA</h1>
          <p>We think Photos are the Emotion of Love</p>

          <button onClick={scrollToPortfolio}>View Portfolio</button>
        </div>

      </div>
    </>
  )
}

export default Home
