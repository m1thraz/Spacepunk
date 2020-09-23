var Game = new GameManager(0);
var Entity = new EntityManager();
var PopUp = new PopUpManager();
var Explosion = new ExplosionManager();
let muted = false;

function preload() {
	font = loadFont("../assets/misc/8-Bit-Madness.otf");

	// Misc
	bg = loadImage("../assets/img/1382554.jpg");
	logo1 = loadImage("../assets/img/logo1.png");
	logo2 = loadImage("../assets/img/logo2.png");
	crosshair = loadImage("../assets/img/crosshair.png");
	heart = loadImage("../assets/img/heart.png");

	// Entitites
	satellite = loadImage("../assets/img/entities/sat.png");
	meteor = loadImage("../assets/img/entities/meteor.png");
	trump = loadImage("../assets/img/entities/trump_pixelated.png");
	trump_hit = loadImage("../assets/img/entities/trump_angry.png");
	musk = loadImage("../assets/img/entities/musk_pixelated.png");
	musk_hit = loadImage("../assets/img/entities/musk_hit.png");
	spacex = loadImage("../assets/img/entities/spacex.png");

	ufosprites = [];
	ufosprites[0] = loadImage("../assets/img/entities/UFO1.png");
	ufosprites[1] = loadImage("../assets/img/entities/UFO2.png");
	ufosprites[2] = loadImage("../assets/img/entities/UFO3.png");

	boss1 = loadImage("../assets/img/entities/boss1.png");
	boss2 = loadImage("../assets/img/entities/boss2.png");
	boss3 = loadImage("../assets/img/entities/boss3.png");
	bosssprites = [boss1, boss2, boss3];
	boss_hit = loadImage("../assets/img/entities/boss_hit.png");


	explosionsprites = [];
	for (var i = 0; i < 5; i++) {
		var numb = i + 1;
		explosionsprites[i] = loadImage(
			"../assets/img/entities/hit" + numb + ".png"
		);
	}

	// explosionsprites = [];
	// for (var i = 0; i < 48; i++) {
    //     // var numb = i + 1;
    //     var formattedNumber = ("0" + i).slice(-2);
	// 	explosionsprites[i] = loadImage(
	// 		"../assets/img/entities/explosion/tile0" + formattedNumber + ".png"
	// 	);
	// }

	soundFormats("wav", "mp3");
	theme = loadSound("../assets/audio/music/The_Encounter_Astrid.mp3");
	explosion = loadSound("../assets/audio/samples/Explosion8.wav");
	lasershot = loadSound("../assets/audio/samples/Laser_Shoot14.wav");
	doublekill = loadSound("../assets/audio/samples/double-kill.mp3");
	tripplekill = loadSound("../assets/audio/samples/triple-kill.mp3");
	gameoversound = loadSound("../assets/audio/samples/gameover.wav");
	trump_no = loadSound("../assets/audio/samples/trump_no.wav");
	unstoppable = loadSound("../assets/audio/samples/unstoppable.wav");
	explose = loadSound("../assets/audio/samples/explose.wav");
	defeat = loadSound("../assets/audio/samples/Humiliating_defeat.wav");
	prepare = loadSound("../assets/audio/samples/prepare.wav");
	count3 = loadSound("../assets/audio/samples/cd3.wav");
	count2 = loadSound("../assets/audio/samples/cd2.wav");
	count1 = loadSound("../assets/audio/samples/cd1.wav");

	explosion.setVolume(0.1);
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	noCursor();
	textFont(font);

	fft = new p5.FFT();
	// Menu
	btn_start = new Clickable();
	btn_start.text = "START GAME";
	btn_start.locate(windowWidth / 2 - 300, windowHeight / 2);
	btn_start.width = 600;
	btn_start.height = 70;
	btn_start.cornerRadius = 0;
	btn_start.textSize = 70;
	btn_start.textFont = font;

	btn_start.onHover = function() {
		this.color = "#FF0000";
		this.textColor = "#FFFFFF";
	};
	btn_start.onOutside = function() {
		this.color = "#EEEEEE";
		this.textColor = "#000000";
	};
	btn_start.onPress = function() {
		Game.state = "prestart";
		stateChanged("prestart");
	};

	if (getCookie("muted")) {
		muted = getCookie("muted").bool();
	}
	btn_mute = new Clickable();
	if (muted == true) {
		btn_mute.text = "UNMUTE MUSIC/SFX";
		masterVolume(0);
	} else {
		btn_mute.text = "MUTE MUSIC/SFX";
		masterVolume(1);
	}
	btn_mute.locate(windowWidth / 2 - 300, windowHeight / 2 + 90);
	btn_mute.width = 600;
	btn_mute.height = 70;
	btn_mute.cornerRadius = 0;
	btn_mute.textSize = 70;
	btn_mute.textFont = font;

	btn_mute.onHover = function() {
		this.color = "#FF0000";
		this.textColor = "#FFFFFF";
	};
	btn_mute.onOutside = function() {
		this.color = "#EEEEEE";
		this.textColor = "#000000";
	};
	btn_mute.onPress = function() {
		if (muted == false) {
			muted = true;
			this.text = "UNMUTE MUSIC/SFX";
			masterVolume(0);
		} else {
			muted = false;
			this.text = "MUTE MUSIC/SFX";
			masterVolume(1);
		}
		document.cookie =
			"muted=" + muted + "; expires=Thu, 18 Dec 2030 12:00:00 UTC";
	};

	btn_restart = new Clickable();
	btn_restart.text = "RESTART GAME";
	btn_restart.locate(windowWidth / 2 - 300, windowHeight - 200);
	btn_restart.width = 600;
	btn_restart.height = 70;
	btn_restart.cornerRadius = 0;
	btn_restart.textSize = 70;
	btn_restart.textFont = font;

	btn_restart.onHover = function() {
		this.color = "#FF0000";
		this.textColor = "#FFFFFF";
	};
	btn_restart.onOutside = function() {
		this.color = "#EEEEEE";
		this.textColor = "#000000";
	};
	btn_restart.onPress = function() {
		Game.restartGame();
		Game.state = "prestart";
		// stateChanged('prestart');
	};

	sleep(1000).then(() => {
		theme.loop();
	});
}

