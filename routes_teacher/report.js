var express = require('express');
var router = express.Router();
const session = require('express-session');
const mongoose = require("mongoose");
const md5 = require('md5');
const httpMsgs = require('http-msgs');
var signupModel = require('../schemas/signupSchema');
var signupModel = signupModel.signupModel;
var attendanceModel = require('../schemas/attendanceSchema');
var attendanceModel = attendanceModel.attendanceModel;
var semModel = require('../schemas/semSchema');
var semModel = semModel.semModel;
var divisionModel = require('../schemas/divisionSchema');
var divisionModel = divisionModel.divisionModel;
var subjectModel = require('../schemas/subjectSchema');
var subjectModel = subjectModel.subjectModel;

router.get("/report", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "teacher") {
            res.render('report', { userInfo: req.session.name, role: req.session.role, userId: req.session.uid, pic: req.session.pic });
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }

});

router.get("/getattendancedata", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "teacher") {
            attendanceModel.find({ 'teacher.registred_id': req.session.uid }, function(err, data) {

                console.log(res.status(200).json(data));

            })
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }

});

module.exports = router;