function gameStart(parent) {
  parent.style.display = 'none'
  const cvs = document.querySelector("canvas"),
  ctx = cvs.getContext("2d");
const { gameWidth, gameHeight } = {
  gameWidth: innerWidth,
  gameHeight: innerHeight,
};

cvs.width = gameWidth;
cvs.height = gameHeight;
let PLAYERLIVES = 5;

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
    this.life = 3;
    this.Yvelocity = Math.floor(Math.random() * 7) + 1;
    this.explodeAudio = new Audio(`assets/sounds/explosion1.wav`)
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
    this.y += this.Yvelocity
    
    
    if(this.life <= 0) {
      this.toExplode = true
      this.explodeAudio.play();
      
      
      setTimeout(() => {
        this.readyToPop = true
      }, 500)
    }
    
    if (this.toExplode && (this.gameFrame % this.staggerFrames) == 0) {
      if (this.currentFrame < this.frameCount) {
        this.currentFrame++;
      }
    }
    
    this.gameFrame++;
    
  }
}


class LobsterMorph {
    constructor(x, y, w, h, sw, sh, src) {
      this.src = src;
      this.spriteWidth = sw
      this.spriteHeight = sh
      this.width = w;
      this.height = h;
      this.x = x
      this.y = y
      this.frameX = 0;
      this.frameY = Math.floor(Math.random() * 4);
      this.gameFrame = 0;
      this.staggerFrames = 4;
      this.toExplode = false;
      this.readyToPop = false;
      this.life = 2;
      this.explodeAudio = new Audio(`assets/sounds/explosion1.wav`)
    }
    draw() {
      const lobstermorph = new Image();
      lobstermorph.src = this.src;
      ctx.drawImage(lobstermorph, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
    update() {
      this.y += 5
      
      if(this.y >= gameHeight) this.readyToPop = true;
      
      if(this.gameFrame % this.staggerFrames == 0) {
        if(this.frameX < ((this.toExplode) ? 14 : 7)) this.frameX++
        else {
          (!this.toExplode) && (this.frameX = 0)
        }
      }
      
      
      this.gameFrame++
      
    }
  }
  
  class RhinoMorph extends LobsterMorph {
    update() {
      this.y += 5
      
      if (this.y >= gameHeight) this.readyToPop = true;
      
      if (this.gameFrame % this.staggerFrames == 0) {
        if (this.frameX < ((this.toExplode) ? 6 : 4)) this.frameX++
        else {
          (!this.toExplode) && (this.frameX = 0)
        }
      }
      this.gameFrame++
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


let asteroids = []
let lobsterMorphs = []
let rhinoMorphs = []


let playerAmmo = 30;
const maxAmmo = 30;


// Push new LobsterMorph
setInterval(() => {
  const h = 100, w = 100
  lobsterMorphs.push(new LobsterMorph(Math.floor(Math.random() * (gameWidth - w)), -50, w, h, 1120/14, 320/4,  'assets/lobstermorph.png'))
}, 7000)


setInterval(() => {
  const h = 100, w = 100
  rhinoMorphs.push(new RhinoMorph(Math.floor(Math.random() * (gameWidth - w)), -50, w, h, 480/6, 320/4,  'assets/rhinomorph.png'))
}, 5000)




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
}, 7000)

function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}



function handleAsteroid() {
  lobsterMorphs.forEach(lobs => {
    lobs.draw()
    lobs.update()
    if(isColliding(player, lobs) && !lobs.toExplode) {
      lobs.life = 0
      if(PLAYERLIVES > 0) {
        PLAYERLIVES--
      }
    }
    if(lobs.life <= 0 && !lobs.toExplode) {
      lobs.toExplode = true
      lobs.explodeAudio.play()
      setTimeout(()=> {
        lobs.readyToPop = true
      }, 600)
    }
  });
  
  
  
  rhinoMorphs.forEach(rhinos => {
  rhinos.draw();
  rhinos.update();
  if (isColliding(player, rhinos) && !rhinos.toExplode) {
    rhinos.life = 0;
    if (PLAYERLIVES > 0) {
      PLAYERLIVES--;
    }
  }
  if (rhinos.life <= 0 && !rhinos.toExplode) {
    rhinos.toExplode = true;
    rhinos.explodeAudio.play();
    setTimeout(() => {
      rhinos.readyToPop = true;
    }, 600);
  }
});

  
  
  asteroids.forEach(asteroid => {
    asteroid.draw()
    asteroid.update()
    
    
    if(isColliding(asteroid, player) && !asteroid.toExplode) {
      const explodeAudio = new Audio(`assets/sounds/explosion2.wav`)
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
    
    obstacles.forEach(obs => {
      if(isColliding(obs, asteroid) && !obs.readyToPop) {
        obs.readyToPop = true
        asteroid.life--;
      }
      
      
      lobsterMorphs.forEach(lobs => {
        if(isColliding(obs, lobs) && !obs.readyToPop) {
          obs.readyToPop = true
          lobs.life > 0 && lobs.life--;
        }
        
        lobsterMorphs = lobsterMorphs.filter(v => !v.readyToPop)
       
      });
      
      
      rhinoMorphs.forEach(rhinos => {
        if (isColliding(obs, rhinos) && !obs.readyToPop) {
          obs.readyToPop = true;
          if (rhinos.life > 0) {
            rhinos.life--;
          }
        }
      });
      
      rhinoMorphs = rhinoMorphs.filter(rhinos => !rhinos.readyToPop);

      if(obs.y <= 0) obs.readyToPop = true
    })
    obstacles = obstacles.filter(obs => !obs.readyToPop)
  });
  
  
  
  
  asteroids = asteroids.filter(v => !v.readyToPop);
  
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

let isStart = false;
document.addEventListener("click", function () {
   if(!isStart) {
     sound1.play();
     sound2.play();
     isStart = true;
   }
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
    bgY += 20;
    bgY2 += 20;
  }

  x++;
}

// small devices (cp)
if (gameWidth < gameHeight) {
  /*alert(
    "Use swipe left to move the player to the left ⬅️ and swipe right to move the player to right ➡️"
  ); */
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
  createFlame();
  player.draw();
  
  obstacles.forEach(obs => {
    obs.draw();
    obs.update();
  })
  
  handleAsteroid();
  drawAmmoBar();
  handlePlayerLives();
  window.requestAnimationFrame(animate);
}

animate();
              }
