const Booking = require("../models/Booking");
const Notification = require("../models/Notification");

const createBooking = async (req, res) => {
    try {
        const { preferredDate, eventType, location, details, phone, package: packageId, service: serviceId } = req.body;
        if (!preferredDate || !eventType || !location || !phone) return res.status(400).json({ success: false, message: "Date, event type, location and phone are required." });
        const booking = await Booking.create({ client: req.user.id, package: packageId || null, service: serviceId || null, preferredDate, eventType, location, details, phone });
        const admins = await require("../models/User").find({ role: "admin" }).select("_id");
        await Notification.insertMany(admins.map((admin) => ({ recipient: admin._id, type: "BOOKING_CREATED", message: `New booking request from ${req.user.name}.`, link: "/admin/bookings" })));
        res.status(201).json({ success: true, booking: await booking.populate(["package", "service"]) });
    } catch (error) { res.status(500).json({ success: false, message: "Could not submit booking." }); }
};

const listBookings = async (req, res) => {
    const filter = req.user.role === "admin" ? {} : { client: req.user.id };
    if (req.query.status) filter.status = req.query.status;
    const bookings = await Booking.find(filter).populate("client", "name email").populate("package service").sort({ preferredDate: 1 });
    res.json({ success: true, bookings });
};

const updateBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    if (req.user.role !== "admin" && booking.client.toString() !== req.user.id) return res.status(403).json({ success: false, message: "You cannot modify this booking." });
    if (req.user.role !== "admin" && req.body.status && req.body.status !== "CANCELLED") return res.status(403).json({ success: false, message: "Clients may only cancel bookings." });
    Object.assign(booking, req.body);
    await booking.save();
    if (req.user.role === "admin") await Notification.create({ recipient: booking.client, type: "BOOKING_UPDATED", message: `Your booking status is now ${booking.status}.`, link: "/dashboard/bookings" });
    res.json({ success: true, booking: await booking.populate(["package", "service", "client"]) });
};

module.exports = { createBooking, listBookings, updateBooking };
