var Tile = require('./Tile');
var Player = require('./Player');
var mouse = require('./Mouse');

var astar = require('./astar');

var Camera = require('./Camera');

window.camera = Camera;

class Map {
  constructor(game) {
    this.game = game;
    this.tiles = [];
    this.path = [];

    this.initialize();

    mouse.addEventListener('mousedown', (mouse) => {
      this.createHighlight();
    });

    mouse.addEventListener('mouseup', (mouse) => {
      this.clearHighlight();

      if (!this.zooming) {
        this.createPath();
      }
    });

    var previousDistance = 0;
    this.zooming = false;

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        this.zooming = true;
        var a = e.touches[0].screenX - e.touches[1].screenX;
        var b = e.touches[0].screenY - e.touches[1].screenY;

        var c = Math.sqrt(a * a + b * b);

        if (previousDistance !== 0) {
          var delta = c - previousDistance;

          console.log(delta);

          if (Math.abs(delta) > 1) {
            var scale = Camera.scale;
            Camera.scale = {
              width: scale.width + (Math.sign(delta)),
              height: scale.height + (Math.sign(delta))
            };
          }
        }
        previousDistance = c;
      }
    });

    window.addEventListener('touchend', (e) => {
      setTimeout(() => {
        this.zooming = false;
      }, 500);
    });
  }

  initialize() {
    this.player = new Player();
    this.player.sprite = 'resources/fuzzball.png';

    this.player.tilePosition = {x: 5, y: 5};
    this.player.position.set(this.player.tilePosition.x * 50, this.player.tilePosition.y * 50);

    this.game.world.addChild(this.player);

    this.width = 21;
    this.height = 21;

    window.player = this.player;

    Camera.follow(this.player);

    for (let x = 0; x < this.width; ++x) {
      let tilesY = [];
      for (let y = 0; y < this.height; ++y) {
        let tile = new Tile();
        if (Math.random() > 0.15) {
          tile.sprite = 'resources/floor.png';
          tile.solid = 0;
          tile.z = 0;

        } else {
          tile.sprite = 'resources/wall.png';
          tile.solid = 1;
          tile.z = 0;
        }

        if (y == 5 && x == 5) {
          tile.sprite = 'resources/floor.png';
          tile.solid = 0;
          tile.z = 0;
        }

        if (y == 0 || x == 0 || y == this.height - 1 || x == this.height - 1) {
          tile.sprite = 'resources/wall.png';
          tile.solid = 1;
          tile.z = 0;
        }

        tile.tilePosition = {x, y};

        tilesY.push(tile);
      }
      this.tiles.push(tilesY);
    }

    window.tiles = this.tiles;
  }

  createPath() {
    let mouseTile = {
      x: Math.floor((mouse.position().x + Camera.position.x) / (50 * this.game.world.scale.x)),
      y: Math.floor((mouse.position().y + Camera.position.y) / (50 * this.game.world.scale.y))
    };

    // Create path
    if (this.tiles[mouseTile.x] && this.tiles[mouseTile.x][mouseTile.y] &&
        this.tiles[mouseTile.x][mouseTile.y].solid === 0
    ) {
      let start = this.path[0] || [this.player.tilePosition.x, this.player.tilePosition.y];
      var newPath = this.findPath(start, [mouseTile.x, mouseTile.y]);

      newPath.shift();

      this.path.splice(1);
      this.path = this.path.concat(newPath);
    }
  }

  findPath(start, end) {
      return astar(this.tiles, start, end);
  }

  clearHighlight() {
    // Clearing previous highlight
    let len = this.tiles.length;
    for (let x = 0; x < this.width; ++x) {
      for (let y = 0; y < this.height; ++y) {
        this.tiles[x][y].highlight = false;
      }
    }
  }

  createHighlight() {
    let mouseTile = {
      x: Math.floor((mouse.position().x + Camera.position.x) / (50 * this.game.world.scale.x)),
      y: Math.floor((mouse.position().y + Camera.position.y) / (50 * this.game.world.scale.y))
    };

    if (!this.tiles[mouseTile.x] || !this.tiles[mouseTile.x][mouseTile.y]) {
      return;
    }

    let start = this.path[0] || [this.player.tilePosition.x, this.player.tilePosition.y];
    var newPath = this.findPath(start, [mouseTile.x, mouseTile.y]);

    // Setting new highlight
    if (this.tiles[mouseTile.x][mouseTile.y].solid === 0 &&
        this.tiles[mouseTile.x][mouseTile.y].highlighted !== true &&
        mouse.isDown()
    ) {
      for (let i = 0; i < newPath.length; ++i) {
        this.tiles[newPath[i][0]][newPath[i][1]].highlight = true;
      }
    }
    this.game.world.children.sort(depthCompare);
  }

  highlight() {
    this.clearHighlight();

    if (!this.zooming) {
      this.createHighlight();
    }
  }

  interpolate(to, duration) {
    this.player.moveDuration += this.game.delta * 1000;

    if (this.player.moveDuration >= duration) {
      this.player.moveDuration = duration;

      var x = to.x;
      var y = to.y;
      this.player.tilePosition = {x, y};

      this.path.shift();
      if (this.path.length < 1) {
        this.player.moveDuration = 0;
      } else {
        this.player.moveDuration -= duration;
      }
    }

    var tilePos = this.player.tilePosition;
    var pos = this.player.position;

    pos.x = tilePos.x * 50 + (to.x * 50 - tilePos.x * 50) *
      (this.player.moveDuration / duration);

    pos.y = tilePos.y * 50 + (to.y * 50 - tilePos.y * 50) *
      (this.player.moveDuration / duration);
  }

  update() {
    this.highlight();

    //Move the player if I can.
    if (this.path.length > 0) {
      this.interpolate({x: this.path[0][0], y: this.path[0][1]}, 500);
      Camera.update(this.player);
    }
  }
}

module.exports = Map;
