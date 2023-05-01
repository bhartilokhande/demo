const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");
const d = "bharrt"

router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.post("/forgot_password", auth.forgotPassword);
router.post("/reset_password", auth.resetPassword);

module.exports = router;
