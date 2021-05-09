var express = require('express');
var router = express.Router();
const session = require('express-session');
const mongoose = require("mongoose");
const md5 = require('md5');
const httpMsgs = require('http-msgs');

var signupModel = require('../schemas/signupSchema');
var signupModel = signupModel.signupModel;
var announcementModel = require('../schemas/announcementSchema');
var announcementModel = announcementModel.announcementModel;

router.get("/", function(req, res) {
    req.session.destroy();
    res.render('login');
});

router.get("/accessdenied", function(req, res) {
    res.render('403');
})
router.post("/ajaxlogin", function(req, res) {

    usernameajax = req.body.username;
    passwordajax = req.body.password;
    password1 = md5(passwordajax);
    signupModel.findOne({ email: usernameajax, password: password1 }, function(err, obj) {
        signupModel.countDocuments({ email: usernameajax, password: password1 }, function(err, count) {
            if (count == 1) {
                var rolename = obj.role_id.role_name;
                req.session.uid = obj.registred_id;
                req.session.role = rolename;
                httpMsgs.sendJSON(req, res, req.session.role);

            } else {
                httpMsgs.sendJSON(req, res, "invalid user name or password");

            }
        })

    });

});

module.exports = router;