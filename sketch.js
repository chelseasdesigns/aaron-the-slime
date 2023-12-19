let startScreen = 0;

let gameoverScreen = false, respawnTimeout;

let enemiesKilled = 0, highScore = 0;

let player, playerIMG;

let enemy, slime, wall, bulletsFired = [], shooting = false;

let maxSlimesRespawned = 6, maxAmmo = 6, ammoCount = 0, maxDiameter = 300, minDiameter = 150, respawnDelay = 1500;

let startButton, mode;

let galaxyBG1, galaxyBG2, galaxyBG3, galaxyBG4, galaxyBG5, galaxyBG6, stars1, stars2, stars3, enemyIMG;


function preload () {
  galaxyBG1 = loadImage ('assets/img/background/Background-1.png');
  galaxyBG2 = loadImage ('assets/img/background/Background-2.png');
  galaxyBG3 = loadImage ('assets/img/background/Background-3.png');
  galaxyBG4 = loadImage ('assets/img/background/Background-4.png');
  galaxyBG5 = loadImage ('assets/img/background/Background-5.png');
  galaxyBG6 = loadImage ('assets/img/background/Background-6.png');
  
  stars1 = loadImage ('assets/img/background/Background-7.png');
  stars2 = loadImage ('assets/img/background/Background-8.png');
  stars3 = loadImage ('assets/img/background/Background-9.png');

  slime = loadImage ('assets/img/slimeball.png');
  playerIMG = loadImage ('assets/img/Aaron_The_Slime.png');
  enemyIMG = loadImage('assets/img/enemyslime.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Pixelify+Sans&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
  document.head.appendChild(link);

  // Player
  player = new Sprite();
  player.img = playerIMG;
  player.diameter = minDiameter;
  player.scale = 0.05;

  // Slime
  slime = new Group();
  slime.diameter = 30;
  slime.color = (142, 127, 199);
  slime.x = () => random(0, width);
  slime.y = () => random(0, height);
  slime.respawn = false;
  respawnSlime();

  // Enemies
  enemySprites = new Group();
  enemy = new Sprite();
  // enemySprites.add(enemy);

  // Player & Slime Interactios
  player.overlaps(slime, collect);

  // Player & enemies Interactions
  player.collide(enemy, die);

  // Camera
  camera.zoom = 1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // player.debug = true;
  // enemy.debug = true;

  if (gameoverScreen) {
    // Game Over Screen
    fill(7, 40, 61);
    textSize(80);
    textAlign(CENTER);
    textFont('Pixelify Sans, sans-serif');
    text("GAME OVER", width / 2 + 6, height / 2 + 6);
    textSize(30);
    text("Press 'Spacebar' to Restart", width / 2 + 4, height - 150 + 4);
  
    // Text
    fill(255);
    textSize(80);
    textAlign(CENTER);
    textFont('Pixelify Sans, sans-serif');
    text("GAME OVER", width / 2, height / 2);
    textSize(30);
    text("Press 'Spacebar' to Restart", width / 2, height - 150);
  
    if (kb.presses(' ')) {
      resetGame();
      gameoverScreen = false; 
    }
  } else {
  clear();
  noStroke();
  background(28, 68, 94);

  switch(startScreen){
    case 0:

    // Shadow
      fill(7, 40, 61);
      textSize(80);
      textAlign(CENTER);
      textFont('Pixelify Sans, sans-serif');
      text("SLIMEVADERS", width / 2 + 6, height / 2 - 250);
      textSize(50);
      text("HOW TO PLAY", width / 2 + 6, height / 2 - 50);
      textSize(30);

      let howToPlayParagraph = 'Move with mouse to collect the slimeballs. Left-click with mouse to shoot. Kill as many enemies as you can without dying to them.';
      text(howToPlayParagraph, width / 2 - 310, height - 450 + 4, 660);
      textSize(30);
      text("Press Spacebarto Start", width / 2 + 4, height - 150 + 4);


    // Text
      fill(156, 172, 255);
      textSize(80);
      text("SLIMEVADERS", width / 2, height / 2 - 250);
      textSize(50);
      text("HOW TO PLAY", width / 2, height / 2 - 50);
      textSize(30);
      text("Press Spacebar to Start", width / 2, height - 150);
      text(howToPlayParagraph, width / 2 - 315, height - 450 + 4, 660);

      if (kb.presses(' ')) {
        startScreen++;
      }
      break;
      
    default:
      camera.on();

      // Parallax Effect
      let parallaxSpeeds = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.9, 1.0, 1.1];

      imageMode(CENTER);

      image(galaxyBG1, mouseX * parallaxSpeeds[0], 100, width * 2, height * 2);
      image(galaxyBG2, mouseX * parallaxSpeeds[1], 170, width * 2, height * 2);
      image(galaxyBG3, mouseX * parallaxSpeeds[2], 300, width * 2, height * 2);
      image(galaxyBG4, mouseX * parallaxSpeeds[3], 330, width * 2, height * 2);
      image(galaxyBG5, mouseX * parallaxSpeeds[4], 360, width * 2, height * 2);
      image(galaxyBG6, mouseX * parallaxSpeeds[5], 390, width * 2, height * 2);
      image(stars1, mouseX * parallaxSpeeds[6], 390, width * 2, height * 2);
      image(stars2, mouseX * parallaxSpeeds[7], 390, width * 2, height * 2);
      image(stars3, mouseX * parallaxSpeeds[8], 390, width * 2, height * 2);

        playerMovement();
        if (player.overlaps(slime)) {
          collect();
        }
      
        // Bullets
        for (let i = bulletsFired.length - 1; i >= 0; i--) {
          bulletsFired[i].display();
          bulletsFired[i].update();
      
          if (bulletsFired[i].outOfBounds() && ammoCount > 0) {
            bulletsFired.splice(i, 1);
            ammoCount--;
            console.log('remaining bullets: ');
            console.log(ammoCount);
          } else if (bulletsFired[i].hitScan()) {
            bulletsFired.splice(i, 1);
            ammoCount++;

            enemiesKilled++;
            highScore++;
          }
        }
      
        // Enemy Behavior
        for (let i = 0; i < enemySprites.length; i++) {
          enemy = enemySprites[i];
          let direction = p5.Vector.sub(player.position, enemy.position);
          direction.normalize();
          enemy.velocity.add(direction.mult(0.1));
    
        }
      
        playerShooting();

        // Player & Enemy Collisions
        for (let i = 0; i < enemySprites.length; i++) {
          let enemy = enemySprites[i];
          if (player.collides(enemy)) {
            // Handle player-enemy collision
            player.rotationSpeed = 3;
            player.life = 300;
            enemy.remove(); // Remove the collided enemy
            gameoverScreen = true; // Set game over state
          }
        }
      
        // Enemies
        if (frameCount % 180 === 0) {
          spawnEnemies(); 
        }

        camera.x = player.x;
        camera.y = player.y;
        camera.off();

        fill(255);
        textSize(35);
        textAlign(RIGHT);
        text('Enemies Killed: ' + enemiesKilled, width - 60, 40);

        fill(255);
        textSize(35);
        textAlign(RIGHT);
        text('Highscore: ' + highScore, width - 60, 70);

        break;
      }
    }
}

