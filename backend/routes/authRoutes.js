const express = require("express");
const { register, login, loginAdmin, me, updateProfile } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/admin/login", loginAdmin);
router.get("/me", authenticate, me);
router.patch("/me", authenticate, updateProfile);

module.exports = router;
