var hero, goal, fireBall, myBackground, hud, myScore, bott, lt, rt, roof, myGameArea;

// SET STARTING POSITION OF ALL GAME OBJECTS
function startGame() {
	//SET LOCAL VARIABLES FOR CANVAS 
	minX = 40; maxX = myGameArea.canvas.width - 30;
	minY = 50; maxY = myGameArea.canvas.height - 80;
	randomX = Math.floor(Math.random()*(maxX-minX+1)+minX); 
	randomY = Math.floor(Math.random()*(maxY-minY+1)+minY);
	myGameArea.start();	
	hud = new gamePiece(myGameArea.canvas.width, 50, "black", 0, 0);
	myBackground = new gamePiece(myGameArea.canvas.width, myGameArea.canvas.height-100, "forest_fire.gif", 0, 50, "image");
	hero = new gamePiece(30, 30, "bird.gif", 40, 100, "image");
	fireBall = new gamePiece(30, 30, "fire_ball.gif", 200, 20, "image");
	goal = new gamePiece(30, 30, "life_goal.gif", randomX, randomY, "image");
	myScoreMessage = new gamePiece("30px", "Consolas", "white", myGameArea.canvas.width - 200, 30, "text");
	gameMessage = new gamePiece("30px", "Consolas", "yellow", 50, 30, "text");
	bott = new gamePiece(myGameArea.canvas.width, 50, "fire_bottom.gif", 0, myGameArea.canvas.height - 50, "image");
	let = new gamePiece(3, myGameArea.canvas.height, "rgba(0,0,0,0)", 0, 0);
	rit = new gamePiece(3, myGameArea.canvas.height, "rgba(0,0,0,0)", myGameArea.canvas.width-3, 0);
	roof = new gamePiece(myGameArea.canvas.width, 50, "rgba(0,0,0,0)", 0, 0);
	
}

myGameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 600;
		this.canvas.height = 400;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.frameNo = 0;
		this.myScore = 0;
		this.interval = setInterval(updateGameArea, 20);
		window.addEventListener('keydown', function (e) {
            	    myGameArea.key = e.keyCode;
       		})
        	window.addEventListener('keyup', function (e) {
            	    myGameArea.key = false;
        	})
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop : function() {
		
    		clearInterval(this.interval); // this is the stop function
    		
		
	},
	// how to pause a stupid game http://atomicrobotdesign.com/blog/web-development/pause-your-html5-canvas-game/
	

}



