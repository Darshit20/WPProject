var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const ids = require('short-id');
const nodemailer = require("nodemailer");
const md5 = require('md5');
const httpMsgs = require('http-msgs');
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});
var upload = multer({ storage: storage });
var signupModel = require('../schemas/signupSchema');
var signupModel = signupModel.signupModel;
var subjectModel = require('../schemas/subjectSchema');
var subjectModel = subjectModel.subjectModel;
var semModel = require('../schemas/semSchema');
var semModel = semModel.semModel;
var divisionModel = require('../schemas/divisionSchema');
var divisionModel = divisionModel.divisionModel;
var roleModel = require('../schemas/roleSchema');
var roleModel = roleModel.roleModel;

router.get("/manageteacherjquery", upload.single('fileupd'), function(req, res) {
    console.log(req.body.registred_id);
    divisionModel.find({}, function(err, divdata) {
        semModel.find({}, function(err, semdata) {
            subjectModel.find({}, function(err, subdata) {
                res.render('manageTeacherjquery', { subject_data: subdata, div_data: divdata, sem_data: semdata });

            })
        })
    })

});
router.get("/teacher", function(req, res) {

    signupModel.find({ "role_id.role_name": "teacher" }, function(err, data) {
        res.status(200).json(data);

    })


});
router.post("/registerteacher", upload.single('fileupd'), async function(req, res) {
    var fileinfo = req.body.pic;
    console.log(fileinfo);
    var name = req.body.namej;
    console.log(name);
    var email = req.body.emailj;
    var gender = req.body.genderj;
    var sub = req.body.checked_subject1;
    var sem = req.body.checked_sem1;
    var dob = req.body.dobj
    var path = req.body.pic;
    var Upass = ids.generate();
    var Upass1 = md5(Upass);


    var subjectrecords = await subjectModel.find().where('subject_id').in(sub).exec();
    var semrecords = await semModel.find().where('sem_id').in(sem).exec();
    signupModel.countDocuments({ email: email }, function(err, cnt) {
        console.log("total mail:-" + cnt);
        if (cnt > 0) {
            httpMsgs.sendJSON(req, res, { exist: "email already exist" });
        } else {
            httpMsgs.sendJSON(req, res, { exist: "Done" });
            roleModel.findOne({ role_name: "teacher" }, function(err, role) {
                var user = new signupModel({
                    role_id: role,
                    name: name,
                    registred_id: mongoose.Types.ObjectId(),
                    email: email,
                    subject: subjectrecords,
                    gender: gender,
                    dob: dob,
                    password: Upass1,
                    sem: semrecords,
                    pic: path
                })
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
            });
        }
    })



});




module.exports = router;