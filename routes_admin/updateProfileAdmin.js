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
var divisionModel = require('../schemas/divisionSchema');
var divisionModel = divisionModel.divisionModel;
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

router.get("/updateprofileadmin", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "admin") {
            signupModel.findOne({ registred_id: req.session.uid }, function(err, details) {
                console.log(details.div);
                res.render('updateprofileadmin', { userInfo: req.session.name, role: req.session.role, name: details.name, dob: details.dob, email: details.email, gender: req.session.gender, pic: req.session.pic });
            })
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }
});

router.post("/updateprofileadmin", upload.single('fileupd'), function(req, res) {

    var name = req.body.name;
    var gender = req.body.gender;
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
        signupModel.updateOne({ registred_id: registred_id }, { name: name, pic: result, dob: obj, gender: gender }, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/indexadmin');
            }
        });
    });
})
module.exports = router;