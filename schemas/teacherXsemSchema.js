var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var signupModel = require('./signupSchema');
var signupSchema = signupModel.signupModel.schema;
var semModel = require('./semSchema');
var semSchema = semModel.semModel.schema;


var teacherxsemSchema = new schema({
    id: String,
    teacher: signupSchema,
    sem: semSchema

});

var teacherxsemModel = mongoose.model('teacherxsem', teacherxsemSchema);

exports.teacherxsemModel = teacherxsemModel;