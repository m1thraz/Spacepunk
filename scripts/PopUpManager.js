function PopUpManager() {
	this.Entities = [];

	var t = this;
	var Timer = setInterval(function() {
		t.UpdateDuration();
	}, 100);
	var Timer = setInterval(function() {
		t.UpdatePos();
	}, 100);
}

PopUpManager.prototype.UpdatePos = function() {
	for (var i = 0; i < this.Entities.length; i++) {
		this.Entities[i].y = this.Entities[i].y - this.Entities[i].size / 10;
	}
};

PopUpManager.prototype.UpdateDuration = function() {
	for (var i = 0; i < this.Entities.length; i++) {
		if (this.Entities[i].duration > 0) {
			this.Entities[i].duration -= 0.1;
		} else {
			this.Entities.splice(i, 1);
		}
	}
};

PopUpManager.prototype.CreateEntity = function(
	text,
	x,
	y,
	size,
	color,
	duration
) {
	var Entity = new Object();
	Entity.text = text;
	Entity.x = x;
	Entity.y = y;
	Entity.size = size;
	Entity.color = color;
	Entity.duration = duration;

	Entity.frameIndex = 0;

	this.Entities.push(Entity);
};

// PopUpManager.prototype.DeleteEntity = function(index) {
//     this.Entities.splice(index, 1);
// }
