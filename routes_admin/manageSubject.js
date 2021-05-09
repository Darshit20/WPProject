var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const httpMsgs = require('http-msgs');
var subjectModel = require('../schemas/subjectSchema');
var subjectModel = subjectModel.subjectModel;
router.get("/managesubject", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "admin") {
            res.render('manageSubject', { userInfo: req.session.name, role: req.session.role, pic: req.session.pic });
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }
});
router.get("/subject", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "admin") {
            subjectModel.find({}, function(err, data) {
                res.status(200).json(data);
            })
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }
});

router.post("/insertsubject", function(req, res) {

    var subdata = req.body;
    var subject = new subjectModel({
        subject_id: mongoose.Types.ObjectId(),
        subject_name: subdata.models[0].subject_name

    })
    subject.save();
    httpMsgs.sendJSON(req, res, { 'status': "success" });
});


router.post("/updatesubject", function(req, res) {
    var sid = req.body.models[0].subject_id;
    console.log(sid);
    var query = { 'subject_id': sid };
    var newsubject = req.body.models[0].subject_name;

    subjectModel.updateOne({ subject_id: sid }, { subject_name: newsubject }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            httpMsgs.sendJSON(req, res, { 'status': "success" });
        }
    });
});

router.post("/deletesubject", function(req, res) {
    var sid = req.body.models[0].subject_id;
    subjectModel.deleteOne({ subject_id: sid }, function(err) {
        if (err) console.log(err);
        else httpMsgs.sendJSON(req, res, { 'status': "success" });
    });

})
module.exports = router;