import "./About.css"
import aboutImage from "./about.png"

import React from 'react'

const About = () => {
    return (
        <section className="about" id="about">
            <div className="about-left">
                <img src={aboutImage} alt="Behind the Scenes" />
            </div>

            <div className="about-right">
                <p className="about-tag">
                    ABOUT
                </p>

                <h2 className="about-title">
                    Capturing
                    <br />
                    <span>Moments</span>
                    That Last Forever.
                </h2>

                <p className="about-description">
                    Every photograph is more than a picture—it's a memory preserved
                    forever. What started as a simple passion has evolved into a
                    journey of capturing authentic emotions, timeless celebrations,
                    and stories that deserve to be remembered.
                </p>

                <p className="about-description">
                    From intimate portraits to grand weddings, every frame is crafted
                    with creativity, precision, and a love for storytelling.
                </p>

                <div className="about-stats">

                    <div className="stat">
                        <h3>100+</h3>
                        <span>Projects</span>
                    </div>

                    <div className="stat">
                        <h3>15+</h3>
                        <span>Years</span>
                    </div>

                    <div className="stat">
                        <h3>20+</h3>
                        <span>Awards</span>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default About;
