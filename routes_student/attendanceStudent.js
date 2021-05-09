var express = require('express');
var router = express.Router();
const session = require('express-session');
const mongoose = require("mongoose");
const md5 = require('md5');
const httpMsgs = require('http-msgs');
var attendanceModel = require('../schemas/attendanceSchema');
var attendanceModel = attendanceModel.attendanceModel;



router.get("/attendanceStudent", async function(req, res) {
    var subjects = [];
    var totaldays = [];
    var presentdays = [];

    if (req.session.uid) {
        if (req.session.role == "student") {
            var attendance_data = await attendanceModel.find({ 'student.registred_id': req.session.uid }, 'subject.subject_name').distinct('subject.subject_name').exec();
            for (let index = 0; index < attendance_data.length; index++) {
                var countTotal = await attendanceModel.countDocuments({ 'student.registred_id': req.session.uid, 'subject.subject_name': attendance_data[index] }).exec();
                var countPresent = await attendanceModel.countDocuments({ 'student.registred_id': req.session.uid, 'subject.subject_name': attendance_data[index], 'attendance': "Present" }).exec();
                subjects.push(attendance_data[index]);
                totaldays.push(countTotal);
                presentdays.push(countPresent);
            }
            res.render('attendanceStudent', { userInfo: req.session.name, role: req.session.role, pic: req.session.pic, userId: req.session.uid, subjectdetail: subjects, total: totaldays, present: presentdays });




        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }

});

module.exports = router;