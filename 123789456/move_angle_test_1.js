//run the script on page load
(function () {
//Declare the global variables

var hero, heroWidth, heroHeight, heroColor, heroStartX, heroStartY; //Declare the hero object
var animationScreenWidth; //declare the screen width
var animationScreenHeight; //declare the screen height

//Declare the height and width of the canvas
animationScreenWidth = 800; //set the screen width
animationScreenHeight = 450; //set the screen height
animationScreenBackground = "beige"; //set the screen color

//Declare the properties of the hero object
heroWidth = 30; 
heroHeight = 30;
heroColor = "blue"; //This must be in quotes
heroStartX = animationScreenWidth/2; 
heroStartY = 200;

//declare the function to render the animation screen
function render() {
    //This function runs once per frame or 60x/second
    animationScreen.clearScreen();
    animationScreen.colorScreen();
    hero.moveAngle = 0;
    hero.speed = 0;
    if (animationScreen.keys && animationScreen.keys[37]) {hero.moveAngle = -1; }
    if (animationScreen.keys && animationScreen.keys[39]) {hero.moveAngle = 1; }
    if (animationScreen.keys && animationScreen.keys[38]) {hero.speed= 1; }
    if (animationScreen.keys && animationScreen.keys[40]) {hero.speed= -1; }
    if (animationScreen.keys && animationScreen.keys[32]) {var bullet = new animationObject(10,10,"green",hero.x,hero.y); bullet.drawCharacter(); bullet.x += 1;}
    

    hero.newPosition();
    hero.drawCharacter();
}

//declare the screen animation variable
var animationScreen = {

    canvas : document.createElement("canvas"), //set the canvas 
    //declare the start function
    start : function() {
        //set up the properties of the canvas animations screen
        this.canvas.setAttribute("id", "animationScreen");
        this.canvas.width = animationScreenWidth;
        this.canvas.height = animationScreenHeight;
        
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        //set the render interval for updating the game screen
        this.interval = setInterval(render, 1000/60); 
         window.addEventListener('keydown', function (e) {
            e.preventDefault();
            animationScreen.keys = (animationScreen.keys || []);
            animationScreen.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            animationScreen.keys[e.keyCode] = (e.type == "keydown");
        })       
    },
    //declare a function to color the screen background
    colorScreen : function() {
        this.context.fillStyle=animationScreenBackground;
        this.context.fillRect(0,0,animationScreenWidth,animationScreenHeight);
    },
    //declare a function to stop all animation
    stopAnimation : function() {
        clearInterval(this.interval);
    },    
    //declare a function to clear the screen of past animations
    clearScreen : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

//declare the prototype for an animated object (character)
function animationObject(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;    
    this.speedX = 0;
    this.speedY = 0;    
    
    //create a method to draw the object on the screen   
    this.drawCharacter = function() {
        ctx = animationScreen.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();  
     }
     this.newPosition = function() {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }
    
}


//declare the start animation function
function startAnimation() {
    //The properties for character objects are(width,height,color,starting x position, starting y position)
    hero = new animationObject(heroWidth, heroHeight, heroColor, heroStartX, heroStartY); // set the properties of the hero object
    animationScreen.start(); //call the animation screen variable and start it
}

startAnimation();
    } ());