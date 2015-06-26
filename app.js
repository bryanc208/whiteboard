var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/app'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/app/index.html');
});

io.on('connection', function(socket) {
	console.log("[" + new Date().toUTCString()+"]" + ' New user connected');
	socket.on('disconnect', function() {
		console.log("[" + new Date().toUTCString()+"]" + ' User disconnected');
	});

	socket.on('draw', function(msg){
		console.log(msg);
    	io.emit('draw', msg);
  	});
})

http.listen(3000, function() {
	console.log('listening on *:3000');
});