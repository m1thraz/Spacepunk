function GameManager() {
	this.state = "menu";
	this.time = 0;
	this.score = 0;
	this.finalscore = 0;
	this.shots = 0;
	this.countdown = 4;
	this.missed = 0;
	this.friendlyShots = 0;
	this.lifes = 5;
	this.bossFight = false;
	this.wave = 0;
	this.waveOnGoing = false;
	this.playerRecentlyHit = false;
	this.bossRecentlyHit = false;
	this.SequenceTimer;

	if (getCookie("highscore")) {
		this.highscore = getCookie("highscore");
	} else {
		this.highscore = 0;
	}

	stateChanged(this.state);

	var t = this;
	gameTimer = setInterval(function() {
		t.UpdateTime();
	}, 1000);
}

GameManager.prototype.UpdateTime = function() {
	if (this.state == "prestart") {
		if (this.countdown >= 0) {
			this.countdown--;
			countDownChanged();
		}
		if (this.countdown < 0) {
			this.state = "running";
			stateChanged(this.state);
		}
	}
	if (this.state == "running") {
		this.time++;
	}
};

GameManager.prototype.restartGame = function() {
	this.state = "prestart";
	this.time = 0;
	this.score = 0;
	this.finalscore = 0;
	this.shots = 0;
	this.countdown = 4;
	this.missed = 0;
	this.friendlyShots = 0;
	this.lifes = 5;
	this.totalTime = 0;
	this.bossFight = false;
	this.wave = 0;
	this.playerRecentlyHit = false;
	this.bossRecentlyHit = false;
	this.SequenceTimer;

	stateChanged("prestart");
};

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
