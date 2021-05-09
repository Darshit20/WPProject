var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const md5 = require('md5');
const httpMsgs = require('http-msgs');
const ids = require('short-id');
var subjectModel = require('../schemas/subjectSchema');
var subjectModel = subjectModel.subjectModel;
var signupModel = require('../schemas/signupSchema');
var signupModel = signupModel.signupModel;
var semModel = require('../schemas/semSchema');
var semModel = semModel.semModel;
var divisionModel = require('../schemas/divisionSchema');
var divisionModel = divisionModel.divisionModel;
var roleModel = require('../schemas/roleSchema');
var roleModel = roleModel.roleModel;

router.get("/manageteacher", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "admin") {
            res.render('manageTeacher', { userInfo: req.session.name, role: req.session.role, pic: req.session.pic });
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }
});

router.get("/teacher", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "admin") {
            subjectModel.find({}, function(err, subjectdata) {
                semModel.find({}, function(err, semdata) {
                    signupModel.find({ "role_id.role_name": "teacher" }, function(err, data) {
                        var obj = {
                            semdata: semdata,
                            userdata: data,
                            subjectdata: subjectdata,
                        }
                        res.status(200).json(obj);
                    })
                })
            })
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }

});

router.post("/addteacher", function(req, res) {
    var subjects_id = [];
    var semesters_id = [];
    var email = req.body.email;
    var dob = req.body.dob;
    var gender = req.body.gender;
    var name = req.body.name;
    var Upass = ids.generate();
    var Upass1 = md5(Upass);
    subjects_id = req.body.subjects;
    semesters_id = req.body.semesters;
    if (email == "" || dob == "" || name == "" || semesters_id == "" || subjects_id == "" || gender == "") {
        httpMsgs.sendJSON(req, res, { exist: "Fill all require data" });

    } else {
        signupModel.countDocuments({ email: email }, function(err, cnt) {
            console.log("total mail:-" + cnt);
            if (cnt > 0) {
                httpMsgs.sendJSON(req, res, { exist: "email already exist" });
            } else {
                httpMsgs.sendJSON(req, res, { exist: "Done" });
                roleModel.findOne({ role_name: "teacher" }, function(err, role) {
                    semModel.find({ 'sem_id': { $in: semesters_id } }, function(err, semdata) {
                        subjectModel.find({ 'subject_id': { $in: subjects_id } }, function(err, subjectdata) {
                            var user = new signupModel({
                                role_id: role,
                                name: name,
                                registred_id: mongoose.Types.ObjectId(),
                                email: email,
                                subject: subjectdata,
                                gender: gender,
                                dob: dob,
                                password: Upass1,
                                sem: semdata,
                                pic: "https://cdn2.iconfinder.com/data/icons/green-2/32/expand-color-web2-23-512.png"
                            })
                            console.log(user);
                            user.save();
                            nodemailer.createTestAccount((err, account) => {
                                if (err) {
                                    console.error('Failed to create a testing account');
                                    console.error(err);
                                    return process.exit(1);
                                }
                                console.log('Credentials obtained, sending message...');
                                let transporter = nodemailer.createTransport({
                                    service: 'Gmail',
                                    host: "smtp.gmail.com",
                                    port: 587,
                                    requireTLS: true,
                                    secure: false,
                                    auth: {
                                        user: 'prayagdalal11@gmail.com',
                                        pass: 'prayag@2103$'
                                    },
                                    logger: true,
                                    debug: false,
                                    from: 'prayagdalal11@gmail.com',
                                });
                                let message = {
                                    to: email,
                                    subject: "ACCOUNT DETAILS",
                                    html: "<b>User Mail:</b><b>'" + email + "'</b><br><b>Password:</b><b>'" + Upass + "'</b>" // html body
                                };
                                transporter.sendMail(message, (error, info) => {
                                    if (error) {
                                        console.log('Error occurred');
                                        console.log(error.message);
                                        return process.exit(1);
                                    }
                                    console.log('Message sent successfully!');
                                    console.log(nodemailer.getTestMessageUrl(info));
                                });

                            });

                        });
                    });
                });
            }
        })

    }
});


router.post("/updateteacher", function(req, res) {
    var subjects_id = [];
    var semesters_id = [];
    var register_id = req.body.registred_id;
    var email = req.body.email;
    var dob = req.body.dob;
    var gender = req.body.gender;
    var name = req.body.name;
    subjects_id = req.body.subjects;
    semesters_id = req.body.semesters;
    semModel.find({ 'sem_id': { $in: semesters_id } }, function(err, semdata) {
        subjectModel.find({ 'subject_id': { $in: subjects_id } }, function(err, subjectdata) {
            signupModel.updateOne({ registred_id: register_id }, { name: name, email: email, dob: dob, gender: gender, subject: subjectdata, sem: semdata }, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    httpMsgs.sendJSON(req, res, { 'status': "success" });
                }
            });
        });
    });
});
router.post("/deleteteacher", function(req, res) {
    var registred_id = req.body.registred_id;
    signupModel.deleteOne({ registred_id: registred_id }, function(err) {
        if (err) console.log(err);
        else httpMsgs.sendJSON(req, res, { 'status': "success" });
    });
});

module.exports = router;