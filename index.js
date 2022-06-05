const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const gravity = 0.2;

// sets canvas width, height and background colour
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);

// sprite class
class Sprite {
  constructor({ position, velocity }) {
    this.position = position; // sets position of sprite
    this.velocity = velocity; // sets velocity of sprite
    this.height = 150;
  }

  // draw funtion to represent sprite - red rectangle
  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, 50, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // check if the sprite has reachd the bottom - if so set the velocity to 0 to stop it else velocty.y + gravity
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
}

// creating player
const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

// creating enemy
const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

console.log(player);

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
};

let lastKey;

// function to create animation loop
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height); // clears canvas before moving sprites
  player.update();
  enemy.update();

  player.velocity.x = 0;
  if (keys.a.pressed && lastKey === "a") {
    player.velocity.x = -1;
  } else if (keys.d.pressed && lastKey === "d") {
    player.velocity.x = 1;
  }
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "w":
      player.velocity.y = -10;
      break;
  }
  console.log(event.key);
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
  console.log(event.key);
});
