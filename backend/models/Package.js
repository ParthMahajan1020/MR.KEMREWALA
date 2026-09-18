const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    description: { type: String, default: "", trim: true },
    price: { type: Number, min: 0, default: null },
    duration: { type: String, default: "" },
    photographers: { type: Number, min: 1, default: 1 },
    editedPhotos: { type: Number, min: 0, default: null },
    features: [{ type: String, trim: true }],
    addOns: [{ type: String, trim: true }],
    active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Package", packageSchema);