function draw() {
	if (Game.playerRecentlyHit) {
		var shakex = random(-7, 7);
		var shakey = random(-7, 7);
		translate(shakex, shakey);
	}

	// background(0);
	switch (Game.state) {
		case "menu":
			drawBackground();
			image(bg, 0, 0, windowWidth, windowHeight);

			drawEntities();
			drawMenu();
			break;

		case "prestart":
			drawBackground();
			drawEntities();
			drawScore();
			drawPopUps();
			drawCountdown();
			break;

		case "running":
			drawBackground();
			drawEntities();
			drawScore();
			drawPopUps();
			break;

		case "gameover":
			drawBackground();
			drawEntities();
			drawEndScreen();

			var shake = startShake(3);
			btn_restart.draw();
			btn_restart.locate(windowWidth / 2 - 300, windowHeight - 150);
			endShake(shake);
			break;

		default:
			break;
	}

	image(crosshair, mouseX - 20, mouseY - 20, 40, 40);
}

function drawCountdown() {
	var shake = startShake(5);

	textAlign(CENTER, CENTER);
	textSize(450);
	var asc = textAscent();
	fill(255, 255, 255, 255);
	var countdown = Game.countdown;
	if (countdown == 0) {
		countdown = "GO!";
	}
	text(countdown, windowWidth / 2, windowHeight / 2);
	endShake(shake);
}

function drawBackground() {
	image(bg, 0, 0, windowWidth, windowHeight);
}

