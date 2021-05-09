var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var divisionSchema = new Schema({
    division_id: String,
    division: String

});

var divisionModel = mongoose.model('division', divisionSchema);

exports.divisionModel = divisionModel;