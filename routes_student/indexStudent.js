var express = require('express');
var router = express.Router();
const session = require('express-session');
const mongoose = require("mongoose");
const md5 = require('md5');
const httpMsgs = require('http-msgs');
var signupModel = require('../schemas/signupSchema');
var signupModel = signupModel.signupModel;
var announcementModel = require('../schemas/announcementSchema');
var announcementModel = announcementModel.announcementModel;

router.get("/indexstudent", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "student") {
            signupModel.findOne({ registred_id: req.session.uid, password: password1 }, function(err, obj) {
                req.session.name = obj.name;
                req.session.sem = obj.sem[0].sem
                req.session.dob = obj.dob;
                req.session.email = obj.email;
                req.session.gender = obj.gender;
                req.session.pic = obj.pic;
                console.log(req.session.sem);
                return res.render('indexStudent', { userInfo: req.session.name, role: req.session.role, userId: req.session.uid, pic: req.session.pic });
            })
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }
});
router.get("/getannouncementStudent", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "student") {
            signupModel.findOne({ registred_id: req.session.uid }, 'sem.sem', function(err, data) {
                announcementModel.find({ 'sem.sem': data.sem[0].sem }, function(err, announcementdata) {
                    httpMsgs.sendJSON(req, res, JSON.parse(JSON.stringify(announcementdata)));
                });

            });
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }

});



module.exports = router;