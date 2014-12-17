var socket = require('socket.io-client')('http://mobile-cmd.herokuapp.com');
var fs = require('fs');
var my_credentials = []
socket.on('command', function (data){	
	console.log(data);
});
var prev = '';
socket.on('user', function (data){
	if(data == 'No user'){
		console.log("No such user Found :( !");
		process.exit(0);
	}
	console.log(data);
});
if(!process.argv[2] || !process.argv[3]){
	console.log('Enter Username & Password!');
	process.exit(0);
}
var start = Date.now();
my_credentials = my_credentials.concat(process.argv[2]);
my_credentials = my_credentials.concat(process.argv[3]);
console.log(my_credentials);
socket.emit('credentials', my_credentials);
setInterval(function (){
fs.readFile('screenshot.jpeg', function (err, orginal_image){
	if(err){
		console.log(err);
		return;
	}
	var base64image = new Buffer(orginal_image, 'binary').toString('base64');
	if(base64image != prev){
		prev = base64image;
		socket.emit('image', base64image);
	}
});
}, 100);

