
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


/////////////////////////////////////////////////// MAIN GAME LOOP
var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0; // What units is this in?

    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main); // this is a really weird call back to the setTimeout function
};

/////////////////INITIALIZE GAME WHEN ALL IMAGES ARE READY, CREATE BACKGROUND, HOOK PLAY BUTTON
function init() {
    
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
   
]);
resources.onReady(init);

////////////////////////////////////////////////////// GAME STATES
////Hero player initial position and sprite position
var player = {
    pos: [0, 0],
   // sprite: new Sprite('img/sprites.png', [0, 0], [39, 39], 4, [0,1]) // This is the original
    sprite: new Sprite('img/sprites.png', [0, 0], [39, 22], 4, [0])
}; //Create the hero player with sprite image

var bullets = []; //empty bullet array
var enemies = []; //empty enemy array
var explosions = []; //empty explosion array


var lastFire = Date.now();
var gameTime = 0;
var isGameOver;


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


};

///////////////MOVE PLAYER WITH KEYS
function handleInput(dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += playerSpeed * dt;
    }

  

}
////////////////////////////////////////////UPDATE POSITIONS OF ALL PLAYER OBJECTS
function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt);
    // Update all the bullets
   
            bullet.pos[0] += bulletSpeed * dt;
  

}




///////////// Draw everything
function render() {
    

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




