

var myBackground;
var canvasWidth = 500;
var canvasHeight = 430;

function startBackground(){
	myBackground = new bkground(6800, canvasHeight, 'img/Mario_level_1_scroll_clean.png', 0,0,'image');
	gameCanvas.start();
}

var gameCanvas = {
	canvas: document.createElement("canvas"),
	start: function(){
		this.canvas.width = canvasWidth;
		this.canvas.height = canvasHeight;
		this.context = this.canvas.getContext("2d");
		//document.body.insertBefore(
		//	this.canvas, document.body.childNodes[0]
		//	); // COULD BE document.body.appendChild(canvas)
		this.interval = setInterval(updateGame, 1000/60);
	},
	clear: function(){
		this.context.clearRect(0,0, this.canvas.width,this.canvas.height);
	},
	stop: function(){
		clearInterval(this.interval);
	}

}

function bkground(width,height,color,x,y,type)
{
	this.type = type;
	if (type == "image"){
		this.image = new Image();
		this.image.src = color;
	}
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.update = function(){
		ctx = gameCanvas.context;
		if (type == "image") {
			ctx.drawImage(this.image,
				this.x,
				this.y,
				this.width,
				this.height);
		}
	}
	this.newPos = function(){
		this.x += this.speedX;
		this.y += this.speedY;
	}
}


function updateGame(){
	gameCanvas.clear();
	myBackground.speedX = -1;
	myBackground.newPos();
	myBackground.update();
}