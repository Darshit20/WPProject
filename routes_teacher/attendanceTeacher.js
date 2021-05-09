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

router.get("/attendanceteacher", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "teacher") {
            signupModel.find({ registred_id: req.session.uid }, function(err, data) {
                //console.log(JSON.parse(JSON.stringify(data))[0])
                res.render('attendanceteacher', { userInfo: req.session.name, role: req.session.role, userId: req.session.uid, subject_data: JSON.parse(JSON.stringify(data))[0].subject, sem_data: JSON.parse(JSON.stringify(data))[0].sem, pic: req.session.pic });
            });
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }


});

router.post("/getrecord", function(req, res) {
    var div = req.body.div;
    var sem = req.body.sem;
    var dob = req.body.date;
    console.log(dob);
    if (dob == "") {
        httpMsgs.sendJSON(req, res, "Please select date!");
    } else {
        semModel.findOne({ sem: sem }, function(err, semdata) {
            divisionModel.findOne({ division: div }, function(err, divdata) {
                signupModel.find({ 'sem.sem': semdata.sem, 'div.division': divdata.division }, null, { sort: { name: 1 } }, function(err, getrecord) {
                    var records = JSON.parse(JSON.stringify(getrecord));
                    httpMsgs.sendJSON(req, res, records);
                })

            })
        });
    }
});
router.post("/savestudents", async function(req, res) {
    var details = JSON.parse(req.body.attendance);
    console.log(details);
    if (details != "") {
        for (var i = 0; i < details.length; i++) {
            var std_id = details[i].std_id;
            var std_status = details[i].std_status;
            var teacher_id = details[i].attendance_by;
            var day = details[i].attendance_on;
            var sub = details[i].sub;
            var rno = details[i].rollno;
            var student_data = await signupModel.findOne({ registred_id: std_id }).exec();
            var teacher_data = await signupModel.findOne({ registred_id: teacher_id }).exec();
            var subject_data = await subjectModel.findOne({ subject_name: sub }).exec();
            var studentattendance = new attendanceModel({
                id: mongoose.Types.ObjectId(),
                student: student_data,
                teacher: teacher_data,
                attendance: std_status,
                attendance_on: day,
                subject: subject_data,
                rollno: rno
            })
            studentattendance.save();



        }
        httpMsgs.sendJSON(req, res, { status: "Done" });
    } else {
        httpMsgs.sendJSON(req, res, { status: "Please fill the attendance first!" });

    }

});

module.exports = router;