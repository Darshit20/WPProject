var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var roleSchema = new Schema({
	role_name: String
});

var roleModel = mongoose.model("role", roleSchema);

exports.roleModel = roleModel;