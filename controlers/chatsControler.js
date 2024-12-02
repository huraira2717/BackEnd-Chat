const express = require("express");
const Chat = require("../models/chatModels");
const User = require("../models/userModel");
const AyncHandler = require("express-async-handler");

const accessChats = AyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Backend-only validation
    if (!userId) {
        console.log("userId not provided");
        return res.status(400).json({ message: "userId is required" });
    }
    console.log("Received userId:", userId);

    // Dummy response for testing
    res.status(200).json({ message: "userId is valid", userId });
    console.log("Received userId:", userId);

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: userId } } },
            { users: { $elemMatch: { $eq: req.user._id } } }
        ]
    }).populate("users", "-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    });

    if (isChat.length > 0) {
        return res.send(isChat[0]);
    }

    const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId]
    };

    try {
        const createChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
            "users",
            "-password"
        );
        res.status(200).send(fullChat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = { accessChats };
