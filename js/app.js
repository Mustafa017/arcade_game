// Game variales like life and number of gems that can be
// 
let GameVariables = function() {
    this.lives = 3;
    this.gemCount = 5;
}

let game = new GameVariables();

// Enemies our player must avoid
const Enemy = function(startX,startY) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.postnX = startX;
    this.postnY = startY;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.speed = 100 + randomNum(150);
    let averageSpeed = this.speed * dt;
    this.postnX += averageSpeed;

    // Make the enemy bugs reappear once they reach the end of 
    // the canvas
    const canvas = document.querySelector('canvas');
    if(this.postnX > canvas.width){
        this.postnX = -10;
    }
    
    // Manage collisions between player and enemy bugs
    if (player.postnX < this.postnX + 70 &&
        player.postnX + 40 > this.postnX &&
        player.postnY < this.postnY + 30 &&
        player.postnY + 30 > this.postnY) {
            if(game.lives <= 1){
                gameOver();
            }else{
                game.lives--;
                player.postnY = 400;
                player.postnX = 200;
            }
            
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.postnX, this.postnY);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function (startX,startY) {
    // use .call() to run Enemy class inside Player class
    //to avoid redundant code for the X and Y start positions
    Enemy.call(this,startX,startY);

    //The image/sprite for our player
    this.sprite = 'images/char-cat-girl.png';

    //Number of lives
    // this.lives = 3;
}
//Assign Player.prototype to delegate to Enemy.prototype to borrow 
//the render() method from the Enemy class.
Player.prototype = Object.create(Enemy.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {
    // Ensure the player does not go off the screen
    if(this.postnY < 80){
        this.postnY = 0;
        // Get into the water to get reset to the starting point.
        setTimeout(() => {
            this.postnY = 400;
            this.postnX = 200;
        }, 300); 
    }else if(this.postnX > 400){
        this.postnX = 400;
    }
    if(this.postnY > 400){
        this.postnY = 400;
    }
    if(this.postnX < 0){
        this.postnX = 0;
    }
}

Player.prototype.handleInput = function(params) {
    switch (params) {
        case 'up':
            this.postnY -= 80;
            break;
        
        case 'right':
            this.postnX += 100;
            break;
        
        case 'down':
            this.postnY += 80;
            break;
        
        case 'left':
            this.postnX -= 100;
            break;

        default:
            return;
    }
}

Player.prototype.variables = function () {
    const canvas = document.querySelector('canvas');
    canvas.style.cssText = "position: relative";
    ctx.clearRect(0, 20 , canvas.width , 25);
    ctx.font = 'bold 20pt coda';
    ctx.lineWidth = 3;

    ctx.textAlign = 'start';
    ctx.fillStyle = 'green';
    ctx.fillText('Gem : '+ game.gemCount,0,40);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'orange';
    ctx.fillText('lives : '+ game.lives, canvas.width / 2 ,40);
}


const Gem = function(startX,startY) {
    Enemy.call(this,startX,startY);
    this.message = '';
    //change color of gem randomly
    const gemImages = ['Gem Blue.png','Gem Orange.png','Gem Green.png'];
    let randomGem = gemImages[randomNum(gemImages.length)];

    this.sprite = 'images/'+randomGem;
}
Gem.prototype = Object.create(Enemy.prototype);
Gem.prototype.update = function () {
    // manage collision between player and Gem
    if(player.postnX < this.postnX + 20 &&
        player.postnX + 20 > this.postnX &&
        player.postnY < this.postnY + 20 &&
        player.postnY + 20 > this.postnY){
            if (game.gemCount <= 1) {
                this.message = 'Congratulations';
                gameOver();
            }else{
                game.gemCount--;
                this.message = 'Nice try. You can do better';
                this.postnX = gemXPostn[randomNum(gemXPostn.length)];
                this.postnY = gemYPostn[randomNum(gemYPostn.length)];
            }
    }
}
Gem.prototype.constructor = Gem;

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const enemy1 = new Enemy(300,60);
const enemy2 = new Enemy(0,145);
const enemy3 = new Enemy(200,230);
const enemy4 = new Enemy(200,145);

let player = new Player(200,400);
let gem = new Gem(300,150);
let allEnemies = [enemy1,enemy2,enemy3,enemy4];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// ensure Gem is placed at the center of the stone block and 
// only exists within the stone block section on the Y axis
const gemXPostn = [0,100,200,300,400];
const gemYPostn = [70,145,230];

function randomNum(len) {
    return Math.floor(Math.random() * len);
}

let overlayDiv = document.querySelector('.overlay');

//Modal displayed when game is over
let gameOver = function(){
    allEnemies = [];
    let docFrag = document.createDocumentFragment();
    overlayDiv.classList.remove('hidden');
    overlayDiv.innerHTML = `<div id="modal">
        <span>Game Over</span>
        <div id="score_message">${gem.message}</div>
        <input type="button" id="reset" onclick="hideModal()" value="reset"/>
        </div>`;
    docFrag.appendChild(overlayDiv);
    document.body.appendChild(docFrag);
}

function hideModal(){
    overlayDiv.classList.add('hidden');
    allEnemies = [enemy1,enemy2,enemy3,enemy4];
    player = new Player(200,400);
    gem = new Gem(300,150);
    game.gemCount = 5;
    game.lives = 3;
}

