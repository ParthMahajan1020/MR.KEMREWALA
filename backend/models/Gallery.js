const mongoose = require("mongoose");

const galleryPhotoSchema = new mongoose.Schema({
    url: { type: String, required: true, trim: true },
    title: { type: String, default: "" },
    status: { type: String, enum: ["UNSELECTED", "SELECTED", "FINAL"], default: "UNSELECTED" },
    comments: [{
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true, trim: true, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
    }],
}, { timestamps: true });

const gallerySchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },
    published: { type: Boolean, default: false },
    photos: [galleryPhotoSchema],
}, { timestamps: true });

module.exports = mongoose.model("Gallery", gallerySchema);