function drawEntities() {
	for (var i = 0; i < Entity.Entities.length; i++) {
		e = Entity.Entities[i];

		if (e.type == "UFO") {
			image(ufosprites[e.frameIndex], e.x, e.y, e.sizeX, e.sizeY);
		}

		if (e.type == "satellite") {
			image(satellite, e.x, e.y, e.sizeX, e.sizeY);
		}

		if (e.type == "pickup") {
			if (Game.bossFight == "trump") {
				image(meteor, e.x, e.y, e.sizeX, e.sizeY);
			} else if (Game.bossFight == "musk") {
				image(spacex, e.x, e.y, e.sizeX, e.sizeY);
			}
		}

		if (e.type == "trump") {
			if (Game.bossRecentlyHit) {
				image(boss_hit, e.x, e.y, e.sizeX, e.sizeY);
			} else {
				// image(trump, e.x, e.y, e.sizeX, e.sizeY);
				image(bosssprites[e.frameIndex], e.x, e.y, e.sizeX, e.sizeY);
			}
			// textSize(50);
			// textAlign(RIGHT, TOP);
			// fill('white');
			// text(e.health, e.x + 50, e.y);

			var healthbarWidth = 30 * e.health;
			var startX = e.x + e.sizeX / 2 - healthbarWidth / 2;
			for (var k = 0; k < e.health; k++) {
				image(heart, startX + 30 * k, e.y - 30, 30, 30);
			}
		}

		if (e.type == "musk") {
			if (Game.bossRecentlyHit) {
				image(musk_hit, e.x, e.y, e.sizeX, e.sizeY);
			} else {
				image(musk, e.x, e.y, e.sizeX, e.sizeY);
			}
			var healthbarWidth = 30 * e.health;
			var startX = e.x + e.sizeX / 2 - healthbarWidth / 2;
			for (var k = 0; k < e.health; k++) {
				image(heart, startX + 30 * k, e.y - 30, 30, 30);
			}
		}

		// BOSS MOVEMENTS

		if (e.type == "trump" || e.type == "musk") {
			// TOP
			var randomdir = Math.round(random(1, 3));
			if (e.y <= 0) {
				switch (randomdir) {
					case 1:
						e.direction = "down";
						break;
					case 2:
						e.direction = "downleft";
						break;
					case 3:
						e.direction = "downright";
						break;
				}
			}
			// BOTTOM
			if (e.y >= windowHeight - e.sizeY) {
				switch (randomdir) {
					case 1:
						e.direction = "up";
						break;
					case 2:
						e.direction = "upleft";
						break;
					case 3:
						e.direction = "upright";
						break;
				}
			}
			// LEFT
			if (e.x <= 0) {
				switch (randomdir) {
					case 1:
						e.direction = "right";
						break;
					case 2:
						e.direction = "upright";
						break;
					case 3:
						e.direction = "downright";
						break;
				}
			}
			// RIGHT
			if (e.x >= windowWidth - e.sizeX) {
				switch (randomdir) {
					case 1:
						e.direction = "left";
						break;
					case 2:
						e.direction = "upleft";
						break;
					case 3:
						e.direction = "downleft";
						break;
				}
			}
		}

		if (
			(e.direction == "right" && e.x > windowWidth) ||
			(e.direction == "left" && e.x < -0 - e.sizeX)
		) {
			if (e.type == "UFO") {
				if (Game.state == "running") {
					Game.missed++;
					Game.lifes--;

					defeat.play();
					PopUp.CreateEntity(
						"FATAL HIT!",
						windowWidth / 2,
						windowHeight / 2,
						200,
						"RED",
						0.5
					);

					checkIfWaveWasCleared();

					Entity.DeleteEntity(i);
				}
				if (Game.lifes == 0 && Game.state == "running") {
					Game.state = "gameover";
					stateChanged("gameover");
				}
			}
		}
	}

	// Explosions
	for (var i = 0; i < Explosion.Explosions.length; i++) {
		var e = Explosion.Explosions[i];
		image(explosionsprites[e.frameIndex], e.x, e.y, e.size, e.size);
	}

	wasMouseHitByBoss();
}

function drawPopUps() {
	for (var i = 0; i < PopUp.Entities.length; i++) {
		e = PopUp.Entities[i];
		textAlign(CENTER, CENTER);
		textSize(e.size);
		fill(e.color);
		text(e.text, e.x, e.y);
	}
}

