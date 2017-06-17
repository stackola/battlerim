var Bullet=function (point, angle, speed){
	this.point = point;
	this.angle = angle;
	this.speed = speed;

	this.tick=function(){
		this.point = {
			x:point.x + (Math.sin(angle) * speed),
			y:point.y - (Math.cos(angle) * speed)
		};
	}
}
module.exports = Bullet;