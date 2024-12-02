const express = require("express");
const dotenv = require("dotenv");
const userRoute = require('./routes/userRoute');
const conDB = require("./config/db");
const Data = require("./Data/Data");
const cors = require("cors");
const chatRoute = require("./routes/chatRoute"); 
const { errorHandler, NotFound } = require("./Middleware/ErrorHandle");

const app = express();
dotenv.config();
conDB();

// Corrected CORS middleware setup
app.use(cors());
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);

// Middleware for JSON parsing
app.use(express.json());

// Test route (optional)
app.get('/', (req, res) => {
    res.send("hello");
});

// User routes
app.use('/api/user', userRoute);

//User Chats Route
app.use('/api/chat', chatRoute);


// Error handling middlewares
app.use(NotFound);
app.use(errorHandler);

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
