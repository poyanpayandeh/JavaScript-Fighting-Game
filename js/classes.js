// sprite class
class Fighter {
  constructor({ position, velocity, color, offset }) {
    this.position = position; // sets position of sprite
    this.velocity = velocity; // sets velocity of sprite
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: offset,
      height: 50,
      width: 100,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
  }

  // draw funtion to represent sprite
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // attack box
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // check if the sprite has reached the bottom - if so set the velocity to 0 to stop it else velocty.y + gravity
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 95) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

// sprite class
class Sprite {
  constructor({ position, imageSrc, scale = 1, frames = 1 }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.frames = frames;
    this.currentFrame = 0;
    this.elapsedFrames = 0;
    this.framesHold = 8;
  }

  // draw funtion to represent sprite
  draw() {
    c.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.frames),
      0,
      this.image.width / this.frames,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / this.frames) * this.scale,
      this.image.height * this.scale
    );
  }

  update() {
    this.draw();
    this.elapsedFrames++;

    if (this.elapsedFrames % this.framesHold === 0) {
      if (this.currentFrame < this.frames - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }
}