function drawMenu() {
	drawSoundWaves(
		windowHeight / 9,
		400,
		windowWidth / 4 + ((windowWidth / 2) * 0.27) / 2
	);

	let spectrum = fft.analyze();
	var shake = spectrum[1] / 50;
	drawShakyImage(
		logo2,
		windowWidth / 4 + 5,
		windowHeight / 9 - 2,
		windowWidth / 2,
		(windowWidth / 2) * 0.27,
		shake
	);
	drawShakyImage(
		logo1,
		windowWidth / 4,
		windowHeight / 9,
		windowWidth / 2,
		(windowWidth / 2) * 0.27,
		shake
	);

	shake = startShake(shake);
	textAlign(CENTER, CENTER);
	var offset = -3;
	fill("#74fcff");
	// fill('white');
	text("Your Highscore: " + Game.highscore, windowWidth / 2, windowHeight - 75);
	// fill('red');
	fill("#fff000");
	text(
		"Your Highscore: " + Game.highscore,
		windowWidth / 2 + offset,
		windowHeight - 75 + offset
	);

	btn_start.draw();
	btn_mute.draw();

	endShake(shake);
	btn_start.locate(windowWidth / 2 - 300, windowHeight / 2);
	btn_mute.locate(windowWidth / 2 - 300, windowHeight / 2 + 90);
}

function drawEndScreen() {
	// GAME OVER
	textAlign(CENTER, CENTER);
	fill(0, 0, 0, 200);
	rect(0, 0, windowWidth, windowHeight);

	drawSoundWaves(
		windowHeight / 9,
		400,
		windowWidth / 4 + ((windowWidth / 2) * 0.27) / 2
	);

	var shake = startShake(2);
	textSize(250);
	var asc = textAscent();
	// fill(255, 0, 0, 150);
	// rect(0,windowHeight/4-asc/2, windowWidth, asc*1.2);
	fill(255, 255, 255, 255);
	text("GAME OVER", windowWidth / 2, windowHeight / 4);
	var w = textWidth("GAME OVER") / 1.5;
	endShake(shake);

	// SCORE TABLE
	var shake = startShake(2);
	textSize(40);
	var asc2 = textAscent();
	// fill(255, 0, 0, 150);
	// rect(windowWidth/2-w/2,windowHeight/4+asc, w, asc2*8+80);
	fill(255, 255, 255, 255);

	var minusUFOs = Game.missed * -500;
	var minusShots = Game.shots * -20;
	var newscore = Game.score + minusShots + minusUFOs;
	Game.finalscore = newscore;

	text(
		"Score: " + Game.score,
		windowWidth / 2,
		windowHeight / 4 + asc + asc2 + 10
	);
	text(
		"UFOs missed: " + minusUFOs,
		windowWidth / 2,
		windowHeight / 4 + asc + asc2 + 40
	);
	text(
		"Satellites shot: " + Game.friendlyShots,
		windowWidth / 2,
		windowHeight / 4 + asc + asc2 + 70
	);
	text(
		"Used Shots: " + minusShots,
		windowWidth / 2,
		windowHeight / 4 + asc + asc2 + 100
	);
	text(
		"Time survived: " + Game.time + " seconds",
		windowWidth / 2,
		windowHeight / 4 + asc + asc2 + 130
	);

	textAlign(CENTER, TOP);
	textSize(80);
	fill("#74fcff");
	text(
		"Final Score: " + newscore,
		windowWidth / 2,
		windowHeight / 4 + asc + 170
	);
	var offset = -3;
	fill("#fff000");
	text(
		"Final Score: " + newscore,
		windowWidth / 2 + offset,
		windowHeight / 4 + asc + 170 + offset
	);
	endShake(shake);

	if (Game.finalscore > Game.highscore) {
		var shake = startShake(3);
		textAlign(CENTER, TOP);
		textSize(100);
		fill("#74fcff");
		text("NEW HIGHSCORE!", windowWidth / 2, 100);
		var offset = -3;
		fill("#fff000");
		text("NEW HIGHSCORE!", windowWidth / 2 + offset, 100 + offset);
		endShake(shake);
	}
}

