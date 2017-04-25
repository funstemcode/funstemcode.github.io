var hero, myGameArea, myUpBtn, myDownBtn, myLeftBtn, myRightBtn;
// figure out acceleration https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/HTML-canvas-guide/AddingMouseandTouchControlstoCanvas/AddingMouseandTouchControlstoCanvas.html
// SET STARTING POSITION OF ALL GAME OBJECTS
function startGame() {
	//SET LOCAL VARIABLES FOR CANVAS 
	
	
	hero = new gamePiece(30, 30, "bird.gif", 40, 100, "image");
	myUpBtn = new gamePiece(30, 30, "red", 350, 100); 
  	myDownBtn = new gamePiece(30, 30, "orange", 350, 160); 
  	myLeftBtn = new gamePiece(30, 30, "orange", 320, 130); 
  	myRightBtn = new gamePiece(30, 30, "orange", 380, 130);
	myGameArea.start();
	
}

///////////////SET CANVAS PROPERTIES AND EVENT TRIGGERS
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
		window.addEventListener('mousedown', function (e) {
            	    myGameArea.x = e.pageX;
                    myGameArea.y = e.pageY;
       		})
       	 	window.addEventListener('mouseup', function (e) {
          	  myGameArea.x = false;
                  myGameArea.y = false;
       		})
        	window.addEventListener('touchstart', function (e) {
                    myGameArea.x = e.pageX;
                    myGameArea.y = e.pageY;
        	})
        	window.addEventListener('touchend', function (e) {
            	    myGameArea.x = false;
            	    myGameArea.y = false;
        	})
        }, 

	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop : function() {
		
    		clearInterval(this.interval); // this is the stop function
    		
		
	},
	
}



//////////////// SET PROPERTIES OF THE GAMEPIECES
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
	this.gravity = 0.02;
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
	this.newPos = function() {
            this.gravitySpeed += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY + this.gravitySpeed;
            this.hitBottom();
   	}
    	this.hitBottom = function() {
            var rockbottom = myGameArea.canvas.height - this.height;
            if (this.y > rockbottom) {
                this.y = rockbottom;
                this.gravitySpeed = 0;
            }
    	}
	this.clicked = function() {
            var myClickleft = this.x;
            var myClickright = this.x + (this.width);
            var myClicktop = this.y;
            var myClickbottom = this.y + (this.height);
            var clicked = true;
            if ((myClickbottom < myGameArea.y) || (myClicktop > myGameArea.y)
               || (myClickright < myGameArea.x) || (myClickleft > myGameArea.x)) {
            clicked = false;
            }
        return clicked;
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
	
	if (myGameArea.x && myGameArea.y) {
            if (myUpBtn.clicked()) {
	        console.log("up clicked");
                accelerate(-0.02);
            }
	    if (!myUpBtn.clicked()) {
	        hero.speedY = 0;
	    }
            if (myDownBtn.clicked()) {
            console.log("down clicked");
	    hero.y += 1;
            }
            if (myLeftBtn.clicked()) {
            console.log("left clicked");
	    hero.x += -1;
            }
            if (myRightBtn.clicked()) {
            console.log("right clicked");
	    hero.x += 1;
            }
        }
	
		
	myGameArea.clear();
		
	hero.newPos();
	hero.update();
		
	myUpBtn.update();
	myDownBtn.update();
	myLeftBtn.update();
	myRightBtn.update();
		
}

function accelerate(n) {
    hero.gravity = n;
}


