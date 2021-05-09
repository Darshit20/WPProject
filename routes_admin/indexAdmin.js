var express = require('express');
var router = express.Router();
var subjectModel = require('../schemas/subjectSchema');
var subjectModel = subjectModel.subjectModel;
var signupModel = require('../schemas/signupSchema');
var signupModel = signupModel.signupModel;
var semModel = require('../schemas/semSchema');
var semModel = semModel.semModel;
var divisionModel = require('../schemas/divisionSchema');
var divisionModel = divisionModel.divisionModel;



router.get("/indexadmin", function(req, res) {
    if (req.session.uid) {
        console.log(req.session.role);
        if (req.session.role == "admin") {
            signupModel.countDocuments({ 'role_id.role_name': 'student' }, function(err, countstudent) {
                signupModel.countDocuments({ 'role_id.role_name': 'teacher' }, function(err, countteacher) {
                    semModel.countDocuments({}, function(err, countsem) {
                        subjectModel.countDocuments({}, function(err, countsubject) {
                            divisionModel.countDocuments({}, function(err, countdiv) {
                                signupModel.findOne({ registred_id: req.session.uid, password: password1 }, function(err, obj) {
                                    req.session.name = obj.name;
                                    req.session.dob = obj.dob;
                                    req.session.email = obj.email;
                                    req.session.gender = obj.gender;
                                    req.session.pic = obj.pic;
                                    console.log(req.session.name);
                                    res.render('indexAdmin', { userInfo: req.session.name, role: req.session.role, userId: req.session.uid, totalsem: countsem, totaldiv: countdiv, totalsubject: countsubject, totalstudent: countstudent, totalteacher: countteacher, pic: req.session.pic });
                                })
                            })
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

module.exports = router;