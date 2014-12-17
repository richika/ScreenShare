var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	sanitizer = require('sanitizer'),
	querystring = require('querystring'),
	server = require('http').Server(app),
	io = require('socket.io').listen(server);


var sockets = {};
var system = {};
var loggedIn = {};

mongoose.connect('mongodb://tantrik:tantrik1115@ds037907.mongolab.com:37907/heroku_app26645381');
var userDB = new mongoose.Schema({
	username : 'string',
	password : 'string'
});

var User = mongoose.model('userDB', userDB);
User.find(function (err,res){
	if(err)
		return;
	console.log(res);
});
io.on('connection', function (socket){
	console.log('connected');
	sockets[socket.id] = socket;
	socket.on('credentials', function (data){
		console.log(data[0] + " " + data[1]);
		User.findOne({username : data[0]}, function (err, res){
			if(err){
				console.log(err);
				return;
			}
			if(res == null){
				socket.emit('user', 'No user');
				return;
			}
			if(res['password'] == data[1]){
				socket.emit('user', 'Authentication Successful :)')
				system[data[0]] = socket;
			}
			else{
				socket.emit('user', 'No user');
			}
		});
	});
	socket.on('image', function (data){
		//console.log(data);
		io.sockets.emit('imageFromPc', data);
	});
	socket.on('disconnect', function (){
		delete sockets[socket.id];
	});
	socket.on('click', function (data){

		io.sockets.emit('click', data);
	});
});

app.use(express.cookieParser('1234567890QWERTYoolalathisisastupidkey'));
app.use(express.session({secret: '1234567890QWERTYoolalathisisastupidkey'}));
app.engine('.html', require('ejs').__express);

app.get('/', function (req, res){
	if(!loggedIn[req.sessionID]){
		res.render('index.ejs');
	}
	else{
		res.render('loggedin.ejs', {username : loggedIn[req.sessionID]});
	}
});

app.get('/open/:process', function (req, res){
	if(!loggedIn[req.sessionID]){
		res.end();
		return;
	}
	if(system[loggedIn[req.sessionID]]){
		if(req.params.process == 'shutdown')
			system[loggedIn[req.sessionID]].emit('command', "shutdown now");
		else
			system[loggedIn[req.sessionID]].emit('command', req.params.process);
		res.end('Started!');
	}
	else{
		res.end('Client not working on your system!');
	}
});
app.get('/close/:process', function (req, res){
	if(!loggedIn[req.sessionID]){
		res.end();
		return;
	}
	if(system[loggedIn[req.sessionID]]){
		system[loggedIn[req.sessionID]].emit('command', "pkill -9 " + req.params.process);
		res.end('Process killed! :D ');
	}
	else{
		res.end('Client not working on your system!');
	}
});
app.post('/login', function (req, res){
	var chunk = '';
	req.on('data', function (data){
		chunk += data;
	});
	req.on('end', function (){
		var string = querystring.parse(chunk);
		console.log(string);
		User.findOne({username : string['username']}, function (err, rows){
			if(err){
				console.log(err);
				return;
			}
			if(rows == null){
				res.redirect('/');
				return;
			}
			if(rows['password'] == string['password']){
				loggedIn[req.sessionID] = string['username'];
				res.redirect('/');
				return;
			}
			else{
				res.redirect('/');
			}
		});
	});
});

/*
app.use(function (req, res, next){
	for(socket in sockets){
		sockets[socket].emit('command', 'vlc');
	}
	next();
});
*/

app.use(express.static(__dirname + '/public'));


server.listen(Number(process.env.PORT || 5001));
