var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var signupModel = require('./signupSchema');

var signupSchema =  signupModel.signupModel.schema;

var chatSchema = {
	from: signupSchema,
	to: signupSchema,
	chat: String,
	attachment: String,
	chat_time: Date
}
var chatModel = mongoose.model("chat", chatSchema);

exports.chatModel = chatModel;