function drawScore() {
	fill(0, 0, 0, 150);
	textSize(windowHeight * 0.055);
	let asc = textAscent();
	rect(0, 0, windowWidth, asc * 1.4);
	fill(255, 255, 255, 255);

	var shake = startShake(1);
	textAlign(LEFT, TOP);
	var enemies = Entity.GetEntitiesByType("UFO").length;
	text(
		"Score: " +
			Game.score +
			". Wave: " +
			Game.wave +
			". Enemies alive: " +
			enemies +
			". Hearts: " +
			Game.lifes,
		20,
		0
	);

	textAlign(CENTER, TOP);
	// text('Shots: ' + Game.shots + '    Missed UFOs: ' + Game.missed, windowWidth/2, 0);
	// text('Lifes: ' + Game.lifes, windowWidth / 2, 0);

	textAlign(RIGHT, TOP);
	text("Time passed: " + Game.time, windowWidth - 20, 0);

	endShake(shake);
}

function mouseClicked() {
	if (Game.state == "running") {
		Game.shots++;
		lasershot.play();

		var EnemyHitCount = 0;

		for (var i = 0; i < Entity.Entities.length; i++) {
			var e = Entity.Entities[i];
			if (Game.bossFight == "musk" && e.type == "pickup") {
				var wasHit = Entity.WasEntityHit(i, mouseX, mouseY, true);
			} else {
				var wasHit = Entity.WasEntityHit(i, mouseX, mouseY);
			}

			if (wasHit == true && e.isBoss == false) {
				Entity.Entities[i].health--;
				createExplosion(mouseX - 50, mouseY - 50, 100);

				if (Entity.Entities[i].health == 0) {
					createExplosion(e.x, e.y, e.sizeX);
					if (Game.bossFight == "musk" && e.type == "pickup") {
						for (var k = 0; k < 12; k++) {
							createExplosion(e.x, e.y + e.sizeX * k, e.sizeX);
						}
					}
					switch (e.type) {
						case "UFO":
							var bonus = Math.floor(Entity.Entities[i].sizeX);
							PopUp.CreateEntity(
								bonus,
								e.x + e.sizeX / 2,
								e.y + e.sizeX / 2,
								e.sizeX / 2,
								"green",
								0.5
							);
							EnemyHitCount++;
							var enemies = Entity.GetEntitiesByType("UFO").length;
							checkIfWaveWasCleared();
							break;
						case "satellite":
							var bonus = Math.floor(Entity.Entities[i].sizeX) * -10;
							Game.friendlyShots += bonus;
							PopUp.CreateEntity(
								bonus,
								e.x + e.sizeX / 2,
								e.y + e.sizeX / 2,
								e.sizeX / 2,
								"red",
								0.5
							);
							break;
						case "pickup":
							var bonus = 2500;
							PopUp.CreateEntity(
								"GREAT!",
								e.x + e.sizeX / 2,
								e.y + e.sizeX / 2,
								e.sizeX / 2,
								"blue",
								1
							);
							PopUp.CreateEntity(
								"+" + bonus,
								e.x + e.sizeX / 2,
								e.y + e.sizeX / 2 + 50,
								e.sizeX / 3,
								"green",
								1
							);
							var id = Entity.GetBossEntity();
							createExplosion(
								Entity.Entities[id].x,
								Entity.Entities[id].y,
								Entity.Entities[id].sizeX
							);
							Entity.Entities[id].health--;
							Game.bossRecentlyHit = true;
							sleep(1000).then(() => {
								Game.bossRecentlyHit = false;
							});
							if (Entity.Entities[id].health == 0) {
								EnemyHitCount++;
								var bonus = 12500;
								PopUp.CreateEntity(
									"BOSS DEFEAT!",
									windowWidth / 2,
									windowHeight / 2,
									250,
									"hotpink",
									1
								);
								unstoppable.play();
								Entity.DeleteEntity(id);
								sleep(2000).then(() => {
									Game.bossFight = false;
									Game.waveOnGoing = false;
									Game.lifes += 3;
									Entity.SpeedMultiplier += 0.5;
									startNewWave();
								});
							}
							break;
					}

					Game.score += bonus;
					Entity.DeleteEntity(i);
				}
			}
		}

		if (EnemyHitCount == 2) {
			Game.score += 500;
			doublekill.play();
			PopUp.CreateEntity(
				"DOUBLEKILL!",
				windowWidth / 2,
				windowHeight / 2,
				100,
				"DARKORANGE",
				0.5
			);
		}
		if (EnemyHitCount >= 3) {
			Game.score += 1000;
			tripplekill.play();
			PopUp.CreateEntity(
				"TRIPPLEKILL!",
				windowWidth / 2,
				windowHeight / 2,
				150,
				"DEEPPINK",
				0.5
			);
		}
	}
}

