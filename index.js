const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const gravity = 0.7;
const floor = 331;

// sets canvas width, height and background colour
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);

// creating backgroung image
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

// creating shop animation image
const shop = new Sprite({
  position: {
    x: 600,
    y: 130,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  frames: 6,
});

// creating player 1
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  frames: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      frames: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      frames: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      frames: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      frames: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      frames: 6,
    },
    takehit: {
      imageSrc: "./img/samuraiMack/Take Hit.png",
      frames: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      frames: 6,
    },
  },
  attackBox: {
    offset: {
      x: 50,
      y: 50,
    },
    width: 200,
    height: 50,
  },
});

// creating player 2
const enemy = new Fighter({
  position: {
    x: 980,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/kenji/Idle.png",
  frames: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      frames: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      frames: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      frames: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      frames: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      frames: 4,
    },
    takehit: {
      imageSrc: "./img/kenji/Take hit.png",
      frames: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      frames: 7,
    },
  },
  attackBox: {
    offset: {
      x: -160,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

// array for player 1 and 2 movement
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

decreaseTimer();

// function to create animation loop
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height); // clears canvas before moving sprites
  background.update();
  shop.update();
  c.fillStyle = "rgba(255,255,255,0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  //player 1 movement
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a" && player.position.x != 0) {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (
    keys.d.pressed &&
    player.lastKey === "d" &&
    player.position.x != 975
  ) {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // player 2 movement
  if (
    keys.ArrowLeft.pressed &&
    enemy.lastKey === "ArrowLeft" &&
    enemy.position.x != 0
  ) {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (
    keys.ArrowRight.pressed &&
    enemy.lastKey === "ArrowRight" &&
    enemy.position.x != 975
  ) {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");

    if (enemy.velocity.y < 0) {
      enemy.switchSprite("jump");
    } else if (enemy.velocity.y > 0) {
      enemy.switchSprite("fall");
    }
  }

  // player 1 attack
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.currentFrame === 4
  ) {
    player.isAttacking = false;
    enemy.takehit();
    gsap.to("#playerTwoHealth", {
      width: enemy.health + "%",
    });
  }

  // if player 1 misses
  if (player.isAttacking && player.currentFrame === 4) {
    player.isAttacking = false;
  }

  // player 2 attack
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.currentFrame === 1
  ) {
    enemy.isAttacking = false;
    player.takehit();
    gsap.to("#playerOneHealth", {
      width: player.health + "%",
    });
  }

  // if player 2 misses
  if (enemy.isAttacking && enemy.currentFrame === 1) {
    enemy.isAttacking = false;
  }

  // end game if health reaches 0
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

// event listener for player 1 and 2 controls
window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        if (player.position.y < floor) {
        } else {
          player.velocity.y = -20;
        }
        break;
      case " ":
        if (player.image !== player.sprites.takehit.image) {
          player.attack();
        }
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        if (enemy.position.y < floor) {
        } else {
          enemy.velocity.y = -20;
        }
        break;
      case "ArrowDown":
        if (enemy.image !== enemy.sprites.takehit.image) {
          enemy.attack();
        }
        break;
    }
  }
});

// event listener to stop players when the movement buttons are released
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
