var express = require('express');
var router = express.Router();
const session = require('express-session');
const mongoose = require("mongoose");
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
const md5 = require('md5');
const httpMsgs = require('http-msgs');
var signupModel = require('../schemas/signupSchema');
var signupModel = signupModel.signupModel;
var semModel = require('../schemas/semSchema');
var semModel = semModel.semModel;
var announcementModel = require('../schemas/announcementSchema');
var announcementModel = announcementModel.announcementModel;
const app = express();
//app.use(upload());
router.get("/announcementTeacher", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "teacher") {

            semModel.find({}, function(err, sem_data) {
                res.render('announcementTeacher', { userInfo: req.session.name, role: req.session.role, userId: req.session.uid, sem_data: sem_data, pic: req.session.pic });

            });
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }
});


router.post("/announcementTeacher", upload.single('fileupd'), async function(req, res) {
    var fileinfo = "";
    var sem = req.body.sem;
    var content = req.body.fromcontent;
    var id = req.session.uid;
    var result = "";
    if (!req.file) {
        fileinfo = "https://cdn2.iconfinder.com/data/icons/mixed-rounded-flat-icon/512/megaphone-64.png";
        result = fileinfo;
    } else {
        fileinfo = req.file.path;
        result = fileinfo.substr(7);

    }

    var teacher_data = await signupModel.findOne({ registred_id: id }).exec();
    var semrecords = await semModel.find().where('sem_id').in(sem).exec();
    var announcementdata = new announcementModel({
        id: mongoose.Types.ObjectId(),
        body: content,
        file: result,
        from: teacher_data,
        time: Date.now(),
        sem: semrecords
    })
    announcementdata.save();
    res.redirect('indexTeacher');

});

module.exports = router;