function respawnSlime() {
  if (startScreen === 0) {
    setTimeout(respawnSlime, respawnDelay);
    return;
  }

  if (slime.length < maxSlimesRespawned) {
    const newSlime = createSprite(slime.x(), slime.y(), slime.diameter);
    slime.add(newSlime);
  }
  setTimeout(respawnSlime, respawnDelay);
}

function collect() {
  for (let i = slime.length - 1; i >= 0; i--) {
    if (player.overlap(slime[i])) {
      slime[i].remove();
      playerGrowth();
      break;
    }
    console.log('Ammo Count: ');
    console.log(ammoCount);
    if (ammoCount < maxAmmo) {
      ammoCount++;
      console.log('Ammo Count: ');
      console.log(ammoCount);
    }
  }
  
}

function playerMovement() {
  player.moveTowards(mouseX, mouseY, 0.5);
  player.rotateTowards(mouse, 0.1, 1);
}

function playerGrowth() {
  if (player.diameter && player.scale < maxDiameter) {
    player.diameter += 0.1;
    player.scale += 0.005;
  }
}

function playerDecrease() {
  if (player.diameter && player.scale > minDiameter && shootBullet) {
    player.diameter -= 5;
    player.scale -= 0.01;
  }
}

function spawnEnemies() {
  if (startScreen === 0) {
    setTimeout(spawnEnemies, 50);
    return;
  }

  const numEnemies = 1;

  for (let i = 0; i < numEnemies; i++) {
    const side = Math.floor(random(0, 1));
    let xPos, yPos;

    if (side === 0) { // Top side
      xPos = random(0, width);
      yPos = -enemy.diameter;
    } else if (side === 1) { // Right side
      xPos = width + enemySprites[0]?.diameter || 0;
      yPos = random(0, height);
    } else if (side === 2) { // Bottom side
      xPos = random(0, width);
      yPos = height + enemySprites[0]?.diameter || 0;
    } else { // Left side
      xPos = -enemy.diameter;
      yPos = random(0, height);
    }

    let newEnemy = new Sprite(xPos, yPos);
    newEnemy.diameter = random(150, 200);
    newEnemy.image = enemyIMG;
    newEnemy.scale = random(0.3, 0.6);
    newEnemy.rotationSpeed = random(-2, 2);
    newEnemy.velocity.x = random(-2, 1);
    newEnemy.velocity.y = random(-2, 1);

    enemySprites.add(newEnemy);
  }
}

