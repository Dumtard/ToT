window.depthCompare = function(a, b) {
  if(a.z < b.z) {
    return -1;
  }

  if (a.z > b.z) {
    return 1;
  }

  return 0;
}

var Camera = require('./Camera');
var Renderer = require('./Renderer');

class Game {
  constructor() {
    this.size = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;

    window.addEventListener('resize', this.resize.bind(this));

    this.world = new PIXI.Container();

    var Map = require('./Map.js');
    this.map = new Map(this);

    Renderer.registerWorld(this.world);
    Camera.registerWorld(this.world);

    for (let x = 0; x < this.map.tiles.length; ++x) {
      for (let y = 0; y < this.map.tiles.length; ++y) {
        this.world.addChild(this.map.tiles[x][y]);
      }
    }
    this.resize();

    this.world.children.sort(depthCompare);

    this.previous = Date.now() / 1000;
    this.current = Date.now() / 1000;
    this.delta = 0;

    window.addEventListener('mousewheel', function(e) {
      var scale = Camera.scale;
      Camera.scale = {
        width: scale.width + (Math.sign(e.wheelDelta) * -2),
        height: scale.height + (Math.sign(e.wheelDelta) * -2)
      };
    });

    requestAnimationFrame(this.update.bind(this));
  }

  resize() {
    Renderer.resize(this.size, this.size);
    this.world.scale.set(this.size / 550);
    //Camera.scale = {x: size / 550, y: size / 550};
  }

  update() {
    this.current = Date.now() / 1000;
    this.delta = this.current - this.previous;
    this.previous = this.current;

    this.map.update();

    Renderer.render();

    requestAnimationFrame(this.update.bind(this));
  }
}

module.exports = Game;
