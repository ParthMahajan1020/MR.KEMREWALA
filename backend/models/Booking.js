const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package", default: null },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", default: null },
    preferredDate: { type: Date, required: true },
    eventType: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    details: { type: String, default: "", trim: true },
    phone: { type: String, required: true, trim: true },
    status: { type: String, enum: ["PENDING", "CONFIRMED", "REJECTED", "COMPLETED", "CANCELLED"], default: "PENDING" },
    adminNote: { type: String, default: "", trim: true },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
