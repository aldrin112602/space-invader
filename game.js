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

    // Draw the player
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


const playerHeight = 100,
  playerWidth = 100;


const player = new Player(
  gameWidth / 2 - playerWidth / 2,
  gameHeight - playerHeight * 2,
  playerWidth,
  playerHeight
);
document.addEventListener("keyup", function () {
  player.angle = 0;
});
document.addEventListener("keydown", function ({ key }) {
  (key = key.toLowerCase()),
    (keys = ["arrowleft", "arrowright", "arrowup", "arrowdown"]);
  if (!keys.includes(key)) return;

  if (key == keys[0]) {
    // arrow left
    if (player.x <= 0) {
      player.x = 0;
      return;
    }
    player.angle = -20;

    player.x -= 50;
  } else if (key == keys[1]) {
    // arrow right
    if (player.x >= gameWidth - player.width) {
      player.x = gameWidth - player.width;
      return;
    }
    player.angle = 20;
    player.x += 50;
  } else if (key == keys[2]) {
    // arrowup
    if (player.y <= 0) {
      player.y = 0;
      return;
    }
    player.y -= 50;
  } else {
    //  arrow down
    if (player.y >= gameHeight - player.height) {
      player.y = gameHeight - player.height;
      return;
    }
    player.y += 50;
  }
});
let bgY = 0, x = 0, bgY2 = -(gameHeight - 30);

function createFlame() {
  const flameHeight = 100;
  const flameWidth = 20;
  ctx.fillStyle = "orange";
  ctx.save(); // Save the canvas state

  // Translate to the center of the player's spaceship
  ctx.translate(player.x + player.width / 2, player.y + player.height);

  // Apply the rotation based on the player's angle
  ctx.rotate((Math.PI / 180) * player.angle);

  // Move the flame slightly below the spaceship's center
  const yOffset = 0; // Adjust this value as needed
  ctx.translate(0, yOffset);

  // Draw the flame
  ctx.beginPath();
  ctx.moveTo(-flameWidth / 2, 0);
  ctx.lineTo(0, flameHeight);
  ctx.lineTo(flameWidth / 2, 0);
  ctx.closePath();
  ctx.fill();

  ctx.restore(); // Restore the canvas state
}


function animate() {
  ctx.clearRect(0, 0, gameWidth, gameHeight);
  const bg1 = new Image();
  bg1.src = "./assets/bg.png";
  ctx.drawImage(bg1, 0, bgY, gameWidth, gameHeight);

  const bg2 = new Image();
  bg2.src = "./assets/bg.png";
  ctx.drawImage(bg2, 0, bgY2, gameWidth, gameHeight);


  if(bgY >= gameHeight) {
    bgY = -(gameHeight - 50);
  }
  if(bgY2 >= gameHeight) {
    bgY2 = -(gameHeight - 50);
  }
  if(x % 2 == 0) {
    bgY += 20;
    bgY2 += 20;
  }
  
  x++;



  player.draw();
  createFlame();
  window.requestAnimationFrame(animate);
}

animate();
