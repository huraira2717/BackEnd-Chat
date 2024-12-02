const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const JWT = require("jsonwebtoken");

const AuthMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    // Check if Authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]; // Extract token
            
            console.log("Token:", token); // Log token for debugging

            // Verify token with the secret key
            const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
            
            console.log("Decoded user ID:", decoded.id); // Log decoded ID for debugging

            req.user = await userModel.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Move to the next middleware
            next();
        } catch (error) {
            console.error("Token verification failed:", error.message); // Log only the error message

            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token expired" });
            }

            return res.status(401).json({ message: "Not authorized, token verification failed" });
        }
    } else {
        console.log("No Authorization header found");
        return res.status(401).json({ message: "Not authorized, token missing" });
    }
});

module.exports = { AuthMiddleware };
