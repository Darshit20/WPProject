var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var signupModel = require('./signupSchema');
var signupSchema = signupModel.signupModel.schema;
var semModel = require('./semSchema');
var semSchema = semModel.semModel.schema;


var announcementSchema = {
    id: String,
    body: String,
    file: String,
    from: signupSchema,
    time: Date,
    sem: [semSchema]
}
var announcementModel = mongoose.model("announcement", announcementSchema);
exports.announcementModel = announcementModel;