function createExplosion(x, y, size) {
	Explosion.CreateExplosion(x, y, size);
	explosion.play();
}

function createRandomUfo() {
	var size = random(windowHeight / 10, windowHeight / 5);
	var speed = random(1, 3);

	var startLeft = Math.random() >= 0.5;
	if (startLeft == true) {
		var x = 0 - random(size, size * 5);
		var direction = "right";
	} else {
		var x = random(windowWidth, windowWidth + size * 5);
		var direction = "left";
	}
	var y = random(0, windowHeight - size);
	Entity.CreateEntity("UFO", 3, size, size, speed, x, y, direction, 1);
}

function createRandomSatellite() {
	var size = random(windowHeight / 10, windowHeight / 5);
	var speed = random(1, 3);

	var startLeft = Math.random() >= 0.5;
	if (startLeft == true) {
		var x = 0 - size;
		var direction = "right";
	} else {
		var x = windowWidth;
		var direction = "left";
	}
	var y = random(0, windowHeight - size);
	Entity.CreateEntity("satellite", 1, size, size, speed, x, y, direction, 1);
}

function createRandomPickup() {
	if (Game.bossFight == "trump") {
		var size = random(windowHeight / 10, windowHeight / 5);
		var speed = random(5, 10);
		var x = random(0, windowWidth - size);
		var y = 0 - size;
		var direction = "down";
		Entity.CreateEntity("pickup", 1, size, size, speed, x, y, direction, 1);
	} else if (Game.bossFight == "musk") {
		var size = random(windowWidth / 25, windowWidth / 15);
		var speed = random(Game.wave / 5, Game.wave);
		// var speed = wave/5;
		var x = random(0, windowWidth - size);
		var y = windowHeight + size;
		var direction = "up";
		Entity.CreateEntity(
			"pickup",
			1,
			size,
			size * 13,
			speed,
			x,
			y,
			direction,
			3
		);
	}
}

function createRandomTrump() {
	var size = windowWidth / 3;
	// var speed = random(1,3);
	var speed = Game.wave / 3;
	// var x = Math.min(windowWidth * Math.random(), windowWidth - size);
	var x = random(0, windowWidth - size);
	var y = windowHeight;
	var direction = "upright";
	Entity.CreateEntity("trump", 3, size, size, speed, x, y, direction, 10, true);
}

function createRandomMusk() {
	var size = random(windowHeight / 3, windowHeight / 2);
	// var speed = random(1,3);
	var speed = Game.wave / 2;
	var x = windowWidth;
	// var y = Math.min(windowHeight * Math.random(), windowHeight - size);
	var y = random(0, windowHeight - size);
	var direction = "left";
	Entity.CreateEntity("musk", 1, size, size, speed, x, y, direction, 10, true);
}

function stateChanged(state) {
	if (state == "menu") {
	}
	if (state == "gameover") {
		gameoversound.play();
		// Entity = new EntityManager();
		var minusUFOs = Game.missed * -500;
		var minusShots = Game.shots * -500;
		var newscore = Game.score + minusShots + minusUFOs;
		Game.finalscore = newscore;
		if (Game.finalscore > Game.highscore) {
			document.cookie =
				"highscore=" +
				Game.finalscore +
				"; expires=Thu, 18 Dec 2030 12:00:00 UTC";
		}
	}
	if (state == "prestart") {
		Entity = new EntityManager();
	}
	if (state == "running") {
		startGameProgress();
	}
}

function startGameProgress() {
	clearInterval(Game.SequenceTimer);
	startNewWave();

	Game.SequenceTimer = setInterval(function() {
		if (Game.state == "running") {
			playTimeLeftSounds();

			if (Game.time % 5 == 0) {
				createRandomSatellite();
			}

			if (Game.bossFight) {
				if (Game.time % 5 == 0) {
					createRandomPickup();
				}
				return;
			}
		}
	}, 1000);
}

