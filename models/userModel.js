const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema =mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true , unique: true },
    password: { type: String, required: true },
    pic: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
    console.log("Entered Password:", enteredPassword);
    console.log("Hashed Password:", this.password);
    return await bcrypt.compare(enteredPassword,this.password);

};



userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

    
    

module.exports = mongoose.model("User", userSchema); 
