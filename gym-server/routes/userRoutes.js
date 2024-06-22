const express = require("express");
const router = express.Router();
const { signup, verifyEmail } = require("../controller/user/signup");

// User sign-up route
router.post("/signup", signup);
router.get("/verify-email", verifyEmail);

module.exports = router;
