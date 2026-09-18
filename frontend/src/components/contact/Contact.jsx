import { useEffect, useRef, useState } from 'react'
import "./Contact.css"
import "./contact.js"

import contactBG from "./contact.png"



const Contact = () => {
    const sectionRef = useRef(null)
    const contentRef = useRef(null)
    const formRef = useRef(null)

    useEffect(() => {
        if (window.conatct) {
            window.contact(sectionRef, contentRef, formRef)
        }
    }, [])

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);

                setFormData({
                    name: "",
                    phone: "",
                    email: "",
                    message: "",
                });
            } else {
                alert(data.message);
            };

        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
        }
    };

    return (
        <section
            id='contact'
            className='contact'
            ref={sectionRef}
            style={{
                backgroundImage: `url(${contactBG})`
            }}
        >
            <div className="contact-overlay">
                <div className="contact-content" ref={contentRef}>
                    <span className="contact-tag">BOOK A SHOOT</span>

                    <h2>
                        LET'S CREATE
                        <br />
                        SOMETHING
                        <br />
                        UNFORGETTABLE.
                    </h2>

                    <p>
                        Every great photographer starts with a simple conversation.
                        Tell me your vision, and together we'll turn it into timeless
                        memories.
                    </p>
                </div>

                <div className="contact-card" ref={formRef}>
                    <h3>BOOK YOUR SESSION</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <textarea
                                rows="5"
                                name="message"
                                placeholder="Tell me about your shoot..."
                                value={formData.message}
                                onChange={handleChange}
                            />
                        </div>

                        <button type='submit' className='contact-btn'>
                            Book Now
                        </button>
                    </form>
                </div>
            </div >
        </section >
    )
}

export default Contact
