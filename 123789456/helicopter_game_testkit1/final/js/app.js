
// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

/////// CREATE THE CANVAS

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 430;
document.body.appendChild(canvas); //Look up append child
var timeCount = 0;
var jumpTime = 0;
/////////////////////////////////////////////////// MAIN GAME LOOP
var lastTime;
function main() {
    
    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main); // this is a really weird call back to the setTimeout function
};

/////////////////INITIALIZE GAME WHEN ALL IMAGES ARE READY, CREATE BACKGROUND, HOOK PLAY BUTTON
function init() {
    //terrainPattern = ctx.createPattern(resources.get('img/Mario_level_1_scroll_clean.png'), 'repeat'); //CREATE BACKGROUND

    document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });//Add click to play-again button --HTML

    reset(); // reset the game state
    lastTime = Date.now();
    main(); // start game // Why do we need a main function and then an init function?
}

////////////////////////GET IMAGE WHEN GAME LOADS
resources.load([
    'img/sprites.png',
    'img/terrain.png',
    'img/bubble.png',
    'img/lasagna_bullet.png',
    'img/Mario_level_1_scroll_clean.png',
    'img/yoshi_walk_sprites.png',
    'img/yoshi_tongue.png',
]);
resources.onReady(init);

var myBackground;
var canvasWidth = 500;
var canvasHeight = 430;


var myBackground = new bkground(6800, canvasHeight, 'img/Mario_level_1_scroll_clean.png', 0,0,'image');   


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


function updateBackground(){
    
    
    myBackground.update();
}
////////////////////////////////////////////////////// GAME STATES
////Hero player initial position and sprite position
var player = {
    pos: [0, 0],
   // sprite: new Sprite('img/sprites.png', [0, 0], [39, 39], 4, [0,1]) // This is the original
    sprite: new Sprite('img/yoshi_walk_sprites.png', [0, 0], [20, 30], 4, [0])
}; //Create the hero player with sprite image

var bullets = []; //empty bullet array
var enemies = []; //empty enemy array
var explosions = []; //empty explosion array
var background = {
    pos: [0,0],
    sprite: new Sprite('img/Mario_level_1_scroll_clean.png',[0,0],[canvas.width, canvas.height], 4, [0])
};

var lastFire = Date.now();
var gameTime = 0;
var isGameOver;
var terrainPattern;

var score = 0;
var scoreEl = document.getElementById('score');

//////////////////////////////// Variable Speed in pixels per second of game components
var playerSpeed = 200;
var bulletSpeed = 200;
var enemySpeed = 100;

//////////////////////////////////////// UPDATE GAME OBJECTS

function update(dt) {
    gameTime += dt;
    
    handleInput(dt);
    updateEntities(dt);


    // It gets harder over time by adding enemies using this
    // equation: 1-.993^gameTime

    /////////////I NEED TO UNDERSTAND THIS MATH original Math.pow(.993, gameTime), .999 makes it very slow, .1 makes it infinitely fast
    if(Math.random() < 1 - Math.pow(.999, gameTime)) {
        //Push enemies to the screen
        enemies.push({
            
            //Changing the enemy position to remove random
           // pos: [canvas.width, canvas.height - 39],   
            pos: [canvas.width, Math.random() * (canvas.height - 39)],    // The X and Y position of the enemy pushed on screen
                                                //[starting x, starting y], [width, height], no of frames, [frame iteration])
            sprite: new Sprite('img/bubble.png', [0, 0], [30, 30], 6, [0])
        });
    }
    
    checkCollisions();

    scoreEl.innerHTML = score;
};
console.log(player.sprite.frames);
///////////////MOVE PLAYER WITH KEYS
function handleInput(dt) {
    var runCount = 0;
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += playerSpeed * dt;
    }

    if(input.isDown('UP') || input.isDown('w')) {
        if(player.pos[1]>(canvas.height-106)){
            player.pos[1]=canvas.height-106;
            //for (jumpTime; jumpTime < 100; jumpTime += .001){
        }
        //        console.log("player jumptime" + jumpTime);
        if (jumpTime <=.05){


        player.pos[1] -= 50;
        //player.pos[0] +=60;  
        } else{player.pos[1] += 30;}
        jumpTime += .1;
        console.log(jumpTime);
            
        
        //do{console.log("player jumptime" + jumpTime); 
        //jumpTime += .1;}while(jumpTime <= 200)
    }
    if(!input.isDown('UP')) {
        jumpTime = 0;
        //console.log(jumpTime);
    }
    if(input.isDown('LEFT') || input.isDown('a')) {
        player.pos[0] -= playerSpeed * dt;
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        //player.pos[0] += playerSpeed * dt;
        runCount ++;
        player.sprite.frames = [2,1,0];
        player.sprite.speed += runCount*.05;
        if(myBackground.x <= -6750+canvasWidth){
            myBackground.x = 0;
        }
        myBackground.speedX -= runCount*.05;
    myBackground.newPos();
    }
    if(!input.isDown('RIGHT')){
        player.sprite.frames = [0];
        
    }


