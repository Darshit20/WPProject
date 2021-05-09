var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var signupModel = require('./signupSchema');
var signupSchema = signupModel.signupModel.schema;
var subjectModel = require('../schemas/subjectSchema');
var subjectSchema = subjectModel.subjectModel.schema;

var attendanceSchema = {
    id: String,
    rollno: Number,
    student: signupSchema,
    teacher: signupSchema,
    attendance: String,
    attendance_on: Date,
    subject: subjectSchema

}

var attendanceModel = mongoose.model("attendance", attendanceSchema);
exports.attendanceModel = attendanceModel;