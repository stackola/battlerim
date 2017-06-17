function clamp(number, min, max) {
	return Math.min(Math.max(number, min), max);
};

var Player = function(name, socket) {
	this.socket = socket;
	this.name = name;
	this.x = 320;
	this.y = 180;
	this.speedX = 0;
	this.speedY = 0;
	this.angle = 0;

	this.printName = function() {
		console.log(this.name);
	}

	this.printName();

	this.tick = function() {
		this.speedX = friction(this.speedX, 0.05);
		this.speedY = friction(this.speedY, 0.05);
		this.x += this.speedX;
		this.y += this.speedY;	
		this.x=clamp(this.x,2,638);
		this.y=clamp(this.y,2,358);
	}

	this.start = function(id){
		this.socket.emit("start",id);
	}

	this.socket.on('disconnect', function() {
		console.log('a user left ' + this.name);
	}.bind(this));

	this.socket.on('join', function() {
		console.log('user joined');
	}.bind(this));

	this.socket.on('frame', function(keys) {
		var maxSpeed=1.5;
	
		//handle key inputs!
		if (keys.left) { //left
			//velX = -10;
			if (this.speedX > -maxSpeed) {
				this.speedX -= 0.2;
			}
		}

		if (keys.right) { //right
			//this.speedX = 10;
			if (this.speedX < maxSpeed) {
				this.speedX += 0.2;
			}
		}
		if (keys.down) { //down
			//this.speedY = 10;
			if (this.speedY < maxSpeed) {
				this.speedY += 0.2;
			}
		}
		if (keys.up) { //up
			//this.speedY = -10;
			if (this.speedY > -maxSpeed) {
				this.speedY -= 0.2;
			}
		}
	}.bind(this));
};


module.exports = Player;

function friction(value, friction) {
	var flipped = false;

	if (value < 0) {
		value = value * -1;
		flipped = true;
	}

	value -= friction;

	if (value < 0) {
		value = 0;
	}


	if (flipped) {
		value = value * -1;
	}

	return value;
}