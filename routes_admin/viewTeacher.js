 var express = require('express');
 var router = express.Router();
 const mongoose = require("mongoose");
 const ids = require('short-id');
 const nodemailer = require("nodemailer");
 const md5 = require('md5');
 const httpMsgs = require('http-msgs');
 const multer = require('multer');
 var storage = multer.diskStorage({
     destination: function(req, file, cb) {
         cb(null, 'uploads/')
     },
     filename: function(req, file, cb) {
         cb(null, Date.now() + file.originalname)
     }
 });
 var upload = multer({ storage: storage });
 var signupModel = require('../schemas/signupSchema');
 var signupModel = signupModel.signupModel;
 var subjectModel = require('../schemas/subjectSchema');
 var subjectModel = subjectModel.subjectModel;
 var semModel = require('../schemas/semSchema');
 var semModel = semModel.semModel;
 var divisionModel = require('../schemas/divisionSchema');
 var divisionModel = divisionModel.divisionModel;
 var roleModel = require('../schemas/roleSchema');
 var roleModel = roleModel.roleModel;

 router.get("/viewteacher", function(req, res) {

     signupModel.find({ "role_id.role_name": "teacher" }, function(err, data) {
         var teacherdetails = JSON.stringify(data);
         //  console.log(teacherdetails);
         res.render('viewTeacher', { teacherdetail: teacherdetails });

     })

 });

 router.post("/modifyteacher", function(req, res) {
     var rid = req.body.registred_id;
     divisionModel.find({}, function(err, divdata) {
         semModel.find({}, function(err, semdata) {
             subjectModel.find({}, function(err, subdata) {
                 signupModel.find({ registred_id: rid }, function(err, userdata) {

                     res.render('manageTeacher', { subject_data: subdata, div_data: divdata, sem_data: semdata, userdata: JSON.parse(JSON.stringify(userdata))[0] });

                 })

             })
         })
     })
 });

 module.exports = router;