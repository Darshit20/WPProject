var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const httpMsgs = require('http-msgs');
var semModel = require('../schemas/semSchema');
var semModel = semModel.semModel;
router.get("/managesem", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "admin") {
            res.render('manageSem', { userInfo: req.session.name, role: req.session.role, pic: req.session.pic });
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }
});
router.get("/sem", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "admin") {
            semModel.find({}, function(err, data) {
                res.status(200).json(data);
            })
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }
});

router.post("/insertsem", function(req, res) {
    var semdata = req.body;
    var semester = new semModel({
        sem_id: mongoose.Types.ObjectId(),
        sem: semdata.models[0].sem

    })
    semester.save();
    httpMsgs.sendJSON(req, res, { 'status': "success" });
});


router.post("/deletesem", function(req, res) {
    var sid = req.body.models[0].sem_id;
    semModel.deleteOne({ sem_id: sid }, function(err) {
        if (err) console.log(err);
        else httpMsgs.sendJSON(req, res, { 'status': "success" });
    });

})
module.exports = router;