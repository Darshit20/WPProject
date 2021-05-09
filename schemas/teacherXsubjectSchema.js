var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var signupModel = require('./signupSchema');
var signupSchema = signupModel.signupModel.schema;
var subjectModel = require('./subjectSchema');
var subjectSchema = subjectModel.subjectModel.schema;


var teacherxsubjectSchema = new Schema({
    id: String,
    teacher: signupSchema,
    subject: subjectSchema

});

var teacherxsubjectModel = mongoose.model('teacherxsubject', teacherxsubjectSchema);

exports.teacherxsubjectModel = teacherxsubjectModel;