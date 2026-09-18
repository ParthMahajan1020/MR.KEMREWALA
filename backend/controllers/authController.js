const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const tokenFor = (user) => jwt.sign({ id: user._id.toString(), role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password || password.length < 8) return res.status(400).json({ success: false, message: "Name, email and an 8-character password are required." });
        const normalizedEmail = email.toLowerCase().trim();
        if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ success: false, message: "An account already exists for this email." });
        const user = await User.create({ name, email: normalizedEmail, passwordHash: await bcrypt.hash(password, 12) });
        res.status(201).json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: tokenFor(user) });
    } catch (error) { res.status(500).json({ success: false, message: "Could not create account." }); }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: String(email || "").toLowerCase().trim() }).select("+passwordHash");
        if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) return res.status(401).json({ success: false, message: "Invalid email or password." });
        res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: tokenFor(user) });
    } catch (error) { res.status(500).json({ success: false, message: "Could not sign in." }); }
};

const me = async (req, res) => {
    const user = await User.findById(req.user.id).select("name email role createdAt");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.json({ success: true, user });
};

const ensureAdmin = async () => {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return;
    const email = process.env.ADMIN_EMAIL.toLowerCase().trim();
    const exists = await User.findOne({ email });
    if (!exists) await User.create({ name: process.env.ADMIN_NAME || "MR.KEMREWALA Admin", email, passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12), role: "admin" });
};

module.exports = { register, login, me, ensureAdmin };
