var express = require('express');
var router = express.Router();
const session = require('express-session');
const mongoose = require("mongoose");
const md5 = require('md5');
var signupModel = require('../schemas/signupSchema');
var signupModel = signupModel.signupModel;
const httpMsgs = require('http-msgs');
var announcementModel = require('../schemas/announcementSchema');
var announcementModel = announcementModel.announcementModel;


router.get("/indexTeacher", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "teacher") {
            announcementModel.find({}, function(err, announcementdata) {
                signupModel.findOne({ registred_id: req.session.uid, password: password1 }, function(err, obj) {
                    req.session.name = obj.name;
                    req.session.dob = obj.dob;
                    req.session.email = obj.email;
                    req.session.gender = obj.gender;
                    req.session.pic = obj.pic;
                    return res.render('indexTeacher', { userInfo: req.session.name, role: req.session.role, userId: req.session.uid, announcement: JSON.stringify(announcementdata), pic: req.session.pic });
                })
            })
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }
});

router.get("/getannouncement", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "teacher") {
            announcementModel.find({}, function(err, announcementdata) {
                httpMsgs.sendJSON(req, res, announcementdata);
            });
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }
});

module.exports = router;