function touchStarted() {
	getAudioContext().resume();
}

function drawSoundWaves(posY, height) {
	let waveform = fft.waveform();
	noFill();
	beginShape();
	stroke(255, 0, 0);
	strokeWeight(1);
	for (var i = 0; i < waveform.length; i++) {
		let x = map(i, 0, waveform.length, 0, width);
		let y = map(waveform[i], -1, 1, height, posY);
		vertex(x, y);
	}
	endShape();

	noFill();
	beginShape();
	stroke(0, 255, 0);
	strokeWeight(1);
	for (var i = 0; i < waveform.length; i++) {
		let x = map(i, 0, waveform.length, 0, width);
		let y = map(waveform[i], -1, 1, height + 10, posY);
		vertex(x, y);
	}
	endShape();

	noFill();
	beginShape();
	stroke(0, 0, 255);
	strokeWeight(1);
	for (var i = 0; i < waveform.length; i++) {
		let x = map(i, 0, waveform.length, 0, width);
		let y = map(waveform[i], -1, 1, height + 20, posY);
		vertex(x, y);
	}
	endShape();
}

function playTimeLeftSounds() {
	switch (Game.countdown) {
		case 3:
			count3.play();
			break;
		case 2:
			count2.play();
			break;
		case 1:
			count1.play();
			break;
		case 0:
			// prepare.play();
			break;
	}
}

function wasMouseHitByBoss() {
	if (Game.state == "running") {
		var id = Entity.GetBossEntity();
		if (id || id == 0) {
			var wasHit = Entity.WasEntityHit(id, mouseX, mouseY);
			if (wasHit && Game.playerRecentlyHit == false) {
				PopUp.CreateEntity(
					"DAMAGE TAKEN!",
					windowWidth / 2,
					windowHeight / 2,
					150,
					"DEEPPINK",
					1
				);
				Game.playerRecentlyHit = true;
				Game.lifes--;
				if (Game.lifes == 0 && Game.state == "running") {
					Game.state = "gameover";
					stateChanged("gameover");
				}
				sleep(1000).then(() => {
					Game.playerRecentlyHit = false;
				});
			}
		}

		if (Game.playerRecentlyHit) {
			fill(255, 0, 0, 100);
			rect(0, 0, windowWidth, windowHeight);
		}
	}
}

function startNewWave() {
	Game.wave++;
	Game.waveOnGoing = true;
	// Entity.SpeedMultiplier += 0.05;
	prepare.play();
	PopUp.CreateEntity(
		"NEW WAVE",
		windowWidth / 2,
		windowHeight / 2,
		250,
		"WHITE",
		1
	);
	var enemyCount = Game.wave + 5;
	// var enemyCount = 5;
	for (var i = 0; i < enemyCount; i++) {
		createRandomUfo();
	}
}

function checkIfWaveWasCleared() {
	if (Entity.GetEntitiesByType("UFO").length == 1 && Game.wave == 10) {
		PopUp.CreateEntity(
			"WAVE CLEARED!",
			windowWidth / 2,
			windowHeight / 2,
			100,
			"DARKORANGE",
			1
		);
		Game.bossFight = "musk";
		sleep(2000).then(() => {
			createRandomMusk();
		});
	}
	if (Entity.GetEntitiesByType("UFO").length == 1 && Game.wave == 15) {
		PopUp.CreateEntity(
			"WAVE CLEARED!",
			windowWidth / 2,
			windowHeight / 2,
			100,
			"DARKORANGE",
			1
		);
		Game.bossFight = "trump";
		sleep(2000).then(() => {
			createRandomTrump();
		});
	}
	if (Entity.GetEntitiesByType("UFO").length == 1 && Game.bossFight == false) {
		PopUp.CreateEntity(
			"WAVE CLEARED!",
			windowWidth / 2,
			windowHeight / 2,
			100,
			"DARKORANGE",
			1
		);
		Game.waveOnGoing = false;
		sleep(5000).then(() => {
			startNewWave();
		});
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function countDownChanged() {
	playTimeLeftSounds();
}
