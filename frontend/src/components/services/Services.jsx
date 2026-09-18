import "./Services.css";
import { services } from "./services";

const Services = () => {
  return (
    <section className="services" id="services">
      <div className="services-container">

        <div className="services-header">
          <span className="section-tag">Services</span>

          <h2>
            Capturing Every Chapter <br />
            of Your Story
          </h2>

          <p>
            From intimate portraits to grand celebrations, every photograph is
            crafted with emotion, creativity, and timeless elegance.
          </p>
        </div>


        <div className="services-grid">

          {services.map((service, index) => (
            <div
              className={`service-card ${service.className}`}
              key={index}
            >
              
              <img
                src={service.image}
                alt={service.title}
                className="service-image"
              />

              <div className="service-overlay"></div>

              <div className="service-content">

                <div className="service-top">
                  <span className="service-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* <button className="service-btn">
                    <FaArrowRight />
                  </button> */}
                </div>

                <div className="service-bottom">
                  <h3>{service.title}</h3>

                  <p>{service.description}</p>
                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Services;