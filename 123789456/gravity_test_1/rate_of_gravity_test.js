//run the script on page load
(function () {

//Declare the global variables
var hero, heroWidth, heroHeight, heroColor, heroX, heroY; //Declare the hero object
var animationScreenWidth, animationScreenHeight; //declare the screen width and height

//Declare the height and width of the canvas
animationScreenWidth = 800; //set the screen width
animationScreenHeight = 500; //set the screen height
animationScreenBackground = "beige"; //set the screen color

//Set up hero properties
heroWidth = 20; 
heroHeight = 20; 
heroColor = "green"; 
heroX = (animationScreenWidth/2)-heroWidth;
heroY = 0-heroHeight;

//SET UP PHYSICS VARIABLES
var heightMultiplier = .01;//1 is 50 meters, .1 is 500 meters, .01 is 5000 meters etc.
var rateOfGravity = ((9.8/60)**2)*heightMultiplier;
var rateOfBounce = 1;
var currentGravitySpeed = 0;
var frameCounter = 0;

//declare the start animation function
function startAnimation() {
    //The properties for character objects are(width,height,color,starting x position, starting y position)
    hero = new animationObject(heroWidth, heroHeight, heroColor, heroX, heroY); // set the properties of the hero object
    animationScreen.start(); //call the animation screen variable and start it
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
        
        //set a counter for time based calculations
        
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
    
    //set up the gravity and bounce variables
    this.rateOfGravity = rateOfGravity;
    this.rateOfBounce = rateOfBounce;
    this.currentGravitySpeed = currentGravitySpeed;

    //create a method to draw the object on the screen   
    this.drawCharacter = function() {
        ctx = animationScreen.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    //declare a function to change the positon of the animation object
    this.newPosition = function() {
        //Set up the algorithm to change position based on gravity
        this.currentGravitySpeed += this.rateOfGravity;
        this.x += this.speedX;
        this.y += this.speedY + this.currentGravitySpeed;

        //Check for collision with bottom of screen
        this.hitBottom();
    }

    //declare a function to initiate the bottom of the screen
    this.hitBottom = function(){

        //set the bottom of the screen equal to height of the screen - the height of character because y is at top of character
        var screenBottom = animationScreen.canvas.height - this.height;
        //if the character is below the bottom of screen, reset character to touch the bottom
        //then flip the characters current trajectory to upwards with a minus sign 
        if (this.y > screenBottom)
        {
            //optional to stop the animtion, comment out if necessary
            animationScreen.stopAnimation(); //this stops the animation at hitbottom
            
            this.y = screenBottom;
            this.currentGravitySpeed = -(this.currentGravitySpeed * this.rateOfBounce);
        }
    }
    
}

//declare the function to render the animation screen
function render() {
    frameCounter++;
    //console.log(frameCounter);
    if((frameCounter%6) ==0){
        console.log("seconds: "+(frameCounter/60));
    }
    //console.log(frameCounter);
    //This function runs once per frame or 60x/second
    
    animationScreen.clearScreen();
    animationScreen.colorScreen();
    hero.newPosition();
    hero.drawCharacter();
}

//Call the animation to begin
startAnimation();
    } ());
