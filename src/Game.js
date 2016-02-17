window.depthCompare = function(a, b) {
  if(a.z < b.z) {
    return -1;
  }

  if (a.z > b.z) {
    return 1;
  }

  return 0;
}

class Game {
  constructor() {
    this.stage = new PIXI.Container();

    let size = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;

    this.renderer = PIXI.autoDetectRenderer(
      size, size, { antialias: false }
    );
    document.body.appendChild(this.renderer.view);

    window.addEventListener('resize', () => {
      let size = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
      this.renderer.resize(size, size);
      this.stage.scale.set(size / 550);
    });
    this.stage.scale.set(size / 550);

    var Map = require('./Map.js');
    this.map = new Map(this);

    for (let x = 0; x < this.map.tiles.length; ++x) {
      for (let y = 0; y < this.map.tiles.length; ++y) {
        this.stage.addChild(this.map.tiles[x][y]);
      }
    }

    this.stage.children.sort(depthCompare);

    this.previous = Date.now() / 1000;
    this.current = Date.now() / 1000;
    this.delta = 0;

    requestAnimationFrame(this.update.bind(this));
  }

  update() {
    this.current = Date.now() / 1000;
    this.delta = this.current - this.previous;
    this.previous = this.current;

    this.map.update();

    this.renderer.render(this.stage);

    requestAnimationFrame(this.update.bind(this));
  }
}

module.exports = Game;
