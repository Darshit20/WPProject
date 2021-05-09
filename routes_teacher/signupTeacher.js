var express = require('express');
var router = express.Router();
const session = require('express-session');
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const md5 = require('md5');
const httpMsgs = require('http-msgs');
const ids = require('short-id');
var signupModel = require('../schemas/signupSchema');
var signupModel = signupModel.signupModel;
var roleModel = require('../schemas/roleSchema');
var roleModel = roleModel.roleModel;
var subjectModel = require('../schemas/subjectSchema');
var subjectModel = subjectModel.subjectModel;
var semModel = require('../schemas/semSchema');
var semModel = semModel.semModel;
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});
var upload = multer({ storage: storage });

router.get("/teacherRegistration", function(req, res) {
    subjectModel.find({}, function(err, subjectdata) {
        semModel.find({}, function(err, semdata) {

            res.render('registerTeacher', { subject_data: subjectdata, sem_data: semdata });
        })
    })
});

router.post("/teacherRegistration", upload.single('fileupd'), function(req, res) {


    var name = req.body.namej;
    console.log(name);
    var email = req.body.emailj;
    var gender = req.body.genderj;
    var sub = req.body.checked_subject1;
    var div = req.body.checked_div1;
    var sem = req.body.checked_sem1;
    var dob = req.body.dobj;
    var sem = req.body.sem;
    var path = req.body.pic;
    var Upass = ids.generate();
    var Upass1 = md5(Upass);
    console.log(sub);
    console.log("appjs mail:-" + email);
    signupModel.countDocuments({ email: email }, function(err, cnt) {
        console.log("total mail:-" + cnt);
        if (cnt > 0) {
            httpMsgs.sendJSON(req, res, { exist: "email already exist" });
        } else {
            httpMsgs.sendJSON(req, res, { exist: "Done" });
            roleModel.findOne({ role_name: "teacher" }, function(err, role) {
                subjectModel.find({ subject_id: { $in: sub } }, function(err, subdata) {
                    console.log(subdata);
                })
                console.log(role);
                var user = new signupModel({
                    role_id: role,
                    name: name,
                    registred_id: mongoose.Types.ObjectId(),
                    email: email,
                    subject: sub,
                    gender: gender,
                    dob: dob,
                    password: Upass1,
                    pic: path,
                    sem: sem
                })
                console.log(user);
                user.save();
            });

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
                    secure: false, // true for 465, false studefor other ports
                    auth: {
                        user: 'prayagdalal11@gmail.com',
                        pass: 'prayag11'
                    },
                    logger: true,
                    debug: false // include SMTP traffic in the logs
                        ,
                    from: 'prayagdalal11@gmail.com',
                });
                let message = {
                    to: email,
                    subject: "ACCOUNT DETAILS",
                    html: "<b>USER NAME:-</b><b>'" + name + "'</b><br><b>PASSWORD:-</b><b>'" + Upass + "'</b>" // html body
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
        }
    });

});
module.exports = router;