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
router.get("/studentRegistration", function(req, res) {
    res.render('registerStudent');
});

router.post("/studentRegistration", function(req, res) {
    var name = req.body.namej;
    var gender = req.body.genderj;
    var dob = req.body.dobj;
    var sem = req.body.semj;
    var div = req.body.divj;
    var Upass = ids.generate();
    var Upass1 = md5(Upass);
    var check_mail = req.body.emailj;
    console.log("appjs mail:-" + check_mail);
    signupModel.countDocuments({ email: check_mail }, function(err, cnt) {
        console.log("total mail:-" + cnt);
        if (cnt > 0) {
            httpMsgs.sendJSON(req, res, { exist: "email already exist" });
        } else {
            httpMsgs.sendJSON(req, res, { exist: "Done" });
            roleModel.findOne({ role_name: "student" }, function(err, role) {
                console.log(role);
                const user = new signupModel({
                    role_id: role,
                    name: name,
                    registred_id: mongoose.Types.ObjectId(),
                    email: check_mail,
                    gender: gender,
                    dob: dob,
                    sem: sem,
                    div: div,
                    password: Upass1
                })
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
                    to: check_mail,
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