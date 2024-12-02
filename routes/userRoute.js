const express = require("express");
const { registerUser, AuthenticateUser , getAllUsers } = require("../controlers/userControler");
const { AuthMiddleware } = require("../Middleware/AuthMiddleware");
const router = express.Router();
// router.route("/").get(registerUser);
router.route("/").post(registerUser).get(AuthMiddleware ,getAllUsers);
router.route("/login").get(AuthenticateUser);
router.route("/login").post(AuthenticateUser);

module.exports = router;
