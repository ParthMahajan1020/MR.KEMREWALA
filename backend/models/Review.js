const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        review: {
            type: String,
            required: true,
            trim: true,
        },

        approved: {
            type: Boolean,
            default: false,
        },

        actionToken: {
            type: String,
            default: null,
        },

        actionTokenExpires: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Review", reviewSchema);