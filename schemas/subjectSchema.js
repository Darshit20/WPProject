var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var subjectSchema = new Schema({
    subject_id: String,
    subject_name: String

});

var subjectModel = mongoose.model('subject', subjectSchema);

exports.subjectModel = subjectModel;