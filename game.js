const cvs = document.querySelector("canvas"),
  ctx = cvs.getContext("2d");
const { gameWidth, gameHeight } = {
  gameWidth: innerWidth,
  gameHeight: innerHeight,
};

cvs.width = gameWidth;
cvs.height = gameHeight;

class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = 0;
  }

  draw() {
    const image = new Image();
    image.src = "./assets/player.png";

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate((Math.PI / 180) * this.angle);

    ctx.drawImage(
      image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    ctx.restore();
  }

  update() {}
}

class Obstacle {
  constructor(x, y, width, height, color) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y -= 10;
  }
}

class LifeBar {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {}
}

class Asteroid {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frameWidth = 560 / 7;
    this.frameHeight = 320 / 4;
    this.currentFrame = 0;
    this.frameCount = 7;
    this.rowCount = 4;
    this.readyToPop = false;
    this.toExplode = false;
    this.staggerFrames = 6;
    this.gameFrame = 0;
  }

  draw() {
    const image = new Image();
    image.src = "./assets/asteroid.png";

    ctx.drawImage(
      image,
      this.currentFrame * this.frameWidth,
      0,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update() {
    this.y += 3;
    if (this.toExplode && (this.gameFrame % this.staggerFrames) == 0) {
      if (this.currentFrame < this.frameCount) {
        this.currentFrame++;
      }
    }
    
    this.gameFrame++;
    
  }
}
 
const playerHeight = 100,
  playerWidth = 100;

const player = new Player(
  gameWidth / 2 - playerWidth / 2,
  gameHeight - playerHeight * 2,
  playerWidth,
  playerHeight
);


const asteroids = []

let PLAYERLIVES = 5;


let playerAmmo = 30;
const maxAmmo = 30;

function handlePlayerLives() {
  const livesArr = [];
  const maxLives = 5;

  for (let i = 0; i < maxLives; i++) {
    const w = 15,
      h = 30;

    if (i < PLAYERLIVES) {
      livesArr.push(new LifeBar(5 + i * (w + 10), 10, w, h, "limegreen"));
    } else {
      livesArr.push(new LifeBar(5 + i * (w + 10), 10, w, h, "white"));
    }
  }
  
  livesArr.forEach((life) => {
    life.draw();
  });
}

let obstacles = [];

function drawAmmoBar() {
  const barWidth = gameHeight > gameWidth ? 150 : 400;
  const barHeight = 20;
  const x = gameWidth - barWidth - 10;
  const y = 10;
  const color = "blue";
  const filledWidth = (playerAmmo / maxAmmo) * barWidth;

  ctx.fillStyle = "gray";
  ctx.fillRect(x, y, barWidth, barHeight);

  ctx.fillStyle = color;
  ctx.fillRect(x, y, filledWidth, barHeight);
}

setInterval(function () {
  if (playerAmmo >= maxAmmo) return;
  playerAmmo++;
}, 600);
setInterval(function () {
  const h = 60, w = 60
  asteroids.push(new Asteroid(Math.floor(Math.random() * (gameWidth - w)), -50, w, h))
}, 5000)

function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function handleAsteroid() {
  asteroids.filter(e => !e.readyToPop)
  .forEach(asteroid => {
    if(isColliding(asteroid, player)) {
      const explodeAudio = new Audio(`assets/sounds/explosion${Math.floor(Math.random()) + 1}.wav`)
      asteroid.toExplode = true
      if(window.navigator.vibrate) {
        navigator.vibrate([200])
      }
      explodeAudio.play();
      
      setTimeout(() => {
        asteroid.readyToPop = true
        PLAYERLIVES--
        return
      }, 500)
      
      
    }
    asteroid.draw()
    asteroid.update()
  })
}
cvs.addEventListener("click", function () {
  if (playerAmmo > 0) playerAmmo--;
  else return;
  obstacles.push(
    new Obstacle(player.x + player.width / 2, player.y + 50, 3, 10, "orange")
  );
  let shotSound = new Audio("./assets/sounds/shot.wav");
  shotSound.play();
});
const sound2 = new Audio("./assets/sounds/outer-sound-2.mp3");
sound2.loop = true;
const sound1 = new Audio("./assets/sounds/outer-sound-1.mp3");
sound1.loop = true;

document.addEventListener("DOMContentLoaded", function () {
  // sound1.play();
  // sound2.play();
});

document.addEventListener("keyup", function () {
  player.angle = 0;
});
document.addEventListener("keydown", function ({ key }) {
  (key = key.toLowerCase()),
    (keys = [
      "arrowleft",
      "arrowright",
      "arrowup",
      "arrowdown",
      "a",
      "w",
      "s",
      "d",
    ]);
  if (!keys.includes(key)) return;

  if (key == keys[0] || key == "a") {
    if (player.x <= 0) {
      player.x = 0;
      return;
    }
    player.angle = -20;

    player.x -= 10;
  } else if (key == keys[1] || key == "d") {
    if (player.x >= gameWidth - player.width) {
      player.x = gameWidth - player.width;
      return;
    }
    player.angle = 20;
    player.x += 10;
  } else if (key == keys[2] || key == "w") {
    if (player.y <= 0) {
      player.y = 0;
      return;
    }
    player.y -= 10;
  } else {
    if (player.y >= gameHeight - player.height) {
      player.y = gameHeight - player.height;
      return;
    }
    player.y += 10;
  }
});
let bgY = 0,
  x = 0,
  bgY2 = -(gameHeight - 30);

function createFlame() {
  const flameHeight = 100;
  const flameWidth = 20;
  ctx.fillStyle = "orange";
  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
  ctx.rotate((Math.PI / 180) * player.angle);

  ctx.beginPath();
  ctx.moveTo(-flameWidth / 2, 0);
  ctx.lineTo(0, flameHeight);
  ctx.lineTo(flameWidth / 2, 0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function renderBg() {
  const bg1 = new Image();
  bg1.src = "./assets/bg.png";
  ctx.drawImage(bg1, 0, bgY, gameWidth, gameHeight);

  const bg2 = new Image();
  bg2.src = "./assets/bg.png";
  ctx.drawImage(bg2, 0, bgY2, gameWidth, gameHeight);

  if (bgY >= gameHeight) {
    bgY = -(gameHeight - 60);
  }
  if (bgY2 >= gameHeight) {
    bgY2 = -(gameHeight - 60);
  }
  if (x % 2 == 0) {
    bgY += 10;
    bgY2 += 10;
  }

  x++;
}

// small devices (cp)
if (gameWidth < gameHeight) {
  alert(
    "Use swipe left to move the player to the left ⬅️ and swipe right to move the player to right ➡️"
  );
  cvs.addEventListener("touchend", function (ev) {
    player.angle = 0;
  });

  cvs.addEventListener("touchmove", function (evt) {
    evt.preventDefault();
    const { clientX, clientY } = evt.touches[0];
    if (Math.floor(clientX) < gameWidth / 2) {
      // left
      if (player.x <= 0) {
        player.x = 0;
        return;
      }
      player.angle = -20;

      player.x -= 10;
    } else {
      //right
      if (player.x >= gameWidth - player.width) {
        player.x = gameWidth - player.width;
        return;
      }
      player.angle = 20;
      player.x += 10;
    }
  });
}

function animate() {
  ctx.clearRect(0, 0, gameWidth, gameHeight);
  renderBg();

  handlePlayerLives();

  drawAmmoBar();
  createFlame();
  player.draw();
  obstacles.forEach((obs) => {
    obs.draw();
    obs.update();
  });
  
  handleAsteroid()

  window.requestAnimationFrame(animate);
}

animate();
