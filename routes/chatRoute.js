const express = require("express");
const { AuthMiddleware } = require("../Middleware/AuthMiddleware");
const router=require("express").Router();
const { accessChats} = require("../controlers/chatsControler");
router.route("/").post(AuthMiddleware , accessChats);
// router.route("/").get(AuthMiddleware , fatchChats);
// router.route("/group").post(AuthMiddleware , createGroupChat);
// router.route("/rename").put(AuthMiddleware , renameGroup);
// router.route("/groupremove").put(AuthMiddleware , removeFromGroup);

module.exports = router;