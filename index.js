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
	bullets=[];
	//move player
	for (var i = 0; i < players.length; i++) {
		var p = players[i];
		p.tick();
		positions.push({x:p.x,y:p.y});
		for (var ii = 0; ii < p.bullets.length; ii++) {
			var bb = p.bullets[ii];
			if (bb.speed > 0 ){
				bb.tick();
				bullets.push({x:bb.point.x, y:bb.point.y});
			}
			
		}		
	}


}


function frame(){
	var obj = {players:positions, bullets:bullets};
	io.sockets.emit("gamestate",obj);
}
setInterval(tick, 1000/60);

setInterval(frame, 1000/40);