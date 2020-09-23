function EntityManager() {
	this.Entities = [];
	this.SpeedMultiplier = 1;

	var t = this;
	var Timer = setInterval(function() {
		t.UpdatePos();
	}, 10);
	var Timer2 = setInterval(function() {
		t.UpdateFrameIndex();
	}, 50);
}

EntityManager.prototype.UpdatePos = function() {
	for (var i = 0; i < this.Entities.length; i++) {
		if (this.Entities[i].direction == "right") {
			this.Entities[i].x =
				this.Entities[i].x + this.Entities[i].speed * this.SpeedMultiplier;
		}
		if (this.Entities[i].direction == "left") {
			this.Entities[i].x =
				this.Entities[i].x - this.Entities[i].speed * this.SpeedMultiplier;
		}
		if (this.Entities[i].direction == "down") {
			this.Entities[i].y =
				this.Entities[i].y + this.Entities[i].speed * this.SpeedMultiplier;
		}
		if (this.Entities[i].direction == "up") {
			this.Entities[i].y =
				this.Entities[i].y - this.Entities[i].speed * this.SpeedMultiplier;
		}

		// BOSS MOVEMENTS
		if (this.Entities[i].direction == "upleft") {
			this.Entities[i].x =
				this.Entities[i].x - this.Entities[i].speed * this.SpeedMultiplier;
			this.Entities[i].y =
				this.Entities[i].y - this.Entities[i].speed * this.SpeedMultiplier;
		}
		if (this.Entities[i].direction == "upright") {
			this.Entities[i].x =
				this.Entities[i].x + this.Entities[i].speed * this.SpeedMultiplier;
			this.Entities[i].y =
				this.Entities[i].y - this.Entities[i].speed * this.SpeedMultiplier;
		}
		if (this.Entities[i].direction == "downleft") {
			this.Entities[i].x =
				this.Entities[i].x - this.Entities[i].speed * this.SpeedMultiplier;
			this.Entities[i].y =
				this.Entities[i].y + this.Entities[i].speed * this.SpeedMultiplier;
		}
		if (this.Entities[i].direction == "downright") {
			this.Entities[i].x =
				this.Entities[i].x + this.Entities[i].speed * this.SpeedMultiplier;
			this.Entities[i].x =
				this.Entities[i].x + this.Entities[i].speed * this.SpeedMultiplier;
		}
	}
};

EntityManager.prototype.UpdateFrameIndex = function() {
	for (var i = 0; i < this.Entities.length; i++) {
		if (this.Entities[i].frameIndex < this.Entities[i].frames - 1) {
			this.Entities[i].frameIndex++;
		} else {
			this.Entities[i].frameIndex = 0;
			if (this.Entities[i].type == "explosion") {
				this.Entities[i].health = 0;
				// this.Entities.splice(i, 1);
			}
		}
	}
};

EntityManager.prototype.CreateEntity = function(
	type,
	frames,
	sizeX,
	sizeY,
	speed,
	x,
	y,
	direction,
	health,
	isBoss
) {
	var Entity = new Object();
	Entity.type = type;
	Entity.frames = frames;
	Entity.sizeX = sizeX;
	Entity.sizeY = sizeY;
	Entity.speed = speed;
	Entity.x = x;
	Entity.y = y;
	Entity.direction = direction;
	Entity.health = health;
	// Entity.selfDestruct = selfDestruct;
	Entity.isBoss = isBoss || false;

	Entity.frameIndex = 0;

	this.Entities.push(Entity);
};

EntityManager.prototype.DeleteEntity = function(index) {
	// this.Entities[index].health = 0;
	this.Entities.splice(index, 1);
};

EntityManager.prototype.WasEntityHit = function(i, x, y, useRect) {
	var e = this.Entities[i];
	if (useRect) {
		if (e.health >= 1) {
			if (x >= e.x && x <= e.x + e.sizeX && y >= e.y && y <= e.y + e.sizeY) {
				return true;
			}
		}
	} else {
		var distance = dist(x, y, e.x + e.sizeX / 2, e.y + e.sizeY / 2);
		if (e.health >= 1) {
			if (distance <= e.sizeY / 2) {
				return true;
			}
		}
	}
	return false;
};

EntityManager.prototype.GetEntitiesByType = function(name) {
	var obj = [];
	for (var i = 0; i < this.Entities.length; i++) {
		if (this.Entities[i].type == name) {
			obj.push(this.Entities[i]);
		}
	}
	return obj;
};

EntityManager.prototype.GetFirstEntitityIDByType = function(name) {
	for (var i = 0; i < this.Entities.length; i++) {
		if (this.Entities[i].type == name) {
			return i;
		}
	}
};

EntityManager.prototype.GetBossEntity = function() {
	for (var i = 0; i < this.Entities.length; i++) {
		if (this.Entities[i].isBoss) {
			return i;
		}
	}
};
