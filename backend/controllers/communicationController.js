const Message = require("../models/Message");
const Notification = require("../models/Notification");

const listMessages = async (req, res) => {
    const key = req.user.role === "admin" ? String(req.query.client || "") : `${req.user.id}:admin`;
    const messages = key ? await Message.find({ conversationKey: key }).populate("sender", "name role").sort({ createdAt: 1 }) : [];
    res.json({ success: true, messages });
};
const sendMessage = async (req, res) => {
    const recipient = req.user.role === "admin" ? req.body.recipient : (await require("../models/User").findOne({ role: "admin" }))?._id;
    if (!recipient || !req.body.text) return res.status(400).json({ success: false, message: "Recipient and message are required." });
    const conversationKey = req.user.role === "admin" ? `${recipient}:admin` : `${req.user.id}:admin`;
    const message = await Message.create({ conversationKey, sender: req.user.id, recipient, text: req.body.text });
    await Notification.create({ recipient, type: "NEW_MESSAGE", message: `New message from ${req.user.name}.`, link: "/dashboard/messages" });
    res.status(201).json({ success: true, message });
};
const listNotifications = async (req, res) => res.json({ success: true, notifications: await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 }).limit(50) });
const markNotificationRead = async (req, res) => res.json({ success: true, notification: await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user.id }, { readAt: new Date() }, { new: true }) });
module.exports = { listMessages, sendMessage, listNotifications, markNotificationRead };
