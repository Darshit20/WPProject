var express = require('express');
var router = express.Router();



app.get("/", function (req, res) {
	if (req.session.name) {
		return res.render('index', { userInfo: req.session.name = username, userId: req.session.uid });
	}
	else {
		return res.redirect('login');
	}
});


app.get("/attendance", function (req, res) {
	res.render('attendance', { userInfo: req.session.name = username, userId: req.session.uid });
});

app.get("/chat", function (req, res) {
	if (req.session.name) {
		Signup.find({ 'role_id.role_name': "student", registred_id: { $ne: req.session.uid } }, function (err, students) {
			res.render('chat', { userInfo: req.session.name = username, chatuStdents: students, userId: req.session.uid });
		})
	}
	else {
		return res.redirect('login');
	}

});
app.get("/loginT", function (req, res) {
	res.render('loginT');
});

app.get("/loginS", function (req, res) {
	res.render('loginS');
});

app.get("/login", function (req, res) {
	req.session.destroy();
	res.render('login');
});


app.post("/loginT", function (req, res) {

	const name = req.body.name;
	const email = req.body.email;
	const gender = req.body.gender;
	const sub = [];
	sub.push.apply(sub, req.body.subject);
	sub.toString();
	const dob = req.body.date;
	const id = teacher;
	var Upass = ids.generate();
	var Upass1 = md5(Upass);
	const user = new Signup({
		role_id: id,
		name: name,
		email: email,
		subject: sub.toString(),
		gender: gender,
		dob: dob,
		password: Upass1
	})
	user.save();
	nodemailer.createTestAccount((err, account) => {
		if (err) {
			console.error('Failed to create a testing account');
			console.error(err);
			return process.exit(1);
		}
		console.log('Credentials obtained, sending message...');
		let transporter = nodemailer.createTransport({
			service: 'Gmail',
			host: "smtp.gmail.com",
			port: 587,
			requireTLS: true,
			secure: false, // true for 465, false for other ports
			auth: {
				user: 'prayagdalal11@gmail.com',
				pass: 'prayag11'
			},
			logger: true,
			debug: false // include SMTP traffic in the logs
			, from: 'prayagdalal11@gmail.com',
		});

		let message = {
			to: email,
			subject: "ACCOUNT DETAILS",
			html: "<b>USER NAME:-</b><b>'" + name + "'</b><br><b>PASSWORD:-</b><b>'" + Upass + "'</b>" // html body
		};
		transporter.sendMail(message, (error, info) => {
			if (error) {
				console.log('Error occurred');
				console.log(error.message);
				return process.exit(1);
			}

			console.log('Message sent successfully!');
			console.log(nodemailer.getTestMessageUrl(info));
		});
	});
});

app.post("/plz", function (req, res) {

	var fromUserId = req.body.from1;
	var toUserId = req.body.to1;
	Chat.find({ 'from.registred_id': fromUserId, 'to.registred_id': toUserId }, function (errFromData, inbox_data) {
		Chat.find({ 'from.registred_id': toUserId, 'to.registred_id': fromUserId }, function (errFromData, inbox_data1) {
			inbox_data = inbox_data.concat(inbox_data1)
			//console.log("ALL DATA:-----"+inbox_data);
			inbox_data.sort(function (a, b) {
				return Date.parse(new Date(a.chat_time)) - Date.parse(new Date(b.chat_time));
			});
			console.log(inbox_data);
			httpMsgs.sendJSON(req, res, inbox_data);
		});
	});
});
app.post("/inbox", function (req, res) {
	var from_data = "";
	var to_data = "";
	var fromUserId = req.body.from1;
	var toUserId = req.body.to1;
	var chat_info = req.body.send_chat;
	console.log(chat_info);
	Signup.findOne({ registred_id: fromUserId }, function (errFromData, fromUserData) {
		Signup.findOne({ registred_id: toUserId }, function (errToData, toUserData) {
			console.log(fromUserData);
			var chatUser = new Chat({
				from: fromUserData,
				to: toUserData,
				chat: chat_info,
				chat_time: Date.now()
			});
			chatUser.save();

		});
	});
	httpMsgs.sendJSON(req, res, { 'toUserId': toUserId });

});
app.post("/loginS", function (req, res) {
	var name = req.body.namej;
	var gender = req.body.genderj;
	var dob = req.body.dobj;
	var sem = req.body.semj;
	var div = req.body.divj;
	var Upass = ids.generate();
	var Upass1 = md5(Upass);
	var check_mail = req.body.emailj;
	console.log("appjs mail:-" + check_mail);
	Signup.countDocuments({ email: check_mail }, function (err, cnt) {
		console.log("total mail:-" + cnt);
		if (cnt > 0) {
			httpMsgs.sendJSON(req, res, { exist: "email already exist" });
		}
		else {
			httpMsgs.sendJSON(req, res, { exist: "Done" });
			const user = new Signup({
				role_id: student,
				name: name,
				registred_id: mongoose.Types.ObjectId(),
				email: check_mail,
				gender: gender,
				dob: dob,
				sem: sem,
				div: div,
				password: Upass1
			})
			user.save();
			nodemailer.createTestAccount((err, account) => {
				if (err) {
					console.error('Failed to create a testing account');
					console.error(err);
					return process.exit(1);
				}
				console.log('Credentials obtained, sending message...');
				let transporter = nodemailer.createTransport({
					service: 'Gmail',
					host: "smtp.gmail.com",
					port: 587,
					requireTLS: true,
					secure: false, // true for 465, false for other ports
					auth: {
						user: 'prayagdalal11@gmail.com',
						pass: 'prayag11'
					},
					logger: true,
					debug: false // include SMTP traffic in the logs
					, from: 'prayagdalal11@gmail.com',
				});
				let message = {
					to: check_mail,
					subject: "ACCOUNT DETAILS",
					html: "<b>USER NAME:-</b><b>'" + name + "'</b><br><b>PASSWORD:-</b><b>'" + Upass + "'</b>" // html body
				};
				transporter.sendMail(message, (error, info) => {
					if (error) {
						console.log('Error occurred');
						console.log(error.message);
						return process.exit(1);
					}
					console.log('Message sent successfully!');
					console.log(nodemailer.getTestMessageUrl(info));
				});
			});
		}
	});
});
app.post("/login", function (req, res) {
	username = req.body.uname;
	password = req.body.pass;
	password1 = md5(password);
	Signup.countDocuments({ name: username, password: password1 }, function (err, cnt) {
		if (cnt == 1) {
			console.log(username);
			Signup.findOne({ name: username, password: password1 }, function (err, obj) {
				req.session.name = username;
				req.session.uid = obj.registred_id;
				res.render("index", { userInfo: req.session.name, userId: req.session.uid });
			})
		}
		else {
			const name = "wrong id or password";
			res.send(req.body.dname = name);
		}

	});
});