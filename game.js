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
const playerHeight = 100,
  playerWidth = 100;

const player = new Player(
  gameWidth / 2 - playerWidth / 2,
  gameHeight - playerHeight * 2,
  playerWidth,
  playerHeight
);

let PLAYERLIVES = 5;
const livesArr = [];

let playerAmmo = 30;
const maxAmmo = 30;

(function () {
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
})();

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
}, 1000);

cvs.addEventListener("click", function () {
  if (playerAmmo > 0) playerAmmo--;
  else return;
  obstacles.push(
    new Obstacle(player.x + player.width / 2, player.y + 50, 3, 10, "orange")
  );
  let shotSound = new Audio("./assets/sounds/shot.wav");
  shotSound.play()
});
document.addEventListener('DOMContentLoaded', function() {
  const sound1 = new Audio('./assets/sounds/outer-sound-1.mp3')
  sound1.autoplay = true;
  sound1.loop = true;
  const sound2 = new Audio("./assets/sounds/outer-sound-2.mp3");
  sound2.loop = true;
  sound2.autoplay = true;
})

document.addEventListener("keyup", function () {
  player.angle = 0;
});
document.addEventListener("keydown", function ({ key }) {
  (key = key.toLowerCase()),
    (keys = ["arrowleft", "arrowright", "arrowup", "arrowdown"]);
  if (!keys.includes(key)) return;

  if (key == keys[0]) {
    if (player.x <= 0) {
      player.x = 0;
      return;
    }
    player.angle = -20;

    player.x -= 10;
  } else if (key == keys[1]) {
    if (player.x >= gameWidth - player.width) {
      player.x = gameWidth - player.width;
      return;
    }
    player.angle = 20;
    player.x += 10;
  } else if (key == keys[2]) {
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

  livesArr.forEach((life) => {
    life.draw();
  });

  drawAmmoBar();
  createFlame();
  player.draw();
  obstacles.forEach((obs) => {
    obs.draw();
    obs.update();
    
  });

  window.requestAnimationFrame(animate);
}

animate();
