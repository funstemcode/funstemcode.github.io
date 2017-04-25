/*

//run the script on page load
//(function () {

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
heroStartY = animationScreenHeight/2;

//declare the function to render the animation screen
function render() {
    //This function runs once per frame or 60x/second
    animationScreen.clearScreen();
    animationScreen.colorScreen();
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
    this.x = x;
    this.y = y;    
    this.speedX = 0;
    this.speedY = 0;    
    
    //create a method to draw the object on the screen   
    this.drawCharacter = function() {
        ctx = animationScreen.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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

*/