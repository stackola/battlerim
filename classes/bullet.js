var Bullet=function (point, angle, speed, player){
	this.point = point;
	this.angle = angle;
	this.angle+=Math.PI/2;
	this.speed = speed;
	this.player = player;
	this.ticks=0;

	this.tick=function(){
		this.point = {
			x:this.point.x + (Math.sin(this.angle) * this.speed),
			y:this.point.y - (Math.cos(this.angle) * this.speed)
		};
		this.ticks++;
		if (this.ticks > 300){
			this.speed=0;
		}
	}


}
module.exports = Bullet;