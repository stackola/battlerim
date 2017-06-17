var socket = io();
socket.emit('join');


///////////////////////////////////////////////////////
// DRAWING
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var keys =[]; //keys pressed;
var snap;
var player = {
	x:320,
	y:180,
	speedX:0,
	speedY:0
}
var id = 0;

socket.on("gamestate",function (msg) {
	timeline.addSnapshot(msg);
});
Number.prototype.clamp = function(min, max) {
	return Math.min(Math.max(this, min), max);
};

function draw(){
	// Clear canvas
	ctx.clearRect(0,0,canvas.width,canvas.height);
	// Draw segments
	// ctx.strokeStyle = "#999";
	// for(var i=0;i<segments.length;i++){
	// 	var seg = segments[i];
	// 	ctx.beginPath();
	// 	ctx.moveTo(seg.a.x,seg.a.y);
	// 	ctx.lineTo(seg.b.x,seg.b.y);
	// 	ctx.stroke();
	// }
	// Sight Polygons
	var fuzzyRadius = 10;


	var polygons = [getSightPolygon(player.x,player.y, segments)];

	var allPolys=[];
	for (var i = 0; i < snap.state.length; i++) {
		var aPlayer = snap.state[i];
		allPolys.push(getSightPolygon(aPlayer.x,aPlayer.y, segments));
	}
	// DRAW AS A GIANT POLYGON	

	drawPolygon(polygons[0],ctx,"#fff");

	for (var i = 0; i < allPolys.length; i++) {
		drawPolygon(allPolys[i],ctx,"hsla(0,0%,0%,0.2)");
	}

	

	// Draw red dots
	for (var i = 0; i < snap.state.length; i++) {
		var aPlayer = snap.state[i];
		if (inside(aPlayer, polygons[0])){
			ctx.fillStyle = "#dd3838";
			ctx.beginPath();
			ctx.arc(aPlayer.x, aPlayer.y, 2, 0, 2*Math.PI, false);
			ctx.fill();
		}
		
	}


}


function drawPolygon(polygon,ctx,fillStyle){
	ctx.fillStyle = fillStyle;
	ctx.beginPath();
	ctx.moveTo(polygon[0].x,polygon[0].y);
	for(var i=1;i<polygon.length;i++){
		var intersect = polygon[i];
		ctx.lineTo(intersect.x,intersect.y);
	}
	ctx.fill();
}
// LINE SEGMENTS
var segments = [
// Border
{a:{x:0,y:0}, b:{x:640,y:0}},
{a:{x:640,y:0}, b:{x:640,y:360}},
{a:{x:640,y:360}, b:{x:0,y:360}},
{a:{x:0,y:360}, b:{x:0,y:0}},
// Polygon #1
{a:{x:100,y:150}, b:{x:120,y:50}},
{a:{x:120,y:50}, b:{x:200,y:80}},
{a:{x:200,y:80}, b:{x:140,y:210}},
{a:{x:140,y:210}, b:{x:100,y:150}},
// Polygon #2
{a:{x:100,y:200}, b:{x:120,y:250}},
{a:{x:120,y:250}, b:{x:60,y:300}},
{a:{x:60,y:300}, b:{x:100,y:200}},
// Polygon #3
{a:{x:200,y:260}, b:{x:220,y:150}},
{a:{x:220,y:150}, b:{x:300,y:200}},
{a:{x:300,y:200}, b:{x:350,y:320}},
{a:{x:350,y:320}, b:{x:200,y:260}},
// Polygon #4
{a:{x:340,y:60}, b:{x:360,y:40}},
{a:{x:360,y:40}, b:{x:370,y:70}},
{a:{x:370,y:70}, b:{x:340,y:60}},
// Polygon #5
{a:{x:450,y:190}, b:{x:560,y:170}},
{a:{x:560,y:170}, b:{x:540,y:270}},
{a:{x:540,y:270}, b:{x:430,y:290}},
{a:{x:430,y:290}, b:{x:450,y:190}},
// Polygon #6
{a:{x:400,y:95}, b:{x:580,y:50}},
{a:{x:580,y:50}, b:{x:480,y:150}},
{a:{x:480,y:150}, b:{x:400,y:95}}
];



// DRAW LOOP
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;



function drawLoop(){
	requestAnimationFrame(drawLoop);
	//send key states to server
	var pressed={
		left:keys[37]|false,
		right:keys[39]|false,
		down:keys[40]|false,
		up:keys[38]|false
	}

	
	socket.emit("frame",pressed);

	snap = timeline.getSnap();
	player.x = snap.state[id].x;
	player.y = snap.state[id].y;
	draw();
	
}
socket.on("start",function(number){
	console.log(number);
	id = number;
	setTimeout(drawLoop, 500);
});




// MOUSE	
var Mouse = {
	x: canvas.width/2,
	y: canvas.height/2
};



canvas.onmousemove = function(event){	
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
	
};


window.addEventListener("keydown", function (e) {
	keys[e.keyCode] = true;
});
window.addEventListener("keyup", function (e) {
	keys[e.keyCode] = false;
});


