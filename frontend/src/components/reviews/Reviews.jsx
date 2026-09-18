import { useEffect, useState } from "react";
import "./Reviews.css";
import { FaStar } from "react-icons/fa";

const Reviews = () => {
    const [rating, setRating] = useState(0);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        review: "",
    });

    const [reviews, setReviews] = useState([]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/reviews"
            );

            const data = await response.json();

            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error) {
            console.error("Fetch Reviews Error:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert("Please select a rating");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/reviews",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...formData,
                        rating,
                    }),
                }
            );

            const data = await response.json();

            alert(data.message);

            if (response.ok) {
                setFormData({
                    name: "",
                    email: "",
                    review: "",
                });

                setRating(0);

                fetchReviews();
            }
        } catch (error) {
            console.error("Review Error:", error);
            alert(error.message);
        }
    };

    useEffect(() => {
        const timer = window.setTimeout(fetchReviews, 0);
        return () => window.clearTimeout(timer);
    }, []);

    return (
        <section id="reviews" className="reviews-section">

            <div className="reviews-container">

                {/* LEFT - REVIEW FORM */}
                <div className="review-form-card">

                    <span className="review-tag">
                        CLIENT REVIEWS
                    </span>

                    <h2>
                        Share Your Experience
                    </h2>

                    <p>
                        Your feedback helps us create even
                        better memories.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        {/* STAR RATING */}
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    className={
                                        star <= rating
                                            ? "star active"
                                            : "star"
                                    }
                                    onClick={() =>
                                        setRating(star)
                                    }
                                />
                            ))}
                        </div>

                        <textarea
                            name="review"
                            rows="5"
                            placeholder="Write your review..."
                            value={formData.review}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit">
                            Submit Review
                        </button>

                    </form>
                </div>


                {/* RIGHT - REVIEWS */}
                <div className="reviews-content">

                    <div className="reviews-heading">
                        <span>WHAT CLIENTS SAY</span>

                        <h3>
                            Real Stories.
                            <br />
                            Real Experiences.
                        </h3>
                    </div>


                    <div className="reviews-list">

                        {reviews.length > 0 ? (

                            reviews.map((item) => (

                                <div
                                    className="review-card"
                                    key={item._id}
                                >

                                    <div className="review-card-top">

                                        <h4>
                                            {item.name}
                                        </h4>

                                        <div className="review-stars">
                                            {"★".repeat(item.rating)}
                                            {"☆".repeat(5 - item.rating)}
                                        </div>

                                    </div>

                                    <p className="review-text">
                                        "{item.review}"
                                    </p>

                                </div>

                            ))

                        ) : (

                            <div className="no-reviews">
                                <p>
                                    No reviews yet. Be the first
                                    to share your experience.
                                </p>
                            </div>

                        )}

                    </div>

                </div>

            </div>

        </section>
    );
};

export default Reviews;