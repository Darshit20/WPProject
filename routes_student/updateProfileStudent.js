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

router.get("/updateProfileStudent", function(req, res) {
    if (req.session.uid) {
        console.log(req.session.role);
        if (req.session.role == "student") {
            divisionModel.find({}, function(err, divisiondata) {
                semModel.find({}, function(err, semdata) {
                    signupModel.findOne({ registred_id: req.session.uid }, function(err, details) {
                        res.render('updateProfileStudent', { userInfo: details.name, role: req.session.role, division_data: divisiondata, dob: details.dob, sem_data: semdata, email: details.email, gender: req.session.gender, pic: details.pic, division: JSON.stringify(details.div), sem: JSON.stringify(details.sem) });
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

router.post("/updateprofilestudent", upload.single('fileupd'), function(req, res) {

    var name = req.body.name;
    var gender = req.body.gender;
    var sem = req.body.semdata;
    var division = req.body.divdata;
    var registred_id = req.session.uid;
    var dob = req.body.date;
    var obj = new Date(dob);
    obj = obj.toISOString();
    var result = "";
    signupModel.findOne({ registred_id: req.session.uid }, function(err, details) {

        if (!req.file) {
            fileinfo = details.pic;
            var result = fileinfo;
        } else {
            fileinfo = req.file.path;
            result = fileinfo.substr(7);
        }
        console.log(fileinfo);
        semModel.find({ 'sem_id': { $in: sem } }, function(err, semdata) {
            divisionModel.find({ 'division_id': { $in: division } }, function(err, divisiondata) {
                signupModel.updateOne({ registred_id: registred_id }, { name: name, pic: result, dob: obj, gender: gender, div: divisiondata, sem: semdata }, function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/indexstudent');
                    }
                });

            })
        })
    });
})
module.exports = router;