(function (){
	var socket = io.connect();
	var c = 0;
	socket.on('imageFromPc', function (data){
		c += 1;
		document.getElementById('image').setAttribute( 'src', 'data:image/png;base64,' + data );
		var c = document.getElementById("myCanvas");
		var ctx = c.getContext("2d");
		var img = document.getElementById("image");
		ctx.drawImage(img,0,0, 1300, 760);
		c.addEventListener('click', function (data){
			console.log(data.clientX + " " + data.clientY);
			var mouse_clicked = [];
			mouse_clicked = mouse_clicked.concat(data.clientX);
			mouse_clicked = mouse_clicked.concat(data.clientY);
			socket.emit('click', mouse_clicked);
		});
		//document.getElementById('image').src = url(data);
	});


})()