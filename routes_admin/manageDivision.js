var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const httpMsgs = require('http-msgs');
var divisionModel = require('../schemas/divisionSchema');
var divisionModel = divisionModel.divisionModel;
router.get("/managedivision", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "admin") {
            res.render('manageDivision', { userInfo: req.session.name, role: req.session.role, pic: req.session.pic });
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }
});
router.get("/division", function(req, res) {
    if (req.session.uid) {
        if (req.session.role == "admin") {
            divisionModel.find({}, function(err, data) {
                res.status(200).json(data);
            })
        } else {
            res.redirect('/accessdenied');
        }
    } else {
        return res.redirect('/');
    }
});

router.post("/insertdivision", function(req, res) {
    var divisiondata = req.body;
    var division = new divisionModel({
        division_id: mongoose.Types.ObjectId(),
        division: divisiondata.models[0].division

    })
    division.save();
    httpMsgs.sendJSON(req, res, { 'status': "success" });
});


router.post("/deletedivision", function(req, res) {
    var did = req.body.models[0].division_id;
    divisionModel.deleteOne({ division_id: did }, function(err) {
        if (err) console.log(err);
        else httpMsgs.sendJSON(req, res, { 'status': "success" });
    });

})
module.exports = router;