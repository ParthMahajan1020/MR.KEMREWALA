const crypto = require("crypto");
const Review = require("../models/Review");
const transporter = require("../config/mailConfig");


// Escape HTML to prevent user-submitted content from breaking the email
const escapeHtml = (text) => {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};


// =====================================================
// CREATE REVIEW
// =====================================================

const createReview = async (req, res) => {
    try {
        const { name, email, rating, review } = req.body;

        if (!name || !email || !rating || !review) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address.",
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5.",
            });
        }


        // Generate secure random token
        const actionToken = crypto.randomBytes(32).toString("hex");

        // Token valid for 24 hours
        const actionTokenExpires = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        );


        // Save review as PENDING
        const newReview = await Review.create({
            name,
            email,
            rating,
            review,
            approved: false,
            actionToken,
            actionTokenExpires,
        });


        // Backend URL
        const backendUrl =
            process.env.BACKEND_URL || "http://localhost:5000";


        const approveUrl =
            `${backendUrl}/api/reviews/approve/${actionToken}`;

        const deleteUrl =
            `${backendUrl}/api/reviews/delete/${actionToken}`;


        // Stars for email
        const stars = "★".repeat(Number(rating));


        // Send notification email to photographer
        await transporter.sendMail({
            from: `"MR.KEMREWALA Reviews" <${process.env.EMAIL}>`,
            to: process.env.EMAIL,
            subject: `New Client Review - ${name}`,

            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>New Client Review</title>
                </head>

                <body style="
                    margin:0;
                    padding:40px 20px;
                    background:#111;
                    font-family:Arial,Helvetica,sans-serif;
                    color:#fff;
                ">

                    <div style="
                        max-width:650px;
                        margin:auto;
                        background:#1b1b1b;
                        border:1px solid #333;
                        border-radius:16px;
                        padding:35px;
                    ">

                        <h1 style="
                            margin-top:0;
                            font-size:26px;
                        ">
                            New Client Review
                        </h1>

                        <p style="
                            color:#aaa;
                            font-size:15px;
                        ">
                            A new review has been submitted on your
                            photography website.
                        </p>

                        <hr style="
                            border:none;
                            border-top:1px solid #333;
                            margin:25px 0;
                        ">


                        <p>
                            <strong>Client Name:</strong><br>
                            ${escapeHtml(name)}
                        </p>

                        <p>
                            <strong>Client Email:</strong><br>
                            ${escapeHtml(email)}
                        </p>

                        <p>
                            <strong>Rating:</strong><br>

                            <span style="
                                color:#d4af37;
                                font-size:22px;
                            ">
                                ${stars}
                            </span>
                        </p>

                        <p>
                            <strong>Review:</strong>
                        </p>

                        <div style="
                            background:#111;
                            border-radius:10px;
                            padding:20px;
                            color:#ddd;
                            line-height:1.6;
                        ">
                            ${escapeHtml(review)}
                        </div>


                        <div style="
                            margin-top:35px;
                            text-align:center;
                        ">

                            <a href="${approveUrl}"
                               style="
                                    display:inline-block;
                                    background:#d4af37;
                                    color:#fff;
                                    text-decoration:none;
                                    padding:14px 24px;
                                    border-radius:8px;
                                    font-weight:bold;
                                    margin:5px;
                               ">
                                DISPLAY REVIEW
                            </a>


                            <a href="${deleteUrl}"
                               style="
                                    display:inline-block;
                                    background:#333;
                                    color:#fff;
                                    text-decoration:none;
                                    padding:14px 24px;
                                    border-radius:8px;
                                    font-weight:bold;
                                    margin:5px;
                               ">
                                DELETE REVIEW
                            </a>

                        </div>


                        <p style="
                            margin-top:30px;
                            color:#777;
                            font-size:12px;
                            text-align:center;
                        ">
                            These buttons are valid for 24 hours.
                        </p>

                    </div>

                </body>
                </html>
            `,
        });


        res.status(201).json({
            success: true,
            message:
                "Review submitted successfully. It will appear after approval.",
        });


    } catch (error) {
        console.error("Create Review Error:", error);

        res.status(500).json({
            success: false,
            message: "Review submitted, but notification email could not be sent.",
        });
    }
};


// =====================================================
// GET APPROVED REVIEWS
// =====================================================

const getApprovedReviews = async (req, res) => {
    try {

        const reviews = await Review.find({
            approved: true,
        })
            .select("-actionToken -actionTokenExpires")
            .sort({ createdAt: -1 });


        res.status(200).json({
            success: true,
            reviews,
        });


    } catch (error) {
        console.error("Get Reviews Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


// =====================================================
// APPROVE REVIEW
// =====================================================

const approveReview = async (req, res) => {
    try {

        const { token } = req.params;


        const review = await Review.findOne({
            actionToken: token,
            actionTokenExpires: {
                $gt: new Date(),
            },
        });


        if (!review) {
            return res.status(404).send(`
                <h1>Invalid or Expired Link</h1>
                <p>This review approval link is no longer valid.</p>
            `);
        }


        if (review.approved) {
            return res.send(`
                <h1>Review Already Displayed</h1>
                <p>This review has already been approved.</p>
            `);
        }


        review.approved = true;

        // Invalidate token after use
        review.actionToken = null;
        review.actionTokenExpires = null;

        await review.save();


        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Review Approved</title>
            </head>

            <body style="
                margin:0;
                padding:60px 20px;
                background:#111;
                color:white;
                font-family:Arial;
                text-align:center;
            ">

                <h1 style="color:#d4af37;">
                    Review Displayed Successfully
                </h1>

                <p>
                    The client review is now visible on your website.
                </p>

            </body>
            </html>
        `);


    } catch (error) {

        console.error("Approve Review Error:", error);

        res.status(500).send(`
            <h1>Something went wrong</h1>
            <p>Please try again later.</p>
        `);
    }
};


// =====================================================
// DELETE REVIEW
// =====================================================

const deleteReview = async (req, res) => {
    try {

        const { token } = req.params;


        const review = await Review.findOne({
            actionToken: token,
            actionTokenExpires: {
                $gt: new Date(),
            },
        });


        if (!review) {
            return res.status(404).send(`
                <h1>Invalid or Expired Link</h1>
                <p>This review deletion link is no longer valid.</p>
            `);
        }


        await Review.deleteOne({
            _id: review._id,
        });


        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Review Deleted</title>
            </head>

            <body style="
                margin:0;
                padding:60px 20px;
                background:#111;
                color:white;
                font-family:Arial;
                text-align:center;
            ">

                <h1 style="color:#d4af37;">
                    Review Deleted
                </h1>

                <p>
                    The review has been permanently removed.
                </p>

            </body>
            </html>
        `);


    } catch (error) {

        console.error("Delete Review Error:", error);

        res.status(500).send(`
            <h1>Something went wrong</h1>
            <p>Please try again later.</p>
        `);
    }
};


module.exports = {
    createReview,
    getApprovedReviews,
    approveReview,
    deleteReview,
};