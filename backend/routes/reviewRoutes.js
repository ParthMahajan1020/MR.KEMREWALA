const express = require("express");

const router = express.Router();

const {
    createReview,
    getApprovedReviews,
    approveReview,
    deleteReview,
} = require("../controllers/reviewController");


router.post("/", createReview);


router.get("/", getApprovedReviews);


router.get("/approve/:token", approveReview);

router.get("/delete/:token", deleteReview);


module.exports = router;