////////////BULLET FIRE LOGIC
    if(input.isDown('SPACE') &&
       !isGameOver &&
       Date.now() - lastFire > 100) {
        //Push bullets based on player position
        var x = player.pos[0] + player.sprite.size[0] / 2;
        var y = player.pos[1] + player.sprite.size[1] / 2;
        


        player.sprite.pos = [80,0];
        player.sprite.size = [35,30];
        player.sprite.frames = [2,1,0];
        
        bullets.push({ pos: [x, y],
                       dir: 'forward',
                       sprite: new Sprite('img/lasagna_bullet.png', [0, 0], [25, 15]) });
        bullets.push({ pos: [x, y],
                       dir: 'up',
                       sprite: new Sprite('img/sprites.png', [0, 50], [9, 5]) });
        bullets.push({ pos: [x, y],
                       dir: 'down',
                       sprite: new Sprite('img/sprites.png', [0, 60], [9, 5]) });

        lastFire = Date.now();
    }
} 
////////////////////////////////////////////UPDATE POSITIONS OF ALL PLAYER OBJECTS
function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt);
    // Update all the bullets
    for(var i=0; i<bullets.length; i++) {
        var bullet = bullets[i];

        switch(bullet.dir) {
        case 'up': bullet.pos[1] -= bulletSpeed * dt; break;
        case 'down': bullet.pos[1] += bulletSpeed * dt; break;
        default:
            bullet.pos[0] += bulletSpeed * dt;
        }

        // Remove the bullet if it goes offscreen
        if(bullet.pos[1] < 0 || bullet.pos[1] > canvas.height ||
           bullet.pos[0] > canvas.width) {
            bullets.splice(i, 1); //What is Splice again?
            i--;
        }
    }

    // Update all the enemies
   /*for(var i=0; i<enemies.length; i++) {
        enemies[i].pos[0] -= enemySpeed * dt;
        if ((Math.floor(dt)/2) % 0) {
        enemies[i].pos[1] -= enemySpeed * dt;
        }// NOT A SINGLE BUBBLE GOES UP OR DOWN?
        enemies[i].sprite.update(dt);

        // Remove if offscreen
        if(enemies[i].pos[0] + enemies[i].sprite.size[0] < 0) {
            enemies.splice(i, 1);
            i--;
        }
    }
*/
    // Update all the explosions
    for(var i=0; i<explosions.length; i++) {
        explosions[i].sprite.update(dt);

        // Remove if animation is done
        if(explosions[i].sprite.done) {
            explosions.splice(i, 1);
            i--;
        }
    }
}


///////////////////COLLISION LOGIC
// Collisions

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}


function checkCollisions() {
    checkPlayerBounds();
    
    // Run collision detection for all enemies and bullets
    for(var i=0; i<enemies.length; i++) {
        var pos = enemies[i].pos;
        var size = enemies[i].sprite.size;

        for(var j=0; j<bullets.length; j++) {
            var pos2 = bullets[j].pos;
            var size2 = bullets[j].sprite.size;

            if(boxCollides(pos, size, pos2, size2)) {
                // Remove the enemy
                enemies.splice(i, 1);
                i--;

                // Add score
                score += 100;

                // Add an explosion
                explosions.push({
                    pos: pos,
                    sprite: new Sprite('img/sprites.png',
                                       [0, 117],
                                       [39, 39],
                                       16,
                                       [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                       null,
                                       true)
                });

                // Remove the bullet and stop this iteration
                bullets.splice(j, 1);
                break;
            }
        }

        if(boxCollides(pos, size, player.pos, player.sprite.size)) {
            gameOver();
        }
    }
}

function checkPlayerBounds() {
    // Check bounds
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
    }
}

///////////// Draw everything
function render() {
    //ctx.fillStyle = terrainPattern; // this is a shortcut to call the background
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    timeCount += 1;
    //console.log(timeCount);
    updateBackground();
    // Render the player if the game isn't over
    if(!isGameOver) {
        renderEntity(player);

    }

    renderEntities(bullets);
    renderEntities(enemies);
    renderEntities(explosions);
};

function renderEntities(list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }    
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}




///////////////GAME OVER AND RESET
// Game over
function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block'; // Screen over the game?
    isGameOver = true;
}

// Reset game to original state
function reset() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    isGameOver = false;
    
    //Reset the game time variables and arrays
    gameTime = 0;
    score = 0;

    enemies = [];
    bullets = [];
    //reset player position to 50px and half canvas
    player.pos = [50, canvas.height - 76];
};