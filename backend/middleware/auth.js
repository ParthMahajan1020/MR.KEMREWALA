const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) return res.status(401).json({ success: false, message: "Authentication required." });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || "mr-kemrewala-dev-secret");
        next();
    } catch {
        return res.status(401).json({ success: false, message: "Invalid or expired session." });
    }
};

const requireRole = (role) => (req, res, next) => {
    if (!req.user || req.user.role !== role) {
        return res.status(403).json({ success: false, message: role === "admin" ? "Admin access required." : "Access denied." });
    }
    next();
};

const requireAdmin = requireRole("admin");

module.exports = { authenticate, requireAdmin, requireRole };
