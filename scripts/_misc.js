function sleep(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

function drawShakyImage(img, x, y, w, h, shake) {
	var shakex = random(-shake, shake);
	var shakey = random(-shake, shake);
	translate(shakex, shakey);
	image(img, x, y, w, h);
	translate(-shakex, -shakey);
}

function startShake(level) {
	var x = random(-level, level);
	var y = random(-level, level);
	translate(x, y);
	var shake = [x, y];
	return shake;
}

function endShake(shake) {
	translate(-shake[0], -shake[1]);
}

String.prototype.bool = function() {
	return strToBool(this);
};

function strToBool(s) {
	// will match one and only one of the string 'true','1', or 'on' rerardless
	// of capitalization and regardless off surrounding white-space.
	//
	regex = /^\s*(true|1|on)\s*$/i;

	return regex.test(s);
}
