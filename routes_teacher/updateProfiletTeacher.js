var express = require('express');
var router = express.Router();
var subjectModel = require('../schemas/subjectSchema');
var subjectModel = subjectModel.subjectModel;
var semModel = require('../schemas/semSchema');
var semModel = semModel.semModel;
var signupModel = require('../schemas/signupSchema');
var signupModel = signupModel.signupModel;
var roleModel = require('../schemas/roleSchema');
var roleModel = roleModel.roleModel;
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

router.get("/updateProfileTeacher", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "teacher") {
            subjectModel.find({}, function(err, subjectdata) {
                semModel.find({}, function(err, semdata) {
                    signupModel.findOne({ registred_id: req.session.uid }, function(err, details) {
                        res.render('updateProfileTeacher', { userInfo: details.name, role: req.session.role, subject_data: subjectdata, dob: details.dob, sem_data: semdata, email: details.email, gender: req.session.gender, pic: details.pic, checked_subject: JSON.stringify(details.subject), checked_sem: JSON.stringify(details.sem) });
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

router.post("/updateprofileteacher", upload.single('fileupd'), function(req, res) {

    var fileinfo = "";
    var name = req.body.name;
    var gender = req.body.gender;
    var sem = req.body.semdata;
    var subject = req.body.subject;
    var registred_id = req.session.uid;
    var dob = req.body.date;
    var obj = new Date(dob);
    obj = obj.toISOString();
    var result = "";
    signupModel.findOne({ registred_id: req.session.uid }, function(err, details) {
        if (!req.file) {
            fileinfo = details.pic;
            result = fileinfo;
        } else {
            fileinfo = req.file.path;
            result = fileinfo.substr(7);
        }
        semModel.find({ 'sem_id': { $in: sem } }, function(err, semdata) {
            subjectModel.find({ 'subject_id': { $in: subject } }, function(err, subjectdata) {
                signupModel.updateOne({ registred_id: registred_id }, { name: name, pic: result, dob: obj, gender: gender, subject: subjectdata, sem: semdata }, function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/indexteacher');
                    }
                });

            })
        })
    })
})
module.exports = router;