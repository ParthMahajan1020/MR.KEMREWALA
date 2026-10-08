const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const buildUserPayload = (user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    bio: user.bio || "",
    createdAt: user.createdAt,
});

const tokenFor = (user) => jwt.sign({
    id: user._id.toString(),
    role: user.role,
    name: user.name,
    email: user.email,
}, process.env.JWT_SECRET || "mr-kemrewala-dev-secret", { expiresIn: "7d" });

const validatePassword = (password) => {
    if (typeof password !== "string") return false;
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
};

const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email and password are required." });
        }

        if (password !== confirmPassword && confirmPassword !== undefined) {
            return res.status(400).json({ success: false, message: "Passwords do not match." });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters and include a letter and number." });
        }

        const normalizedEmail = normalizeEmail(email);
        const adminEmail = process.env.ADMIN_EMAIL ? normalizeEmail(process.env.ADMIN_EMAIL) : "";

        if (normalizedEmail === adminEmail) {
            return res.status(403).json({ success: false, message: "Admin accounts cannot be created from the public registration form." });
        }

        if (await User.exists({ email: normalizedEmail })) {
            return res.status(409).json({ success: false, message: "An account already exists for this email." });
        }

        const user = await User.create({
            name: String(name).trim(),
            email: normalizedEmail,
            passwordHash: await bcrypt.hash(password, 12),
            role: "client",
        });

        res.status(201).json({ success: true, user: buildUserPayload(user), token: tokenFor(user) });
    } catch (error) {
        res.status(500).json({ success: false, message: "Could not create account." });
    }
};

const performLogin = async (req, res, requestedRole = "client") => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = normalizeEmail(email);
        const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const isValidPassword = await bcrypt.compare(String(password || ""), user.passwordHash || "");
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        if (requestedRole === "admin" && user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Admin credentials are required for this portal." });
        }

        res.json({ success: true, user: buildUserPayload(user), token: tokenFor(user) });
    } catch (error) {
        res.status(500).json({ success: false, message: "Could not sign in." });
    }
};

const login = async (req, res) => {
    const requestedRole = String(req.body.role || "client").toLowerCase();
    return performLogin(req, res, requestedRole);
};

const loginAdmin = async (req, res) => {
    return performLogin(req, res, "admin");
};

const me = async (req, res) => {
    const user = await User.findById(req.user.id).select("name email role phone bio createdAt");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.json({ success: true, user: buildUserPayload(user) });
};

const updateProfile = async (req, res) => {
    try {
        const { name, email, phone, bio } = req.body;
        const updates = {};

        if (name !== undefined) {
            const trimmedName = String(name).trim();
            if (!trimmedName) return res.status(400).json({ success: false, message: "Name cannot be empty." });
            updates.name = trimmedName;
        }

        if (email !== undefined) {
            const normalizedEmail = normalizeEmail(email);
            if (normalizedEmail && normalizedEmail !== req.user.email) {
                const duplicate = await User.exists({ email: normalizedEmail, _id: { $ne: req.user.id } });
                if (duplicate) {
                    return res.status(409).json({ success: false, message: "This email is already in use." });
                }
            }
            updates.email = normalizedEmail;
        }

        if (phone !== undefined) updates.phone = String(phone).trim();
        if (bio !== undefined) updates.bio = String(bio).trim();
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: "No profile changes were provided." });
        }

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select("name email role phone bio createdAt");
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        res.json({ success: true, user: buildUserPayload(user), token: tokenFor(user) });
    } catch (error) {
        res.status(500).json({ success: false, message: "Could not update profile." });
    }
};

const ensureAdmin = async () => {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return;

    const email = normalizeEmail(process.env.ADMIN_EMAIL);
    let admin = await User.findOne({ email });

    if (!admin) {
        await User.create({
            name: process.env.ADMIN_NAME || "MR.KEMREWALA Admin",
            email,
            passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
            role: "admin",
        });
        return;
    }

    if (admin.role !== "admin") {
        admin.role = "admin";
        await admin.save();
    }
};

module.exports = { register, login, loginAdmin, me, updateProfile, ensureAdmin };
