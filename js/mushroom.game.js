$(function () {
	var game = {};
	game.context = $("#game_scene").get(0).getContext("2d");
	game.score = 0;
	game.win_score = 200;
	game.mushrooms = [];
	game.height = game.context.canvas.height;
	game.width = game.context.canvas.width;

	game.basket = {
		x : 0,
		y : 0,
		width : 0,
		height : 0
	};

	game.cursor = {
		x : 0,
		y : 0
	};

	game.cursor.draw = function(ctx) {
		drawCircle(ctx, this.x, this.y, 5, 5);
	}

	game.basket.draw = function (ctx) {
		var x = this.x;
		var y = this.y;
		drawImage(ctx, this.image, x, y);
	}

	game.basket.image = new Image();
	game.basket.image.src = "images/basket.jpg";
	game.basket.image.onload = function () {
		game.basket.width = game.basket.image.width;
		game.basket.height = game.basket.image.height;
		game.basket.y = game.height - game.basket.height - 10;
	}

	game.mushroom = {
		width: 100,
		height: 40
	};
	game.mushroom.image = new Image();
	game.mushroom.image.src = "images/hulu.jpg";
	// game.mushroom.image.onload = function () {
	// 	game.mushroom.width = game.mushroom.image.width;
	// 	game.mushroom.height = game.mushroom.image.height;
	// }

	Array.prototype.foreach = function (func) {
		for (var i = 0; i < this.length; i++) {
			func(this[i], i);
		}
	}

	Array.prototype.removeObject = function (item) {
		var index = -1;
		for (var i = 0; i < this.length; i++) {
			if (this[i] == item) {
				index = i;
				break;
			}
		}
		this.splice(i, 1);
	}

	var texts = ['M2W', '刷题', '写文档'];
	function Mushroom (x, y, v) {
		this.x = x;
		this.y = y;
		this.v = v;
		var r = Math.floor(rand(0, texts.length));
		this.text = texts[r];
	}

	Mushroom.prototype.draw = function (ctx) {
		// drawImage(ctx, game.mushroom.image, this.x, this.y);
		drawRect(ctx, this.x, this.y, game.mushroom.width, game.mushroom.height, "blue");
		drawText(ctx, this.text, this.x + game.mushroom.width/2 - 15, this.y + game.mushroom.height/2, "white");
	}

	Mushroom.prototype.update = function () {
		this.y += this.v;
	}

	setInterval(gameLoop, 30);

	setInterval(generateMushroom, 1200);

	$("#layers").bind("mousemove", function (e) {
		// game.basket.x = e.layerX - game.basket.width / 2;
		game.cursor.x = e.layerX;
		game.cursor.y = e.layerY;
	});

	$("#layers").bind("click", function (e) {
		var clickX = e.layerX;
		var clickY = e.layerY;

		var hitmushroom;
		for (var i = 0; i < game.mushrooms.length; i++) {
			var mushroom = game.mushrooms[i];
			var mx = mushroom.x + game.mushroom.width / 2;
			var my = mushroom.y + game.mushroom.height / 2;

			if (Math.abs(clickX - mx) < game.mushroom.width / 2 && Math.abs(clickY - my) < game.mushroom.height / 2) {
				hitmushroom = i;
				break;
			}
		}
		if (typeof hitmushroom !== 'undefined') {
			game.mushrooms.splice(hitmushroom, 1);
			game.score += 10;
		}
	});

	function gameLoop() {
		update();
		draw();
	}

	function draw() {
		clear(game.context);
		game.mushrooms.foreach(function (mushroom) {
			mushroom.draw(game.context);
		});
		// game.basket.draw(game.context);
		game.cursor.draw(game.context);

		$("#score_span").html(parseInt(game.score));
	}

	function update() {
		var dropedMushrooms = [];
		game.mushrooms.foreach(function (mushroom, i) {
			mushroom.update();

			if (mushroom.y > game.height) {
				dropedMushrooms.push(i);
			}
		});

		dropedMushrooms.foreach(function (i) {
			game.score -= 20;
			game.mushrooms.splice(i, 1);
		});

		// detect win
		if (game.score > game.win_score) {
			$("#win").show();
		}

	}

	function generateMushroom (argument) {
		var margin = 20;
		var x = rand(margin, game.width - margin);
		var y = 0;
		var v = rand(2, 7);
		var mushroom = new Mushroom(x, y, v);
		game.mushrooms.push(mushroom);
	}

	// Utilities
	function rand (from, to) {
		return Math.random() * (to - from) + from;
	}

	function clear(ctx) {
		ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
	}

	function drawCircle(ctx, x, y, radius) {
		// prepare the radial gradients fill style
		var circle_gradient = ctx.createRadialGradient(x-3,y-3,1,x,y,radius);
		circle_gradient.addColorStop(0, "#fff");
		circle_gradient.addColorStop(1, "#cc0");
		ctx.fillStyle = circle_gradient;

		// draw the path
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI*2, true);
		ctx.closePath();

		// actually fill the circle path
		ctx.fill();
	}

	function drawImage (ctx, image, x, y) {
		if (image) {
			ctx.drawImage(image, x, y);
		}
	}

	function drawText(ctx, text, x, y, style) {
		ctx.fillStyle = style;
		ctx.fillText(text, x, y);
	}

	function drawRect(ctx, x, y, width, height, style) {
		ctx.fillStyle = style;
		ctx.fillRect(x, y, width, height);
	}
});
