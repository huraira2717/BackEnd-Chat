const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../config/genrateToken"); // Ensure this path is correct
const Data = require("../Data/Data");

const registerUser = asyncHandler(async (req, res) => {
    // console.log("Incoming request body:", req.body); Log request body
res.json(Data);
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    
    const userExists = await User.findOne({ email});
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
console.log("Hashed password:", hashedPassword);


    // Create a new user
    const user = await User.create({
        name,
        email,
        password, // Store the hashed password
        pic,
    });

    // Respond with user data and token if user is created successfully
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(500);
        throw new Error("Failed to create user");
    }
});
const AuthenticateUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log("Incoming email and password:", email, password);

    // User find karna by email
    const user = await User.findOne({ email });
    if (user) {
        // Password comparison with bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch);

        // Agar password match karta hai toh response return karein
        if (isMatch) {
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id), // JWT token generate ho raha hai
            });
        }
    }

    // Invalid email/password case
    res.status(401).json({ message: "Invalid email or password" });
});


const getAllUsers = asyncHandler(async (req, res) => {
    const keywords = req.query.search
     ? {
    $or: [
        { 
            name: { $regex:req.query.search, $options: "i" },
            email: { $regex:req.query.search, $options: "i" },
        },
    ]
}:{};
const users=await User.find(keywords).find({ _id: { $ne: req.user._id } });
    res.send(users);

});

// Export the registerUser function
module.exports = { registerUser , AuthenticateUser , getAllUsers };
