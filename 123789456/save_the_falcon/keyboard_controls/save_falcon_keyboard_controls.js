(function () {

//////////// CHANGE THESE VARIABLES
/////////// CHANGE THESE VARIABLES
/////////// CHANGE THESE VARIABLES
/* // SpongeBob Image Package
var myBackgroundImage = "https://img.clipartfest.com/9c56b1a8ab0cee3fa0f8fde96887a503_the-spongebob-squarepants-spongebob-bikini-bottom-clipart_1360-768.jpeg" ;
var myHeroImage = "https://vignette2.wikia.nocookie.net/nickelodeon/images/2/27/Spongebob_PNG.png/revision/latest?cb=20120702055752";
var myObstacleImage = "https://imgs-tuts-dragoart-386112.c.cdn77.org/how-to-draw-a-krabby-patty_1_000000021433_5.png" ;
*/

 //AHS Falcon Fire Image Package
var myBackgroundImage = "bird_fire_img/forest_fire.gif";
var myHeroImage = "bird_fire_img/alchesayFalconsHead.png"; 
var myObstacleImage = "bird_fire_img/fireball.png";

var rateOfEnemy = 100;
var speedOfEnemy = 1;
var heroSpeed = 2;
animationScreenWidth = 600; //set the screen width
animationScreenHeight = 400; //set the screen height
//animationScreenBackground = "#7eC0ee"; //set the screen color

//Declare the properties of the hero object
heroWidth = 40; 
heroHeight = 40;
//heroColor = "blue"; //This must be in quotes
heroStartX = animationScreenWidth/2; 
heroStartY = animationScreenHeight/2;

///// DON'T CHANGE BELOW HERE
///// DON'T CHANGE BELOW HERE
///// DON'T CHANGE BELOW HERE

//Declare the global variables
var myObstacles = [];
var myBackground;
var hero, heroWidth, heroHeight, heroColor, heroStartX, heroStartY; //Declare the hero object
var animationScreenWidth; //declare the screen width
var animationScreenHeight; //declare the screen height


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
        
        this.frameNo = 0;
        //set the render interval for updating the game screen
        this.interval = setInterval(render, 1000/60); 
        window.addEventListener('keydown', function (e) {
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
    if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.speedX = 0;
    this.speedY = 0;    
    
    //create a method to draw the object on the screen   
    this.drawCharacter = function() {
        ctx = animationScreen.context;
        if (type == "image") {
      ctx.drawImage(this.image, 
        this.x, 
        this.y,
        this.width, this.height);
    }else{
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);}
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }   
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    
}


//declare the start animation function
function startAnimation() {
    //The properties for character objects are(width,height,color,starting x position, starting y position)
    //hero = new animationObject(heroWidth, heroHeight, heroColor, heroStartX, heroStartY); // set the properties of the hero object
    hero = new animationObject(heroWidth, heroHeight, myHeroImage, heroStartX, heroStartY, "image");
    myBackground = new animationObject(animationScreenWidth, animationScreenHeight, myBackgroundImage,0,0,"image");
    animationScreen.start(); //call the animation screen variable and start it
}

function everyinterval(n) {
    if ((animationScreen.frameNo / n) % 1 == 0) {return true;}
    return false;
}

//Render the animation screen
function render() {
    
    //This function runs once per frame or 60x/second
    
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (hero.crashWith(myObstacles[i])) {
            animationScreen.stopAnimation();
            return;
        } 
    }
    animationScreen.clearScreen();
    myBackground.newPos(); 
    myBackground.drawCharacter();
    //animationScreen.colorScreen();

    animationScreen.frameNo += 1;
    if (animationScreen.frameNo == 1 || everyinterval(rateOfEnemy)) {
        y = animationScreenHeight;
        minWidth = 20;
        maxWidth = 200;
        width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
        minGap = 50;
        maxGap = 400;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new animationObject(30, 30, myObstacleImage, width, 0, "image"));
       //myObstacles.push(new animationObject(y - width - gap, 10, "green", width + gap, y));
    }
    for (i = 0; i < myObstacles.length; i += 2) {
        myObstacles[i].y += speedOfEnemy;
        myObstacles[i].drawCharacter();
    }
    hero.speedX = 0;
    hero.speedY = 0; 
    if (animationScreen.keys && animationScreen.keys[37]) {hero.speedX = -heroSpeed; }
    if (animationScreen.keys && animationScreen.keys[39]) {hero.speedX = heroSpeed; }
    if (animationScreen.keys && animationScreen.keys[38]) {hero.speedY = -heroSpeed; }
    if (animationScreen.keys && animationScreen.keys[40]) {hero.speedY = heroSpeed; }
    hero.newPos();
    hero.drawCharacter();
}


startAnimation();
    } ());
