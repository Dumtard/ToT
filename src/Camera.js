var Renderer = require('./Renderer');

window.renderer = Renderer;

class Camera {
  constructor() {
  }

  registerWorld(world) {
    this.container = world;
  }

  update() {
    this.container.position.set(
      (-this.target.position.x + ((this.scale.width - 1) / 2) * 50) * this.container.scale.x,
      (-this.target.position.y + ((this.scale.width - 1) / 2) * 50) * this.container.scale.y
    );

    if (this.container.position.x > 0) {
      this.container.position.x = 0;
    }
    if (this.container.position.y > 0) {
      this.container.position.y = 0;
    }

    var tileWidth = 50;
    var screenTiles = Renderer.width / this.container.scale.x / tileWidth;
    var numTiles = this.container.width / this.container.scale.x / tileWidth;
    var maxSize = (numTiles * -tileWidth) + (screenTiles * tileWidth);

    if (this.container.position.x < maxSize * game.world.scale.x) {
      this.container.position.x = maxSize * game.world.scale.x;
    }
    if (this.container.position.y < maxSize * game.world.scale.y) {
      this.container.position.y = maxSize * game.world.scale.y;
    }
  }

  follow(target) {
    this.target = target;
  }

  get scale() {
    return {
      width: Renderer.width / this.container.scale.x / 50,
      height: Renderer.height / this.container.scale.y / 50
    }
  }

  set scale({width, height}) {
    if (width > 21) {
      width = 21;
    } else if (width < 5) {
      width = 5;
    }
    if (height > 21) {
      height = 21;
    } else if (height < 5) {
      height = 5;
    }
    this.container.scale.set(Renderer.width / width / 50,
                             Renderer.height / height / 50);

    this.update();
  }

  get position() {
    return {
      x: -this.container.x,
      y: -this.container.y
    }
  }
}

module.exports = new Camera();
