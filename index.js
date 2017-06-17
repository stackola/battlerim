var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Player = require("./classes/player.js");

var players = [];
var positions=[];
var bullets=[];

app.use(express.static('public'));


io.on('connection', function(socket){
	console.log('a user connected');
	var p = new Player("hans", socket);
	players.push(p);
	p.start(players.length-1);
});



http.listen(process.env.PORT || 5000, function(){
	console.log('listening on *:5000');
});



function tick(){
	positions=[];
	//move player
	for (var i = 0; i < players.length; i++) {
		var p = players[i];
		p.tick();
		positions.push({x:p.x,y:p.y});
	}



}


function frame(){
	io.sockets.emit("gamestate",positions);
}
setInterval(tick, 1000/60);

setInterval(frame, 1000/40);