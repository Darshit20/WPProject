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

router.get("/managestudent", function (req, res) {
	if (req.session.uid) {
		if (req.session.role == "admin") {
			res.render('manageStudent', { userInfo: req.session.name, role: req.session.role, pic: req.session.pic });
		} else {
			res.redirect('/accessdenied');
		}
	} else {
		return res.redirect('/');
	}

});

router.get("/student", function (req, res) {
	if (req.session.uid) {
		if (req.session.role == "admin") {
			subjectModel.find({}, function (err, subjectdata) {
				semModel.find({}, function (err, semdata) {
					divisionModel.find({}, function (err, divisiondata) {
						signupModel.find({ "role_id.role_name": "student" }, function (err, data) {
							var obj = {
								semdata: semdata,
								userdata: data,
								divdata: divisiondata,
							}
							res.status(200).json(obj);
						})

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

router.post("/addstudent", function (req, res) {

	var email = req.body.email;
	var dob = req.body.dob;
	var gender = req.body.gender;
	var name = req.body.name;
	var Upass = ids.generate();
	var Upass1 = md5(Upass);
	var semester_id = req.body.semester;
	var division = req.body.division;

	if (email == "" || dob == "" || name == "" || semester_id == "" || division == "" || gender == "") {
		httpMsgs.sendJSON(req, res, { exist: "Fill all require data" });

	} else {
		signupModel.countDocuments({ email: email }, function (err, cnt) {
			console.log("total mail:-" + cnt);
			if (cnt > 0) {
				httpMsgs.sendJSON(req, res, { exist: "email already exist" });
			} else {
				httpMsgs.sendJSON(req, res, { exist: "Done" });
				roleModel.findOne({ role_name: "student" }, function (err, role) {
					semModel.find({ 'sem_id': semester_id }, function (err, semdata) {
						divisionModel.find({ 'division_id': division }, function (err, divisiondata) {
							var user = new signupModel({
								role_id: role,
								name: name,
								registred_id: mongoose.Types.ObjectId(),
								email: email,
								gender: gender,
								dob: dob,
								password: Upass1,
								sem: semdata,
								div: divisiondata,
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
										user: 'projectwp064@gmail.com',
										pass: 'wpnodejs'
									},
									logger: true,
									debug: false,
									from: 'projectwp064@gmail.com',
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
		});

	}

});

router.post("/updatestudent", function (req, res) {
	var register_id = req.body.registred_id;
	var email = req.body.email;
	var dob = req.body.dob;
	var gender = req.body.gender;
	var name = req.body.name;
	var semester_id = req.body.semester;
	var division = req.body.division;
	semModel.find({ 'sem_id': semester_id }, function (err, semdata) {
		divisionModel.find({ 'division_id': division }, function (err, divisiondata) {
			signupModel.updateOne({ registred_id: register_id }, { name: name, email: email, dob: dob, gender: gender, div: divisiondata, sem: semdata }, function (err, result) {
				if (err) {
					console.log(err);
				} else {
					httpMsgs.sendJSON(req, res, { 'status': "success" });
				}
			});
		});
	});
});
router.post("/deletestudent", function (req, res) {
	var registred_id = req.body.registred_id;
	signupModel.deleteOne({ registred_id: registred_id }, function (err) {
		if (err) console.log(err);
		else httpMsgs.sendJSON(req, res, { 'status': "success" });
	});
});

module.exports = router;