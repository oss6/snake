/*
 * snake
 * MIT licensed
 *
 * Created by Ossama Edbali
 */
 
//
// DEFINITION OF GLOBAL VARIABLES
//

// Game variables
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var FPS = 45; // 25
var game_loop;
var gameOverText = function() {
	return "Game over! You've totalized " + snakeSettings.score + " points.";
}

// Snake variables
var snakeSettings = {
	n: 5, // Number of elements/squares
	eachSize: 10,
	speed: 10,
	score: 0
};
var snakeHandler = {
	direction: "right",
	moveDown: function() { snake[0].pos.y += snakeSettings.speed; },
	moveUp: function() { snake[0].pos.y -= snakeSettings.speed; },
	moveRight: function() { snake[0].pos.x += snakeSettings.speed; },
	moveLeft: function() { snake[0].pos.x -= snakeSettings.speed; },
	update: function() {
		for (var i = snakeSettings.n - 1; i > 0; i--){		
			snake[i].pos.y = snake[i - 1].pos.y;
			snake[i].pos.x = snake[i - 1].pos.x;
		}
	},
	draw: function() {
		for(var i = 0; i < snakeSettings.n; i++) {
			ctx.fillStyle = snake[i].color;
			ctx.fillRect(snake[i].pos.x, snake[i].pos.y, snakeSettings.eachSize, snakeSettings.eachSize);
		}
	}
};
var snake; // Array of squares
var keyPressed;

// Food variables
var rndX;
var rndY;

// Canvas and context
var canvas;
var ctx;

//
// FUNCTIONS
//

function initialize() {
	canvas = $("#universe").get(0);
	
	if(canvas && canvas.getContext)
		ctx = canvas.getContext("2d");
	initSnake();
	
	// Random position of food
	rndX = randomNumber(SCREEN_WIDTH);
	rndY = randomNumber(SCREEN_HEIGHT);
	
	game_loop = setInterval(loop, FPS);
}

function initSnake() {
	snake = [];
	for(var i = 0; i < snakeSettings.n; i++) {
		var el = {
			pos: { x: 0, y: 10 },
			color: "#fff"
		};
		el.pos.x = (snakeSettings.n * snakeSettings.eachSize) - (i * snakeSettings.eachSize);
		
		snake.push(el);
	}
}

function growSnake() {
	var xNew, yNew, newEl;
	var dim = snakeSettings.n;
	
	switch(snakeHandler.direction) {
		case "up":
			xNew = snake[dim - 1].pos.x;
			yNew = snake[dim - 1].pos.y + snakeSettings.eachSize;
			break;
		case "down":
			xNew = snake[dim - 1].pos.x;
			yNew = snake[dim - 1].pos.y - snakeSettings.eachSize;
			break;
		case "right":
			xNew = snake[dim - 1].pos.x - snakeSettings.eachSize;
			yNew = snake[dim - 1].pos.y;
			break;
		case "left":
			xNew = snake[dim - 1].pos.x + snakeSettings.eachSize;
			yNew = snake[dim - 1].pos.y;
			break;
	}
	
	newEl = {
		pos: { x: xNew, y: yNew },
		color: "#fff"
	}
	
	snake.push(newEl);
	snakeSettings.n++;
}

function randomNumber(max) {
	var n;
	
	do
		n = Math.floor(Math.random() * max);
	while(n % snakeSettings.eachSize != 0);
	
	return n;
}

function drawFood() {
	ctx.fillStyle = "#ff0";
	ctx.fillRect(rndX, rndY, snakeSettings.eachSize, snakeSettings.eachSize);
}

function drawScore() {
	ctx.fillStyle = "#fff";
	ctx.font = '20pt Calibri';
    ctx.fillText('Score: ' + snakeSettings.score, 20, 20);
}

function resizeHandler() {
	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight;
	
	if(canvas) {
		canvas.width = SCREEN_WIDTH;
		canvas.height = SCREEN_HEIGHT;
	}
}

function backToMenu() {
	$("#universe")
		.slideUp(500, function() {
			$('<div class="game"><h1 class="title">Snake</h1><div class="button">Start game!</div></div>').appendTo('body');
			
			// Reset settings
			snakeHandler.direction = "right";
			snakeSettings.n = 5;
			snakeSettings.score = 0;
			
			$(this).remove(); // Remove canvas
		});
}

function background(fillClr) {
	ctx.fillStyle = fillClr;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function loop() {
	// Core of the game
	background('rgba(0,0,0,0.5)');
	
	// Check bounds collision
	if(snake[0].pos.x >= SCREEN_WIDTH || snake[0].pos.x <= 0 || snake[0].pos.y >= SCREEN_HEIGHT || snake[0].pos.y <= 0) {
		clearInterval(game_loop);
		alert(gameOverText()); // Smart alert
		backToMenu();
	}
	
	// Check if snake hits him self (...)
	for(var i = 1; i < snakeSettings.n; i++)
		if(snake[0].pos.x == snake[i].pos.x && snake[0].pos.y == snake[i].pos.y) {
			clearInterval(game_loop);
			alert(gameOverText()); // Smart alert
			backToMenu();
		}
	
	// Redraw food
	drawFood();
	
	// Movement
	switch(snakeHandler.direction) {
		case "up":
			snakeHandler.update();
			snakeHandler.moveUp();
			snakeHandler.draw();
			break;
		case "down":
			snakeHandler.update();
			snakeHandler.moveDown();
			snakeHandler.draw();
			break;
		case "left":
			snakeHandler.update();
			snakeHandler.moveLeft();
			snakeHandler.draw();
			break;
		case "right":
			snakeHandler.update();
			snakeHandler.moveRight();
			snakeHandler.draw();
			break;
	}
	
	// Check food collision
	if(snake[0].pos.x == rndX && snake[0].pos.y == rndY) {
		rndX = randomNumber(SCREEN_WIDTH);
		rndY = randomNumber(SCREEN_HEIGHT);
		growSnake();
		
		snakeSettings.score += 10;
	}
	
	drawScore();
}

// Support variables
(function($) {
	$(document).ready(function() {
		$('body').on('click', '.button', function() {
			$('<canvas id="universe">Your browser doesnt support the "canvas" element</canvas>')
				.width(SCREEN_WIDTH)
				.height(SCREEN_HEIGHT)
				.appendTo('body')
				.hide()
				.slideDown(1000);
			
			initialize();
			resizeHandler(); // First call --> when the doc is ready
			$(".game").remove();
		});
		
		$(window).resize(function() {
			resizeHandler();
		});
		
		$(window).on('keydown', function(e) {
			keyPressed = e.which;
			if((keyPressed == "38" || keyPressed == "87") && snakeHandler.direction != "down")  // UP
				snakeHandler.direction = "up";
			else if((keyPressed == "40" || keyPressed == "83") && snakeHandler.direction != "up") // DOWN
				snakeHandler.direction = "down";
			else if((keyPressed == "37" || keyPressed == "65") && snakeHandler.direction != "right") // LEFT
				snakeHandler.direction = "left";
			else if((keyPressed == "39" || keyPressed == "68") && snakeHandler.direction != "left") // RIGHT
				snakeHandler.direction = "right";
		});
	});
})(jQuery);
