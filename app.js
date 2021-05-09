const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const ids = require('short-id');
const ejs = require("ejs");
const _ = require("lodash");
const session = require('express-session');
const mongoose = require("mongoose");
const md5 = require('md5');
const httpMsgs = require('http-msgs');
const moment = require('moment-timezone');
const path = require('path');
const app = express();
var indexStudent = require('./routes_student/indexStudent');
var chatStudent = require('./routes_student/chatStudent');
var attendanceStudent = require('./routes_student/attendanceStudent');
var signupStudent = require('./routes_student/signupStudent');
var updateProfileStudent = require('./routes_student/updateProfileStudent');
var login = require('./routes_student/login');

var signupTeacher = require('./routes_teacher/signupTeacher');
var indexTeacher = require('./routes_teacher/indexTeacher');
var chatTeacher = require('./routes_teacher/chatTeacher');
var updateProfiletTeacher = require('./routes_teacher/updateProfiletTeacher');
var announcementTeacher = require('./routes_teacher/announcementTeacher');
var attendanceTeacher = require('./routes_teacher/attendanceTeacher');
var report = require('./routes_teacher/report');

var indexAdmin = require('./routes_admin/indexAdmin');
var manageStudent = require('./routes_admin/manageStudent');
var manageTeacher = require('./routes_admin/manageTeacher');
var manageSubject = require('./routes_admin/manageSubject');
var manageSem = require('./routes_admin/manageSem');
var manageDivison = require('./routes_admin/manageDivision');
var manageTeacher = require('./routes_admin/manageTeacher');
var updateProfileAdmin = require('./routes_admin/updateProfileAdmin');

var __dirname = "../collage managment";
app.set('view engine', 'ejs');
app.set('views', [path.join(__dirname, 'views'),
path.join(__dirname, 'views/studentView/'),
path.join(__dirname, 'views/teacherView/'),
path.join(__dirname, 'views/adminView/')
]);
app.use(bodyParser());
app.use(express.static("public"));
app.use(session({ 'secret': '343ji43j4n3jn4jk3n' }));
mongoose.connect(
	"mongodb://localhost:27017/CollegeDB",
	 { useNewUrlParser: true }
	);


app.use(indexStudent);
app.use(chatStudent);
app.use(attendanceStudent);
app.use(login);
app.use(signupStudent);
app.use(updateProfileStudent);

app.use(indexTeacher);
app.use(chatTeacher);
app.use(signupTeacher);
app.use(attendanceTeacher);
app.use(announcementTeacher);
app.use(updateProfiletTeacher);
app.use(report);

app.use(indexAdmin);
app.use(manageStudent);
app.use(manageTeacher);
app.use(manageSubject);
app.use(manageSem);
app.use(manageDivison);
app.use(manageTeacher);
app.use(updateProfileAdmin);

let port = process.env.PORT;
if (port == null || port == "") {
	port = 8080;

}

app.listen(port, function () {
	console.log("connected to server");
	const md5 = require('md5');
	console.log(md5("Admin"))
});