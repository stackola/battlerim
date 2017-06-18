var timeline = {
	snapshots:[],
	addSnapshot:function(s){
		var aSnap={
			time:Date.now(),
			state:s
		}

		this.snapshots = this.snapshots.filter(function(d){return d.time>Date.now()-2000});
		this.snapshots.push(aSnap);
		this.snapshots.sort(function(a,b){return a.time>b.time});

		
	},
	getSnap:function(){
		//get frame before
		time=Date.now()-30;
		var older = this.snapshots.filter(function(d){return d.time<time});
		//get frame after
		var newer = this.snapshots.filter(function(d){return d.time>=time});
		var frameBefore = older[older.length-1];
		var frameAfter = newer[0];


		if (typeof frameAfter == "undefined"){
			console.log("no after frame");
			return frameBefore;
		}
		else
		{
			//console.log("do have after frame");
		}


		

		var percentageDone= (time - frameBefore.time) / (frameAfter.time - frameBefore.time);

		var newFrame={
			time:time,
			state:{players:[], bullets:frameBefore.state.bullets}
		}

		for (var i = 0; i < frameBefore.state.players.length; i++) {
			var stateBefore = frameBefore.state.players[i];
			var stateAfter = frameAfter.state.players[i];

			var newX = stateBefore.x + (stateAfter.x - stateBefore.x)* percentageDone;
			var newY = stateBefore.y + (stateAfter.y - stateBefore.y)* percentageDone;
			newFrame.state.players.push({x:newX,y:newY});


		}
		

		return newFrame;


	}
}