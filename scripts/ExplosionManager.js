function ExplosionManager() {
	this.Explosions = [];
	this.maxFrames = 3;
	// this.maxFrames = 47;

	var t = this;
	var Timer = setInterval(function() {
		t.UpdateFrameIndex();
	// }, 20);
	}, 100);
}

ExplosionManager.prototype.UpdateFrameIndex = function() {
	for (var i = 0; i < this.Explosions.length; i++) {
		if (this.Explosions[i].frameIndex < this.maxFrames - 1) {
			this.Explosions[i].frameIndex++;
		} else {
			this.Explosions.splice(i, 1);
		}
	}
};

ExplosionManager.prototype.CreateExplosion = function(x, y, size) {
	var Entity = new Object();
	Entity.x = x-size/2;
	Entity.y = y-size/2;
	Entity.size = size*2;

	Entity.frameIndex = 0;
	// Entity.selfDestruct = selfDestruct;

	this.Explosions.push(Entity);
};

ExplosionManager.prototype.DeleteExplosion = function(index) {
	this.Explosions[index].health = 0;
	// this.Explosions.splice(index, 1);
};