// SET PROPERTIES OF THE GAMEPIECES
function gamePiece(w, h, c, x, y, type) {

	this.type = type;
	// Check if game piece is an image
	if (type == "image") { 
		this.image = new Image();
		this.image.src = c;
	}

	this.width = w;
	this.height = h;
	// I still don't understand this speed thing
	this.speedX = 0;
	this.speedY = 0;
	//gravity is apparently a built in function of html canvas
	this.gravity = 0.01;
	this.gravitySpeed = 0;
	
	this.x = x;
	this.y = y;

	this.update = function() {
		ctx = myGameArea.context; 
		if (type == "image") {
			ctx.drawImage(this.image,this.x,this.y,this.width, this.height);
		} 
		else if (this.type == "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = c;
			ctx.fillText(this.text, this.x, this.y);

		}
		else {
			ctx.fillStyle = c;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}
	
	this.gravityFalls = function() {
		this.gravitySpeed += this.gravity;
		this.x += this.speedX;
		this.y += this.speedY + this.gravitySpeed;
		this.hitBottom(); // call to the hitbottom function to stop game
	}

	this.hitBottom = function() {
		var rockbottom = myGameArea.canvas.height - this.height;
		if (this.y > rockbottom) {
			this.gravitySpeed = 0;
			this.gravity = 0;
		}
	}
	
	this.fireFalling = function() {
		minX = 30;
		maxX = myGameArea.canvas.width - 30;
		if ((myGameArea.frameNo % 180) == 0) {
			this.y = 50;
			this.x = Math.floor(Math.random()*(maxX-minX+1)+minX);
		} else {
			this.y += 2
		}
		
		
	}
	
	this.collideWith = function(someObject) {
        	var myleft = this.x;
        	var myright = this.x + (this.width);
        	var mytop = this.y;
        	var mybottom = this.y + (this.height);
        	var otherleft = someObject.x;
        	var otherright = someObject.x + (someObject.width);
        	var othertop = someObject.y;
        	var otherbottom = someObject.y + (someObject.height);
        	var crash = true;
// This crash logic is EVERYTHING, remember the coordinates of the canvas start at top left
        if ((mybottom < othertop) || (mytop > otherbottom) || 
	   (myright < otherleft) ||(myleft > otherright)) 
		{
           		crash = false;
        	}
        return crash;
    	}

}


// THIS WHOLE SECTION IS FOR KEEPING TRACK OF SCREEN REFRESH FOR SCORING PURPOSES
//function everyinterval(n) {
//	if ((myGameArea.frameNo /n) % 1 == 0) {return true;}
//	return false;
//}


function updateGameArea(){
	
	
	if (hero.collideWith(fireBall) || hero.collideWith(bott)) {
		myGameArea.clear();
		myBackground.update();
		
		hero.update();
		hud.update();
		gameMessage.text = "You Lost! Oh No!";
		
		gameMessage.update(); //Write my message	    
		
		myGameArea.stop();
	    
	} 
	else if (hero.collideWith(goal)) {
		minX = 30;
		maxX = 370;
		minY = 50;
		maxY = 340;
		randomX = Math.floor(Math.random()*(maxX-minX+1)+minX);
		randomY = Math.floor(Math.random()*(maxY-minY+1)+minY);
		
		myGameArea.myScore += 1;
	
		
		if (myGameArea.myScore == 3) {
			
			
			myGameArea.clear();
			myBackground.update();
			bott.update();
			let.update();
			rit.update();
			roof.update();
			hero.update();
			hud.update();
			myScoreMessage.text = "Score: " + myGameArea.myScore;
		
			myScoreMessage.update(); //Write my score to the screen
			gameMessage.text = "YOU SAVED THE BIRDS!";
		
			gameMessage.update(); //Write my score to the screen	
			myGameArea.stop();
		};
			    
		
		hero.x = 1;
		
		hero.y = randomY+-50;
		goal.x = randomX
		goal.y = randomY;
		if (hero.x < 21) {
		    hero.x += 2;
		}				
	}
	
	
	else {
		
		if (hero.collideWith(rit)) {
			hero.x = 365;
		}
		if (hero.collideWith(let)) {
			hero.x = 5;
		}
		if (hero.collideWith(roof)) {
			hero.y = 51;
			hero.gravitySpeed = 0;
			
		}
		
		myGameArea.clear();
		if (myGameArea.key && myGameArea.key == 37) {moveleft() }
    		if (myGameArea.key && myGameArea.key == 39) {moveright() }
    		if (myGameArea.key && myGameArea.key == 38) {accelerate() }
    		//if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 1; }
		myGameArea.frameNo += 1;
		
		
		fireBall.fireFalling();
		hero.gravityFalls();
		//fireBall.newPos();
		myBackground.update();
		
		
		fireBall.update();
		hud.update();
		if (myGameArea.myScore >= 1) {
			gameMessage.text = "GREAT JOB!";
		
	    		gameMessage.update(); //Write my score to the screen;
		    
		} else if (myGameArea.myScore == 3) {
			gameMessage.text = "";
			gameMessage.update();
		}
		myScoreMessage.text = "Score: " + myGameArea.myScore;
		
		myScoreMessage.update(); //Write my score to the screen
		goal.update();
		hero.update();
		//sun1.update(); //write a sun piece to the canvas
		//sun2.update(); //write a sun piece to the canvas
		bott.update();
		let.update();
		rit.update();
		roof.update();
		

	
	}
}

function moveup() {
	
hero.speedY -= .1;
	

}



function moveleft() {
    hero.speedX -= .1;
}

function moveright() {
    hero.speedX += .1;
}
function stopMove() {
	hero.speedX = 0;
	hero.speedY = 0;
}
function accelerate(n) {
    hero.gravity = n;
}

function keyDown(e) {
  if (e.keyCode == 32) {myGameArea.stop();}
}
