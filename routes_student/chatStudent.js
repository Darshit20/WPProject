var express = require('express');
const ejs = require("ejs");
const app = express();
app.set('view engine', 'ejs');
var router = express.Router();
const session = require('express-session');
const mongoose = require("mongoose");
const md5 = require('md5');
const httpMsgs = require('http-msgs');
var signupModel = require('../schemas/signupSchema');
var chatModel = require('../schemas/chatSchema');
var signupModel = signupModel.signupModel;
//var signupCollection=signupModel.signupModel.collection;
var chatModel = chatModel.chatModel;

router.get("/chatStudent", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "student") {
            signupModel.find({ registred_id: { $ne: req.session.uid } }, function(err, data) {
                res.render("chatStudent", { userInfo: req.session.name, role: req.session.role, pic: req.session.pic, userId: req.session.uid, chatStudents: data });
            });
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }

});

router.post("/plz", function(req, res) {

    var fromUserId = req.body.from1;
    var toUserId = req.body.to1;
    chatModel.find({ 'from.registred_id': fromUserId, 'to.registred_id': toUserId }, function(errFromData, inbox_data) {
        chatModel.find({ 'from.registred_id': toUserId, 'to.registred_id': fromUserId }, function(errFromData, inbox_data1) {
            inbox_data = inbox_data.concat(inbox_data1)
            inbox_data.sort(function(a, b) {
                return Date.parse(new Date(a.chat_time)) - Date.parse(new Date(b.chat_time));
            });
            httpMsgs.sendJSON(req, res, inbox_data);
        });
    });
});
router.post("/inbox", function(req, res) {
    var fromUserId = req.body.from1;
    var toUserId = req.body.to1;
    var chat_info = req.body.send_chat;
    console.log(chat_info);
    signupModel.findOne({ registred_id: fromUserId }, function(errFromData, fromUserData) {
        signupModel.findOne({ registred_id: toUserId }, function(errToData, toUserData) {
            console.log(fromUserData);
            var chatUser = new chatModel({
                from: fromUserData,
                to: toUserData,
                chat: chat_info,
                chat_time: Date.now()
            });
            chatUser.save();

        });
    });
    httpMsgs.sendJSON(req, res, { 'toUserId': toUserId });

});
module.exports = router;