function playerShooting() {
  if (kb.presses(' ') && !shooting && player.diameter > minDiameter && ammoCount <= maxAmmo && ammoCount >= 0) {
    shootBullet();
    shooting = true;
  }
}

function shootBullet() {
  let mouseVector = createVector(mouseX, mouseY);
  let bullet = {
    position: createVector(player.position.x, player.position.y),
    velocity: p5.Vector.sub(mouseVector, player.position).normalize().mult(30),
    radius: 10,
    image: loadImage('assets/img/slimeball.png'),
    display: function () {
      noStroke();
      image(this.image, this.position.x, this.position.y, this.radius * 2, this.radius * 2);
    },
    update: function () {
      this.position.add(this.velocity);
      playerDecrease();

      if (this.outOfBounds()) {
        shooting = false; 
      }
    },
    outOfBounds: function () {
      return (
        this.position.x < 0 ||
        this.position.x > width ||
        this.position.y < 0 ||
        this.position.y > height
      );
    },
    hitScan: function () {
      let scoreIncremented = false;
  for (let i = enemySprites.length - 1; i >= 0; i--) {
    if (this.position.dist(enemySprites[i].position) <= this.radius + enemySprites[i].width / 2) {
      enemySprites[i].remove();
      if (!scoreIncremented) {
        highScore++;
        scoreIncremented = true;
      }
      return true;
    }
  }
  return false;
}
  };
  bulletsFired.push(bullet);
  shooting = false;

  console.log('Bullets Left: ');
  console.log(ammoCount);
}

function die() {
  resetPlayer();
}

function resetPlayer () {
  player.position.x = width / 2;
  player.position.y = height / 2;
  player.diameter = minDiameter;
  ammoCount = 0;
}

function resetGame() {
  bulletsFired.splice(0, bulletsFired.length);
  enemySprites.forEach(enemy => enemy.remove());
  slime.forEach(s => s.remove());

  gameoverScreen = false;
  enemiesKilled = 0;

  if (slime.length === 0) {
    respawnSlime();
  }
}
