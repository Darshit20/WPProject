var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var semSchema = new Schema({
    sem_id: String,
    sem: Number

});

var semModel = mongoose.model('sem', semSchema);

exports.semModel = semModel;